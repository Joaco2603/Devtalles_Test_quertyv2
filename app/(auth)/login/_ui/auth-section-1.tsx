"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useState, type ReactNode, type FormEvent } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

// Apple-inspired spring physics (instant response, critically damped)
const SPRING_TRANSITION = { type: "spring", damping: 30, stiffness: 350 } as const;

export default function AuthSectionOne() {
  const [email, setEmail] = useState("harshitlog@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <main className="relative h-svh min-h-svh w-full bg-white p-2.5 sm:p-4 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white flex items-center justify-center overflow-hidden ">
      {/* Container chassis scaled to fit effortlessly within 100dvh */}
      <div className="grid h-full max-h-160 sm:max-h-167.5 lg:max-h-168.75 xl:max-h-172.25 w-full max-w-300 grid-cols-1 lg:grid-cols-[0.96fr_1.04fr] gap-3 sm:gap-4 overflow-hidden">

        {/* =========================================================================
            LEFT CARD: COMPACT LOGIN FORM
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_TRANSITION}
          className="flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-black/10 bg-white px-6 py-10 sm:px-8 sm:py-12 lg:px-9 lg:py-14 dark:border-white/10 dark:bg-[#0a0a0a] shadow-sm dark:shadow-2xl overflow-y-auto"
        >
          <div className="mx-auto w-full max-w-105 my-auto">
            {/* Logo, Editorial Title & Subtitle */}
            <div>
              <Link href="/" className="">
                <Image
                  src="/img/logo.png"
                  alt="Devtalles Logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="size-8 sm:w-40 h-20 object-contain invert dark:invert-0 pb-4"
                  priority
                />
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-medium tracking-[-0.04em] leading-[1.1] text-neutral-950 dark:text-white">
                Welcome back
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-black/60 dark:text-white/60 tracking-tight">
                Brainstorm in chat, build together in cowork.
              </p>
            </div>

            {/* Social Logins */}
            <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2.5">
              <SocialButton icon={<GoogleIcon />} label="Sign in with Google" />
              <SocialButton icon={<AppleIcon />} label="Sign in with Apple" />
            </div>

            {/* Minimalist Divider */}
            <div className="relative my-3.5 sm:my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10 dark:border-white/10" />
              </div>
              <div className="relative bg-white dark:bg-[#0a0a0a] px-3 text-[11px] font-medium text-black/45 dark:text-white/45 uppercase tracking-wider">
                or
              </div>
            </div>

            {/* Login Inputs */}
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              <FieldBox
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="name@company.com"
                autoComplete="email"
              />

              <FieldBox
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="••••••••••••"
                autoComplete="current-password"
                trailingAction={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />

              {/* Remember Me & Forgot Password row */}
              <div className="flex items-center justify-between pt-0.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-black/70 dark:text-white/70">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-3.5 rounded border-black/20 dark:border-white/20 accent-[#FC7819] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <a
                  href="#"
                  className="font-medium text-black/60 hover:text-[#FC7819] dark:text-white/60 dark:hover:text-[#FC7819] transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit CTA (Instant feedback, Apple press physics) */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex h-11 sm:h-11.5 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm sm:text-base font-medium text-white transition-all duration-150 ease-out active:scale-[0.98] hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 disabled:opacity-75 cursor-pointer shadow-sm"
              >
                <span>{isLoading ? "Signing in..." : "Sign in"}</span>
                <ArrowRightIcon className="size-4" />
              </button>
            </form>
          </div>

          {/* Bottom Switcher */}
          <div className="mt-3 text-center text-xs text-black/55 dark:text-white/55">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-black dark:text-white underline underline-offset-2 hover:text-[#FC7819] transition-colors"
            >
              Create an account
            </Link>
          </div>
        </motion.div>

        {/* =========================================================================
            RIGHT CARD: CINEMATIC GRAIN SHADER & PROMO
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING_TRANSITION}
          className="relative hidden lg:flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-black p-7 xl:p-9 text-white shadow-2xl h-full"
        >
          {/* Grain Shader */}
          <GrainGradient
            speed={0.85}
            scale={1}
            rotation={0}
            offsetX={0}
            offsetY={0}
            softness={0.5}
            intensity={0.5}
            noise={0.25}
            shape="corners"
            frame={2854.5}
            colors={["#FFFFFF", "#FC7819", "#FC7819", "#FFFFFF"]}
            colorBack="#00000000"
            className="absolute inset-0 bg-black"
          />

          {/* Vignette overlay */}
          <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-t from-black/80 via-transparent to-black/40" />

          {/* Content Header & Headline (2 lines max, wide container) */}
          <div className="relative z-10">
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-mono backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              WORKSPACE // CLUSTER 04
            </div> */}

            <h2 className="mt-6 max-w-md text-4xl xl:text-[48px] font-medium tracking-[-0.05em] leading-[0.98] text-white">
              Think fast,
              <br />
              Build faster
            </h2>
          </div>

          {/* Bottom Desktop Download Island */}
          <div className="relative z-10 flex items-center justify-between gap-3 pt-4">
            <div
              className="inline-flex h-10 items-center gap-2.5 rounded-xl border border-white/25 bg-black/30 px-4 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-150 ease-out active:scale-[0.98] hover:border-white/50 hover:bg-black/50 hover:text-white"
            >
              <WindowsIcon className="size-4 shrink-0" />
              <span className="truncate">Download for Windows</span>
            </div>

            <div
              className="inline-flex h-10 items-center gap-2.5 rounded-xl border border-white/25 bg-black/30 px-4 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-150 ease-out active:scale-[0.98] hover:border-white/50 hover:bg-black/50 hover:text-white"
            >
              <AppleIcon className="size-4 shrink-0" />
              <span className="truncate">macOS</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function SocialButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-3 text-xs sm:text-[13px] font-medium text-black transition-all duration-150 ease-out active:scale-[0.98] hover:bg-black/4 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 cursor-pointer"
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function FieldBox({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  trailingAction,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  trailingAction?: ReactNode;
}) {
  return (
    <label className="flex h-11 sm:h-12 items-center justify-between gap-3 rounded-xl border border-black/15 bg-white px-3.5 text-xs sm:text-sm transition-all focus-within:border-black dark:focus-within:border-white focus-within:ring-1 focus-within:ring-black/10 dark:focus-within:ring-white/10 dark:border-white/15 dark:bg-white/5">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoComplete={autoComplete}
        className="min-w-0 flex-1 bg-transparent text-black dark:text-white outline-none placeholder:text-black/35 dark:placeholder:text-white/35 text-xs sm:text-sm font-medium"
      />
      {trailingAction ? (
        trailingAction
      ) : (
        <span className="shrink-0 text-xs text-black/40 dark:text-white/40 font-medium select-none">
          {label}
        </span>
      )}
    </label>
  );
}

// =============================================================================
// ICONS
// =============================================================================

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function AppleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}

function WindowsIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 4.7 10.7 3.6v7.7H3V4.7Zm8.8-1.25L21 2.1v9.2h-9.2V3.45ZM3 12.7h7.7v7.7L3 19.3v-6.6Zm8.8 0H21v9.2l-9.2-1.3v-7.9Z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
