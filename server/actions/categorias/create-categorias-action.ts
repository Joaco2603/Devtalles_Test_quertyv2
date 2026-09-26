'use server';

import { actionClient } from "@/lib/action-client";
import { auth } from "@/server/auth";
import { createCategorySchema } from "@/types/categoria-scha";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createCategoryAction = actionClient
    .inputSchema(createCategorySchema)
    .action(async ({ parsedInput: { name, id } }) => {
        const url = process.env.ADDRESS_SERVER;
        try {
            const session = await auth();
            console.log(session);
            if (!session) return { ok: false, msg: 'No tiene permisos para realizar esta operacion' };
            const nameSanitize = name.toLowerCase().trim();
            if (id) {
                const resp = await fetch(`${url}/api/categories/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.user.tokenAuth}`
                    },
                    body: JSON.stringify({ name: nameSanitize })
                });
                const data = await resp.json();
                console.log(data);
                if (!data.data) {
                    return {
                        ok: false,
                        msg: 'Error al actualizar la categoría'
                    }
                }
                revalidatePath('/admin/categorias');
                return {
                    ok: true,
                    msg: 'Categoría actualizada exitosamente'
                }
            }
            const resp = await fetch(`${url}/api/categories`, {
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
                    msg: 'Error al crear la categoría'
                }
            }
            return {
                ok: true,
                msg: 'Categoría creada exitosamente'
            }
        } catch (e) {
            return { ok: false, msg: 'Error al crear la categoría' }
        }
    });