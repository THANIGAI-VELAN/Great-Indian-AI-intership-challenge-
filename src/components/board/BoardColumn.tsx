"use client";

import * as React from "react";
import { Task, UrgencyCategory } from "@/types";
import { TaskCard } from "@/components/card/TaskCard";
import { cn } from "@/lib/utils";

export interface BoardColumnProps {
  id: UrgencyCategory;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  accentClass?: string;
  emptyText?: string;
}

export function BoardColumn({
  title,
  tasks,
  onEditTask,
  accentClass,
  emptyText = "Nothing due here.",
}: BoardColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] sm:min-w-[310px] max-w-[340px] flex-1 shrink-0 rounded-xl bg-paper/60 border border-rule/70 p-3.5 transition-colors">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule/60">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              accentClass || "bg-ink-muted"
            )}
          />
          <h2 className="text-xs font-mono font-bold tracking-wider text-ink uppercase">
            {title}
          </h2>
        </div>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-paper border border-rule/80 text-ink-muted">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))
        ) : (
          <div className="py-8 px-4 text-center rounded-lg border border-dashed border-rule/80 bg-paper/30">
            <p className="text-xs text-ink-muted/80 font-sans italic">
              {emptyText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

