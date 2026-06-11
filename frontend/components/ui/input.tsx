import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-[4px] border border-[var(--color-ash)] bg-[var(--color-pure-white)] px-3 py-2 text-[14px] text-[var(--color-midnight-plum)] outline-none transition-colors placeholder:text-[var(--color-fog)] focus-visible:ring-2 focus-visible:ring-[var(--color-aubergine-core)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
