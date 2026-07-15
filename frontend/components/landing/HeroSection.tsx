"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { GradientWaves } from "./GradientWaves";
import { OAuthButtons } from "./OAuthButtons";
import { fadeUp, staggerContainer } from "./animations";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden pb-16 pt-[72px] sm:pt-[88px]">
      <GradientWaves />

      <motion.div
        className="relative z-10 mx-auto max-w-landing px-6 text-center lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeUp}
          className="font-serif text-[44px] font-normal leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[56px] lg:text-[68px]"
        >
          Your spreadsheets.
          <br />
          <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">
            Supercharged by AI.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-[580px] text-[17px] leading-[1.65] text-neutral-500 sm:text-[18px]"
        >
          Connect Google Sheets and Microsoft Excel. Let AI agents analyze, edit,
          clean, transform, and automate your spreadsheet workflows.
        </motion.p>

        <OAuthButtons size="lg" className="mt-10" showOrDivider={false} />

        <motion.div
          variants={fadeUp}
          className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button className="group inline-flex items-center gap-2 text-[14px] text-neutral-600 transition-colors hover:text-black">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 transition-colors group-hover:border-neutral-400">
              <Play className="h-3 w-3 fill-current" />
            </span>
            Watch Demo
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
