import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import SidebarApp from "../_ui/Sidebar";
import { getAllCoursesAction } from "@/server/actions/cursos/get-all-cursos-action";
import TablaCursos from "./_ui/TablaCursos";

export const metadata: Metadata = {
    title: "Cursos | Admin Devtalles",
    description: "Gestión y administración integral del catálogo de cursos de Devtalles.",
};

export default async function CoursesPage() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }
    if (session.user.role !== "admin") {
        redirect("/");
    }

    const response = await getAllCoursesAction();
    const initialCourses = response.ok && response.data ? response.data : [];
    const errorMessage = !response.ok ? response.msg : undefined;

    return (
        <SidebarApp>
            <TablaCursos
                initialCourses={initialCourses}
                errorMessage={errorMessage}
            />
        </SidebarApp>
    );
}