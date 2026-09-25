'use server';

import { actionClient } from "@/lib/action-client";
import { signIn } from "@/server/auth";
import { loginSchema } from "@/types/login-schema";

// Password1!
export const loginAction = actionClient
    .inputSchema(loginSchema)
    .action(async ({ parsedInput: { email, password } }) => {
        try {
            const sanitizedEmail = email.trim().toLowerCase();
            const url = process.env.ADDRESS_SERVER;
            const user = await fetch(`${url}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: sanitizedEmail, password })
            });
            const data = await user.json();
            // console.log(data.data);
            if (!data.data) {
                return {
                    ok: false,
                    msg: data.msg
                }
            }

            const usuario = await signIn('credentials', {
                ...{ email, password },
                redirect: false
            });

            return {
                ok: true,
                msg: 'Wellcome back',
            }
        } catch (e) {
            // console.log(e as CredentialsSignin);
            return {
                ok: false,
                msg: 'Error al iniciar sesión'
            }
        }
    })