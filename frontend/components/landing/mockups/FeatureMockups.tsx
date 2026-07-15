"use client";

import { motion } from "framer-motion";
import { Check, Bot, User } from "lucide-react";

export function ChatMockup() {
  return (
    <div className="relative h-full min-h-[340px] overflow-hidden rounded-[24px] bg-gradient-to-br from-sky-100/80 via-amber-50/60 to-emerald-50/40 p-6">
      <div className="rounded-[18px] border border-white/60 bg-white/90 p-5 shadow-lg backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
            <Bot className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[13px] font-medium text-neutral-800">
            SheetMind Agent
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100">
              <User className="h-3 w-3 text-neutral-500" />
            </div>
            <div className="rounded-2xl rounded-tl-md bg-neutral-100 px-3.5 py-2.5 text-[13px] leading-relaxed text-neutral-700">
              Create a monthly revenue report grouped by region.
            </div>
          </div>
          <div className="flex gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black">
              <Bot className="h-3 w-3 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-md bg-black px-3.5 py-2.5 text-[13px] leading-relaxed text-white">
              I&apos;ll build that report with regional totals, growth rates, and
              a summary chart. Preview it in Render Mode first.
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="ml-8 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2"
          >
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[12px] text-emerald-700">Processing…</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function RenderModeMockup() {
  const cells = [
    ["Region", "Revenue", "Growth"],
    ["North", "$141K", "+12%"],
    ["South", "$124K", "+8%"],
    ["East", "$165K", "+15%"],
  ];

  return (
    <div className="relative h-full min-h-[340px] overflow-hidden rounded-[24px] bg-gradient-to-br from-emerald-100/70 via-teal-50/50 to-sky-50/40 p-6">
      <div className="rounded-[18px] border border-white/60 bg-white/95 p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[12px] font-medium text-neutral-700">
            Sales Data — Render Mode
          </span>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700"
          >
            Rendering changes…
          </motion.span>
        </div>
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-neutral-100 bg-neutral-100 text-[12px]">
          {cells.flatMap((row, ri) =>
            row.map((cell, ci) => (
              <motion.div
                key={`${ri}-${ci}`}
                initial={{ backgroundColor: ri > 0 && ci > 0 ? "#ecfdf5" : "#fafafa" }}
                whileInView={{
                  backgroundColor:
                    ri === 0 ? "#fafafa" : ci === 2 ? "#ecfdf5" : "#ffffff",
                }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + ri * 0.15 }}
                className={`px-3 py-2 ${ri === 0 ? "bg-neutral-50 font-medium text-neutral-600" : "text-neutral-800"}`}
              >
                {cell}
              </motion.div>
            ))
          )}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500">
          <Check className="h-3 w-3 text-emerald-500" />
          Preview before committing to your live sheet
        </div>
      </div>
    </div>
  );
}

export function FormulaLibraryMockup() {
  const formulas = [
    "VLOOKUP",
    "SUMIFS",
    "INDEX MATCH",
    "FILTER",
    "TEXTJOIN",
    "QUERY",
    "XLOOKUP",
    "COUNTIF",
    "AVERAGEIF",
  ];

  return (
    <div className="relative h-full min-h-[340px] overflow-hidden rounded-[24px] bg-gradient-to-br from-amber-100/70 via-orange-50/50 to-yellow-50/40 p-6">
      <div className="rounded-[18px] border border-white/60 bg-white/95 p-5 shadow-lg">
        <div className="mb-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Formula Library
          </span>
          <p className="mt-1 text-[15px] font-medium text-neutral-800">
            35+ built-in formulas
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {formulas.map((f, i) => (
            <motion.span
              key={f}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-white"
            >
              {f}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConnectSheetsMockup() {
  return (
    <div className="relative h-full min-h-[340px] overflow-hidden rounded-[24px] bg-gradient-to-br from-sky-100/60 via-white to-emerald-50/50 p-6">
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <div className="flex w-full max-w-[280px] flex-col gap-3">
          <motion.div
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 rounded-[16px] border border-neutral-100 bg-white p-4 shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="1" fill="#34A853" />
                <rect x="13" y="3" width="8" height="8" rx="1" fill="#FBBC04" />
                <rect x="3" y="13" width="8" height="8" rx="1" fill="#4285F4" />
                <rect x="13" y="13" width="8" height="8" rx="1" fill="#EA4335" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-medium text-neutral-900">Google Sheets</p>
              <p className="text-[12px] text-emerald-600">Connected · Auto-sync on</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 rounded-[16px] border border-neutral-100 bg-white p-4 shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <rect x="4" y="2" width="16" height="20" rx="2" fill="#217346" />
                <rect x="7" y="6" width="10" height="1.5" rx="0.5" fill="white" opacity="0.9" />
                <rect x="7" y="9.5" width="10" height="1.5" rx="0.5" fill="white" opacity="0.7" />
                <rect x="7" y="13" width="7" height="1.5" rx="0.5" fill="white" opacity="0.7" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-medium text-neutral-900">Microsoft Excel</p>
              <p className="text-[12px] text-emerald-600">Connected · Auto-sync on</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
