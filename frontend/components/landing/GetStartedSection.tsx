"use client";

import { motion } from "framer-motion";
import { AppMockup } from "./mockups/AppMockup";
import { OAuthButtons } from "./OAuthButtons";
import { slideFromLeft, slideFromRight } from "./animations";

const STEPS = [
  {
    number: "1",
    title: "Connect your account",
    description: "Sign in using Google or Microsoft to link your spreadsheets.",
  },
  {
    number: "2",
    title: "Select your spreadsheets",
    description: "Choose the sheets you want AI to access and manage.",
  },
  {
    number: "3",
    title: "Start chatting",
    description: "Use natural language to edit, analyze, and transform your data.",
  },
];

export function GetStartedSection() {
  return (
    <section id="how-it-works" className="bg-neutral-50/50 px-6 py-[120px] lg:px-8">
      <div className="mx-auto grid max-w-landing items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <motion.div
          variants={slideFromLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <h2 className="font-serif text-[36px] font-normal leading-[1.15] tracking-[-0.02em] text-neutral-900 sm:text-[40px]">
            Get started in minutes
          </h2>

          <div className="mt-10 space-y-8">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-[13px] font-medium text-neutral-700">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-[16px] font-medium text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-neutral-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <OAuthButtons size="lg" className="mt-10" />
        </motion.div>

        <motion.div
          variants={slideFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <AppMockup />
        </motion.div>
      </div>
    </section>
  );
}
