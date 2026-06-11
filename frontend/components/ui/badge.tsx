import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "error" | "outline" }) {
  const variants = {
    default: "bg-[var(--color-lavender-wash)] text-[var(--color-aubergine-core)]",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-700",
    outline: "border border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] text-[var(--color-graphite)]"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[48px] px-2 py-0.5 text-[12px] font-semibold tracking-[0.057em] uppercase",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
