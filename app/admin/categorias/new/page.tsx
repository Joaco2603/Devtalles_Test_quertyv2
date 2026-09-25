import { Suspense } from "react";
import type { Metadata } from "next";
import SidebarApp from "../../_ui/Sidebar";
import FormNewCategoria from "./_ui/FormNewCategoria";

export const metadata: Metadata = {
    title: "Nueva Categoría | Admin Devtalles",
    description: "Crear una nueva categoría para organizar cursos y contenidos.",
};

export default function NewCategoryPage() {
    return (
        <SidebarApp>
            <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Cargando formulario...</div>}>
                <FormNewCategoria />
            </Suspense>
        </SidebarApp>
    );
}