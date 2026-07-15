import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "destructive" | "outline" | "ghost-cta";
  size?: "sm" | "md" | "icon";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default:
        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm",
      secondary:
        "bg-[var(--color-surface-soft)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]",
      ghost:
        "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)]",
      destructive:
        "bg-[var(--color-error)] text-white hover:bg-red-600",
      outline:
        "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)]",
      "ghost-cta":
        "bg-white text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
    };
    const sizes = {
      sm: "h-8 px-3 text-[14px] rounded-md",
      md: "h-10 px-[18px] text-[14px] tracking-[0.01em] rounded-md",
      icon: "h-9 w-9 p-0 rounded-md"
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";