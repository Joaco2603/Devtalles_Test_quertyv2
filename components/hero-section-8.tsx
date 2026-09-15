"use client";
import React from "react";
import Image from "next/image";
import { FlutedGlass } from "@paper-design/shaders-react";
import { motion } from "motion/react";
import Link from "next/link";

const navItems = [
  { name: "Product", href: "#" },
  { name: "Customer", href: "#" },
  { name: "Solution", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Company", href: "#" },
];

export default function HeroSection8() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden antialiased [font-synthesis:none] [--color-primary:#9E73EA] bg-linear-to-b from-(--color-primary) to-white">
      {/* Background Shader */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FlutedGlass
          size={0.89}
          shape="lines"
          angle={0}
          distortionShape="prism"
          distortion={0.5}
          shift={0}
          blur={0}
          edges={0.25}
          stretch={0}
          scale={1.11}
          fit="cover"
          highlights={0.1}
          shadows={0.2}
          grainMixer={0.1}
          grainOverlay={0.1}
          colorBack="#00000000"
          colorHighlight="#FFFFFF"
          colorShadow="#000000"
          className="w-full h-full bg-transparent"
        />
      </div>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto w-full flex justify-between items-center py-5 px-4 sm:px-6 relative z-10">
        <div className="font-bold text-md tracking-tight text-white">SolaceUI</div>

        <div className="items-center gap-4 hidden md:flex">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <span className="text-sm md:text-[1rem] text-white/70 hover:text-white transition-colors">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="px-3 py-1 text-sm font-medium border border-white/20 text-white hover:bg-white/10 transition-colors rounded-sm cursor-pointer">
              Log in
            </button>
          </Link>
          <Link href="/register">
            <button className="px-3 py-1 text-sm font-medium bg-black text-white hover:bg-black/80 transition-colors rounded-sm cursor-pointer">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between pt-12 md:pt-20 lg:pt-32 px-4 sm:px-6 max-w-7xl mx-auto gap-12 lg:gap-2">

        {/* Left Column - Text & Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left shrink-0 z-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-5 max-w-[600px]">
            AI Agents That Code Like Your Best Engineer
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-[#FFFFFF80] font-light max-w-lg mb-8 leading-relaxed">
            Autonomous agents that debug, refactor, and ship features while you
            focus on architecture and strategy
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full md:w-auto mb-10">
            <button className="w-full sm:w-[180px] h-[48px] rounded-xl bg-black text-white font-light text-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-[inset_3px_3px_3px_rgba(242,242,242,0.3),inset_-3px_-3px_3px_rgba(242,242,242,0.3)]">
              Book a demo
            </button>

            <button className="w-full sm:w-[180px] h-[48px] rounded-xl border-[1.5px] border-black text-black font-light text-lg transition-all hover:scale-105 active:scale-95 hover:bg-black/5 cursor-pointer bg-transparent">
              Try for free
            </button>
          </div>

          {/* Testimonial Section */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {['one', 'two', 'three', 'four', 'five'].map((name, index) => (
                <div key={index} className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative">
                  <Image
                    src={`https://assets.solaceui.com/solaceui-member-${name}.png`}
                    alt={`Team member ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <p className="text-sm md:text-base text-black/30 font-light max-w-[200px] leading-tight text-left">
              Trusted by the best people in 200+ companies
            </p>
          </div>
        </motion.div>

        {/* Right Column - Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="w-full lg:w-1/2 relative flex justify-start lg:ml-8 xl:ml-16 pointer-events-none"
        >
          {/* Bounding Image Container - Force absolute width on large screens to break out of container correctly */}
          <div className="w-full lg:w-225 xl:w-300 p-3 lg:p-5 xl:p-8 bg-[#FFFFFF4A] rounded-[14px] shadow-2xl shrink-0">
            <div className="relative w-full rounded-[10px] overflow-hidden border border-white/20 aspect-[1200/719]">
              <Image
                src="https://assets.solaceui.com/solaceui-hero-light.png"
                alt="Dashboard App"
                fill
                className="object-cover object-top"
                priority
                unoptimized
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Fade Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 z-30 pointer-events-none bg-linear-to-t from-white to-transparent" />
    </div>
  );
}
