import { actionClient } from "@/lib/action-client";
import z from "zod";


export const getCursosAction = actionClient
    .inputSchema(z.object({}))
    .action(async ({ parsedInput }) => {

        try {

        } catch (e) {

        }


    })
// .use()
