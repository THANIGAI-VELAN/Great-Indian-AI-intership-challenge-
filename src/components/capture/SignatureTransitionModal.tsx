"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { getSubjectBorderColor } from "@/store/useTaskStore";
import { cn } from "@/lib/utils";

export interface SignatureTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcript?: string;
  createdTask?: Task | null;
}

export function SignatureTransitionModal({
  isOpen,
  onClose,
  transcript = "Sir sonnaru, DBMS assignment Friday-kulla submit pannanum. ER diagram vara venum, chapter 7 refer pannunga.",
  createdTask,
}: SignatureTransitionModalProps) {
  const [animationStep, setAnimationStep] = React.useState<"highlight" | "lifting" | "landed">("highlight");

  React.useEffect(() => {
    if (isOpen) {
      setAnimationStep("highlight");
      const t1 = setTimeout(() => setAnimationStep("lifting"), 700);
      const t2 = setTimeout(() => setAnimationStep("landed"), 1500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayTask = createdTask || {
    id: "sample-id",
    title: "DBMS Assignment Chapter 7",
    subject: "DBMS",
    type: "assignment",
    due: {
      raw: "Friday",
      dateISO: "2026-11-13",
      needsConfirmation: true,
    },
    resources: [{ label: "Chapter 7" }, { label: "ER diagram" }],
    sourceQuote: transcript,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 dark:bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 text-ink dark:text-ink-dark overflow-hidden shadow-2xl border border-rule/70 dark:border-rule-dark/70">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <span className="p-2 rounded-xl bg-vermilion/10 text-vermilion border border-vermilion/30">
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark">
            Transcript to Card Transformation
          </h2>
        </div>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mb-6">
          Watch phrases lift directly from your spoken/typed input into your urgency board.
        </p>

        {/* 1. The Recognised User Transcript with Highlight Elements */}
        <div className="rounded-2xl bg-paper/80 dark:bg-card-dark/80 p-5 border border-rule/70 dark:border-rule-dark/70 mb-6">
          <p className="text-[10px] uppercase tracking-wider font-mono font-bold text-ink-muted dark:text-ink-muted-dark mb-2">
            Captured Note Excerpt
          </p>
          <div className="text-base sm:text-lg leading-relaxed font-sans text-ink dark:text-ink-dark">
            <span
              className={cn(
                "px-2 py-0.5 rounded-lg font-semibold transition-all duration-300",
                animationStep !== "highlight"
                  ? "bg-highlight-task text-highlight-task-text dark:bg-blue-950 dark:text-blue-200 ring-2 ring-info/30"
                  : "bg-highlight-task/70 text-highlight-task-text dark:bg-blue-950/70 dark:text-blue-300"
              )}
            >
              &ldquo;{transcript}&rdquo;
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-rule/50 dark:border-rule-dark/50 text-[11px] font-mono text-ink-muted dark:text-ink-muted-dark">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-highlight-task border border-info/40" />
              Task intent (blue)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-highlight-date border border-vermilion/40" />
              Deadline (vermilion)
            </span>
          </div>
        </div>

        {/* 2. Animate Flying to Resulting Card */}
        <AnimatePresence>
          {animationStep === "landed" && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 26,
              }}
              className={cn(
                "rounded-2xl border-l-[5px] bg-card dark:bg-card-dark p-5 shadow-xl border border-rule/80 dark:border-rule-dark/80",
                getSubjectBorderColor(displayTask.subject)
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-ink dark:text-ink-dark uppercase tracking-wider font-mono">
                  {displayTask.subject ? `${displayTask.subject} · ` : ""}
                  {displayTask.type.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-done/10 text-done border border-done/30 font-semibold uppercase">
                  Newly Created
                </span>
              </div>

              <h3 className="font-display text-lg sm:text-xl font-bold text-ink dark:text-ink-dark mb-2">
                {displayTask.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                {displayTask.due?.raw && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-highlight-date text-vermilion border border-dashed border-vermilion">
                    <AlertCircle className="w-3 h-3 mr-1 inline" />
                    {displayTask.due.raw} ({displayTask.due.dateISO || "needs confirm"})
                  </span>
                )}

                {displayTask.resources?.map((res: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-highlight-resource text-highlight-resource-text dark:bg-emerald-950 dark:text-emerald-200"
                  >
                    {res.label}
                  </span>
                ))}
              </div>

              <p className="text-xs text-ink-muted dark:text-ink-muted-dark italic font-serif">
                From: &ldquo;{displayTask.sourceQuote}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-rule/60 dark:border-rule-dark/60">
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-sans">
            {animationStep === "highlight" && "Recognising and structuring your input..."}
            {animationStep === "lifting" && "Validating with Zod schema..."}
            {animationStep === "landed" && "Saved to your board in localStorage!"}
          </span>
          <Button variant="primary" size="sm" onClick={onClose} className="gap-1.5 rounded-full px-5">
            <span>View on Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
