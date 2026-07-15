"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type LandingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export function LandingButton({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: LandingButtonProps) {
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800",
    ghost: "bg-transparent text-neutral-700 hover:text-black",
    outline: "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
  };

  const sizes = {
    sm: "h-9 px-5 text-[13px]",
    md: "h-11 px-6 text-[14px]",
    lg: "h-12 px-8 text-[15px]",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="inline-flex"
    >
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  );
}
