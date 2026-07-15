"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  ChatMockup,
  RenderModeMockup,
  FormulaLibraryMockup,
  ConnectSheetsMockup,
} from "./mockups/FeatureMockups";
import { fadeUp, slideFromLeft, slideFromRight } from "./animations";

type Feature = {
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  mockup: React.ReactNode;
  reverse?: boolean;
};

const FEATURES: Feature[] = [
  {
    tag: "AI ONLY",
    title: "Ask in English. Get it done.",
    description:
      "Describe what you need in plain language. SheetMind agents understand context, apply the right formulas, and deliver results instantly.",
    bullets: [
      "Natural language spreadsheet commands",
      "Automatic formula generation",
      "Context-aware data analysis",
    ],
    mockup: <ChatMockup />,
  },
  {
    tag: "LIVE RENDER",
    title: "See changes before you commit.",
    description:
      "Preview every AI action in Render Mode before it touches your actual Google Sheet or Excel file. Full control, zero surprises.",
    bullets: [
      "Real-time cell preview",
      "Approve or reject changes",
      "Safe editing workflow",
    ],
    mockup: <RenderModeMockup />,
    reverse: true,
  },
  {
    tag: "35+ FORMULAS",
    title: "35+ Built-in Formulas.",
    description:
      "Access a comprehensive formula library. From VLOOKUP to QUERY, SheetMind applies the right function automatically.",
    bullets: [
      "VLOOKUP, XLOOKUP, INDEX MATCH",
      "SUMIFS, COUNTIF, AVERAGEIF",
      "FILTER, TEXTJOIN, QUERY",
    ],
    mockup: <FormulaLibraryMockup />,
  },
  {
    tag: "MULTI-PLATFORM",
    title: "Connect all your sheets.",
    description:
      "Sign in with Google or Microsoft. Your spreadsheets sync automatically — no manual imports, no copy-paste workflows.",
    bullets: [
      "Google Sheets auto-sync",
      "Microsoft Excel integration",
      "One workspace for all files",
    ],
    mockup: <ConnectSheetsMockup />,
    reverse: true,
  },
];

function FeatureBlock({ feature }: { feature: Feature }) {
  const textContent = (
    <motion.div
      variants={feature.reverse ? slideFromRight : slideFromLeft}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="flex flex-col justify-center"
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400">
        {feature.tag}
      </span>
      <h3 className="mt-3 font-serif text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-neutral-900 sm:text-[36px]">
        {feature.title}
      </h3>
      <p className="mt-4 text-[16px] leading-[1.65] text-neutral-500">
        {feature.description}
      </p>
      <ul className="mt-6 space-y-3">
        {feature.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-[14px] text-neutral-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2} />
            {bullet}
          </li>
        ))}
      </ul>
    </motion.div>
  );

  const visualContent = (
    <motion.div
      variants={feature.reverse ? slideFromLeft : slideFromRight}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
    >
      {feature.mockup}
    </motion.div>
  );

  return (
    <div
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        feature.reverse ? "[&>*:first-child]:lg:order-2" : ""
      }`}
    >
      {textContent}
      {visualContent}
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-[120px] lg:px-8">
      <div className="mx-auto max-w-landing space-y-[100px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-[36px] font-normal tracking-[-0.02em] text-neutral-900 sm:text-[44px]">
            Manage spreadsheets through conversation
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] text-neutral-500">
            Never manually create formulas or navigate complex workflows again.
          </p>
        </motion.div>

        {FEATURES.map((feature) => (
          <FeatureBlock key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}
