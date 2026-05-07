import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "error" | "outline" }) {
  const variants = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-700",
    outline: "border bg-background text-foreground"
  };
  return <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />;
}
