import SidebarApp from "./_ui/Sidebar"
import { auth } from "@/server/auth";
import { notFound, redirect } from "next/navigation";

export default async function AdminPage() {
    // const session = await auth();
    // if (!session || session.user.role !== "admin") {
    //     notFound();
    // }
    return (
        <SidebarApp>
            <h1>Admin Page</h1>
        </SidebarApp>
    );
}