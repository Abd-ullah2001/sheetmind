import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "icon";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-muted text-foreground hover:bg-muted/80",
      ghost: "hover:bg-muted text-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border bg-background hover:bg-muted"
    };
    const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-sm", icon: "h-9 w-9 p-0" };
    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
