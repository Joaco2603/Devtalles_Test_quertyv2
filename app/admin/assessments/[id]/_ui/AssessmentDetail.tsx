"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Tick02Icon,
  Delete02Icon,
  FloppyDiskIcon,
  CheckmarkCircle02Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";

import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type {
  Assessment,
  AssessmentAnswer,
  Question,
  Questionnaire,
} from "@/types/assessment-schema";
import { getAssessmentAction } from "@/server/actions/assessments/get-assessment-action";
import { getAssessmentQuestionnaireAction } from "@/server/actions/assessments/get-assessment-questionnaire-action";
import { upsertAssessmentAnswerAction } from "@/server/actions/assessments/upsert-assessment-answer-action";
import { deleteAssessmentAnswerAction } from "@/server/actions/assessments/delete-assessment-answer-action";
import { completeAssessmentAction } from "@/server/actions/assessments/complete-assessment-action";
import {
  buildUpsertPayload,
  isAssessmentCompleted,
  isMostImportantQuestion,
  uiAnswersFromRows,
} from "../../_ui/answer-utils";
import QuestionControl from "./QuestionControl";

function emptyDraft(questionId: number): AssessmentAnswer {
  return { questionId };
}

function getAnswer(
  answers: AssessmentAnswer[],
  questionId: number
): AssessmentAnswer | undefined {
  return answers.find((a) => a.questionId === questionId);
}

function answerSummary(question: Question, answer?: AssessmentAnswer): string {
  if (!answer) return "Sin respuesta";

  if (question.type === "single_choice") {
    const opt = question.options?.find((o) => o.id === answer.answerOptionId);
    const detail =
      typeof answer.value === "string" && answer.value.trim()
        ? ` — ${answer.value}`
        : "";
    return opt ? `${opt.label}${detail}` : "Sin respuesta";
  }

  if (question.type === "multiple_choice") {
    const ids = answer.answerOptionIds ?? [];
    if (ids.length === 0) return "Sin respuesta";
    return (
      question.options
        ?.filter((o) => ids.includes(o.id))
        .map((o) => o.label)
        .join(", ") || "Sin respuesta"
    );
  }

  if (question.type === "boolean") {
    if (answer.value === true) return "Sí";
    if (answer.value === false) return "No";
    return "Sin respuesta";
  }

  if (answer.value === null || answer.value === undefined || answer.value === "") {
    return "Sin respuesta";
  }

  return String(answer.value);
}

function isDraftFilled(question: Question, draft: AssessmentAnswer): boolean {
  if (question.type === "single_choice") return draft.answerOptionId != null;
  if (question.type === "multiple_choice")
    return (draft.answerOptionIds?.length ?? 0) > 0;
  if (question.type === "boolean")
    return draft.value === true || draft.value === false;
  if (question.type === "number")
    return draft.value !== null && draft.value !== undefined && draft.value !== "";
  if (question.type === "text")
    return typeof draft.value === "string" && draft.value.trim().length > 0;
  return false;
}

