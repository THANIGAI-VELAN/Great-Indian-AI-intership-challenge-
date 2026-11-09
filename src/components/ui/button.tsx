import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "vermilion" | "done";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-ink text-card hover:bg-ink/90 active:scale-[0.98] shadow-paper focus-visible:ring-ink",
      secondary:
        "bg-card text-ink border border-rule hover:bg-paper hover:border-ink/30 active:scale-[0.98] shadow-paper focus-visible:ring-ink",
      outline:
        "bg-transparent text-ink border border-rule hover:border-ink hover:bg-paper/50 active:scale-[0.98] focus-visible:ring-ink",
      ghost:
        "bg-transparent text-ink hover:bg-paper active:bg-rule/40 focus-visible:ring-ink",
      vermilion:
        "bg-vermilion text-white hover:bg-vermilion-dark active:scale-[0.98] shadow-paper focus-visible:ring-vermilion",
      done:
        "bg-done text-white hover:bg-done/90 active:scale-[0.98] shadow-paper focus-visible:ring-done",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-md gap-1.5",
      md: "h-10 px-4 text-sm rounded-md gap-2",
      lg: "h-12 px-6 text-base rounded-md gap-2.5",
      icon: "h-9 w-9 rounded-md justify-center p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

