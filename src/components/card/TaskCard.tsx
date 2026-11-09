"use client";

import * as React from "react";
import {
  Check,
  Calendar,
  ChevronDown,
  ChevronUp,
  Quote,
  AlertCircle,
  Edit2,
  Trash2,
  Clock,
  Volume2,
  CalendarPlus,
} from "lucide-react";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTaskStore, getSubjectBorderColor } from "@/store/useTaskStore";
import { generateTaskICS, downloadICS } from "@/lib/calendar";
import { cn } from "@/lib/utils";

export interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [isQuoteExpanded, setIsQuoteExpanded] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const toggleTaskDone = useTaskStore((state) => state.toggleTaskDone);
  const confirmTaskDate = useTaskStore((state) => state.confirmTaskDate);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const isOverdue = task.due.dateISO && task.due.dateISO < "2026-11-09" && !task.done;
  const isDueToday = task.due.dateISO === "2026-11-09" && !task.done;
  const isUrgent24h = isDueToday || isOverdue;

  // Speak task summary (Feature F9 Read-back)
  const handleSpeakTask = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const spokenText = `${task.subject ? `${task.subject} ` : ""}${task.title}. Due ${
      task.due.raw || task.due.dateISO || "no specified date"
    }. ${task.notes || ""}`;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Add to Calendar (.ics download)
  const handleAddToCalendar = () => {
    const icsData = generateTaskICS(task);
    const safeName = task.title.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 24);
    downloadICS(icsData, `${safeName}.ics`);
  };

  // Deadline pill styling
  const renderDeadlinePill = () => {
    if (!task.due.dateISO && !task.due.raw) {
      return <Badge variant="neutral">No date</Badge>;
    }

    if (task.due.needsConfirmation) {
      return (
        <Badge variant="unconfirmed" className="cursor-pointer hover:bg-highlight-date transition-colors">
          <AlertCircle className="w-3 h-3 mr-1 inline" />
          {task.due.raw || task.due.dateISO}?
        </Badge>
      );
    }

    if (isOverdue) {
      return (
        <Badge variant="overdue">
          <Clock className="w-3 h-3 mr-1 inline" />
          {task.due.raw || task.due.dateISO}
        </Badge>
      );
    }

    if (isDueToday) {
      return (
        <Badge variant="today">
          <Calendar className="w-3 h-3 mr-1 inline" />
          {task.due.raw || "Today"} {task.due.time ? `· ${task.due.time}` : ""}
        </Badge>
      );
    }

    return (
      <Badge variant="upcoming">
        <Calendar className="w-3 h-3 mr-1 inline" />
        {task.due.raw || task.due.dateISO}
      </Badge>
    );
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-rule/80 dark:border-rule-dark/80 bg-card dark:bg-card-dark p-4 transition-all duration-200 shadow-paper hover:shadow-paper-hover hover:border-ink/40 dark:hover:border-rule-dark border-l-[4px]",
        getSubjectBorderColor(task.subject),
        task.done && "opacity-60 bg-paper/60 dark:bg-card-dark/40",
        isUrgent24h && !task.done && "animate-urgency"
      )}
    >
      <div>
        {/* Card Header: Subject, Type & Action Buttons */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider">
            {task.subject && (
              <span className="text-ink dark:text-ink-dark font-bold">{task.subject}</span>
            )}
            {task.subject && <span>·</span>}
            <span>{task.type}</span>
            {task.captureId.startsWith("sample") && (
              <Badge variant="sample" className="ml-1 text-[10px] py-0 px-1.5">
                Sample
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Audio Read-back (F9) */}
            <button
              onClick={handleSpeakTask}
              className={cn(
                "p-1 rounded hover:bg-paper dark:hover:bg-white/10 text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-all cursor-pointer",
                isSpeaking ? "opacity-100 text-vermilion" : "opacity-0 group-hover:opacity-100"
              )}
              title={isSpeaking ? "Stop read-back" : "Read task aloud (F9)"}
              aria-label={isSpeaking ? "Stop read-back" : "Read task aloud"}
            >
              <Volume2 className={cn("w-3.5 h-3.5", isSpeaking && "animate-pulse text-vermilion")} />
            </button>

            {/* Calendar Export (F11) */}
            <button
              onClick={handleAddToCalendar}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-paper dark:hover:bg-white/10 text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-all cursor-pointer"
              title="Add to calendar (.ics)"
              aria-label="Add to calendar (.ics)"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
            </button>

            {/* Edit Task */}
            <button
              onClick={() => onEdit?.(task)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-paper dark:hover:bg-white/10 text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-all cursor-pointer"
              title="Edit task"
              aria-label="Edit task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Task */}
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-vermilion/10 text-ink-muted hover:text-vermilion transition-all cursor-pointer"
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Custom Paper Checkbox */}
            <button
              onClick={() => toggleTaskDone(task.id)}
              className={cn(
                "w-5 h-5 rounded-full border border-rule dark:border-rule-dark flex items-center justify-center transition-all cursor-pointer ml-1",
                task.done
                  ? "bg-done border-done text-white"
                  : "bg-paper dark:bg-card-dark hover:border-ink dark:hover:border-ink-dark"
              )}
              title={task.done ? "Mark as active" : "Mark as completed"}
              aria-label={task.done ? "Mark as active" : "Mark as completed"}
            >
              {task.done && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Task Title in Fraunces Serif */}
        <h3
          className={cn(
            "font-display text-base font-semibold text-ink dark:text-ink-dark leading-snug tracking-tight mb-2.5",
            task.done && "line-through text-ink-muted dark:text-ink-muted-dark opacity-75"
          )}
        >
          {task.title}
        </h3>

        {/* Deadline & Confirmation Status */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {renderDeadlinePill()}
        </div>

        {/* Resource Chips */}
        {task.resources && task.resources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {task.resources.map((res, idx) => (
              <Badge key={idx} variant="resource" title={res.detail || res.label}>
                {res.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Notes Preview */}
        {task.notes && (
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark line-clamp-2 mb-3 font-sans leading-relaxed">
            {task.notes}
          </p>
        )}
      </div>

      <div>
        {/* Unconfirmed Date Callout Block (Integrated in Card Anatomy) */}
        {task.due.needsConfirmation && !task.done && (
          <div className="mt-2 mb-3 p-2.5 rounded-lg bg-highlight-date/50 dark:bg-amber-950/40 border border-dashed border-vermilion/40 text-xs">
            <div className="flex items-start gap-1.5 text-ink dark:text-ink-dark mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-vermilion shrink-0 mt-0.5" />
              <span>
                Professor said <strong>{task.due.raw}</strong>. Is that{" "}
                <strong>{task.due.dateISO}</strong>?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="vermilion"
                className="h-7 text-xs px-2.5 py-0"
                onClick={() => confirmTaskDate(task.id)}
              >
                Confirm Date
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs px-2.5 py-0"
                onClick={() => onEdit?.(task)}
              >
                Change Date
              </Button>
            </div>
          </div>
        )}

        {/* Source Quote Expander */}
        {task.sourceQuote && (
          <div className="pt-2 border-t border-rule/50 dark:border-rule-dark/50">
            <button
              onClick={() => setIsQuoteExpanded(!isQuoteExpanded)}
              className="flex items-center justify-between w-full text-[11px] text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors cursor-pointer select-none"
            >
              <span className="flex items-center gap-1">
                <Quote className="w-3 h-3 text-ink-muted/80" />
                <span>Original audio quote</span>
              </span>
              {isQuoteExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {isQuoteExpanded && (
              <blockquote className="mt-2 p-2 rounded bg-paper/80 dark:bg-black/40 border-l-2 border-ink dark:border-ink-dark text-[11px] text-ink dark:text-ink-dark italic font-serif leading-relaxed animate-in fade-in duration-150">
                &ldquo;{task.sourceQuote}&rdquo;
              </blockquote>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
