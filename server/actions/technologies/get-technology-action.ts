'use server';

import { auth } from "@/server/auth";

export const getTechnologyAction = async (id: string | number) => {
    try {
        const session = await auth();
        if (!session) return { ok: false, msg: 'No tiene permisos para realizar esta operacion' };
        const url = process.env.ADDRESS_SERVER;
        const resp = await fetch(`${url}/api/technologies/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.tokenAuth}`
            }
        });
        const data = await resp.json();

        if (!data.data) {
            return {
                ok: false,
                msg: 'Error al obtener la tecnología'
            };
        }
        return {
            ok: true,
            data: data.data as {
                id: string | number;
                name: string;
            },
            msg: 'Tecnología obtenida exitosamente'
        };
    } catch {
        return { ok: false, msg: 'Error al obtener la tecnología' };
    }
};
