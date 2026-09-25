'use server';

import { auth } from "@/server/auth";

export const getAllCategoriesAction = async () => {
    try {
        const session = await auth();
        if (!session) return { ok: false, msg: 'No tiene permisos para realizar esta operacion' };
        const url = process.env.ADDRESS_SERVER;
        const resp = await fetch(`${url}/api/categories`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.tokenAuth}`
            }
        })
        const data = await resp.json();

        if (!data.data) {
            return {
                ok: false,
                msg: 'Error al obtener las categorías'
            }
        }
        return {
            ok: true,
            data: data.data as {
                id: string;
                name: string;
            }[],
            msg: 'Categorías obtenidas exitosamente'
        }
    } catch (e) {
        return { ok: false, msg: 'Error al obtener las categorías' }
    }
}