export default function AssessmentDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(
    null
  );
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [missing, setMissing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<AssessmentAnswer>(emptyDraft(0));
  const [busy, setBusy] = useState(false);

  const applyAssessment = useCallback(
    (next: Assessment, qs: Questionnaire) => {
      setAssessment(next);
      setQuestionnaire(qs);
      setAnswers(uiAnswersFromRows(next.answers, qs.questions));
    },
    []
  );

  const loadDetail = useCallback(async () => {
    if (!Number.isFinite(id) || id < 1) {
      setMissing(true);
      return;
    }

    setLoadError(null);
    const [assessmentRes, questionnaireRes] = await Promise.all([
      getAssessmentAction(id),
      getAssessmentQuestionnaireAction(id),
    ]);

    if (!assessmentRes.ok) {
      if (
        assessmentRes.msg.toLowerCase().includes("not found") ||
        assessmentRes.msg.toLowerCase().includes("no encontr")
      ) {
        setMissing(true);
        return;
      }
      setLoadError(assessmentRes.msg);
      return;
    }

    if (!questionnaireRes.ok) {
      setLoadError(questionnaireRes.msg);
      return;
    }

    setMissing(false);
    applyAssessment(assessmentRes.data, questionnaireRes.data);
  }, [id, applyAssessment]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const questions = useMemo(() => {
    if (!questionnaire) return [];
    return [...questionnaire.questions].sort(
      (a, b) => a.sortOrder - b.sortOrder || a.id - b.id
    );
  }, [questionnaire]);

  const current = questions[step];
  const completed = assessment ? isAssessmentCompleted(assessment) : false;

  useEffect(() => {
    if (!current) return;
    const saved = getAnswer(answers, current.id);
    setDraft(saved ? { ...saved } : emptyDraft(current.id));
  }, [current, answers]);

  useEffect(() => {
    if (questions.length === 0) return;
    if (step > questions.length - 1) {
      setStep(Math.max(0, questions.length - 1));
    }
  }, [questions.length, step]);

  const answeredCount = useMemo(() => {
    return questions.filter((q) => {
      const a = getAnswer(answers, q.id);
      return a ? isDraftFilled(q, a) : false;
    }).length;
  }, [answers, questions]);

  const refreshQuestionnaire = async (nextAssessment: Assessment) => {
    const qRes = await getAssessmentQuestionnaireAction(nextAssessment.id);
    if (!qRes.ok) {
      applyAssessment(nextAssessment, questionnaire!);
      toast.add({
        title: "Respuesta actualizada",
        description: qRes.msg,
        type: "error",
      });
      return;
    }
    applyAssessment(nextAssessment, qRes.data);
  };

  if (missing) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground">
          Evaluación no encontrada
        </h1>
        <p className="text-sm text-muted-foreground">
          Este intento no existe o no tienes acceso.
        </p>
        <Link
          href="/admin/assessments"
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-500"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground">
          No se pudo cargar la evaluación
        </h1>
        <p className="text-sm text-muted-foreground">{loadError}</p>
        <button
          type="button"
          onClick={() => void loadDetail()}
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-500"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!assessment || !questionnaire) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Cargando evaluación…
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-20 text-center">
        <h1 className="text-xl font-bold text-foreground">
          {questionnaire.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Este cuestionario no tiene preguntas aplicables por ahora.
        </p>
        <Link
          href="/admin/assessments"
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-500"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Cargando evaluación…
      </div>
    );
  }

  const important = isMostImportantQuestion(current, questions);

  const saveAnswer = async () => {
    if (completed || busy) return;
    if (!isDraftFilled(current, draft)) {
      toast.add({
        title: "Respuesta incompleta",
        description: "Selecciona o escribe una respuesta antes de guardar.",
        type: "error",
      });
      return;
    }

    setBusy(true);
    const res = await upsertAssessmentAnswerAction(
      assessment.id,
      buildUpsertPayload(current, draft)
    );
    setBusy(false);

    if (!res.ok) {
      toast.add({
        title: "No se pudo guardar",
        description: res.msg,
        type: "error",
      });
      return;
    }

    await refreshQuestionnaire(res.data);
    toast.add({
      title: "Respuesta guardada",
      description: `Se guardó la respuesta a la pregunta ${step + 1}.`,
      type: "success",
    });
  };

  const clearAnswer = async () => {
    if (completed || busy) return;

    setBusy(true);
    const res = await deleteAssessmentAnswerAction(assessment.id, current.id);
    setBusy(false);

    if (!res.ok) {
      toast.add({
        title: "No se pudo quitar",
        description: res.msg,
        type: "error",
      });
      return;
    }

    await refreshQuestionnaire(res.data);
    setDraft(emptyDraft(current.id));
    toast.add({
      title: "Respuesta quitada",
      description: "Se eliminó la respuesta de esta pregunta.",
      type: "success",
    });
  };

  const completeAssessment = async () => {
    if (completed || busy) return;

    setBusy(true);
    const res = await completeAssessmentAction(assessment.id);
    setBusy(false);

    if (!res.ok) {
      toast.add({
        title: "No se pudo completar",
        description: res.msg,
        type: "error",
      });
      return;
    }

    applyAssessment(res.data, questionnaire);
    toast.add({
      title: "Evaluación completada",
      description: "El intento quedó marcado como completado.",
      type: "success",
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 py-2 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="space-y-4"
      >
        <Link
          href="/admin/assessments"
          className="group inline-flex w-fit items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-border hover:bg-accent hover:text-foreground active:scale-[0.98]"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            strokeWidth={2}
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
          />
          Evaluaciones
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {questionnaire.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {answeredCount}/{questions.length} respondidas
            </p>
          </div>
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              completed
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
            )}
          >
            <HugeiconsIcon
              icon={completed ? CheckmarkCircle02Icon : Tick02Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            {completed ? "Completada" : "En progreso"}
          </span>
        </div>

        {!completed && (
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-purple-600"
              initial={false}
              animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            />
          </div>
        )}
      </motion.div>

      {completed ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 rounded-[1.75rem] border border-border/60 bg-card/95 p-5 shadow-xl sm:p-7"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                strokeWidth={2}
                className="size-5"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Resumen del intento
              </h2>
              <p className="text-xs text-muted-foreground">
                Las respuestas quedaron bloqueadas al completar.
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {questions.map((q, i) => {
              const highlight = isMostImportantQuestion(q, questions);
              return (
                <li
                  key={q.id}
                  className={cn(
                    "rounded-2xl border px-4 py-3",
                    highlight
                      ? "border-purple-500/40 bg-purple-500/10"
                      : "border-border/50 bg-muted/20"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Pregunta {i + 1}
                    </p>
                    {highlight && (
                      <span className="inline-flex items-center rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        La más importante
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {q.question}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {answerSummary(q, getAnswer(answers, q.id))}
                  </p>
                </li>
              );
            })}
          </ul>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={cn(
            "space-y-5 rounded-[1.75rem] border bg-card/95 p-5 shadow-xl sm:p-7",
            important
              ? "border-purple-500/50 ring-2 ring-purple-500/20"
              : "border-border/60"
          )}
        >
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, i) => {
              const answered = !!getAnswer(answers, q.id);
              const highlight = isMostImportantQuestion(q, questions);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setStep(i)}
                  className={cn(
                    "size-8 rounded-lg text-xs font-bold transition-all",
                    i === step
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                      : answered
                        ? "bg-purple-500/15 text-purple-700 dark:text-purple-300"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    highlight && i !== step && "ring-2 ring-purple-500/40"
                  )}
                  aria-label={`Ir a pregunta ${i + 1}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Pregunta {step + 1} de {questions.length}
                    {current.rules?.required === false ? " · Opcional" : ""}
                  </p>
                  {important && (
                    <span className="inline-flex items-center rounded-full bg-purple-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-purple-600/30">
                      La más importante
                    </span>
                  )}
                </div>
                <h2
                  className={cn(
                    "mt-1 text-lg font-bold tracking-tight sm:text-xl",
                    important ? "text-purple-700 dark:text-purple-300" : "text-foreground"
                  )}
                >
                  {current.question}
                </h2>
              </div>

              <QuestionControl
                question={current}
                draft={draft}
                onChange={setDraft}
                disabled={busy}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-3 border-t border-border/50 pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void saveAnswer()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-500 active:scale-[0.98] disabled:opacity-60"
              >
                <HugeiconsIcon
                  icon={FloppyDiskIcon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                Guardar respuesta
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void clearAnswer()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/60 px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.98] disabled:opacity-60"
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                Quitar respuesta
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={step === 0 || busy}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex size-9 items-center justify-center rounded-xl border border-border/70 bg-background/50 transition-all hover:bg-muted disabled:opacity-40"
                aria-label="Anterior"
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </button>
              <button
                type="button"
                disabled={step >= questions.length - 1 || busy}
                onClick={() =>
                  setStep((s) => Math.min(questions.length - 1, s + 1))
                }
                className="inline-flex size-9 items-center justify-center rounded-xl border border-border/70 bg-background/50 transition-all hover:bg-muted disabled:opacity-40"
                aria-label="Siguiente"
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => void completeAssessment()}
            className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-500/20 active:scale-[0.99] disabled:opacity-60 dark:text-emerald-300"
          >
            Completar evaluación
          </button>
        </motion.div>
      )}
    </div>
  );
}
