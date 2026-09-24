'use server';

import { actionClient } from "@/lib/action-client";
import { auth } from "@/server/auth";

export const getCursosAction = actionClient
    .action(async () => {
        try {
            const session = await auth();
            if (!session) return { ok: false, msg: 'No tiene permisos para realizar esta operacion' };
            const url = process.env.ADDRESS_SERVER;
            const resp = await fetch(`${url}/api/categorias`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${session.user.token}`
                }
            })
            const data = await resp.json();

            if (!data.ok) {
                return {
                    ok: false,
                    msg: 'Error al obtener los cursos'
                }
            }
            return {
                ok: true,
                data: data.cursos
            }
        } catch (e) {
            return { ok: false, msg: 'Error al obtener los cursos' }
        }
    })