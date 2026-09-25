import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

const ADMIN_ONLY_PREFIXES = [
    "/admin/users",
    "/admin/roles",
    "/admin/categorias",
    "/admin/technologies",
    "/admin/cursos",
    "/admin/roadmaps",
    "/admin/questionnaires",
    "/admin/audience",
    "/admin/competitor",
    "/admin/sentiment",
    "/admin/calendar",
];

function isAdminOnlyPath(pathname: string) {
    return ADMIN_ONLY_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

export default auth((req) => {
    if (!isAdminOnlyPath(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    const role = req.auth?.user?.role?.toLowerCase();
    if (role === "admin") {
        return NextResponse.next();
    }

    if (!req.auth) {
        const login = new URL("/login", req.nextUrl.origin);
        login.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(login);
    }

    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
});

export const config = {
    matcher: [
        "/admin/users",
        "/admin/users/:path*",
        "/admin/roles",
        "/admin/roles/:path*",
        "/admin/categorias",
        "/admin/categorias/:path*",
        "/admin/technologies",
        "/admin/technologies/:path*",
        "/admin/cursos",
        "/admin/cursos/:path*",
        "/admin/roadmaps",
        "/admin/roadmaps/:path*",
        "/admin/questionnaires",
        "/admin/questionnaires/:path*",
        "/admin/audience",
        "/admin/audience/:path*",
        "/admin/competitor",
        "/admin/competitor/:path*",
        "/admin/sentiment",
        "/admin/sentiment/:path*",
        "/admin/calendar",
        "/admin/calendar/:path*",
    ],
};
