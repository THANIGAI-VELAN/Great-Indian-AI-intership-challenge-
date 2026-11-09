"use client";

import * as React from "react";
import { Play, Pause, Sparkles, AlertCircle, Volume2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Scenario {
  id: string;
  label: string;
  tag: string;
  audioTime: string;
  transcriptTokens: Array<{ text: string; type?: "task" | "date" | "res" }>;
  card: {
    title: string;
    subject: string;
    type: string;
    deadline: string;
    isUnconfirmed: boolean;
    resources: string[];
    quote: string;
    borderColor: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: "tanglish-dbms",
    label: "DBMS Assignment",
    tag: "Tanglish (Tamil + Eng)",
    audioTime: "00:14",
    transcriptTokens: [
      { text: "Sir sonnaru, " },
      { text: "DBMS assignment", type: "task" },
      { text: " " },
      { text: "Friday-kulla", type: "date" },
      { text: " submit pannanum. " },
      { text: "ER diagram", type: "res" },
      { text: " vara venum, " },
      { text: "chapter 7", type: "res" },
      { text: " refer pannunga." },
    ],
    card: {
      title: "DBMS Assignment Chapter 7",
      subject: "DBMS",
      type: "ASSIGNMENT",
      deadline: "Fri 13 Nov?",
      isUnconfirmed: true,
      resources: ["ER Diagram", "Chapter 7"],
      quote: "Sir sonnaru, DBMS assignment Friday-kulla submit pannanum...",
      borderColor: "border-l-[#2B4C7E] dark:border-l-[#4C7DCA]",
    },
  },
  {
    id: "tanglish-os",
    label: "OS Lab Record",
    tag: "Tamil Nadu College",
    audioTime: "00:09",
    transcriptTokens: [
      { text: "Naalaiku morning 9 mani-ku " },
      { text: "lab record submit", type: "task" },
      { text: " pannanum. " },
      { text: "Tomorrow 9:00 AM", type: "date" },
      { text: ". " },
      { text: "Ravi sir", type: "res" },
      { text: " kitta sign vaanganum." },
    ],
    card: {
      title: "OS Lab Record Signature",
      subject: "OS",
      type: "SUBMISSION",
      deadline: "Tomorrow 9:00 AM",
      isUnconfirmed: false,
      resources: ["Lab Manual", "Ravi Sir"],
      quote: "Naalaiku morning 9 mani-ku lab record submit pannanum...",
      borderColor: "border-l-vermilion",
    },
  },
  {
    id: "hinglish-viva",
    label: "OS Viva & Questions",
    tag: "Hinglish (Hindi + Eng)",
    audioTime: "00:11",
    transcriptTokens: [
      { text: "Kal tak " },
      { text: "OS assignment jama", type: "task" },
      { text: " karna hai, " },
      { text: "chapter 5", type: "res" },
      { text: " se questions karne hain. " },
      { text: "Monday ko viva", type: "date" },
      { text: " hai." },
    ],
    card: {
      title: "OS Unit 5 Assignment & Viva",
      subject: "OS",
      type: "EXAM",
      deadline: "Mon 16 Nov",
      isUnconfirmed: false,
      resources: ["Chapter 5", "Viva Prep"],
      quote: "Kal tak OS ka assignment jama karna hai, Monday ko viva...",
      borderColor: "border-l-done",
    },
  },
];

export function InteractiveHeroPreview() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState<"idle" | "playing" | "extracting" | "landed">("landed");

  const scenario = SCENARIOS[selectedScenarioIndex];

  const handleSelectScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    setIsPlaying(false);
    setActiveStep("idle");
    setTimeout(() => {
      setActiveStep("landed");
    }, 200);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setActiveStep("landed");
    } else {
      setIsPlaying(true);
      setActiveStep("playing");
      setTimeout(() => {
        setActiveStep("extracting");
        setTimeout(() => {
          setIsPlaying(false);
          setActiveStep("landed");
        }, 1200);
      }, 1400);
    }
  };

  return (
    <div className="relative group">
      {/* Background Ambient Glows */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-vermilion/20 via-info/20 to-done/20 blur-xl opacity-50 group-hover:opacity-80 transition duration-700 -z-10" />

      {/* Main Glass Panel */}
      <div className="relative glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl transition-all duration-300">
        {/* Scenario Switcher Tabs */}
        <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-rule/50 dark:border-rule-dark/50 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse" />
            <span className="text-[11px] font-mono uppercase font-bold text-ink dark:text-ink-dark tracking-wider">
              Live Demo:
            </span>
          </div>

          <div className="flex items-center gap-1">
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(idx)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                  selectedScenarioIndex === idx
                    ? "bg-ink text-card dark:bg-card-dark dark:text-ink-dark shadow-sm ring-1 ring-rule/40 dark:ring-rule-dark"
                    : "text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Player Glass Bar */}
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl glass-pill mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="w-10 h-10 rounded-full bg-ink dark:bg-card-dark text-card dark:text-ink-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
              title={isPlaying ? "Pause note" : "Play announcement audio"}
              aria-label={isPlaying ? "Pause note" : "Play announcement audio"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-vermilion" />
                <span className="text-xs font-bold text-ink dark:text-ink-dark font-sans">
                  {scenario.label}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-paper dark:bg-card-dark text-ink-muted dark:text-ink-muted-dark border border-rule/50 dark:border-rule-dark/50">
                  {scenario.tag}
                </span>
              </div>
              <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark font-sans">
                {isPlaying ? "Recognising speech with Gnani Prisma..." : "Tap play to hear Tanglish speech & extract"}
              </p>
            </div>
          </div>

          {/* Sound wave graphic animation */}
          <div className="flex items-center gap-1 h-6 shrink-0">
            {[45, 80, 55, 95, 70, 40, 90, 100, 65, 85, 50, 75, 40, 90].map((h, i) => (
              <span
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all duration-200",
                  isPlaying ? "bg-vermilion animate-pulse" : "bg-ink/30 dark:bg-white/30"
                )}
                style={{
                  height: `${isPlaying ? h : Math.max(20, h * 0.4)}%`,
                  animationDelay: `${i * 65}ms`,
                }}
              />
            ))}
          </div>

          <span className="font-mono text-xs text-ink-muted dark:text-ink-muted-dark font-semibold">
            {scenario.audioTime}
          </span>
        </div>

        {/* Recognised Transcript Card with Token Highlights */}
        <div className="mb-4 p-4 rounded-2xl bg-paper/70 dark:bg-card-dark/60 border border-rule/60 dark:border-rule-dark/60 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-ink-muted dark:text-ink-muted-dark">
              Transcribed Classroom Speech
            </span>
            <span className="text-[10px] font-mono text-done font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified Codemix
            </span>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-ink dark:text-ink-dark font-sans">
            {scenario.transcriptTokens.map((token, i) => {
              if (token.type === "task") {
                return (
                  <span
                    key={i}
                    className="inline-block bg-highlight-task text-highlight-task-text dark:bg-blue-950/70 dark:text-blue-300 px-1.5 py-0.5 rounded-md font-semibold border border-info/30 shadow-sm"
                  >
                    {token.text}
                  </span>
                );
              }
              if (token.type === "date") {
                return (
                  <span
                    key={i}
                    className="inline-block bg-highlight-date text-highlight-date-text dark:bg-amber-950/70 dark:text-amber-300 px-1.5 py-0.5 rounded-md font-semibold border border-vermilion/30 shadow-sm"
                  >
                    {token.text}
                  </span>
                );
              }
              if (token.type === "res") {
                return (
                  <span
                    key={i}
                    className="inline-block bg-highlight-resource text-highlight-resource-text dark:bg-emerald-950/70 dark:text-emerald-300 px-1.5 py-0.5 rounded-md font-semibold border border-done/30 shadow-sm"
                  >
                    {token.text}
                  </span>
                );
              }
              return <span key={i}>{token.text}</span>;
            })}
          </p>

          {/* Color Key Guide */}
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-2.5 border-t border-rule/50 dark:border-rule-dark/50 text-[10px] font-mono text-ink-muted dark:text-ink-muted-dark">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-highlight-task dark:bg-blue-900 border border-info/40" />
              Task (Blue)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-highlight-date dark:bg-amber-900 border border-vermilion/40" />
              Deadline (Vermilion)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-highlight-resource dark:bg-emerald-900 border border-done/40" />
              Resource (Green)
            </span>
          </div>
        </div>

        {/* Extracted Interactive Glass Card */}
        <div
          className={cn(
            "relative rounded-2xl glass-panel p-4 sm:p-5 shadow-lg border-l-[5px] transition-all duration-300 hover:scale-[1.01]",
            scenario.card.borderColor
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-ink dark:text-ink-dark tracking-wider">
              <span>{scenario.card.subject}</span>
              <span>·</span>
              <span className="text-ink-muted dark:text-ink-muted-dark font-normal">
                {scenario.card.type}
              </span>
            </div>

            {scenario.card.isUnconfirmed ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-highlight-date text-vermilion border border-dashed border-vermilion">
                <AlertCircle className="w-3 h-3 mr-1 inline" />
                {scenario.card.deadline}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-highlight-task text-highlight-task-text dark:bg-blue-950/70 dark:text-blue-300 border border-info/30">
                {scenario.card.deadline}
              </span>
            )}
          </div>

          <h4 className="font-display text-lg font-bold text-ink dark:text-ink-dark mb-2">
            {scenario.card.title}
          </h4>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {scenario.card.resources.map((res, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-highlight-resource text-highlight-resource-text dark:bg-emerald-950/70 dark:text-emerald-300 border border-done/20"
              >
                {res}
              </span>
            ))}
          </div>

          <p className="text-xs text-ink-muted dark:text-ink-muted-dark italic font-serif">
            From: &ldquo;{scenario.card.quote}&rdquo;
          </p>

          {scenario.card.isUnconfirmed && (
            <div className="mt-3 pt-2.5 border-t border-rule/50 dark:border-rule-dark/50 flex items-center justify-between">
              <span className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
                Sir said Friday. Is that 13 Nov?
              </span>
              <button
                className="px-2.5 py-1 rounded-md text-xs font-bold bg-vermilion text-white hover:bg-vermilion-dark active:scale-95 transition-all shadow-sm cursor-pointer"
                onClick={() => alert("Date confirmed as 13 Nov!")}
              >
                Confirm Date
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
