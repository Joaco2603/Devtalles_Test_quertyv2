import type { Metadata } from "next";
import SidebarApp from "../_ui/Sidebar";
import { getAllCategoriesAction } from "@/server/actions/categorias/get-all-categorias-action";
import CategoriasTable from "./_ui/CategoriasTable";

export const metadata: Metadata = {
    title: "Categorías | Admin Devtalles",
    description: "Gestión y administración de categorías de cursos en Devtalles.",
};

export default async function CategoriesPage() {
    const response = await getAllCategoriesAction();
    const initialCategories = response.ok && response.data ? response.data : [];
    const errorMessage = !response.ok ? response.msg : undefined;

    return (
        <SidebarApp>
            <CategoriasTable
                initialCategories={initialCategories}
                errorMessage={errorMessage}
            />
        </SidebarApp>
    );
}