'use server';

import { actionClient } from "@/lib/action-client";
import { auth } from "@/server/auth";
import { createTechnologySchema } from "@/types/technology-schema";
import { revalidatePath } from "next/cache";

export const createTechnologyAction = actionClient
    .inputSchema(createTechnologySchema)
    .action(async ({ parsedInput: { name, id } }) => {
        const url = process.env.ADDRESS_SERVER;
        try {
            const session = await auth();
            if (!session) return { ok: false, msg: 'No tiene permisos para realizar esta operacion' };
            const nameSanitize = name.toLowerCase().trim();
            if (id) {
                const resp = await fetch(`${url}/api/technologies/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.user.tokenAuth}`
                    },
                    body: JSON.stringify({ name: nameSanitize })
                });
                const data = await resp.json();
                if (!data.data) {
                    return {
                        ok: false,
                        msg: 'Error al actualizar la tecnología'
                    };
                }
                revalidatePath('/admin/technologies');
                return {
                    ok: true,
                    msg: 'Tecnología actualizada exitosamente'
                };
            }
            const resp = await fetch(`${url}/api/technologies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.tokenAuth}`
                },
                body: JSON.stringify({ name: nameSanitize })
            });
            const data = await resp.json();
            if (!data.data) {
                return {
                    ok: false,
                    msg: 'Error al crear la tecnología'
                };
            }
            revalidatePath('/admin/technologies');
            return {
                ok: true,
                msg: 'Tecnología creada exitosamente'
            };
        } catch {
            return { ok: false, msg: 'Error al guardar la tecnología' };
        }
    });
