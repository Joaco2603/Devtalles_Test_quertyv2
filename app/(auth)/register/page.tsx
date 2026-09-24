import { auth } from "@/server/auth";
import AuthSectionTwo from "./_ui/auth-section-2";
import { redirect } from "next/navigation";

export default async function Register() {
    const session = await auth();
    if (session) {
        redirect('/')
    }
    return (
        <div>
            <AuthSectionTwo />
        </div>
    );
}