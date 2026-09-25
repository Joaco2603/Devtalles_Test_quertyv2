import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SidebarApp from "../../_ui/Sidebar";
import FormEditRoadmap from "./_ui/FormEditRoadmap";
import { getRoadmapAction } from "@/server/actions/roadmaps/get-roadmap-action";
import { getPublishedCoursesAction } from "@/server/actions/roadmaps/get-published-courses-action";

export const metadata: Metadata = {
    title: "Editar Roadmap | Admin Devtalles",
    description: "Editar título, orden de cursos y progreso de un roadmap.",
};

interface EditRoadmapPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditRoadmapPage({ params }: EditRoadmapPageProps) {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1) notFound();

    const [roadmapRes, coursesRes] = await Promise.all([
        getRoadmapAction(id),
        getPublishedCoursesAction(),
    ]);

    if (!roadmapRes.ok || !roadmapRes.data) notFound();

    const catalog = coursesRes.ok && coursesRes.data ? coursesRes.data : [];

    return (
        <SidebarApp>
            <FormEditRoadmap roadmap={roadmapRes.data} catalog={catalog} />
        </SidebarApp>
    );
}
