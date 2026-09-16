'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import LearnMoreButton from '@/components/pixel-perfect/learn-more-button'
import RippleTouch from './pixel-perfect/ripple-touch'
import MagneticWarp from './pixel-perfect/magnetic-warp'

const navigation = [
  { name: 'Productos', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
]

const HeroSection8 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-900">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl">
          <div className="px-6 pt-6 lg:max-w-2xl lg:pr-0 lg:pl-8">
            <nav aria-label="Global" className="flex items-center justify-between">
              <div className="flex items-center gap-x-8 lg:gap-x-10">
                <Link href="/" className="flex items-center gap-2 justify-center -m-1.5 p-1.5">
                  <span className="sr-only">Tu logo :D</span>
                  <span className="text-xl font-bold">{`{Dev/talles}`}</span>
                  <span
                    className="h-8 w-auto not-dark:hidden invert dark:invert-0"
                  >{`{Dev/talles}`}</span>
                </Link>
                <div className="hidden lg:flex lg:items-center lg:gap-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-neutral-600 transition-colors duration-150 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Differentiated Apple-style Login button (Desktop) */}
              <div className="hidden lg:flex lg:items-center">
                <Link
                  href="/login"
                  className="group relative inline-flex items-center justify-center rounded-full border border-purple-600/10 bg-purple-600/10 px-4 py-1.5 text-xs sm:text-sm font-medium tracking-tight text-neutral-800 shadow-sm backdrop-blur-md transition-all duration-150 ease-out hover:border-purple-600/15 hover:bg-purple-600/10 hover:text-purple-600 active:scale-[0.96] active:bg-neutral-900/10 dark:border-white/12 dark:bg-white/8 dark:text-neutral-200 dark:shadow-sm dark:hover:border-white/18 dark:hover:bg-white/12 dark:hover:text-white dark:active:bg-white/16 cursor-pointer"
                >
                  Log in
                </Link>
              </div>

              {/* Mobile hamburger menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 lg:hidden dark:text-gray-200"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </nav>
          </div>
        </div>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <Link href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                {/* <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  src="/img/logo.png"
                  className="h-8 w-auto dark:hidden invert dark:invert-0"
                /> */}
                <span
                  className="h-8 w-auto dark:hidden text-xl font-bold"
                >{`{Dev/talles}`}</span>
                <span
                  className="h-8 w-auto not-dark:hidden dark:text-white text-xl font-bold"
                >{`{Dev/talles}`}</span>
                {/* <Image
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  src="/img/logo.png"
                  className="h-8 w-auto not-dark:hidden invert dark:invert-0"
                /> */}
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-full border border-neutral-900/10 bg-neutral-900/[0.04] px-4 py-2.5 text-sm font-medium tracking-tight text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md transition-all duration-150 ease-out hover:border-neutral-900/15 hover:bg-neutral-900/[0.07] hover:text-neutral-950 active:scale-[0.97] dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-neutral-200 dark:shadow-[0_1px_2px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.12)] dark:hover:border-white/[0.18] dark:hover:bg-white/[0.12] dark:hover:text-white"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block dark:fill-gray-900"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>

            {/* section text */}
            <div className="relative px-6 py-28 sm:py-36 lg:px-8 lg:py-36 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                {/* Eyebrow Badge with interactive LearnMoreButton effects */}
                <div className="mb-7 flex">
                  <LearnMoreButton
                    href="/register"
                    badge="2026"
                    text="Roadmaps de Programación"
                    actionText="Explorar"
                    boxShadow=''
                  />
                </div>

                {/* Headline H1 with optical tracking & tight leading */}
                <h1 className="text-4xl font-semibold tracking-[-0.035em] text-pretty text-neutral-950 sm:text-5xl lg:text-[3.25rem] leading-[1.12] dark:text-white">
                  El roadmap exacto para aprender a programar lo que imaginas
                </h1>

                {/* Subtitle */}
                <p className="mt-6 text-base sm:text-lg font-normal leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-lg tracking-[-0.01em]">
                  Rutas paso a paso diseñadas para llevarte desde tus primeras líneas de código hasta desarrollar aplicaciones reales y dominar las tecnologías que necesitas.
                </p>

                {/* Moderate High-End Action CTAs */}
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5 sm:gap-4">
                  <Link
                    href="/register"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-purple-600 dark:bg-purple-600 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white dark:text-neutral-950 shadow-sm transition-all duration-150 ease-out hover:bg-purple-700 dark:hover:bg-purple-700 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Descubrir mi ruta</span>
                    <span className="flex size-4.5 items-center justify-center rounded-full bg-white/15 dark:bg-black/10 transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                      <ArrowRight className="size-2.5 stroke-[2.5]" />
                    </span>
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border border-purple-600 dark:border-purple-600 bg-transparent px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-purple-600 dark:text-purple-600 transition-all duration-150 ease-out hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-100/20 dark:hover:bg-purple-800/20 active:scale-[0.98] cursor-pointer"
                  >
                    Ver roadmaps
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 dark:bg-gray-800">
          {/* <img
            alt=""
            src="https://cdn.cosmos.so/66f53774-ad96-4c47-9f2f-1e022865a82d?format=webp"
            // src="https://images.unsplash.com/photo-1483389127117-b6a2102724ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80"
            className="aspect-3/2 object-cover lg:aspect-auto lg:size-full"
          /> */}
          <MagneticWarp
            // image='https://cdn.cosmos.so/b34094d1-8f3d-4b98-b796-51e0056e6fa0?format=webp'
            // image='https://cdn.cosmos.so/1177f14b-f9f4-4a4a-ad41-d84ade65617a?format=webp'
            image='https://cdn.cosmos.so/6173519b-0c48-446c-869b-aef38b0fe70e?format=webp'
            className="aspect-3/2 object-cover lg:aspect-auto lg:size-full"
          />
        </div>
      </div>
    </div>
  )
}

export default HeroSection8