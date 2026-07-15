import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "error" | "outline" }) {
  const variants = {
    default: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-700",
    outline: "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-2 py-0.5 text-[12px] font-semibold tracking-[0.02em] uppercase",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}