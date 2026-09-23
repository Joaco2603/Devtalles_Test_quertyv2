import { auth } from "@/server/auth";
import AuthSectionOne from "./_ui/auth-section-1";
import { redirect } from "next/navigation";

export default async function Login() {
    const session = await auth();
    if (session) {
        redirect('/')
    }
    return (
        <div>
            <AuthSectionOne />
        </div>
    );
}