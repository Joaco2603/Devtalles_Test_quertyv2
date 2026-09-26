import SidebarApp from "./_ui/Sidebar"
import { auth, signOut } from "@/server/auth";
import { notFound, redirect } from "next/navigation";

export default async function AdminPage() {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        notFound();
    }
    // validate expiration time of session
    if (session.expires < new Date().toISOString()) {
        await signOut({ redirect: false });
        redirect('/auth/login');
    }
    return (
        <SidebarApp>
            <h1>Admin Page</h1>
        </SidebarApp>
    );
}