"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { LandingButton } from "../LandingButton";
import { fadeUp, scaleIn } from "../animations";

export function DemoShowcase() {
  return (
    <section className="relative px-6 pb-[120px] pt-8 lg:px-8">
      <div className="mx-auto max-w-landing">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={scaleIn}
          className="relative overflow-hidden rounded-[28px] border border-neutral-100 bg-gradient-to-br from-neutral-50 via-white to-sky-50/30 shadow-landing-xl"
        >
          <div className="relative aspect-[16/9] min-h-[420px]">
            {/* Mock app interface */}
            <div className="absolute inset-4 overflow-hidden rounded-[20px] border border-neutral-100 bg-white shadow-lg sm:inset-6">
              <div className="flex h-full">
                {/* Spreadsheet area */}
                <div className="flex flex-1 flex-col border-r border-neutral-100">
                  <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="ml-2 text-[11px] text-neutral-400">
                      Q4 Revenue Report.xlsx
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden p-3">
                    <div className="grid grid-cols-5 gap-px overflow-hidden rounded-md border border-neutral-100 bg-neutral-100 text-[10px]">
                      {["Region", "Jan", "Feb", "Mar", "Total"].map((h) => (
                        <div
                          key={h}
                          className="bg-neutral-50 px-2 py-1.5 font-medium text-neutral-600"
                        >
                          {h}
                        </div>
                      ))}
                      {[
                        ["North", "$42K", "$48K", "$51K", "$141K"],
                        ["South", "$38K", "$41K", "$45K", "$124K"],
                        ["East", "$55K", "$52K", "$58K", "$165K"],
                        ["West", "$47K", "$49K", "$53K", "$149K"],
                      ].map((row) =>
                        row.map((cell, i) => (
                          <div
                            key={`${row[0]}-${i}`}
                            className={`bg-white px-2 py-1.5 ${i === 4 ? "font-medium text-emerald-600" : "text-neutral-700"}`}
                          >
                            {cell}
                          </div>
                        ))
                      )}
                    </div>
                    {/* Mini chart */}
                    <div className="mt-3 flex items-end gap-1.5 px-1">
                      {[40, 55, 45, 70, 60, 80, 75].map((h, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-sm bg-gradient-to-t from-sky-400 to-emerald-300"
                          initial={{ height: 0 }}
                          whileInView={{ height: h * 0.6 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI chat panel */}
                <div className="hidden w-[240px] flex-col bg-neutral-50/80 sm:flex">
                  <div className="border-b border-neutral-100 px-3 py-2.5">
                    <span className="text-[11px] font-medium text-neutral-800">
                      AI Agent
                    </span>
                  </div>
                  <div className="flex-1 space-y-2.5 p-3">
                    <div className="rounded-lg bg-white px-2.5 py-2 text-[10px] leading-relaxed text-neutral-600 shadow-sm">
                      Create a monthly revenue report grouped by region.
                    </div>
                    <div className="rounded-lg bg-black px-2.5 py-2 text-[10px] leading-relaxed text-white">
                      Generated report with regional totals and chart. Preview
                      ready in Render Mode.
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["SUMIFS", "FILTER", "CHART"].map((f) => (
                        <span
                          key={f}
                          className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[2px]">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <h2 className="font-serif text-[32px] font-normal tracking-[-0.02em] text-neutral-900 sm:text-[40px]">
                  See SheetMind in Action
                </h2>
                <LandingButton className="mt-5" size="md">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Watch Demo
                </LandingButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
