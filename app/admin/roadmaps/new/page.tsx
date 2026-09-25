import type { Metadata } from "next";
import SidebarApp from "../../_ui/Sidebar";
import FormNewRoadmap from "./_ui/FormNewRoadmap";
import { getPublishedCoursesAction } from "@/server/actions/roadmaps/get-published-courses-action";

export const metadata: Metadata = {
    title: "Nuevo Roadmap | Admin Devtalles",
    description: "Crear una nueva ruta de aprendizaje con cursos ordenados.",
};

export default async function NewRoadmapPage() {
    const coursesRes = await getPublishedCoursesAction();
    const catalog = coursesRes.ok && coursesRes.data ? coursesRes.data : [];

    return (
        <SidebarApp>
            <FormNewRoadmap catalog={catalog} />
        </SidebarApp>
    );
}
