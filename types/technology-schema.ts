import z from "zod";

export const createTechnologySchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre debe tener menos de 100 caracteres")
        .trim(),
});

export type CreateTechnologySchema = z.infer<typeof createTechnologySchema>;
