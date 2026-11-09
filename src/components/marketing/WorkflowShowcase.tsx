"use client";

import * as React from "react";
import { Mic, Cpu, Columns3, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    tag: "CAPTURE",
    title: "Speak in Class, Paste or Drop Audio",
    desc: "Record your professor's voice directly in classroom acoustics, upload a forwarded WhatsApp voice note, or paste syllabus messages.",
    icon: Mic,
    accent: "text-vermilion bg-vermilion/10 border-vermilion/30",
    preview: {
      type: "audio",
      title: "Classroom Audio Recording",
      line1: "Duration: 00:24 · Resampled to mono 16 kHz WAV",
      line2: "Detects Tamil, Tanglish, Hinglish, & English automatically",
    },
  },
  {
    step: "02",
    tag: "UNDERSTAND",
    title: "Gnani Prisma Speech & Structured LLM Extraction",
    desc: "Prisma v3.0 accurately handles Indian codemix and Latin Tanglish transliteration. The LLM extracts only verified deadlines, tasks, and named resources without hallucination.",
    icon: Cpu,
    accent: "text-info bg-info/10 border-info/30",
    preview: {
      type: "code",
      title: "Zod Schema Extraction Output",
      line1: 'title: "DBMS Assignment Chapter 7", due: { weekday: 5, date: "2026-11-13" }',
      line2: 'resources: ["ER Diagram", "Normalization notes"], confidence: "High"',
    },
  },
  {
    step: "03",
    tag: "ORGANISE",
    title: "Self-Sorting Urgency Kanban Columns",
    desc: "Tasks automatically sort into Overdue, Today, This Week, Later, or No Date based on mathematical date resolution in code, preventing missed semester deadlines.",
    icon: Columns3,
    accent: "text-[#2B4C7E] bg-[#2B4C7E]/10 border-[#2B4C7E]/30",
    preview: {
      type: "board",
      title: "5 Urgency Columns",
      line1: "Overdue (Red) → Today (Amber) → This Week (Blue) → Later (Green)",
      line2: "Subject color-coded borders with fast search and subject filtering",
    },
  },
  {
    step: "04",
    tag: "TAKE ACTION",
    title: "Confirm Ambiguous Dates & Complete with Undo",
    desc: "Ambiguous words ('Friday', 'kal') are clearly flagged with dashed pills requiring a single tap to confirm. Check off completed assignments with instant undo safety.",
    icon: CheckCircle2,
    accent: "text-done bg-done/10 border-done/30",
    preview: {
      type: "confirm",
      title: "Honest AI Date Confirmation",
      line1: '"Sir said Friday. Is that 13 Nov?" [Confirm] [Edit]',
      line2: "Every task links directly back to its exact spoken source quotation",
    },
  },
];

export function WorkflowShowcase() {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const activeStep = STEPS[activeStepIndex];

  return (
    <div className="space-y-8">
      {/* Step Selector Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeStepIndex === idx;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStepIndex(idx)}
              className={cn(
                "p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border relative overflow-hidden group",
                isSelected
                  ? "glass-panel shadow-lg border-ink/40 dark:border-white/20 scale-[1.02]"
                  : "bg-card/40 dark:bg-card-dark/40 border-rule/60 dark:border-rule-dark/60 hover:bg-card/80 dark:hover:bg-card-dark/80"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={cn(
                    "text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border",
                    s.accent
                  )}
                >
                  {s.step} · {s.tag}
                </span>
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isSelected ? "text-ink dark:text-ink-dark" : "text-ink-muted dark:text-ink-muted-dark"
                  )}
                />
              </div>
              <h4 className="font-display text-sm sm:text-base font-bold text-ink dark:text-ink-dark line-clamp-1">
                {s.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Glass Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl border border-rule/70 dark:border-rule-dark/70 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-vermilion">
              STEP {activeStep.step} OF 04
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink dark:text-ink-dark leading-snug">
            {activeStep.title}
          </h3>

          <p className="text-sm sm:text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed font-sans">
            {activeStep.desc}
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-ink-muted dark:text-ink-muted-dark">
            <span className="flex items-center gap-1.5 text-done">
              <ShieldCheck className="w-4 h-4" /> 100% On-Device Storage
            </span>
            <span>·</span>
            <span>Zero Hallucinations</span>
          </div>
        </div>

        {/* Live Mockup Box on Right */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-paper/90 dark:bg-card-dark/90 border border-rule dark:border-rule-dark shadow-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rule/60 dark:border-rule-dark/60">
            <span className="text-xs font-mono font-bold text-ink dark:text-ink-dark uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-vermilion" />
              {activeStep.preview.title}
            </span>
            <span className="w-2 h-2 rounded-full bg-done animate-pulse" />
          </div>

          <div className="font-mono text-xs space-y-2 text-ink dark:text-ink-dark bg-card/60 dark:bg-black/30 p-3.5 rounded-xl border border-rule/50 dark:border-rule-dark/50">
            <p className="text-vermilion font-semibold leading-relaxed">
              &gt; {activeStep.preview.line1}
            </p>
            <p className="text-ink-muted dark:text-ink-muted-dark leading-relaxed">
              &gt; {activeStep.preview.line2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

