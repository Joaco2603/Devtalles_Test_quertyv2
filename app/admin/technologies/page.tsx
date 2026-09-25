import type { Metadata } from "next";
import SidebarApp from "../_ui/Sidebar";
import { getAllTechnologiesAction } from "@/server/actions/technologies/get-all-technologies-action";
import TechnologiesTable from "./_ui/TechnologiesTable";

export const metadata: Metadata = {
    title: "Tecnologías | Admin Devtalles",
    description: "Gestión y administración de tecnologías de cursos en Devtalles.",
};

export default async function TechnologiesPage() {
    const response = await getAllTechnologiesAction();
    const initialTechnologies = response.ok && response.data ? response.data : [];
    const errorMessage = !response.ok ? response.msg : undefined;

    return (
        <SidebarApp>
            <TechnologiesTable
                initialTechnologies={initialTechnologies}
                errorMessage={errorMessage}
            />
        </SidebarApp>
    );
}