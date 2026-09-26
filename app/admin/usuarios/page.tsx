import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import SidebarApp from "../_ui/Sidebar";
import { getAllUsersAction } from "@/server/actions/usuarios/get-users-action";
import TablaUsuarios from "./_ui/TablaUsuarios";

export const metadata: Metadata = {
    title: "Usuarios | Admin Devtalles",
    description: "Gestión, monitoreo y auditoría de usuarios registrados en Devtalles.",
};

export default async function UsersPage() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }
    if (session.user.role !== "admin") {
        redirect("/");
    }

    const response = await getAllUsersAction();
    const initialUsers = response.ok && response.data ? response.data : [];
    const errorMessage = !response.ok ? response.msg : undefined;

    return (
        <SidebarApp>
            <TablaUsuarios
                initialUsers={initialUsers}
                errorMessage={errorMessage}
            />
        </SidebarApp>
    );
}