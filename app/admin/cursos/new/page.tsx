import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import SidebarApp from "../../_ui/Sidebar";
import { getAllCategoriesAction } from "@/server/actions/categorias/get-all-categorias-action";
import { getAllTechnologiesAction } from "@/server/actions/technologies/get-all-technologies-action";
import { getAllCoursesAction } from "@/server/actions/cursos/get-all-cursos-action";
import FormnewCourse from "./_ui/FormNewCourse";

export const metadata: Metadata = {
    title: "Registrar Nuevo Curso | Admin Devtalles",
    description: "Crear y publicar un nuevo curso en la plataforma de aprendizaje Devtalles.",
};

export default async function NewCursoPage() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }
    if (session.user.role !== "admin") {
        redirect("/");
    }

    const [categoriesRes, technologiesRes, coursesRes] = await Promise.all([
        getAllCategoriesAction(),
        getAllTechnologiesAction(),
        getAllCoursesAction(),
    ]);

    const initialCategories = categoriesRes.ok && categoriesRes.data ? categoriesRes.data : [];
    const initialTechnologies = technologiesRes.ok && technologiesRes.data ? technologiesRes.data : [];
    const initialCourses = coursesRes.ok && coursesRes.data ? coursesRes.data : [];

    return (
        <SidebarApp>
            <Suspense
                fallback={
                    <div className="flex h-96 w-full items-center justify-center p-8 text-sm text-muted-foreground animate-pulse">
                        Cargando formulario y dependencias del curso...
                    </div>
                }
            >
                <FormnewCourse
                    initialCategories={initialCategories}
                    initialTechnologies={initialTechnologies}
                    initialCourses={initialCourses}
                />
            </Suspense>
        </SidebarApp>
    );
}
