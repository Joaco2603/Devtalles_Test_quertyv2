"use client";

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
    href?: string;
    onClick?: () => void;
    className?: string;
    textClassName?: string;
    srText?: string;
}

interface LogoPart {
    char: string;
    type: 'bracket-open' | 'bracket-close' | 'slash' | 'letter';
}

const LOGO_PARTS: LogoPart[] = [
    { char: '{', type: 'bracket-open' },
    { char: 'D', type: 'letter' },
    { char: 'e', type: 'letter' },
    { char: 'v', type: 'letter' },
    { char: '/', type: 'slash' },
    { char: 't', type: 'letter' },
    { char: 'a', type: 'letter' },
    { char: 'l', type: 'letter' },
    { char: 'l', type: 'letter' },
    { char: 'e', type: 'letter' },
    { char: 's', type: 'letter' },
    { char: '}', type: 'bracket-close' },
];

const AnimatedLogo = ({
    href = '/',
    onClick,
    className = '',
    textClassName = '',
    srText = 'DevTalles',
}: AnimatedLogoProps) => {
    const containerRef = useRef<HTMLAnchorElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useGSAP(
        (context, contextSafe) => {
            const container = containerRef.current;
            if (!container || !contextSafe) return;

            const elements = container.querySelectorAll<HTMLElement>('[data-logo-unit]');
            if (!elements.length) return;

            const handleMouseEnter = contextSafe(() => {
                // Respect reduced-motion preferences
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    gsap.to(elements, {
                        opacity: 0.5,
                        duration: 0.15,
                        stagger: 0.02,
                        yoyo: true,
                        repeat: 1,
                    });
                    return;
                }

                // Kill any in-flight animation and reset cleanly
                if (tlRef.current) {
                    tlRef.current.kill();
                    gsap.set(elements, { clearProps: 'all' });
                }

                const tl = gsap.timeline({
                    onComplete: () => {
                        gsap.set(elements, { clearProps: 'all' });
                        tlRef.current = null;
                    },
                });
                tlRef.current = tl;

                // 1. Playful wave launch: squash & stretch, alternating jaunty tilts, and vibrant color pop
                tl.to(elements, {
                    y: (i, target) => {
                        const type = target.getAttribute('data-type');
                        if (type === 'bracket-open' || type === 'bracket-close') return '-0.3em';
                        if (type === 'slash') return '-0.6em';
                        return '-0.5em';
                    },
                    x: (i, target) => {
                        const type = target.getAttribute('data-type');
                        if (type === 'bracket-open') return '-0.18em';
                        if (type === 'bracket-close') return '0.18em';
                        return '0em';
                    },
                    rotation: (i, target) => {
                        const type = target.getAttribute('data-type');
                        if (type === 'bracket-open') return -22;
                        if (type === 'bracket-close') return 22;
                        if (type === 'slash') return 360; // 360° acrobatic cartwheel
                        return i % 2 === 0 ? -12 : 12;
                    },
                    scaleY: (i, target) => {
                        const type = target.getAttribute('data-type');
                        if (type === 'slash') return 1.35;
                        if (type?.startsWith('bracket')) return 1.15;
                        return 1.28;
                    },
                    scaleX: (i, target) => {
                        const type = target.getAttribute('data-type');
                        if (type === 'slash') return 1.35;
                        if (type?.startsWith('bracket')) return 1.15;
                        return 0.82;
                    },
                    color: (i, target) => {
                        const type = target.getAttribute('data-type');
                        if (type === 'bracket-open' || type === 'bracket-close') return '#a855f7';
                        if (type === 'slash') return '#ec4899'; // Playful bright pink pop
                        return i % 2 === 0 ? '#9333ea' : '#7c3aed';
                    },
                    duration: 0.22,
                    ease: 'power2.out',
                    stagger: {
                        each: 0.032,
                        from: 'start',
                    },
                })
                    // 2. Juicy elastic rebound and return to neutral resting state
                    .to(elements, {
                        y: 0,
                        x: 0,
                        rotation: (i, target) => (target.getAttribute('data-type') === 'slash' ? 360 : 0),
                        scaleY: 1,
                        scaleX: 1,
                        color: 'inherit',
                        duration: 0.62,
                        ease: 'elastic.out(1.25, 0.36)',
                        stagger: {
                            each: 0.032,
                            from: 'start',
                        },
                        clearProps: 'color,transform',
                    }, '<0.13');
            });

            container.addEventListener('mouseenter', handleMouseEnter);

            return () => {
                container.removeEventListener('mouseenter', handleMouseEnter);
            };
        },
        { scope: containerRef }
    );

    return (
        <Link
            ref={containerRef}
            href={href}
            onClick={onClick}
            className={cn(
                "group inline-flex items-center cursor-pointer select-none text-2xl font-bold tracking-tight text-neutral-950 dark:text-white leading-none",
                className
            )}
            aria-label={srText}
        >
            <span className="sr-only">{srText}</span>
            <span
                aria-hidden="true"
                className={cn("inline-flex items-center leading-none", textClassName)}
            >
                {LOGO_PARTS.map((item, idx) => (
                    <span
                        key={idx}
                        data-logo-unit=""
                        data-type={item.type}
                        className="inline-block origin-center will-change-transform"
                    >
                        {item.char}
                    </span>
                ))}
            </span>
        </Link>
    );
};

export default AnimatedLogo;
