import z from "zod";

export const loginSchema = z.object({
    email: z.email("El correo es requerido"),
    password: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .max(100, "La contraseña debe tener menos de 100 caracteres")
        .optional()
        .refine(value => value !== undefined, { message: "La contraseña es requerida" })
});

export type LoginSchema = z.infer<typeof loginSchema>;