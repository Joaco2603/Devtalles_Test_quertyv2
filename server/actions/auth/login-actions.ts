'use server';

import { actionClient } from "@/lib/action-client";
import { loginSchema } from "@/types/login-schema";

export const loginAction = actionClient
    .inputSchema(loginSchema)
    .action(async ({ parsedInput: { email, password } }) => {
        try {

        } catch (error) {

        }
    })