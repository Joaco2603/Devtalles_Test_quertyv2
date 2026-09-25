'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { useAction } from 'next-safe-action/hooks';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft02Icon,
    Tag01Icon,
    Loading03Icon,
    SparklesIcon,
    CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';

import { createCategorySchema, type CreateCategorySchema } from '@/types/categoria-scha';
import { createCategoryAction } from '@/server/actions/categorias/create-categorias-action';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { getCategoriesAction } from '@/server/actions/categorias/get-categoria-action';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function FormNewCategoria() {
    const [chargetCategoria, setChargetCategoria] = useState(false);
    const router = useRouter();
    const params = useSearchParams();
    const editMode = params.get('id');
    const { data: session } = useSession();
    console.log(session);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }, setValue
    } = useForm<CreateCategorySchema>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: '',
        },
        mode: 'onChange',
    });

    const { execute, status } = useAction(createCategoryAction, {
        onSuccess: ({ data }) => {
            if (data?.ok) {
                toast.add({
                    title: 'Categoría creada con éxito',
                    description: data.msg || 'La categoría se registró correctamente en la plataforma.',
                    type: 'success',
                });
                router.push('/admin/categorias');
                router.refresh();
            } else {
                toast.add({
                    title: 'Error al crear la categoría',
                    description: data?.msg || 'Ocurrió un problema al guardar la categoría.',
                    type: 'error',
                });
            }
        },
        onError: ({ error }) => {
            toast.add({
                title: 'Error del servidor',
                description:
                    error.serverError || 'No se pudo conectar con el servidor para registrar la categoría.',
                type: 'error',
            });
        },
    });

    async function checkCategoria() {
        if (editMode) {
            setChargetCategoria(true);
            const { ok, data: categoria, msg } = await getCategoriesAction(editMode);
            setChargetCategoria(false);
            if (!ok) {
                toast.add({
                    title: 'Error al obtener la categoría',
                    description: msg || 'Ocurrió un problema al obtener la categoría.',
                    type: 'error',
                });
                router.push('/admin/categorias');
                return;
            }
            if (categoria) {
                setValue('name', categoria.name);
                setValue('id', editMode);
            }
        }
    }

    useEffect(() => {
        if (!editMode) return;
        if (editMode) {
            checkCategoria();
        }
    }, [editMode]);

    const isPending = status === 'executing';
    const nameValue = watch('name') || '';

    // Generador de preview del slug dinámico
    const dynamicSlug = nameValue
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const onSubmit = (data: CreateCategorySchema) => {

        execute(data);
    };

    return (
        <div className="mx-auto w-full max-w-2xl py-2 sm:py-6">
            {/* Navegación y Encabezado de Página */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 flex flex-col gap-2"
            >
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/categorias"
                        className="group inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-border hover:bg-accent hover:text-foreground active:scale-[0.98]"
                        title="Volver a Categorías"
                    >
                        <HugeiconsIcon
                            icon={ArrowLeft02Icon}
                            strokeWidth={2}
                            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                        />
                        <span>Categorías</span>
                    </Link>
                    <span className="text-xs text-muted-foreground/40">/</span>
                    <span className="text-xs font-semibold text-foreground">Nueva categoría</span>
                </div>

                <div className="mt-2 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Crear nueva categoría
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Define una categoría para clasificar y organizar los cursos y lecciones.
                        </p>
                    </div>

                    <div className="hidden sm:flex size-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-xs">
                        <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="size-5" />
                    </div>
                </div>
            </motion.div>

            {/* Contenedor del Formulario con Estilo Refinado */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-xs sm:p-8 dark:border-white/10 dark:bg-zinc-950/60 dark:shadow-2xl"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Bloque del Input de Nombre */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="category-name"
                                className="text-xs font-semibold uppercase tracking-wider text-foreground/80"
                            >
                                Nombre de la categoría <span className="text-purple-600 dark:text-purple-400">*</span>
                            </label>
                            <span className="text-[11px] tabular-nums text-muted-foreground">
                                {nameValue.length}/100
                            </span>
                        </div>

                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                                <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="size-4" />
                            </div>

                            <input
                                id="category-name"
                                type="text"
                                disabled={isPending}
                                placeholder="Ej. Desarrollo Frontend, DevOps, Inteligencia Artificial..."
                                autoComplete="off"
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? 'name-error' : undefined}
                                className={cn(
                                    'h-12 w-full rounded-xl border bg-background/50 pl-10 pr-4 text-sm font-medium text-foreground transition-all outline-none placeholder:text-muted-foreground/50',
                                    'focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 dark:focus:border-purple-500',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                    errors.name
                                        ? 'border-destructive focus:border-destructive focus:ring-destructive/20 text-destructive'
                                        : 'border-border hover:border-foreground/30'
                                )}
                                {...register('name')}
                            />
                        </div>

                        {/* Mensaje de Error con Animación Fluida */}
                        <AnimatePresence mode="wait">
                            {errors.name ? (
                                <motion.p
                                    id="name-error"
                                    role="alert"
                                    initial={{ opacity: 0, y: -4, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -4, height: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex items-center gap-1.5 text-xs font-medium text-destructive pt-1"
                                >
                                    <span className="size-1 rounded-full bg-destructive" />
                                    {errors.name.message}
                                </motion.p>
                            ) : (
                                <p className="text-xs text-muted-foreground/80 leading-relaxed">
                                    Ingresa un título claro y conciso para la categoría (mínimo 3 caracteres).
                                </p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Tarjeta de Previsualización Dinámica de Slug */}
                    <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-4 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="size-3.5 text-purple-600 dark:text-purple-400" />
                                Slug generado automáticamente
                            </span>
                            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/50">
                                SEO friendly
                            </span>
                        </div>

                        <div className="mt-2.5 flex items-center gap-2 overflow-hidden text-xs">
                            <span className="font-mono text-muted-foreground select-none">/cursos/categoria/</span>
                            <span
                                className={cn(
                                    'font-mono font-semibold truncate transition-colors',
                                    dynamicSlug
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-muted-foreground/40 italic'
                                )}
                            >
                                {dynamicSlug || 'ejemplo-categoria'}
                            </span>
                        </div>
                    </div>

                    {/* Acciones del Formulario */}
                    <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:items-center sm:justify-end">
                        <Link
                            href="/admin/categorias"
                            className={cn(
                                'inline-flex h-11 items-center justify-center rounded-xl border border-border/80 bg-background/50 px-5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:border-border active:scale-[0.98]',
                                isPending && 'pointer-events-none opacity-50'
                            )}
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={isPending}
                            className={cn(
                                'group relative inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all outline-none select-none active:scale-[0.98]',
                                'bg-purple-600 text-white shadow-sm hover:bg-purple-700 hover:shadow-purple-500/25 dark:bg-purple-600 dark:hover:bg-purple-500',
                                'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-purple-600'
                            )}
                        >
                            {isPending ? (
                                <>
                                    <HugeiconsIcon
                                        icon={Loading03Icon}
                                        strokeWidth={2}
                                        className="size-4 animate-spin text-white"
                                    />
                                    <span>Creando categoría...</span>
                                </>
                            ) : (
                                <>
                                    <HugeiconsIcon
                                        icon={CheckmarkCircle02Icon}
                                        strokeWidth={2}
                                        className="size-4 transition-transform group-hover:scale-110"
                                    />
                                    <span>Guardar categoría</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}