"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { slideFromLeft, slideFromRight } from "./animations";

const TESTIMONIALS = [
  {
    quote:
      "SheetMind cut our monthly reporting time from three days to thirty minutes. Our finance team finally spends time on analysis, not formulas.",
    name: "Sarah Chen",
    title: "VP of Finance, Meridian Labs",
  },
  {
    quote:
      "The Render Mode alone is worth it. We preview every AI change before it hits our live Google Sheets. Zero accidental edits.",
    name: "James Okonkwo",
    title: "Head of Operations, Stackline",
  },
  {
    quote:
      "We connected 40 spreadsheets across Google and Excel in one afternoon. The agents handle data cleaning we used to outsource.",
    name: "Elena Vasquez",
    title: "Director of Analytics, Northwind",
  },
];

const FAQ_ITEMS = [
  {
    question: "How secure is my data?",
    answer:
      "SheetMind uses OAuth for Google and Microsoft sign-in. Your credentials are never stored. All data is encrypted in transit and at rest, with granular access controls per spreadsheet.",
  },
  {
    question: "Can I use both Google Sheets and Excel?",
    answer:
      "Yes. Sign in with Google or Microsoft and connect spreadsheets from both platforms in a single workspace.",
  },
  {
    question: "What formulas are included?",
    answer:
      "SheetMind includes 35+ built-in formulas including VLOOKUP, XLOOKUP, SUMIFS, INDEX MATCH, FILTER, TEXTJOIN, QUERY, and more.",
  },
  {
    question: "Will AI edit my live sheets?",
    answer:
      "Not without your approval. Render Mode previews every change before it is committed to your actual Google Sheet or Excel file.",
  },
  {
    question: "How many spreadsheets can I connect?",
    answer:
      "There is no hard limit on the number of spreadsheets you can connect. Select which sheets each agent can access.",
  },
  {
    question: "Can my team collaborate?",
    answer:
      "Yes. Share agents and workflows with your team. Multiple team members can use the same agents on shared spreadsheets.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-neutral-100">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[15px] font-medium text-neutral-900">
          {question}
        </span>
        {isOpen ? (
          <Minus className="h-4 w-4 shrink-0 text-neutral-400" />
        ) : (
          <Plus className="h-4 w-4 shrink-0 text-neutral-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14px] leading-relaxed text-neutral-500">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TestimonialFAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const testimonial = TESTIMONIALS[activeIndex];

  return (
    <section className="border-t border-neutral-100 px-6 py-[120px] lg:px-8">
      <div className="mx-auto grid max-w-landing gap-16 lg:grid-cols-2 lg:gap-20">
        {/* Testimonial */}
        <motion.div
          variants={slideFromLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={activeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-serif text-[28px] font-normal leading-[1.35] tracking-[-0.02em] text-neutral-900 sm:text-[32px]">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-200 to-sky-200 text-[13px] font-medium text-neutral-700">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <cite className="not-italic text-[14px] font-medium text-neutral-900">
                    {testimonial.name}
                  </cite>
                  <p className="text-[13px] text-neutral-500">{testimonial.title}</p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-8 flex gap-2">
            <button
              onClick={() =>
                setActiveIndex((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((i) => (i === TESTIMONIALS.length - 1 ? 0 : i + 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          id="security"
          variants={slideFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <h3 className="mb-2 font-serif text-[28px] font-normal tracking-[-0.02em] text-neutral-900">
            Frequently asked questions
          </h3>
          <div className="mt-4">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openFAQ === i}
                onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
