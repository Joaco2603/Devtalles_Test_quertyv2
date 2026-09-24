import SidebarApp from "../_ui/Sidebar";
import Orbit from "./_ui/Orbit";
import { Sparkles, Cpu, Activity, CheckCircle2, Clock } from "lucide-react";

export default function RoadMapPage() {
    return (
        <SidebarApp>
            <div className="flex flex-col gap-8 p-4 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            Roadmap de Innovación & IA
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground mt-1 max-w-2xl">
                            Visualización del núcleo inteligente interactivo y planificación estratégica de las próximas tecnologías para la plataforma.
                        </p>
                    </div>
                </div>

                {/* Hero Showcase with Orbit Core */}
                <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-linear-to-b from-card/5 via-card/10 to-background/10 p-6 md:p-10 shadow-2xl backdrop-blur-2xl bg-zinc-950">
                    {/* Ambient Glows */}
                    <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 right-10 w-72 h-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <Cpu className="size-4 text-primary" />
                            <span className="text-white">Motor Gráfico WebGPU • Shader Dinámico Fluid Glass</span>
                        </div>

                        {/* Interactive Orbit Component */}
                        <div className="w-full max-w-2xl h-105 md:h-120 my-2 relative">
                            <Orbit
                                className="w-full h-full rounded-2xl"
                                // showControls={true}
                                showStatusBadge={true}
                                initialState="idle"
                            />
                        </div>

                        <p className="mt-4 text-xs text-white/80 max-w-md">
                            Haz clic en el orbe o utiliza los controles inferiores para alternar entre los estados <span className="text-purple-300 font-medium">Idle</span> y <span className="text-purple-300 font-medium">Thinking</span>, o activa pulsos de energía.
                        </p>
                    </div>
                </div>

                {/* Strategic Roadmap Milestones */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                            <Activity className="size-5 text-primary" />
                            Fases del Roadmap
                        </h2>
                        <span className="text-xs text-muted-foreground">Actualizado recientemente</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Q3 Card */}
                        <div className="group relative rounded-2xl border border-border/50 bg-card/60 p-6 hover:border-primary/40 hover:bg-card/90 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                                    <CheckCircle2 className="size-3.5" /> Completado
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">Q3 2026</span>
                            </div>
                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                Motor Gráfico WebGPU & Orbe IA
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                                Integración del pipeline de shaders WGSL de fluidos ópticos analíticos y reactividad de estados en tiempo real.
                            </p>
                            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Progreso</span>
                                <span className="font-semibold text-foreground">100%</span>
                            </div>
                            <div className="w-full bg-muted/60 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full w-full" />
                            </div>
                        </div>

                        {/* Q4 Card */}
                        <div className="group relative rounded-2xl border border-primary/30 bg-card/80 p-6 shadow-md hover:border-primary/60 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/25 flex items-center gap-1.5">
                                    <Clock className="size-3.5 animate-spin" /> En Desarrollo
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">Q4 2026</span>
                            </div>
                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                Tutor Personalizado DevTalles
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                                Asistente conversacional con memoria contextual que ayuda a los estudiantes a resolver dudas de código paso a paso.
                            </p>
                            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Progreso</span>
                                <span className="font-semibold text-primary">68%</span>
                            </div>
                            <div className="w-full bg-muted/60 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-primary h-full rounded-full w-[68%]" />
                            </div>
                        </div>

                        {/* Q1 2027 Card */}
                        <div className="group relative rounded-2xl border border-border/50 bg-card/60 p-6 hover:border-primary/40 hover:bg-card/90 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/50">
                                    Planificado
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">Q1 2027</span>
                            </div>
                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                Evaluación y Certificación Adaptativa
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                                Pruebas técnicas generativas adaptadas a las debilidades del estudiante con emisión de credenciales verificables.
                            </p>
                            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Progreso</span>
                                <span className="font-semibold text-muted-foreground">15%</span>
                            </div>
                            <div className="w-full bg-muted/60 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-muted-foreground/40 h-full rounded-full w-[15%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarApp>
    );
}