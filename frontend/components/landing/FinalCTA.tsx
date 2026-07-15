"use client";

import { motion } from "framer-motion";
import { OAuthButtons } from "./OAuthButtons";
import { fadeUp, staggerContainer } from "./animations";

export function FinalCTA() {
  return (
    <section id="pricing" className="relative overflow-hidden px-6 py-[120px] lg:px-8">
      {/* Bottom gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[400px]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(110, 231, 183, 0.25) 0%, rgba(125, 211, 252, 0.15) 40%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 mx-auto max-w-landing text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[36px] font-normal leading-[1.12] tracking-[-0.03em] text-neutral-900 sm:text-[48px] lg:text-[56px]"
        >
          Ready to transform
          <br />
          your spreadsheets?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-5 max-w-[440px] text-[16px] text-neutral-500"
        >
          Connect your spreadsheets and let AI do the work.
        </motion.p>
        <OAuthButtons size="lg" className="mt-10" />
        <motion.div
          variants={fadeUp}
          className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button className="text-[14px] text-neutral-600 underline-offset-4 transition-colors hover:text-black hover:underline">
            Book Demo
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer id="docs" className="border-t border-neutral-100 px-6 py-8 lg:px-8">
      <div className="mx-auto flex max-w-landing flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="text-[13px] text-neutral-400">
          &copy; {new Date().getFullYear()} SheetMind. All rights reserved.
        </span>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Docs"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] text-neutral-400 transition-colors hover:text-neutral-600"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
