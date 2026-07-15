"use client";

import { motion } from "framer-motion";

export function GradientWaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Gold wave — left */}
      <motion.div
        className="absolute -left-[15%] top-[5%] h-[520px] w-[720px] opacity-[0.55]"
        animate={{
          x: [0, 24, -12, 0],
          y: [0, -18, 12, 0],
          scale: [1, 1.04, 0.98, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="h-full w-full blur-[80px]"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 40% 50%, rgba(252, 211, 77, 0.7) 0%, rgba(253, 230, 138, 0.35) 40%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Blue wave — right */}
      <motion.div
        className="absolute -right-[10%] top-[8%] h-[480px] w-[680px] opacity-[0.5]"
        animate={{
          x: [0, -20, 16, 0],
          y: [0, 14, -10, 0],
          scale: [1, 0.97, 1.03, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div
          className="h-full w-full blur-[90px]"
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 60% 45%, rgba(125, 211, 252, 0.65) 0%, rgba(147, 197, 253, 0.3) 45%, transparent 72%)",
          }}
        />
      </motion.div>

      {/* Green wave — center-bottom */}
      <motion.div
        className="absolute left-[25%] top-[35%] h-[400px] w-[560px] opacity-[0.35]"
        animate={{
          x: [0, 16, -20, 0],
          y: [0, -12, 8, 0],
          scale: [1, 1.02, 0.99, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div
          className="h-full w-full blur-[100px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(110, 231, 183, 0.55) 0%, rgba(134, 239, 172, 0.25) 50%, transparent 75%)",
          }}
        />
      </motion.div>

      {/* Subtle silk overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(105deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 3px)",
        }}
      />
    </div>
  );
}
