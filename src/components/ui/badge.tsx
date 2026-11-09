import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "sample" | "overdue" | "today" | "upcoming" | "neutral" | "unconfirmed" | "resource";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium transition-colors select-none";

  const variantStyles = {
    default: "bg-paper text-ink border border-rule",
    sample: "bg-[#EFEAE1] text-ink-muted text-[11px] px-2 py-0.5 border border-rule/60 font-sans tracking-wide uppercase font-semibold",
    overdue: "bg-vermilion-light text-vermilion border border-vermilion/30 font-mono",
    today: "bg-highlight-date text-highlight-date-text border border-vermilion/20 font-mono",
    upcoming: "bg-highlight-task text-highlight-task-text border border-info/20 font-mono",
    neutral: "bg-paper text-ink-muted border border-rule font-mono",
    unconfirmed: "bg-highlight-date/60 text-vermilion border border-dashed border-vermilion font-mono",
    resource: "bg-highlight-resource text-highlight-resource-text border border-done/20 font-sans text-[11px]",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}

