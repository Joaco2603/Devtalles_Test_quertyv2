'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type RowSelectionState,
} from '@tanstack/react-table';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Book02Icon,
    Search01Icon,
    PlusSignIcon,
    PencilEdit02Icon,
    Copy01Icon,
    ArrowUpDownIcon,
    ReloadIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Cancel01Icon,
    SparklesIcon,
    Tick02Icon,
    Alert02Icon,
    User02Icon,
    CrownIcon,
    Layers01Icon,
    Link01Icon,
} from '@hugeicons/core-free-icons';

import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { getAllCoursesAction, type CursoItem } from '@/server/actions/cursos/get-all-cursos-action';

interface TablaCursosProps {
    initialCourses: CursoItem[];
    errorMessage?: string;
}

export default function TablaCursos({
    initialCourses,
    errorMessage,
}: TablaCursosProps) {
    const [courses, setCourses] = useState<CursoItem[]>(initialCourses);
    const [isPending, startTransition] = useTransition();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

    // TanStack Table states
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'title', desc: false },
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Mantener sincronizado si initialCourses cambia
    useEffect(() => {
        setCourses(initialCourses);
    }, [initialCourses]);

    // Función para copiar texto al portapapeles con feedback háptico
    const handleCopy = async (text: string, label: string = 'Texto', idFeedback?: number) => {
        try {
            await navigator.clipboard.writeText(text);
            if (idFeedback !== undefined) {
                setCopiedId(idFeedback);
                setTimeout(() => setCopiedId(null), 2000);
            }
            toast.add({
                title: 'Copiado al portapapeles',
                description: `${label} copiado exitosamente.`,
                type: 'success',
            });
        } catch {
            toast.add({
                title: 'Error al copiar',
                description: 'No se pudo copiar al portapapeles.',
                type: 'error',
            });
        }
    };

    // Función de recarga manual desde el servidor
    const handleRefresh = () => {
        setIsRefreshing(true);
        startTransition(async () => {
            try {
                const res = await getAllCoursesAction();
                if (res.ok && res.data) {
                    setCourses(res.data);
                    toast.add({
                        title: 'Cursos sincronizados',
                        description: `Se han actualizado ${res.data.length} cursos con éxito.`,
                        type: 'success',
                    });
                } else {
                    toast.add({
                        title: 'Error al sincronizar',
                        description: res.msg || 'No se pudieron cargar los cursos del servidor.',
                        type: 'error',
                    });
                }
            } catch {
                toast.add({
                    title: 'Error de conexión',
                    description: 'No se pudo comunicar con el servidor.',
                    type: 'error',
                });
            } finally {
                setIsRefreshing(false);
            }
        });
    };

    // Filtrar cursos por nivel antes de pasar a la tabla si el filtro está activo
    const filteredData = useMemo(() => {
        if (levelFilter === 'all') return courses;
        return courses.filter(c => c.level === levelFilter);
    }, [courses, levelFilter]);

    // Métricas para los KPI cards
    const stats = useMemo(() => {
        const total = courses.length;
        const beginners = courses.filter(c => c.level === 'beginner').length;
        const intermediates = courses.filter(c => c.level === 'intermediate').length;
        const advanced = courses.filter(c => c.level === 'advanced').length;

        const withPrereqs = courses.filter(c => (c.prerequisiteIds && c.prerequisiteIds.length > 0)).length;

        return {
            total,
            beginners,
            intermediates,
            advanced,
            withPrereqs,
        };
    }, [courses]);

    // Definición de Columnas de la Tabla TanStack
    const columns = useMemo<ColumnDef<CursoItem>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <div className="flex items-center justify-center pl-2">
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected()}
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Seleccionar todos los cursos visibles"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center pl-2">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label={`Seleccionar curso ${row.original.title}`}
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
                size: 44,
            },
            {
                accessorKey: 'title',
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <button
                            type="button"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            className="group -ml-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-[0.98]"
                        >
                            <span>Curso</span>
                            <HugeiconsIcon
                                icon={ArrowUpDownIcon}
                                strokeWidth={2}
                                className={cn(
                                    'size-3.5 transition-colors',
                                    isSorted
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-muted-foreground/60 group-hover:text-foreground'
                                )}
                            />
                        </button>
                    );
                },
                cell: ({ row }) => {
                    const course = row.original;
                    const imageUrl = course.imageUrl;

                    return (
                        <div className="flex items-center gap-3.5 py-2">
                            {/* Miniatura / Thumbnail del curso */}
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/60 shadow-xs">
                                {imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={imageUrl}
                                        alt={course.title}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/15 via-purple-600/10 to-indigo-500/10 text-purple-600 dark:text-purple-400">
                                        <HugeiconsIcon icon={Book02Icon} strokeWidth={2} className="size-5" />
                                    </div>
                                )}
                            </div>

                            {/* Título y descripción */}
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-purple-600 dark:hover:text-purple-400">
                                    {course.title}
                                </span>
                                {course.description && (
                                    <span className="truncate text-xs text-muted-foreground max-w-sm">
                                        {course.description}
                                    </span>
                                )}
                                {course.instructor && (
                                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground/80">
                                        <HugeiconsIcon icon={User02Icon} strokeWidth={2} className="size-3 text-purple-500" />
                                        <span>{course.instructor}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'level',
                header: () => (
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Nivel
                    </div>
                ),
                cell: ({ row }) => {
                    const level = row.original.level;
                    if (!level) return <span className="text-xs text-muted-foreground/60">—</span>;

                    const levelBadgeMap = {
                        beginner: {
                            label: 'Principiante',
                            className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                            icon: SparklesIcon,
                        },
                        intermediate: {
                            label: 'Intermedio',
                            className: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400',
                            icon: Layers01Icon,
                        },
                        advanced: {
                            label: 'Avanzado',
                            className: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
                            icon: CrownIcon,
                        },
                    };

                    const config = levelBadgeMap[level] || {
                        label: level,
                        className: 'border-border/60 bg-muted/60 text-muted-foreground',
                        icon: SparklesIcon,
                    };
                    const BadgeIcon = config.icon;

                    return (
                        <span
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase',
                                config.className
                            )}
                        >
                            <HugeiconsIcon icon={BadgeIcon} strokeWidth={2} className="size-3" />
                            <span>{config.label}</span>
                        </span>
                    );
                },
            },
            {
                id: 'prerequisites',
                header: () => (
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Requisitos
                    </div>
                ),
                cell: ({ row }) => {
                    const count = row.original.prerequisiteIds?.length || 0;
                    if (count === 0) {
                        return <span className="text-xs text-muted-foreground/50">Ninguno</span>;
                    }
                    return (
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {count} {count === 1 ? 'requisito' : 'requisitos'}
                        </span>
                    );
                },
            },
            {
                id: 'actions',
                header: () => (
                    <div className="pr-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Acciones
                    </div>
                ),
                cell: ({ row }) => {
                    const course = row.original;
                    const isCurrentCopied = copiedId === course.id;

                    return (
                        <div className="flex items-center justify-end gap-1.5 pr-2">
                            {/* Botón copiar ID */}
                            <button
                                type="button"
                                onClick={() => handleCopy(String(course.id), `ID del curso #${course.id}`, course.id)}
                                className="group flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/50 text-muted-foreground transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-600 active:scale-[0.95] dark:hover:text-purple-400"
                                title="Copiar ID del curso"
                                aria-label="Copiar ID"
                            >
                                <HugeiconsIcon
                                    icon={isCurrentCopied ? Tick02Icon : Copy01Icon}
                                    strokeWidth={2}
                                    className={cn(
                                        'size-3.5 transition-transform group-hover:scale-110',
                                        isCurrentCopied && 'text-emerald-500'
                                    )}
                                />
                            </button>

                            {/* Enlace externo si existe */}
                            {course.url && (
                                <a
                                    href={course.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="group flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/50 text-muted-foreground transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-600 active:scale-[0.95] dark:hover:text-purple-400"
                                    title="Visitar landing del curso"
                                >
                                    <HugeiconsIcon icon={Link01Icon} strokeWidth={2} className="size-3.5" />
                                </a>
                            )}

                            {/* Botón editar con el estilo exacto de FormNewCategoria */}
                            <Link
                                href={`/admin/cursos/new?id=${course.id}`}
                                className="group inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 hover:shadow-purple-500/25 active:scale-[0.98] dark:bg-purple-600 dark:hover:bg-purple-500"
                                title="Editar curso"
                            >
                                <HugeiconsIcon
                                    icon={PencilEdit02Icon}
                                    strokeWidth={2}
                                    className="size-3.5 transition-transform group-hover:scale-110 text-white"
                                />
                                <span>Editar</span>
                            </Link>
                        </div>
                    );
                },
                enableSorting: false,
            },
        ],
        [copiedId]
    );

    // Instancia de TanStack Table
    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
            columnFilters,
            rowSelection,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableSortingRemoval: false,
    });

    const searchFilterValue =
        (table.getColumn('title')?.getFilterValue() as string) ?? '';

    const selectedCount = Object.keys(rowSelection).filter(
        (key) => rowSelection[key]
    ).length;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

            {/* Header y Acciones Globales */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        Catálogo de Cursos
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Administra todos los programas académicos, niveles de dificultad y dependencias.
                    </p>
                </div>

                {/* Botón "+ Nuevo Curso" (Estilo estricto FormNewCategoria) */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/cursos/new"
                        className="group relative inline-flex h-11 items-center justify-center gap-2.5 rounded-xl bg-purple-600 pl-5 pr-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 hover:shadow-purple-500/25 active:scale-[0.98] dark:bg-purple-600 dark:hover:bg-purple-500"
                    >
                        <span>Registrar nuevo curso</span>
                        <div className="flex size-6 items-center justify-center rounded-lg bg-white/20 transition-transform duration-200 group-hover:scale-110">
                            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.5} className="size-3.5 text-white" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Aviso de error si la conexión falló */}
            {errorMessage && (
                <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive">
                    <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-5 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* KPI Cards: Resumen Métrico Compacto (Double-Bezel Architecture) */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">

                {/* KPI 1: Total Cursos */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-1 ring-1 ring-black/[0.03] dark:border-white/5 dark:bg-zinc-900/40 dark:ring-white/[0.04]">
                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3.5 py-2.5 dark:border-white/10 dark:bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Cursos</span>
                            <div className="mt-0.5 flex items-baseline gap-1.5">
                                <span className="text-lg font-extrabold text-foreground">{stats.total}</span>
                                <span className="text-[10px] text-muted-foreground/75">activos</span>
                            </div>
                        </div>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <HugeiconsIcon icon={Book02Icon} strokeWidth={2} className="size-4" />
                        </div>
                    </div>
                </div>

                {/* KPI 2: Distribución por Nivel */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-1 ring-1 ring-black/3 dark:border-white/5 dark:bg-zinc-900/40 dark:ring-white/4">
                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3.5 py-2.5 dark:border-white/10 dark:bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Por Nivel</span>
                            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                                <span className="text-emerald-500">{stats.beginners}b</span>
                                <span className="text-muted-foreground/30">•</span>
                                <span className="text-purple-500">{stats.intermediates}i</span>
                                <span className="text-muted-foreground/30">•</span>
                                <span className="text-rose-500">{stats.advanced}a</span>
                            </div>
                        </div>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <HugeiconsIcon icon={Layers01Icon} strokeWidth={2} className="size-4" />
                        </div>
                    </div>
                </div>

                {/* KPI 3: Con Prerrequisitos */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-1 ring-1 ring-black/[0.03] dark:border-white/5 dark:bg-zinc-900/40 dark:ring-white/[0.04]">
                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3.5 py-2.5 dark:border-white/10 dark:bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Con Prerrequisitos</span>
                            <div className="mt-0.5 flex items-baseline gap-1">
                                <span className="font-mono text-lg font-extrabold text-foreground">{stats.withPrereqs}</span>
                                <span className="text-[10px] text-muted-foreground/75 font-sans">cursos</span>
                            </div>
                        </div>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <HugeiconsIcon icon={Link01Icon} strokeWidth={2} className="size-4" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Input de Búsqueda */}
                <div className="relative w-full max-w-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
                    </div>
                    <input
                        type="text"
                        value={searchFilterValue}
                        onChange={(e) => table.getColumn('title')?.setFilterValue(e.target.value)}
                        placeholder="Buscar por título de curso..."
                        className="h-10 w-full rounded-xl border border-border/80 bg-background/50 pl-10 pr-9 text-xs font-medium text-foreground transition-all outline-none placeholder:text-muted-foreground/50 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                    />
                    {searchFilterValue && (
                        <button
                            type="button"
                            onClick={() => table.getColumn('title')?.setFilterValue('')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                            aria-label="Limpiar búsqueda"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Filtros de Nivel (Pills) y Botón de Recarga */}
                <div className="flex flex-wrap items-center gap-2">

                    {/* Pills de Niveles */}
                    <div className="inline-flex rounded-xl border border-border/70 bg-muted/40 p-1 text-xs">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'beginner', label: 'Principiante' },
                            { id: 'intermediate', label: 'Intermedio' },
                            { id: 'advanced', label: 'Avanzado' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setLevelFilter(item.id as typeof levelFilter)}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200',
                                    levelFilter === item.id
                                        ? 'bg-purple-600 text-white shadow-sm font-semibold hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                )}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Botón de sincronización manual */}
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isPending || isRefreshing}
                        className="group flex size-10 items-center justify-center rounded-xl border border-border/80 bg-background/50 text-muted-foreground transition-all hover:border-purple-500/40 hover:bg-muted hover:text-foreground active:scale-[0.96] disabled:opacity-50"
                        title="Sincronizar cursos con el servidor"
                    >
                        <HugeiconsIcon
                            icon={ReloadIcon}
                            strokeWidth={2}
                            className={cn('size-4 transition-transform', (isPending || isRefreshing) && 'animate-spin text-purple-600')}
                        />
                    </button>
                </div>
            </div>

            {/* TABLA PRINCIPAL: Double-Bezel Architecture */}
            <div className="rounded-[2rem] border border-border/60 bg-muted/20 p-1.5 sm:p-2 ring-1 ring-black/[0.04] dark:border-white/5 dark:bg-zinc-900/40 dark:ring-white/[0.04] shadow-sm">
                <div className="overflow-hidden rounded-[calc(2rem-0.5rem)] border border-border/80 bg-card dark:border-white/10 dark:bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">

                    <div className="relative overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40 dark:bg-zinc-900/50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="border-border/60 hover:bg-transparent">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                                className="h-11 px-4 text-xs font-bold text-muted-foreground"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && 'selected'}
                                                className={cn(
                                                    'border-border/50 transition-colors hover:bg-muted/30 dark:hover:bg-zinc-900/40',
                                                    row.getIsSelected() && 'bg-purple-500/5 dark:bg-purple-500/10'
                                                )}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="px-4 py-3">
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-64 text-center"
                                            >
                                                <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-3">
                                                    <div className="flex size-14 items-center justify-center rounded-3xl border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                                        <HugeiconsIcon icon={Book02Icon} strokeWidth={1.8} className="size-7" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-foreground">
                                                            No se encontraron cursos
                                                        </h3>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {searchFilterValue || levelFilter !== 'all'
                                                                ? 'No hay cursos que coincidan con los filtros aplicados.'
                                                                : 'Aún no se ha registrado ningún curso en la base de datos.'}
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href="/admin/cursos/new"
                                                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 hover:shadow-purple-500/25 active:scale-[0.98] dark:bg-purple-600 dark:hover:bg-purple-500"
                                                    >
                                                        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.5} className="size-3.5" />
                                                        <span>Crear el primer curso</span>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Barra de Paginación y Contador */}
                    <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground bg-muted/20">
                        <div className="flex items-center gap-2">
                            <span>
                                Mostrando{' '}
                                <strong className="font-semibold text-foreground">
                                    {table.getRowModel().rows.length}
                                </strong>{' '}
                                de{' '}
                                <strong className="font-semibold text-foreground">
                                    {filteredData.length}
                                </strong>{' '}
                                cursos
                            </span>
                            {selectedCount > 0 && (
                                <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-[11px] font-medium text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                    {selectedCount} seleccionados
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Selector de cantidad por página */}
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                                className="h-8 rounded-lg border border-border/80 bg-background px-2 text-xs font-medium text-foreground outline-none"
                            >
                                {[10, 20, 30, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize} por pág.
                                    </option>
                                ))}
                            </select>

                            {/* Controles de página */}
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground transition-all hover:bg-muted disabled:opacity-40"
                                    aria-label="Página anterior"
                                >
                                    <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-3.5" />
                                </button>
                                <span className="px-2 font-mono text-xs">
                                    {table.getState().pagination.pageIndex + 1} /{' '}
                                    {table.getPageCount() || 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground transition-all hover:bg-muted disabled:opacity-40"
                                    aria-label="Página siguiente"
                                >
                                    <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}