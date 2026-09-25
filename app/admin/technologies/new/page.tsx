import { Suspense } from "react";
import type { Metadata } from "next";
import SidebarApp from "../../_ui/Sidebar";
import FormNewTechnology from "./_ui/FormNewTechnology";

export const metadata: Metadata = {
    title: "Nueva Tecnología | Admin Devtalles",
    description: "Crear o editar una tecnología asociada a cursos y contenidos.",
};

export default function NewTechnologyPage() {
    return (
        <SidebarApp>
            <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Cargando formulario...</div>}>
                <FormNewTechnology />
            </Suspense>
        </SidebarApp>
    );
}
