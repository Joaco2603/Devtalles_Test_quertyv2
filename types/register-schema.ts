import z from "zod";


export const registerSchema = z.object({
    firstName: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "Last name must have at least 2 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must have at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must have at least 6 characters")
})
    .refine((data) => data.confirmPassword === data.password, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

export type RegisterSchema = z.infer<typeof registerSchema>;
