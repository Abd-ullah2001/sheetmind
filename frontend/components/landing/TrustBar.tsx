"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./animations";

const LOGOS = [
  { name: "Google", label: "Google" },
  { name: "Microsoft", label: "Microsoft" },
  { name: "Stripe", label: "Stripe" },
  { name: "Notion", label: "Notion" },
  { name: "Vercel", label: "Vercel" },
  { name: "Cloudflare", label: "Cloudflare" },
  { name: "HubSpot", label: "HubSpot" },
];

const STATS = [
  { value: "35+", label: "Ready-to-use formulas" },
  { value: "10x", label: "Faster spreadsheet workflows" },
  { value: "90%", label: "Reduction in manual spreadsheet work" },
];

export function TrustBar() {
  return (
    <section className="border-y border-neutral-100 bg-white/50 px-6 py-14 lg:px-8">
      <div className="mx-auto max-w-landing">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400"
        >
          Trusted by teams at
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14"
        >
          {LOGOS.map(({ name, label }) => (
            <motion.span
              key={name}
              variants={fadeUp}
              className="text-[15px] font-semibold text-neutral-300 transition-colors hover:text-neutral-400"
            >
              {label}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 grid gap-10 sm:grid-cols-3"
        >
          {STATS.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <div className="font-serif text-[40px] font-normal tracking-[-0.02em] text-neutral-900 sm:text-[48px]">
                {value}
              </div>
              <p className="mt-1 text-[14px] text-neutral-500">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
