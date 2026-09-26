'use server';

import { auth } from "@/server/auth";

export interface UserItem {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string | null;
    name?: string;
    lastname?: string | null;
    image?: string | null;
    address?: string | null;
    discordId?: string | null;
    role?: 'admin' | 'client' | 'user' | string;
    isActive?: boolean;
    is_two_factor_enabled?: boolean;
    is_two_factor_pending?: boolean;
    two_factor_secret?: string | null;
    mustChangePassword?: boolean;
    createdAt?: string;
    created_at?: string;
    updatedAt?: string;
    updated_at?: string;
}

export interface GetAllUsersResponse {
    ok: boolean;
    msg: string;
    data?: UserItem[];
}

export const getAllUsersAction = async (): Promise<GetAllUsersResponse> => {
    try {
        const session = await auth();
        if (!session) return { ok: false, msg: 'No estás autorizado' };

        const url = process.env.ADDRESS_SERVER;
        const response = await fetch(`${url}/api/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user?.tokenAuth}`
            }
        });
        const data = await response.json();
        if (!data.data) return { ok: false, msg: data.message || 'No se pudieron obtener los usuarios' };

        return { ok: true, msg: 'Usuarios obtenidos exitosamente', data: data.data };
    } catch {
        return { ok: false, msg: 'Error al obtener los usuarios' };
    }
}