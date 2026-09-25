import z from "zod";

export const createCategorySchema = z.object({
    id: z.string().optional(),
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre debe tener menos de 100 caracteres")
        .trim(),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;