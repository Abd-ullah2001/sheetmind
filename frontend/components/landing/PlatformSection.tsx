"use client";

import { motion } from "framer-motion";
import { Clock, Users, Bot } from "lucide-react";
import { LandingButton } from "./LandingButton";
import { fadeUp, staggerContainer, hoverLift } from "./animations";

const AGENT_USES = ["Finance", "Operations", "Marketing", "Sales", "Analytics"];

const SIDE_CARDS = [
  {
    icon: Clock,
    title: "Always On",
    description: "24/7 spreadsheet automation.",
  },
  {
    icon: Bot,
    title: "Multi-Platform",
    description: "Google Sheets + Microsoft Excel.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Shared agents and workflows.",
  },
];

export function PlatformSection() {
  return (
    <section className="px-6 py-[120px] lg:px-8">
      <div className="mx-auto max-w-landing">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="font-serif text-[36px] font-normal tracking-[-0.02em] text-neutral-900 sm:text-[44px]">
            Built for modern teams
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[16px] text-neutral-500">
            Create custom AI agents tailored to your team&apos;s workflows.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Large card */}
          <motion.div
            variants={hoverLift}
            initial="rest"
            whileHover="hover"
            className="relative overflow-hidden rounded-[24px] border border-neutral-100 bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/40 p-8 shadow-landing-lg"
          >
            <div className="relative z-10">
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400">
                AI Agents
              </span>
              <h3 className="mt-2 font-serif text-[28px] font-normal tracking-[-0.02em] text-neutral-900">
                Create AI Agents
              </h3>
              <p className="mt-2 max-w-[320px] text-[14px] leading-relaxed text-neutral-500">
                Build custom agents for your team&apos;s specific spreadsheet
                needs.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {AGENT_USES.map((use) => (
                  <span
                    key={use}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[12px] text-neutral-600"
                  >
                    {use}
                  </span>
                ))}
              </div>
              <LandingButton className="mt-6" size="sm" variant="outline">
                Create an agent
              </LandingButton>
            </div>

            {/* Decorative keyboard graphic */}
            <div className="absolute -bottom-4 -right-4 h-[180px] w-[280px] opacity-60">
              <div className="grid grid-cols-8 gap-1.5 rounded-xl bg-neutral-900/90 p-4 shadow-2xl">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-4 rounded-sm ${
                      i === 14 || i === 15
                        ? "bg-sky-400/80"
                        : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute -inset-4 -z-10 rounded-full bg-sky-400/20 blur-3xl" />
            </div>
          </motion.div>

          {/* Side cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-5"
          >
            {SIDE_CARDS.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 rounded-[20px] border border-neutral-100 bg-white p-5 shadow-landing-sm transition-shadow hover:shadow-landing-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-50">
                  <Icon className="h-5 w-5 text-neutral-700" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-neutral-900">
                    {title}
                  </h4>
                  <p className="mt-0.5 text-[13px] text-neutral-500">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
