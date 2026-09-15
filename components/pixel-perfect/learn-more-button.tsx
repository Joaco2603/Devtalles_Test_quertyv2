"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LearnMoreButtonProps {
  badge?: string;
  text?: string;
  actionText?: string;
  href?: string;
  className?: string;
  gradient?: string;
  boxShadow?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const LearnMoreButton = ({
  badge,
  text,
  actionText,
  href,
  className,
  gradient = "linear-gradient(180deg, #9333ea 0%, #9333ea 100%)",
  boxShadow = "0px 20px 45px rgba(87, 177, 255, 0.35), 0px 10px 20px rgba(87, 177, 255, 0.2), inset 0px 1px 12px 2px #D2EAFF, inset 0px 1px 4px 1px #D2EAFF",
  onClick,
  children,
}: LearnMoreButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [badge, text, actionText, children]);

  // If text is not provided and neither badge nor children are provided, default to "WATCH MORE"
  const displayText = text ?? (badge || children ? undefined : "WATCH MORE");
  const isBadgeMode = Boolean(badge || actionText || (text && badge !== undefined));

  const content = (
    <motion.div
      ref={containerRef}
      initial="rest"
      animate="rest"
      whileHover="hover"
      transition={{
        type: "spring",
        stiffness: 1000,
        damping: 20,
        mass: 10,
      }}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center rounded-full border border-neutral-900/10 dark:border-white/10 bg-neutral-900/3 dark:bg-white/4 pl-1 pr-3.5 backdrop-blur-sm cursor-pointer select-none transition-colors hover:border-neutral-900/20 dark:hover:border-white/20 h-9",
        className
      )}
    >
      {/* Expanding Pill with Glow and Arrow */}
      <motion.div
        variants={{
          rest: {
            width: 28,
          },
          hover: {
            width: containerWidth > 0 ? containerWidth - 8 : 175,
          },
        }}
        className="h-7 rounded-full flex origin-left justify-start items-center absolute left-1 inset-y-0 my-auto overflow-hidden"
        style={{
          background: gradient,
          boxShadow: boxShadow,
        }}
      >
        <motion.svg
          variants={{
            rest: {
              x: 0,
              scale: 1,
            },
            hover: {
              x: 5,
              scale: 1.05,
            },
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-arrow-right ml-1.5 text-white shrink-0"
        >
          <motion.path
            transition={{ duration: 0.15, delay: 0.05 }}
            variants={{
              rest: {
                opacity: 0,
              },
              hover: {
                opacity: 1,
              },
            }}
            d="M5 12h14"
          />
          <path d="m12 5 7 7-7 7" />
        </motion.svg>
      </motion.div>

      {/* Content / Typography */}
      <div className="relative z-20 flex items-center gap-2 pl-9 pr-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors delay-75 duration-300 group-hover:text-white">
        {children ? (
          children
        ) : isBadgeMode ? (
          <>
            {badge && (
              <span className="rounded-full bg-neutral-950 dark:bg-white px-1.5 py-0.5 text-[9px] font-semibold text-white dark:text-neutral-950 uppercase tracking-wider group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                {badge}
              </span>
            )}
            {displayText && (
              <span className="font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-white transition-colors duration-300">
                {displayText}
              </span>
            )}
            {actionText && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600 group-hover:text-white/60 transition-colors duration-300">
                  ·
                </span>
                <span className="font-semibold text-neutral-900 dark:text-white group-hover:text-white transition-colors duration-300 inline-flex items-center gap-1">
                  {actionText}
                </span>
              </>
            )}
          </>
        ) : (
          <span className="font-medium text-neutral-900 transition-colors delay-100 duration-500 group-hover:text-white dark:text-neutral-100">
            {displayText}
          </span>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
};

export const LearnMoreButtion = LearnMoreButton;
export default LearnMoreButton;
