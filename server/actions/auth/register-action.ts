'use server';

import { actionClient } from "@/lib/action-client";
import { registerSchema } from "@/types/register-schema";

export const registerAction = actionClient
    .inputSchema(registerSchema)
    .action(async ({ parsedInput }) => {
        try {
            return { ok: true, data: parsedInput };
        } catch (error) {
            return { ok: false, error };
        }
    });
