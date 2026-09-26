'use server';

import { auth } from "@/server/auth";

export interface CursoItem {
    id: number;
    title: string;
    description?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    price?: number;
    duration?: number;
    imageUrl?: string;
    instructor?: string;
    prerequisiteIds?: number[];
    categoryIds?: number[];
    technologyIds?: number[];
    categories?: { id: number | string; name: string }[];
    technologies?: { id: number | string; name: string }[];
    url?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface RawCourseItem {
    id: string | number;
    title?: string;
    name?: string;
    description?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    price?: number | string;
    duration?: number | string;
    imageUrl?: string;
    image?: string;
    instructor?: number | string;
    prerequisiteIds?: (number | string)[];
    categoryIds?: (number | string)[];
    technologyIds?: (number | string)[];
    categories?: { id: number | string; name: string }[];
    technologies?: { id: number | string; name: string }[];
    url?: string;
    createdAt?: string;
    created_at?: string;
    updatedAt?: string;
    updated_at?: string;
}

export const getAllCoursesAction = async () => {
    try {
        const session = await auth();
        if (!session) {
            return {
                ok: false,
                data: [] as CursoItem[],
                msg: 'No tiene permisos para realizar esta operación'
            };
        }

        const url = process.env.ADDRESS_SERVER;
        if (!url) {
            return {
                ok: false,
                data: [] as CursoItem[],
                msg: 'Servidor no configurado'
            };
        }

        // Intento 1: /api/admin/courses
        let resp = await fetch(`${url}/api/admin/courses`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.tokenAuth}`
            },
            cache: 'no-store'
        });

        // console.log(resp);

        // Fallback: /api/courses
        if (!resp.ok) {
            resp = await fetch(`${url}/api/courses`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.tokenAuth}`
                },
                cache: 'no-store'
            });
        }

        if (!resp.ok) {
            return {
                ok: false,
                data: [] as CursoItem[],
                msg: 'Error al obtener los cursos'
            };
        }

        const data = await resp.json();
        // console.log(data);

        // El endpoint devuelve { data: [...], meta: {...} } o array directo
        const rawList: RawCourseItem[] = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

        const courses: CursoItem[] = rawList.map((item) => ({
            id: Number(item.id),
            title: item.title || item.name || `Curso #${item.id}`,
            description: item.description,
            level: item.level,
            // price: item.price !== undefined && item.price !== null ? Number(item.price) : undefined,
            // duration: item.duration !== undefined && item.duration !== null ? Number(item.duration) : undefined,
            imageUrl: item.imageUrl || item.image,
            instructor: item.instructor ? String(item.instructor) : undefined,
            prerequisiteIds: Array.isArray(item.prerequisiteIds) ? item.prerequisiteIds.map(Number) : undefined,
            categoryIds: Array.isArray(item.categoryIds) ? item.categoryIds.map(Number) : undefined,
            technologyIds: Array.isArray(item.technologyIds) ? item.technologyIds.map(Number) : undefined,
            categories: Array.isArray(item.categories) ? item.categories : undefined,
            technologies: Array.isArray(item.technologies) ? item.technologies : undefined,
            url: item.url,
            createdAt: item.createdAt || item.created_at,
            updatedAt: item.updatedAt || item.updated_at,
        }));

        return {
            ok: true,
            data: courses,
            msg: 'Cursos obtenidos exitosamente'
        };
    } catch {
        return {
            ok: false,
            data: [] as CursoItem[],
            msg: 'Error al conectar con el servidor de cursos'
        };
    }
};
