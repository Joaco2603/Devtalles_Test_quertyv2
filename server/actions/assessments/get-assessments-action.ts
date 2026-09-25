'use server';

import { auth } from "@/server/auth";
import type { Assessment } from "@/types/assessment-schema";

export const getAssessmentsAction = async () => {
  try {
    const session = await auth();
    if (!session) {
      return { ok: false as const, msg: "No tiene permisos para realizar esta operacion" };
    }

    const url = process.env.ADDRESS_SERVER;
    const resp = await fetch(`${url}/api/assessments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.tokenAuth}`,
      },
      cache: "no-store",
    });

    const body = await resp.json();
    if (!resp.ok) {
      return {
        ok: false as const,
        msg: (body?.message as string) || "Error al obtener las evaluaciones",
      };
    }

    return {
      ok: true as const,
      data: body as Assessment[],
      msg: "Evaluaciones obtenidas exitosamente",
    };
  } catch {
    return { ok: false as const, msg: "Error al obtener las evaluaciones" };
  }
};
