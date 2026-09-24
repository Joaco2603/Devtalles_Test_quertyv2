'use action';

import { actionClient } from "@/lib/action-client";
import { auth } from "@/server/auth";
import { z } from "zod";

export const createCategoryAction = actionClient
    .inputSchema(z.object({ name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').trim(), }))
    .action(async ({ parsedInput: { name } }) => {
        const url = process.env.ADDRESS_SERVER;
        try {
            const session = await auth();
            if (!session) return { ok: false, msg: 'No tiene permisos para realizar esta operacion' };
            const resp = await fetch(`${url}/api/categorias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify({ name })
            });
            const data = await resp.json();
            if (!data.ok) {
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