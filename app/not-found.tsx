"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import {
    Home,
    RotateCcw,
    Dices,
    Orbit,
    Sparkles,
    Code2,
    ArrowLeft,
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

const DEV_EXCUSES = [
    "Funciona perfectamente en mi Localhost ¯\\_(ツ)_/¯",
    "El router de Next.js se tomó un año sabático no remunerado",
    "Un becario hizo 'git push --force' a main un viernes a las 6:01 PM",
    "La inteligencia artificial decidió que esta ruta era demasiado avanzada para este universo",
    "La culpa es 100% de la caché de tu navegador. Siempre es de la caché",
    "El CSS se desbordó con un float misterioso y empujó la página a otra dimensión",
    "El archivo fue renombrado a 'componente_final_v2_DEFINITIVO_este_si.tsx' y nadie sabe dónde está",
    "Error 404: Un punto y coma ';' escapó de su función y anda suelto en el servidor",
    "Un gato caminó sobre el teclado en el datacenter y cerró el puerto",
    "La ruta está en staging... pero en un staging puramente mental",
];

const FLOATING_RELICS = [
    {
        id: 'duck',
        label: 'Rubber Duck Debugger',
        icon: '🦆',
        bubble: '¡Cuak! ¿Ya revisaste la consola?',
        color: 'from-amber-400/20 to-yellow-500/30 border-amber-400/40 text-amber-300',
        initialPos: 'top-[12%] left-[8%] md:left-[12%]',
        deltaY: -22,
        rotationRange: [-10, 12],
    },
    {
        id: 'coffee',
        label: 'Combustible Dev',
        icon: '☕',
        bubble: 'Error 418: Soy una tetera... o falta café',
        color: 'from-amber-700/20 to-orange-800/30 border-amber-600/40 text-amber-400',
        initialPos: 'top-[18%] right-[10%] md:right-[14%]',
        deltaY: -18,
        rotationRange: [8, -14],
    },
    {
        id: 'bug',
        label: 'Feature no documentada',
        icon: '🐛',
        bubble: '¡No soy un bug, soy una sorpresa!',
        color: 'from-emerald-500/20 to-teal-700/30 border-emerald-400/40 text-emerald-300',
        initialPos: 'bottom-[22%] left-[10%] md:left-[14%]',
        deltaY: -25,
        rotationRange: [-12, 10],
    },
    {
        id: 'code',
        label: 'Null Pointer Exception',
        icon: '</>',
        bubble: 'undefined is not a function',
        color: 'from-purple-500/20 to-indigo-700/30 border-purple-400/40 text-purple-300',
        initialPos: 'bottom-[20%] right-[10%] md:right-[15%]',
        deltaY: -20,
        rotationRange: [12, -8],
    },
];

