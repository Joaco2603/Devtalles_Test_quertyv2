'use server';

import { actionClient } from "@/lib/action-client";
import { registerSchema } from "@/types/register-schema";

export interface RegisterResponse {
    ok: boolean;
    msg: string;
}

export const registerAction = actionClient
    .inputSchema(registerSchema)
    .action(async ({ parsedInput: { firstName, lastName, email, password } }) => {
        const sanitizedEmail = email.trim().toLowerCase();
        const url = process.env.ADDRESS_SERVER;

        try {
            const user = await fetch(`${url}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ first_name: firstName.toLowerCase(), last_name: lastName.toLowerCase().toString(), email: sanitizedEmail, password })
            });
            const data = await user.json();

            if (!data.data) {
                return {
                    ok: false,
                    msg: 'Register user failed 😢'
                }
            }

            return {
                ok: true,
                msg: 'User registered successfully 😊'
            }
        } catch (e) {
            return {
                ok: false,
                msg: 'Server error 😢'
            }
        }
    });
