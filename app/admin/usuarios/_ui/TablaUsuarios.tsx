'use client';

/**
 * Reading this as: Admin user management dashboard for system administrators,
 * with a Linear/Apple-inspired minimalist language, leaning toward Tailwind v4 + Hugeicons + TanStack Table + Motion.
 *
 * Dials:
 * - DESIGN_VARIANCE: 5
 * - MOTION_INTENSITY: 5
 * - VISUAL_DENSITY: 4
 */

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { AnimatePresence } from 'motion/react';
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
    User02Icon,
    UserMultiple03Icon,
    Search01Icon,
    Copy01Icon,
    Tick02Icon,
    ArrowUpDownIcon,
    ReloadIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Cancel01Icon,
    Alert02Icon,
    ShieldCheckIcon,
    ShieldOffIcon,
    CrownIcon,
    Mail01Icon,
    CheckmarkCircle02Icon,
    EyeIcon,
    SparklesIcon,
    SecurityCheckIcon,
    LockKeyIcon,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { getAllUsersAction, type UserItem } from '@/server/actions/usuarios/get-users-action';

interface TablaUsuariosProps {
    initialUsers: UserItem[];
    errorMessage?: string;
}

// Helpers para nombres e iniciales
function getUserDisplayName(user: UserItem): string {
    const first = user.first_name || user.name || '';
    const last = user.last_name || user.lastname || '';
    const full = `${first} ${last}`.trim();
    if (full) return full;
    return user.email ? user.email.split('@')[0] : 'Usuario';
}

function getUserInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (parts[0]?.[0] || 'U').toUpperCase();
}

// Paleta de gradientes sutiles para avatares
const AVATAR_PALETTES = [
    'from-purple-500/20 via-purple-600/10 to-indigo-500/20 text-purple-600 dark:text-purple-300 border-purple-500/25',
    'from-blue-500/20 via-sky-600/10 to-cyan-500/20 text-sky-600 dark:text-sky-300 border-sky-500/25',
    'from-emerald-500/20 via-teal-600/10 to-green-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/25',
    'from-amber-500/20 via-orange-600/10 to-yellow-500/20 text-amber-600 dark:text-amber-300 border-amber-500/25',
    'from-rose-500/20 via-pink-600/10 to-fuchsia-500/20 text-rose-600 dark:text-rose-300 border-rose-500/25',
];

function getAvatarPalette(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % AVATAR_PALETTES.length;
    return AVATAR_PALETTES[index];
}