export default function GlobalNotFound() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const leftPupilRef = useRef<HTMLDivElement>(null);
    const rightPupilRef = useRef<HTMLDivElement>(null);
    const particleContainerRef = useRef<HTMLDivElement>(null);
    const excuseTextRef = useRef<HTMLParagraphElement>(null);
    const excuseCounterRef = useRef<HTMLSpanElement>(null);
    const clickHintRef = useRef<HTMLDivElement>(null);

    useGSAP(
        (context, contextSafe) => {
            const container = containerRef.current;
            const head = headRef.current;
            const leftPupil = leftPupilRef.current;
            const rightPupil = rightPupilRef.current;
            const particleContainer = particleContainerRef.current;
            const excuseText = excuseTextRef.current;
            const excuseCounter = excuseCounterRef.current;
            const clickHint = clickHintRef.current;

            if (!container || !contextSafe) return;

            const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // Internal animation variables
            let currentExcuseIdx = 0;
            let mascotClicks = 0;
            let isZeroGRunning = false;

            // 1. Initial entrance timeline
            const tl = gsap.timeline({ defaults: { ease: 'back.out(1.6)' } });

            tl
                .from(
                    '.digit-4-left',
                    {
                        x: -70,
                        opacity: 0,
                        rotation: -25,
                        duration: 0.8,
                    },
                    '-=0.3'
                )
                .from(
                    head,
                    {
                        scale: 0.2,
                        opacity: 0,
                        duration: 0.9,
                        ease: 'elastic.out(1.1, 0.45)',
                    },
                    '-=0.6'
                )
                .from(
                    '.digit-4-right',
                    {
                        x: 70,
                        opacity: 0,
                        rotation: 25,
                        duration: 0.8,
                    },
                    '-=0.7'
                )
                .from(
                    '.text-hero',
                    {
                        y: 25,
                        opacity: 0,
                        stagger: 0.12,
                        duration: 0.6,
                        ease: 'power2.out',
                    },
                    '-=0.4'
                )
                .from(
                    '.relic-item',
                    {
                        scale: 0,
                        opacity: 0,
                        stagger: 0.1,
                        duration: 0.6,
                        ease: 'back.out(2)',
                    },
                    '-=0.3'
                )
                .from(
                    '.action-btn',
                    {
                        y: 20,
                        opacity: 0,
                        stagger: 0.08,
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '-=0.2'
                );

            if (!isReducedMotion) {
                // 2. Idle floating for relics
                FLOATING_RELICS.forEach((relic) => {
                    const el = container.querySelector(`[data-relic-id="${relic.id}"]`);
                    if (el) {
                        gsap.to(el, {
                            y: relic.deltaY,
                            rotation: relic.rotationRange[1],
                            duration: 3.2,
                            repeat: -1,
                            yoyo: true,
                            ease: 'sine.inOut',
                        });
                    }
                });

                // 3. Gentle breathing float for Bot Mascot
                if (head) {
                    gsap.to(head, {
                        y: -10,
                        duration: 2.4,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    });
                }

                // 4. Subtle tilt for numbers
                gsap.to('.digit-4-left', {
                    rotation: -6,
                    y: -6,
                    duration: 3.2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });

                gsap.to('.digit-4-right', {
                    rotation: 6,
                    y: -6,
                    duration: 3.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: 0.3,
                });

                // 5. Blinking eyes
                const blinkTl = gsap.timeline({ repeat: -1, repeatDelay: 3.8 });
                blinkTl
                    .to('.mascot-eyelid', {
                        scaleY: 0.1,
                        duration: 0.12,
                        ease: 'power1.inOut',
                    })
                    .to('.mascot-eyelid', {
                        scaleY: 1,
                        duration: 0.14,
                        ease: 'power1.inOut',
                    });
            }

            // Helper: Spawn floating particles
            const spawnParticles = (startX: number, startY: number, items: string[]) => {
                if (!particleContainer) return;

                items.forEach((item, i) => {
                    const p = document.createElement('span');
                    p.innerText = item;
                    p.className = 'absolute pointer-events-none text-base md:text-lg font-bold select-none z-50';
                    p.style.left = `${startX}px`;
                    p.style.top = `${startY}px`;
                    particleContainer.appendChild(p);

                    const angle = (Math.PI * 2 * i) / items.length + 0.2;
                    const dist = 55;
                    const endX = Math.cos(angle) * dist;
                    const endY = Math.sin(angle) * dist;

                    gsap.to(p, {
                        x: endX,
                        y: endY,
                        opacity: 0,
                        scale: 1.5,
                        rotation: (i % 2 === 0 ? 1 : -1) * 60,
                        duration: 0.9,
                        ease: 'power2.out',
                        onComplete: () => p.remove(),
                    });
                });
            };

            // 6. Interactive Mouse Tracker for Mascot Pupils
            const handleMouseMove = contextSafe((e: MouseEvent) => {
                if (isReducedMotion || !head || !leftPupil || !rightPupil) return;

                const rect = head.getBoundingClientRect();
                const headCenterX = rect.left + rect.width / 2;
                const headCenterY = rect.top + rect.height / 2;

                const deltaX = e.clientX - headCenterX;
                const deltaY = e.clientY - headCenterY;

                const maxOffset = 11;
                const angle = Math.atan2(deltaY, deltaX);
                const distance = Math.min(Math.hypot(deltaX, deltaY) / 12, maxOffset);

                const pupilX = Math.cos(angle) * distance;
                const pupilY = Math.sin(angle) * distance;

                gsap.to([leftPupil, rightPupil], {
                    x: pupilX,
                    y: pupilY,
                    duration: 0.2,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });

                // 3D head tilt
                const tiltX = (deltaY / window.innerHeight) * -12;
                const tiltY = (deltaX / window.innerWidth) * 14;
                gsap.to(head, {
                    rotationY: tiltY,
                    rotationX: tiltX,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });

            // 7. Mascot Click
            const handleMascotClick = contextSafe((e: MouseEvent) => {
                e.stopPropagation();
                if (!head) return;
                mascotClicks += 1;
                if (clickHint) {
                    clickHint.innerText = `Cosquillas: ${mascotClicks}`;
                }

                if (isReducedMotion) {
                    gsap.to(head, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 });
                    return;
                }

                const rect = head.getBoundingClientRect();
                spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, ['✨', '👀', '⚡', '404']);

                gsap.timeline()
                    .to(head, {
                        scaleX: 1.3,
                        scaleY: 0.72,
                        rotation: (mascotClicks % 2 === 0 ? 1 : -1) * 16,
                        duration: 0.16,
                        ease: 'power2.out',
                    })
                    .to(head, {
                        scaleX: 0.88,
                        scaleY: 1.22,
                        y: -25,
                        duration: 0.22,
                        ease: 'power2.out',
                    })
                    .to(head, {
                        scaleX: 1,
                        scaleY: 1,
                        y: 0,
                        rotation: 0,
                        duration: 0.7,
                        ease: 'elastic.out(1.25, 0.35)',
                    });
            });

            // 8. Relics Click Handlers
            const relicElements = container.querySelectorAll<HTMLElement>('.relic-item');
            const handleRelicClick = contextSafe((e: MouseEvent) => {
                e.stopPropagation();
                const target = e.currentTarget as HTMLElement;
                const relicId = target.getAttribute('data-relic-id');
                const relic = FLOATING_RELICS.find((r) => r.id === relicId);
                if (!relic) return;

                const bubble = target.querySelector<HTMLElement>('.speech-bubble');
                if (bubble) {
                    bubble.style.opacity = '1';
                    bubble.style.transform = 'translateY(0) scale(1)';
                    setTimeout(() => {
                        bubble.style.opacity = '';
                        bubble.style.transform = '';
                    }, 3200);
                }

                const rect = target.getBoundingClientRect();
                spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, [relic.icon, '✨', '!']);

                gsap.timeline()
                    .to(target, {
                        scale: 1.4,
                        rotation: '+=360',
                        duration: 0.35,
                        ease: 'back.out(2)',
                    })
                    .to(target, {
                        scale: 1,
                        duration: 0.55,
                        ease: 'elastic.out(1.2, 0.4)',
                    });
            });

            // 9. Dev Excuse Generator Button
            const excuseBtn = container.querySelector<HTMLButtonElement>('.excuse-btn');
            const handleExcuseClick = contextSafe((e: MouseEvent) => {
                e.stopPropagation();
                if (!excuseText) return;

                currentExcuseIdx = (currentExcuseIdx + 1) % DEV_EXCUSES.length;

                gsap.timeline()
                    .to(excuseText, {
                        y: -20,
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.15,
                        ease: 'power2.in',
                    })
                    .call(() => {
                        excuseText.innerText = `“${DEV_EXCUSES[currentExcuseIdx]}”`;
                        if (excuseCounter) {
                            excuseCounter.innerText = `Excusa #${currentExcuseIdx + 1}/${DEV_EXCUSES.length}`;
                        }
                    })
                    .fromTo(
                        excuseText,
                        { y: 20, opacity: 0, scale: 0.95 },
                        { y: 0, opacity: 1, scale: 1, duration: 0.32, ease: 'back.out(1.7)' }
                    );

                if (excuseBtn) {
                    gsap.fromTo(
                        excuseBtn,
                        { rotation: -8, scale: 0.92 },
                        { rotation: 0, scale: 1, duration: 0.45, ease: 'elastic.out(1.2, 0.35)' }
                    );
                }
            });

            // 10. Zero-Gravity Button
            const zeroGBtn = container.querySelector<HTMLButtonElement>('.zerog-btn');
            const handleZeroGClick = contextSafe((e: MouseEvent) => {
                e.stopPropagation();
                if (isZeroGRunning) return;
                isZeroGRunning = true;

                const targets = container.querySelectorAll('.float-target');
                targets.forEach((t, i) => {
                    const randomX = (i % 2 === 0 ? 1 : -1) * (40 + (i * 25));
                    const randomY = -70 - (i * 15);
                    const randomRot = (i % 2 === 0 ? 1 : -1) * (15 + i * 8);

                    gsap.to(t, {
                        x: randomX,
                        y: randomY,
                        rotation: randomRot,
                        duration: 1.6,
                        ease: 'power1.out',
                    });
                });

                if (zeroGBtn) {
                    zeroGBtn.innerText = '¡Flotando!';
                }

                setTimeout(() => {
                    targets.forEach((t) => {
                        gsap.to(t, {
                            x: 0,
                            y: 0,
                            rotation: 0,
                            duration: 1.1,
                            ease: 'bounce.out',
                        });
                    });
                    if (zeroGBtn) {
                        zeroGBtn.innerText = 'Gravedad Cero';
                    }
                    isZeroGRunning = false;
                }, 2000);
            });

            // 11. Digits 4 Click Reactions
            const left4 = container.querySelector<HTMLElement>('.digit-4-left');
            const right4 = container.querySelector<HTMLElement>('.digit-4-right');

            const handleLeft4Click = contextSafe(() => {
                if (isReducedMotion || !left4) return;
                gsap.timeline()
                    .to(left4, { rotation: -28, scale: 1.25, duration: 0.18, ease: 'power2.out' })
                    .to(left4, { rotation: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.35)' });
            });

            const handleRight4Click = contextSafe(() => {
                if (isReducedMotion || !right4) return;
                gsap.timeline()
                    .to(right4, { rotation: 28, scale: 1.25, duration: 0.18, ease: 'power2.out' })
                    .to(right4, { rotation: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.35)' });
            });

            // 12. Background Click Particle Burst
            const handleContainerClick = contextSafe((e: MouseEvent) => {
                const target = e.target as HTMLElement;
                if (target.closest('button, a, input, [role="button"], .relic-item, .digit-bot, .digit-4-left, .digit-4-right')) {
                    return;
                }
                const tokens = ['{ }', '404', 'NaN', 'undefined', '🐛', '✨', '⚡', '</>', '☕', '🦆'];
                const clickX = e.clientX;
                const clickY = e.clientY;

                tokens.slice(0, 4).forEach((token, i) => {
                    if (!particleContainer) return;
                    const p = document.createElement('div');
                    p.innerText = token;
                    p.className =
                        'absolute pointer-events-none text-xs md:text-sm font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm z-50 select-none';
                    p.style.left = `${clickX}px`;
                    p.style.top = `${clickY}px`;
                    particleContainer.appendChild(p);

                    const angle = (Math.PI * 2 * i) / 4 + 0.3;
                    const dist = 65;

                    gsap.to(p, {
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist + 15,
                        opacity: 0,
                        scale: 1.2,
                        rotation: (i % 2 === 0 ? 1 : -1) * 35,
                        duration: 0.9,
                        ease: 'power3.out',
                        onComplete: () => p.remove(),
                    });
                });
            });

            // Attach all event listeners
            window.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('click', handleContainerClick);
            if (head) head.addEventListener('click', handleMascotClick);
            if (left4) left4.addEventListener('click', handleLeft4Click);
            if (right4) right4.addEventListener('click', handleRight4Click);
            if (excuseBtn) excuseBtn.addEventListener('click', handleExcuseClick);
            if (zeroGBtn) zeroGBtn.addEventListener('click', handleZeroGClick);
            relicElements.forEach((el) => el.addEventListener('click', handleRelicClick));

            // Clean up all event listeners on unmount
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('click', handleContainerClick);
                if (head) head.removeEventListener('click', handleMascotClick);
                if (left4) left4.removeEventListener('click', handleLeft4Click);
                if (right4) right4.removeEventListener('click', handleRight4Click);
                if (excuseBtn) excuseBtn.removeEventListener('click', handleExcuseClick);
                if (zeroGBtn) zeroGBtn.removeEventListener('click', handleZeroGClick);
                relicElements.forEach((el) => el.removeEventListener('click', handleRelicClick));
            };
        },
        { scope: containerRef }
    );

    return (
        <main
            ref={containerRef}
            className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-white flex flex-col items-center justify-between p-6 select-none"
        >
            {/* Container for dynamically created flying particles */}
            <div ref={particleContainerRef} className="pointer-events-none fixed inset-0 z-50" />

            {/* Top Bar / Status Pill */}
            <header className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-2">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Inicio DevTalles</span>
                </Link>

            </header>

            {/* Floating Interactive Relics */}
            {FLOATING_RELICS.map((relic) => (
                <div
                    key={relic.id}
                    data-relic-id={relic.id}
                    className={cn(
                        'relic-item float-target absolute z-20 cursor-pointer group flex flex-col items-center select-none',
                        relic.initialPos
                    )}
                >
                    {/* Speech Bubble Tooltip */}
                    <div className="speech-bubble absolute -top-12 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900/95 border border-white/20 text-neutral-100 shadow-xl backdrop-blur-md pointer-events-none opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300">
                        <span>{relic.bubble}</span>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900/95" />
                    </div>

                    {/* Interactive Relic Badge */}
                    <div
                        className={cn(
                            'size-12 md:size-14 rounded-2xl bg-linear-to-br border backdrop-blur-xl flex items-center justify-center text-2xl md:text-3xl shadow-lg transition-transform hover:scale-110 active:scale-95',
                            relic.color
                        )}
                        title={relic.label}
                    >
                        <span>{relic.icon}</span>
                    </div>
                </div>
            ))}

            {/* Central Fun 404 Stage */}
            <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center my-auto py-8">
                {/* 404 Animated Character Group */}
                <div className="flex items-center justify-center gap-3 md:gap-7 my-2">
                    {/* Digit '4' Left */}
                    <span
                        className="digit-4-left float-target text-8xl md:text-9xl font-black tracking-tighter bg-linear-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 will-change-transform"
                        title="Haz clic para que salte"
                    >
                        4
                    </span>

                    {/* Digit '0' Interactive Dev Mascot with Eyes tracking cursor */}
                    <div
                        ref={headRef}
                        className="digit-bot float-target relative w-28 h-36 md:w-36 md:h-44 rounded-[2.5rem] bg-linear-to-b from-purple-500/25 via-purple-700/20 to-neutral-900/90 border-2 border-purple-400/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden group hover:border-purple-400/70 transition-colors will-change-transform"
                        title="¡Tócame o muéveme el cursor!"
                    >
                        {/* Antenna with glowing beacon */}
                        <div className="absolute top-2.5 flex flex-col items-center">
                            <span className="size-2 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_10px_#e879f9]" />
                            <span className="w-0.5 h-2 bg-purple-400/60" />
                        </div>

                        {/* Visor Screen with Eyes */}
                        <div className="relative w-20 h-14 md:w-26 md:h-18 rounded-2xl bg-neutral-950/85 border border-purple-400/30 flex items-center justify-center gap-2.5 md:gap-3.5 px-3 shadow-inner">
                            {/* Left Eye */}
                            <div className="mascot-eyelid relative size-7 md:size-8 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                <div
                                    ref={leftPupilRef}
                                    className="size-3 md:size-3.5 rounded-full bg-neutral-950 flex items-center justify-center relative"
                                >
                                    <span className="absolute top-0.5 right-0.5 size-1 rounded-full bg-white" />
                                </div>
                            </div>

                            {/* Right Eye */}
                            <div className="mascot-eyelid relative size-7 md:size-8 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                <div
                                    ref={rightPupilRef}
                                    className="size-3 md:size-3.5 rounded-full bg-neutral-950 flex items-center justify-center relative"
                                >
                                    <span className="absolute top-0.5 right-0.5 size-1 rounded-full bg-white" />
                                </div>
                            </div>
                        </div>

                        {/* Interactive Cute Smile */}
                        <div className="mt-2.5 flex items-center justify-center">
                            <span className="w-5 h-1.5 rounded-full bg-purple-300/80 group-hover:scale-x-125 transition-transform" />
                        </div>

                        {/* Click Hint badge */}
                        <div
                            ref={clickHintRef}
                            className="absolute bottom-1.5 text-[9px] font-mono tracking-wider text-purple-300/60 uppercase"
                        >
                            DevBot 0
                        </div>
                    </div>

                    {/* Digit '4' Right */}
                    <span
                        className="digit-4-right float-target text-8xl md:text-9xl font-black tracking-tighter bg-linear-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 will-change-transform"
                        title="Haz clic para que salte"
                    >
                        4
                    </span>
                </div>

                {/* Headings */}
                <h1 className="text-hero text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-4">
                    ¡Vaya! Te perdiste en el ciberespacio
                </h1>
                <p className="text-hero text-neutral-400 mt-3 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                    La página que buscas ha sido desintegrada o absorbida por un agujero negro de código.
                    Los ojos del robot siguen tu cursor para ayudarte a encontrar el camino.
                </p>

                {/* Interactive Dev Excuse Generator Card */}
                <div className="text-hero float-target w-full max-w-lg mt-7 p-4 rounded-2xl bg-white/3 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-white/5 text-xs text-neutral-400">
                        <div className="flex items-center gap-1.5 font-mono text-purple-400">
                            <Code2 className="size-3.5" />
                            <span>Diagnóstico del Servidor</span>
                        </div>
                        <span
                            ref={excuseCounterRef}
                            className="text-[11px] text-neutral-500 font-mono"
                        >
                            Excusa #1/{DEV_EXCUSES.length}
                        </span>
                    </div>

                    <p
                        ref={excuseTextRef}
                        className="text-sm sm:text-base font-mono text-neutral-200 min-h-12 flex items-center justify-center px-2 py-1 leading-snug"
                    >
                        &ldquo;{DEV_EXCUSES[0]}&rdquo;
                    </p>

                    <div className="mt-3 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            className="excuse-btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-all cursor-pointer active:scale-95"
                        >
                            <Dices className="size-3.5" />
                            <span>Tirar otra excusa</span>
                        </button>

                        <button
                            type="button"
                            className="zerog-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-white/4 hover:bg-white/8 text-neutral-300 border-white/10 transition-all cursor-pointer active:scale-95"
                        >
                            <Orbit className="size-3.5" />
                            <span>Gravedad Cero</span>
                        </button>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 w-full">
                    <Link
                        href="/"
                        className="action-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-purple-400/20"
                    >
                        <Home className="size-4" />
                        <span>Volver a zona segura</span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                            if (typeof window !== 'undefined') window.location.reload();
                        }}
                        className="action-btn inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/1 text-neutral-300 hover:text-white font-semibold text-sm border border-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <RotateCcw className="size-4" />
                        <span>Reintentar ruta</span>
                    </button>
                </div>
            </div>

            {/* Bottom Footer Details */}
            <footer className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 pb-2 border-t border-white/5 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-purple-400" />
                    <span>Tip: Haz clic en el fondo o en los objetos flotantes para interactuar</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>Código de error: ERR_DEV_PAGE_NOT_FOUND</span>
                </div>
            </footer>
        </main>
    );
}