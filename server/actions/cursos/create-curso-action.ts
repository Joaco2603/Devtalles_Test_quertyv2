'use server';

import { actionClient } from "@/lib/action-client";
import { auth } from "@/server/auth";
import { crearCursoSchema } from "@/types/crear-cursos-schema";
import { revalidatePath } from "next/cache";

export const createCursoAction = actionClient
    .inputSchema(crearCursoSchema)
    .action(async ({ parsedInput }) => {
        const url = process.env.ADDRESS_SERVER;
        try {
            const session = await auth();
            if (!session) {
                return {
                    ok: false,
                    msg: 'No tiene permisos para realizar esta operación'
                };
            }

            // Validación: un curso no puede ser prerrequisito de sí mismo
            if (parsedInput.id && parsedInput.prerequisiteIds?.includes(parsedInput.id)) {
                return {
                    ok: false,
                    msg: 'Un curso no puede tenerse a sí mismo como prerrequisito.'
                };
            }

            // Construcción del payload
            const payload: Record<string, unknown> = {
                title: parsedInput.title.trim(),
                description: parsedInput.description.trim(),
                level: parsedInput.level,
            };

            if (parsedInput.imageUrl?.trim()) {
                payload.imageUrl = parsedInput.imageUrl.trim();
            }
            if (parsedInput.url?.trim()) {
                payload.url = parsedInput.url.trim();
            }
            if (parsedInput.instructor?.trim()) {
                payload.instructor = parsedInput.instructor.trim();
            }
            if (parsedInput.prerequisiteIds && parsedInput.prerequisiteIds.length > 0) {
                payload.prerequisiteIds = parsedInput.id
                    ? parsedInput.prerequisiteIds.filter(id => id !== parsedInput.id)
                    : parsedInput.prerequisiteIds;
            } else {
                payload.prerequisiteIds = [];
            }
            if (parsedInput.categoryIds && parsedInput.categoryIds.length > 0) {
                payload.categoryIds = parsedInput.categoryIds;
            } else {
                payload.categoryIds = [];
            }
            if (parsedInput.technologyIds && parsedInput.technologyIds.length > 0) {
                payload.technologyIds = parsedInput.technologyIds;
            } else {
                payload.technologyIds = [];
            }

            const isEdit = typeof parsedInput.id === 'number';
            const endpoint = isEdit ? `${url}/api/admin/courses/${parsedInput.id}` : `${url}/api/admin/courses`;
            const method = isEdit ? 'PATCH' : 'POST';

            const resp = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.tokenAuth}`
                },
                body: JSON.stringify(payload)
            });

            const data = await resp.json().catch(() => null);
            // console.log(data);
            if (!data.data) {
                return {
                    ok: false,
                    msg: data?.message || data?.msg || 'Error al procesar la solicitud en el servidor'
                };
            }

            revalidatePath('/admin/');
            revalidatePath('/admin/cursos');
            return {
                ok: true,
                data: data?.data || data,
                msg: isEdit ? 'Curso actualizado exitosamente' : 'Curso registrado exitosamente'
            };
        } catch {
            return {
                ok: false,
                msg: 'Error inesperado de conexión con el servidor al guardar el curso'
            };
        }
    });