export default function TablaUsuarios({
    initialUsers,
    errorMessage,
}: TablaUsuariosProps) {
    const [users, setUsers] = useState<UserItem[]>(initialUsers);
    const [isPending, startTransition] = useTransition();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copiedField, setCopiedField] = useState<{ id: string; type: 'id' | 'email' } | null>(null);

    // Filtros
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'client' | 'user'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | '2fa' | 'discord'>('all');
    const [globalSearch, setGlobalSearch] = useState('');

    // Modal de Detalle
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // TanStack Table states
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'user', desc: false },
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Mantener sincronizado si initialUsers cambia
    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    // Copiar texto con feedback háptico y toast
    const handleCopy = async (text: string, label: string, userKey: string, type: 'id' | 'email') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField({ id: userKey, type });
            setTimeout(() => setCopiedField(null), 2000);
            toast.add({
                title: 'Copiado al portapapeles',
                description: `${label} copiado exitosamente.`,
                type: 'success',
            });
        } catch {
            toast.add({
                title: 'Error al copiar',
                description: 'No se pudo acceder al portapapeles.',
                type: 'error',
            });
        }
    };

    // Función de recarga manual
    const handleRefresh = () => {
        setIsRefreshing(true);
        startTransition(async () => {
            try {
                const res = await getAllUsersAction();
                if (res.ok && res.data) {
                    setUsers(res.data);
                    toast.add({
                        title: 'Usuarios actualizados',
                        description: `Se han sincronizado ${res.data.length} usuarios con el servidor.`,
                        type: 'success',
                    });
                } else {
                    toast.add({
                        title: 'Error al sincronizar',
                        description: res.msg || 'No se pudieron cargar los usuarios del servidor.',
                        type: 'error',
                    });
                }
            } catch {
                toast.add({
                    title: 'Error de conexión',
                    description: 'No se pudo establecer conexión con el servidor.',
                    type: 'error',
                });
            } finally {
                setIsRefreshing(false);
            }
        });
    };

    // Datos filtrados
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            // Filtro por Rol
            if (roleFilter !== 'all') {
                if (u.role !== roleFilter) return false;
            }

            // Filtro por Estado / Seguridad
            if (statusFilter === 'active' && u.isActive === false) return false;
            if (statusFilter === 'inactive' && u.isActive !== false) return false;
            if (statusFilter === '2fa' && !u.is_two_factor_enabled) return false;
            if (statusFilter === 'discord' && !u.discordId) return false;

            // Búsqueda global
            if (globalSearch.trim()) {
                const query = globalSearch.toLowerCase().trim();
                const name = getUserDisplayName(u).toLowerCase();
                const email = (u.email || '').toLowerCase();
                const id = (u.id || '').toLowerCase();
                const discord = (u.discordId || '').toLowerCase();
                if (!name.includes(query) && !email.includes(query) && !id.includes(query) && !discord.includes(query)) {
                    return false;
                }
            }

            return true;
        });
    }, [users, roleFilter, statusFilter, globalSearch]);

    // Estadísticas para KPI Cards
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter((u) => u.isActive !== false).length;
        const inactive = users.filter((u) => u.isActive === false).length;
        const admins = users.filter((u) => u.role === 'admin').length;
        const clients = users.filter((u) => u.role === 'client').length;
        const standardUsers = users.filter((u) => u.role === 'user' || !u.role).length;
        const with2FA = users.filter((u) => u.is_two_factor_enabled).length;
        const withDiscord = users.filter((u) => Boolean(u.discordId)).length;
        const twoFaPercentage = total > 0 ? Math.round((with2FA / total) * 100) : 0;

        return {
            total,
            active,
            inactive,
            admins,
            clients,
            standardUsers,
            with2FA,
            twoFaPercentage,
            withDiscord,
        };
    }, [users]);

    // Columnas TanStack
    const columns = useMemo<ColumnDef<UserItem>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <div className="flex items-center justify-center pl-2">
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected()}
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Seleccionar todos los usuarios visibles"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center pl-2">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label={`Seleccionar usuario ${getUserDisplayName(row.original)}`}
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
                size: 44,
            },
            {
                id: 'user',
                accessorFn: (row) => getUserDisplayName(row),
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <button
                            type="button"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            className="group -ml-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-[0.98]"
                        >
                            <span>Usuario</span>
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
                    const user = row.original;
                    const displayName = getUserDisplayName(user);
                    const initials = getUserInitials(displayName);
                    const palette = getAvatarPalette(user.id || user.email);
                    const isActive = user.isActive !== false;

                    return (
                        <div className="flex items-center gap-3.5 py-2">
                            {/* Avatar con status indicator */}
                            <div className="relative size-10 shrink-0">
                                {user.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.image}
                                        alt={displayName}
                                        className="size-10 rounded-xl object-cover border border-border/80 shadow-xs"
                                    />
                                ) : (
                                    <div
                                        className={cn(
                                            'flex size-10 items-center justify-center rounded-xl border bg-linear-to-br font-semibold text-xs shadow-xs',
                                            palette
                                        )}
                                    >
                                        {initials}
                                    </div>
                                )}
                                {/* Status dot */}
                                <span
                                    className={cn(
                                        'absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background',
                                        isActive ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                                    )}
                                    title={isActive ? 'Usuario Activo' : 'Usuario Inactivo'}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex min-w-0 flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="truncate text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-purple-600 dark:hover:text-purple-400">
                                        {displayName}
                                    </span>
                                    {user.discordId && (
                                        <span
                                            className="inline-flex items-center rounded-md bg-[#5865F2]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#5865F2] border border-[#5865F2]/20"
                                            title="Vinculado con Discord"
                                        >
                                            Discord
                                        </span>
                                    )}
                                </div>
                                <span className="font-mono text-[11px] text-muted-foreground/75 truncate">
                                    ID: #{user.id.slice(0, 8)}...
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'email',
                header: () => (
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Correo Electrónico
                    </div>
                ),
                cell: ({ row }) => {
                    const user = row.original;
                    const email = user.email || '—';
                    const isCopied = copiedField?.id === user.id && copiedField?.type === 'email';

                    return (
                        <div className="flex items-center gap-2 py-1">
                            <span className="font-mono text-xs text-foreground/90 select-all">
                                {email}
                            </span>
                            {user.email && (
                                <button
                                    type="button"
                                    onClick={() => handleCopy(user.email, 'Correo electrónico', user.id, 'email')}
                                    className="inline-flex size-6 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-all hover:border-border/60 hover:bg-muted/80 hover:text-foreground active:scale-95"
                                    title="Copiar correo"
                                >
                                    <HugeiconsIcon
                                        icon={isCopied ? Tick02Icon : Copy01Icon}
                                        strokeWidth={2}
                                        className={cn('size-3', isCopied && 'text-emerald-500')}
                                    />
                                </button>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'role',
                header: () => (
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Rol
                    </div>
                ),
                cell: ({ row }) => {
                    const role = row.original.role || 'user';

                    const roleConfigMap: Record<
                        string,
                        { label: string; className: string; icon: typeof CrownIcon }
                    > = {
                        admin: {
                            label: 'Administrador',
                            className: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400',
                            icon: CrownIcon,
                        },
                        client: {
                            label: 'Cliente',
                            className: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
                            icon: User02Icon,
                        },
                        user: {
                            label: 'Estudiante',
                            className: 'border-border/70 bg-muted/60 text-muted-foreground',
                            icon: SparklesIcon,
                        },
                    };

                    const config = roleConfigMap[role] || {
                        label: role,
                        className: 'border-border/70 bg-muted/60 text-muted-foreground',
                        icon: User02Icon,
                    };

                    const RoleIcon = config.icon;

                    return (
                        <span
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase',
                                config.className
                            )}
                        >
                            <HugeiconsIcon icon={RoleIcon} strokeWidth={2} className="size-3" />
                            <span>{config.label}</span>
                        </span>
                    );
                },
            },
            {
                id: 'security',
                header: () => (
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Seguridad & 2FA
                    </div>
                ),
                cell: ({ row }) => {
                    const user = row.original;
                    const has2FA = Boolean(user.is_two_factor_enabled);
                    const pendingChange = Boolean(user.mustChangePassword);

                    return (
                        <div className="flex flex-col gap-1 py-1">
                            {has2FA ? (
                                <span className="inline-flex w-fit items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <HugeiconsIcon icon={ShieldCheckIcon} strokeWidth={2} className="size-3" />
                                    <span>2FA Activo</span>
                                </span>
                            ) : (
                                <span className="inline-flex w-fit items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/75">
                                    <HugeiconsIcon icon={ShieldOffIcon} strokeWidth={2} className="size-3 text-muted-foreground/60" />
                                    <span>Sin 2FA</span>
                                </span>
                            )}

                            {pendingChange && (
                                <span className="inline-flex w-fit items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                    <HugeiconsIcon icon={LockKeyIcon} strokeWidth={2} className="size-2.5" />
                                    <span>Cambio clave req.</span>
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'isActive',
                header: () => (
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Estado
                    </div>
                ),
                cell: ({ row }) => {
                    const isActive = row.original.isActive !== false;
                    return (
                        <span
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border',
                                isActive
                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            )}
                        >
                            <span
                                className={cn(
                                    'size-1.5 rounded-full',
                                    isActive ? 'bg-emerald-500' : 'bg-rose-500'
                                )}
                            />
                            <span>{isActive ? 'Activo' : 'Inactivo'}</span>
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
                    const user = row.original;
                    const isCopied = copiedField?.id === user.id && copiedField?.type === 'id';

                    return (
                        <div className="flex items-center justify-end gap-1.5 pr-2">
                            {/* Copiar ID */}
                            <button
                                type="button"
                                onClick={() => handleCopy(user.id, `ID de usuario #${user.id}`, user.id, 'id')}
                                className="group flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/50 text-muted-foreground transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-600 active:scale-[0.95] dark:hover:text-purple-400"
                                title="Copiar ID de usuario"
                                aria-label="Copiar ID"
                            >
                                <HugeiconsIcon
                                    icon={isCopied ? Tick02Icon : Copy01Icon}
                                    strokeWidth={2}
                                    className={cn(
                                        'size-3.5 transition-transform group-hover:scale-110',
                                        isCopied && 'text-emerald-500'
                                    )}
                                />
                            </button>

                            {/* Ver detalle modal */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedUser(user);
                                    setIsDetailOpen(true);
                                }}
                                className="group inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-600 active:scale-[0.98] dark:hover:text-purple-400"
                                title="Ver detalles completos del usuario"
                            >
                                <HugeiconsIcon
                                    icon={EyeIcon}
                                    strokeWidth={2}
                                    className="size-3.5 transition-transform group-hover:scale-110 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400"
                                />
                                <span>Detalles</span>
                            </button>
                        </div>
                    );
                },
                enableSorting: false,
            },
        ],
        [copiedField]
    );

    // Instancia TanStack Table
    const table = useReactTable({
        data: filteredUsers,
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

    const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

            {/* Header y Acciones Globales */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        Gestión de Usuarios
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Supervisa, audita y administra las cuentas, credenciales y privilegios de acceso en la plataforma.
                    </p>
                </div>

                {/* Botón sincronizar */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isPending || isRefreshing}
                        className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/60 px-4 text-xs font-semibold text-foreground shadow-xs transition-all duration-200 hover:border-purple-500/40 hover:bg-muted/80 active:scale-[0.98] disabled:opacity-50"
                        title="Sincronizar usuarios con el servidor"
                    >
                        <HugeiconsIcon
                            icon={ReloadIcon}
                            strokeWidth={2}
                            className={cn('size-4 transition-transform', (isPending || isRefreshing) && 'animate-spin text-purple-600')}
                        />
                        <span>{isRefreshing ? 'Actualizando...' : 'Sincronizar usuarios'}</span>
                    </button>
                </div>
            </div>

            {/* Mensaje de error si la conexión falló */}
            {errorMessage && (
                <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive">
                    <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-5 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* KPI Cards: Resumen Métrico Compacto (Double-Bezel Architecture) */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">

                {/* KPI 1: Total Usuarios */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-1 ring-1 ring-black/3 dark:border-white/5 dark:bg-zinc-900/40 dark:ring-white/4">
                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3.5 py-2.5 dark:border-white/10 dark:bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total Cuentas</span>
                            <div className="mt-0.5 flex items-baseline gap-1.5">
                                <span className="text-lg font-extrabold text-foreground">{stats.total}</span>
                                <span className="text-[10px] text-muted-foreground/75 font-sans">registradas</span>
                            </div>
                        </div>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <HugeiconsIcon icon={UserMultiple03Icon} strokeWidth={2} className="size-4" />
                        </div>
                    </div>
                </div>

                {/* KPI 2: Desglose por Rol */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-1 ring-1 ring-black/3 dark:border-white/5 dark:bg-zinc-900/40 dark:ring-white/4">
                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3.5 py-2.5 dark:border-white/10 dark:bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Roles</span>
                            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                                <span className="text-purple-500" title="Administradores">{stats.admins}a</span>
                                <span className="text-muted-foreground/30">•</span>
                                <span className="text-sky-500" title="Clientes">{stats.clients}c</span>
                                <span className="text-muted-foreground/30">•</span>
                                <span className="text-emerald-500" title="Estudiantes">{stats.standardUsers}u</span>
                            </div>
                        </div>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <HugeiconsIcon icon={CrownIcon} strokeWidth={2} className="size-4" />
                        </div>
                    </div>
                </div>

                {/* KPI 3: Estado de Cuentas */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-1 ring-1 ring-black/3 dark:border-white/5 dark:bg-zinc-900/40 dark:ring-white/4">
                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3.5 py-2.5 dark:border-white/10 dark:bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Estado Operativo</span>
                            <div className="mt-0.5 flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-emerald-500" />
                                <span className="text-sm font-bold text-foreground font-mono">{stats.active} activos</span>
                                {stats.inactive > 0 && (
                                    <span className="text-[10px] text-rose-500 font-mono">({stats.inactive} inact.)</span>
                                )}
                            </div>
                        </div>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                {/* Input de Búsqueda Global */}
                <div className="relative w-full max-w-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
                    </div>
                    <input
                        type="text"
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                        placeholder="Buscar por nombre, correo, ID o Discord..."
                        className="h-10 w-full rounded-xl border border-border/80 bg-background/50 pl-10 pr-9 text-xs font-medium text-foreground transition-all outline-none placeholder:text-muted-foreground/50 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                    />
                    {globalSearch && (
                        <button
                            type="button"
                            onClick={() => setGlobalSearch('')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                            aria-label="Limpiar búsqueda"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Filtros de Rol y Estado */}
                <div className="flex flex-wrap items-center gap-2">

                    {/* Pills de Roles */}
                    <div className="inline-flex rounded-xl border border-border/70 bg-muted/40 p-1 text-xs">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'admin', label: 'Admins' },
                            { id: 'client', label: 'Clientes' },
                            { id: 'user', label: 'Estudiantes' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setRoleFilter(item.id as typeof roleFilter)}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200',
                                    roleFilter === item.id
                                        ? 'bg-purple-600 text-white shadow-xs font-semibold hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                )}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Pills de Estado / Seguridad */}
                    <div className="inline-flex rounded-xl border border-border/70 bg-muted/40 p-1 text-xs">
                        {[
                            { id: 'all', label: 'Cualquier estado' },
                            { id: 'active', label: 'Solo activos' },
                            { id: '2fa', label: 'Con 2FA' },
                            { id: 'discord', label: 'Discord' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setStatusFilter(item.id as typeof statusFilter)}
                                className={cn(
                                    'rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200',
                                    statusFilter === item.id
                                        ? 'bg-purple-600 text-white shadow-xs font-semibold hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                )}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            {/* TABLA PRINCIPAL: Double-Bezel Architecture */}
            <div className="rounded-[2rem] border border-border/60 bg-muted/20 p-1.5 sm:p-2 ring-1 ring-black/4 dark:border-white/5 dark:bg-zinc-900/40 dark:ring-white/4 shadow-xs">
                <div className="overflow-hidden rounded-[1.5rem] border border-border/80 bg-card dark:border-white/10 dark:bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">

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
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                                                        <HugeiconsIcon icon={UserMultiple03Icon} strokeWidth={1.8} className="size-7" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-foreground">
                                                            No se encontraron usuarios
                                                        </h3>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {globalSearch || roleFilter !== 'all' || statusFilter !== 'all'
                                                                ? 'No existen registros que coincidan con los filtros y término de búsqueda aplicados.'
                                                                : 'Aún no hay usuarios registrados en el sistema.'}
                                                        </p>
                                                    </div>
                                                    {(globalSearch || roleFilter !== 'all' || statusFilter !== 'all') && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setGlobalSearch('');
                                                                setRoleFilter('all');
                                                                setStatusFilter('all');
                                                            }}
                                                            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-muted active:scale-[0.98]"
                                                        >
                                                            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
                                                            <span>Limpiar filtros</span>
                                                        </button>
                                                    )}
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
                                    {filteredUsers.length}
                                </strong>{' '}
                                usuarios
                            </span>
                            {selectedCount > 0 && (
                                <span className="rounded-full bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-medium text-purple-600 dark:text-purple-400 border border-purple-500/20">
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

            {/* Modal de Detalle Completo del Usuario */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-md sm:max-w-lg">
                    {selectedUser && (
                        <div>
                            <DialogHeader>
                                <div className="flex items-center gap-3">
                                    {selectedUser.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={selectedUser.image}
                                            alt={getUserDisplayName(selectedUser)}
                                            className="size-14 rounded-2xl object-cover border border-border shadow-xs"
                                        />
                                    ) : (
                                        <div
                                            className={cn(
                                                'flex size-14 items-center justify-center rounded-2xl border font-bold text-base shadow-xs bg-linear-to-br',
                                                getAvatarPalette(selectedUser.id)
                                            )}
                                        >
                                            {getUserInitials(getUserDisplayName(selectedUser))}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                                            {getUserDisplayName(selectedUser)}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-muted-foreground font-mono">
                                            ID: #{selectedUser.id}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            {/* Contenido del modal */}
                            <div className="mt-5 space-y-4">
                                {/* Estado y Rol */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            Rol asignado
                                        </span>
                                        <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold capitalize text-foreground">
                                            <HugeiconsIcon icon={CrownIcon} strokeWidth={2} className="size-3.5 text-purple-600 dark:text-purple-400" />
                                            <span>{selectedUser.role || 'user'}</span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            Estado de cuenta
                                        </span>
                                        <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                            <span
                                                className={cn(
                                                    'size-2 rounded-full',
                                                    selectedUser.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'
                                                )}
                                            />
                                            <span>{selectedUser.isActive !== false ? 'Activo y Verificado' : 'Suspendido / Inactivo'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Información de contacto e identificadores */}
                                <div className="space-y-2 rounded-xl border border-border/70 bg-card p-3.5 text-xs">
                                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="size-3.5" />
                                            <span>Correo:</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono font-medium text-foreground">
                                            <span>{selectedUser.email}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(selectedUser.email, 'Correo', selectedUser.id, 'email')}
                                                className="hover:text-purple-600 transition-colors"
                                                title="Copiar correo"
                                            >
                                                <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {selectedUser.discordId && (
                                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Discord ID:</span>
                                            <span className="font-mono text-[#5865F2] font-medium">
                                                {selectedUser.discordId}
                                            </span>
                                        </div>
                                    )}

                                    {selectedUser.address && (
                                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Dirección:</span>
                                            <span className="text-foreground font-medium">
                                                {selectedUser.address}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <HugeiconsIcon icon={SecurityCheckIcon} strokeWidth={2} className="size-3.5" />
                                            <span>Autenticación en 2 Pasos (2FA):</span>
                                        </div>
                                        <span
                                            className={cn(
                                                'font-semibold',
                                                selectedUser.is_two_factor_enabled ? 'text-emerald-500' : 'text-muted-foreground'
                                            )}
                                        >
                                            {selectedUser.is_two_factor_enabled ? 'Activado' : 'No configurado'}
                                        </span>
                                    </div>

                                    {selectedUser.mustChangePassword && (
                                        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-amber-600 dark:text-amber-400">
                                            <span>Cambio de contraseña:</span>
                                            <span className="font-semibold">Requerido en próximo inicio</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}