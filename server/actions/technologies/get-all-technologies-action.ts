'use server';

import { auth } from "@/server/auth";

export const getAllTechnologiesAction = async () => {
    try {
        const session = await auth();
        if (!session) return { ok: false, msg: 'No tiene permisos para realizar esta operacion' };
        const url = process.env.ADDRESS_SERVER;
        const resp = await fetch(`${url}/api/technologies`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.tokenAuth}`
            }
        });
        const data = await resp.json();

        if (!data.data) {
            return {
                ok: false,
                msg: 'Error al obtener las tecnologías'
            };
        }
        return {
            ok: true,
            data: data.data as {
                id: string | number;
                name: string;
            }[],
            msg: 'Tecnologías obtenidas exitosamente'
        };
    } catch {
        return { ok: false, msg: 'Error al obtener las tecnologías' };
    }
};
