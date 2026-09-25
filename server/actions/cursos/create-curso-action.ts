'use server';

import { actionClient } from "@/lib/action-client";
import { auth } from "@/server/auth";
import {
    createCursoSchema,
    toCreateCoursePayload,
} from "@/types/curso-schema";
import { revalidatePath } from "next/cache";

function nestMsg(body: { message?: string | string[] }, fallback: string) {
    if (typeof body.message === "string") return body.message;
    if (Array.isArray(body.message)) return body.message.join(", ");
    return fallback;
}

export const createCursoAction = actionClient
    .inputSchema(createCursoSchema)
    .action(async ({ parsedInput }) => {
        try {
            const session = await auth();
            if (!session)
                return {
                    ok: false,
                    msg: "No tiene permisos para realizar esta operacion",
                };

            const url = process.env.ADDRESS_SERVER;
            const resp = await fetch(`${url}/api/admin/courses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.user.tokenAuth}`,
                },
                body: JSON.stringify(toCreateCoursePayload(parsedInput)),
            });
            const body = await resp.json();

            if (!resp.ok) {
                return {
                    ok: false,
                    msg: nestMsg(body, "Error al crear el curso"),
                };
            }

            revalidatePath("/admin/cursos");
            return {
                ok: true,
                data: body.data,
                msg: "Curso creado exitosamente",
            };
        } catch {
            return { ok: false, msg: "Error al crear el curso" };
        }
    });
