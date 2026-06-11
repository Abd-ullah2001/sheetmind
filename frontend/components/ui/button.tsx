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
        "bg-[var(--color-aubergine-core)] text-[var(--color-pure-white)] hover:bg-[var(--color-plum-shadow)] shadow-sm",
      secondary:
        "bg-[var(--color-lavender-wash)] text-[var(--color-midnight-plum)] hover:bg-[var(--color-lilac-veil)]",
      ghost:
        "text-[var(--color-midnight-plum)] hover:bg-[var(--color-lavender-wash)]",
      destructive:
        "bg-[var(--color-magenta-pulse)] text-[var(--color-pure-white)] hover:bg-[var(--color-plum-shadow)]",
      outline:
        "border border-[var(--color-iris-mid)] bg-[var(--color-pure-white)] text-[var(--color-iris-mid)] hover:bg-[var(--color-lavender-wash)]",
      "ghost-cta":
        "bg-[var(--color-pure-white)] text-[var(--color-iris-mid)] border border-[var(--color-iris-mid)] hover:bg-[var(--color-lavender-wash)]"
    };
    const sizes = {
      sm: "h-8 px-3 text-[14px]",
      md: "h-10 px-[18px] text-[14px] tracking-[0.012em]",
      icon: "h-9 w-9 p-0"
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-aubergine-core)]",
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
