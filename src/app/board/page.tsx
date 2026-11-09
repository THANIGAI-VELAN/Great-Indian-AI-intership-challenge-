"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Database,
  Settings as SettingsIcon,
  Search,
  Filter,
  Columns3,
  List,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Plus,
  Download,
  Upload,
  FileJson,
  CalendarPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { TaskCard } from "@/components/card/TaskCard";
import { EditTaskModal } from "@/components/card/EditTaskModal";
import { BoardColumn } from "@/components/board/BoardColumn";
import { CaptureBar } from "@/components/capture/CaptureBar";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { SignatureTransitionModal } from "@/components/capture/SignatureTransitionModal";
import { AskSolliModal } from "@/components/assistant/AskSolliModal";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { generateBoardICS, downloadICS } from "@/lib/calendar";
import { useTaskStore, getUrgencyCategory } from "@/store/useTaskStore";
import { Task } from "@/types";
import { cn } from "@/lib/utils";

export default function BoardPage() {
  const {
    tasks,
    searchQuery,
    selectedSubject,
    viewMode,
    undoToastMessage,
    isSettingsOpen,
    setSearchQuery,
    setSelectedSubject,
    setViewMode,
    setIsSettingsOpen,
    undoLastAction,
    clearUndoToast,
    resetToSampleData,
    clearAllTasks,
  } = useTaskStore();

  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = React.useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = React.useState(false);
  const [isAskSolliOpen, setIsAskSolliOpen] = React.useState(false);
  const [signatureTranscript, setSignatureTranscript] = React.useState("");
  const [newlyCreatedTask, setNewlyCreatedTask] = React.useState<Task | null>(null);

  // Dismiss undo toast automatically after 5s
  React.useEffect(() => {
    if (undoToastMessage) {
      const timer = setTimeout(() => {
        clearUndoToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [undoToastMessage, clearUndoToast]);

  // Subject list extraction
  const subjects = React.useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.subject) set.add(t.subject.toUpperCase());
    });
    return Array.from(set);
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        searchQuery === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.subject && t.subject.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject =
        selectedSubject === null ||
        (t.subject && t.subject.toUpperCase() === selectedSubject.toUpperCase());

      return matchesSearch && matchesSubject;
    });
  }, [tasks, searchQuery, selectedSubject]);

  // Categorize into the 5 Urgency Columns
  const overdueTasks = filteredTasks.filter((t) => getUrgencyCategory(t) === "overdue");
  const todayTasks = filteredTasks.filter((t) => getUrgencyCategory(t) === "today");
  const thisWeekTasks = filteredTasks.filter((t) => getUrgencyCategory(t) === "this_week");
  const laterTasks = filteredTasks.filter((t) => getUrgencyCategory(t) === "later");
  const noDateTasks = filteredTasks.filter((t) => getUrgencyCategory(t) === "no_date");

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `solli-tasks-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark flex flex-col md:flex-row transition-colors">
      {/* 1. Left Sidebar Navigation (Desktop) */}
      <aside className="w-full md:w-64 bg-paper dark:bg-paper-dark border-b md:border-b-0 md:border-r border-rule/70 dark:border-rule-dark/70 p-4 sm:p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Back to Landing */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-ink dark:bg-card-dark text-card dark:text-ink-dark flex items-center justify-center font-display font-bold text-base group-hover:scale-105 transition-transform shadow-paper">
                S
              </span>
              <span className="font-display font-bold text-2xl tracking-tight text-ink dark:text-ink-dark">
                Solli
              </span>
            </Link>

            <Link
              href="/"
              className="text-xs text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark flex items-center gap-1 md:hidden"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            <button
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold bg-ink text-card dark:bg-card-dark dark:text-ink-dark shadow-paper text-left transition-all cursor-pointer whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4 text-vermilion" />
              <span>My Board</span>
            </button>

            {/* Real Ask Your List Assistant Trigger */}
            <button
              onClick={() => setIsAskSolliOpen(true)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5 text-left transition-all cursor-pointer whitespace-nowrap group"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-vermilion" />
                <span>Ask your list</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-vermilion/10 text-vermilion font-bold uppercase tracking-wider group-hover:bg-vermilion group-hover:text-white transition-colors">
                AI Voice
              </span>
            </button>

            <button
              onClick={() => setIsDataModalOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5 text-left transition-all cursor-pointer whitespace-nowrap"
            >
              <Database className="w-4 h-4" />
              <span>Data controls</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5 text-left transition-all cursor-pointer whitespace-nowrap"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings (BYOK)</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Widget */}
        <div className="hidden md:block pt-4 border-t border-rule/60 dark:border-rule-dark/60 text-xs text-ink-muted dark:text-ink-muted-dark space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold">Active Tasks</span>
            <span className="font-mono font-bold text-ink dark:text-ink-dark">
              {tasks.filter((t) => !t.done).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold">Local Storage</span>
            <span className="text-done font-medium">100% Private</span>
          </div>
          <p className="text-[11px] text-ink-muted/80 dark:text-ink-muted-dark/80 pt-1">
            Built by Thanigai Velan for The Great Indian AI Challenge.
          </p>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink dark:text-ink-dark tracking-tight">
              Your board.
            </h1>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1 font-sans">
              Everything important, in one place.
            </p>
          </div>

          {/* Search, Filter & View Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Ask Solli Quick Button */}
            <button
              onClick={() => setIsAskSolliOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-vermilion/10 text-vermilion hover:bg-vermilion hover:text-white border border-vermilion/30 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Ask queries about your tasks"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Solli</span>
            </button>

            <div className="relative min-w-[180px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted/70" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Subject Filter Pills */}
            <select
              value={selectedSubject || ""}
              onChange={(e) => setSelectedSubject(e.target.value || null)}
              className="h-9 rounded-lg border border-rule dark:border-rule-dark bg-card dark:bg-card-dark px-3 text-xs font-medium text-ink dark:text-ink-dark focus-visible:outline-none focus-visible:border-ink cursor-pointer"
            >
              <option value="">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-rule dark:border-rule-dark bg-card dark:bg-card-dark p-0.5">
              <button
                onClick={() => setViewMode("board")}
                className={cn(
                  "p-1.5 rounded-md transition-colors cursor-pointer",
                  viewMode === "board"
                    ? "bg-ink text-card dark:bg-paper dark:text-ink"
                    : "text-ink-muted hover:text-ink dark:hover:text-ink-dark"
                )}
                title="Board View"
                aria-label="Board View"
              >
                <Columns3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-colors cursor-pointer",
                  viewMode === "list"
                    ? "bg-ink text-card dark:bg-paper dark:text-ink"
                    : "text-ink-muted hover:text-ink dark:hover:text-ink-dark"
                )}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* 3. Top Capture Bar */}
        <div className="mb-6">
          <CaptureBar
            onSignatureTransition={(transcript, createdTask) => {
              setSignatureTranscript(transcript);
              setNewlyCreatedTask(createdTask || null);
              setIsSignatureModalOpen(true);
            }}
          />
        </div>

        {/* 4. Kanban Urgency Columns or List View */}
        {viewMode === "board" ? (
          <div className="flex items-start gap-4 overflow-x-auto pb-6 pt-1 flex-1">
            <BoardColumn
              id="overdue"
              title="OVERDUE"
              tasks={overdueTasks}
              onEditTask={(t) => setEditingTask(t)}
              accentClass="bg-vermilion"
              emptyText="No overdue assignments. Great job!"
            />

            <BoardColumn
              id="today"
              title="TODAY"
              tasks={todayTasks}
              onEditTask={(t) => setEditingTask(t)}
              accentClass="bg-vermilion"
              emptyText="Nothing scheduled for today."
            />

            <BoardColumn
              id="this_week"
              title="THIS WEEK"
              tasks={thisWeekTasks}
              onEditTask={(t) => setEditingTask(t)}
              accentClass="bg-[#2B4C7E]"
              emptyText="Clear week ahead."
            />

            <BoardColumn
              id="later"
              title="LATER"
              tasks={laterTasks}
              onEditTask={(t) => setEditingTask(t)}
              accentClass="bg-done"
              emptyText="No upcoming deadlines."
            />

            <BoardColumn
              id="no_date"
              title="NO DATE"
              tasks={noDateTasks}
              onEditTask={(t) => setEditingTask(t)}
              accentClass="bg-ink-muted"
              emptyText="All tasks have dates."
            />
          </div>
        ) : (
          /* List View */
          <div className="flex-1 overflow-y-auto space-y-3 max-w-4xl pb-10">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(t) => setEditingTask(t)}
                />
              ))
            ) : (
              <div className="py-12 text-center rounded-xl border border-dashed border-rule bg-card/60">
                <p className="text-sm font-sans text-ink-muted">
                  No tasks found matching your filter criteria.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Undo Toast Banner */}
        {undoToastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-ink text-card shadow-paper-lg animate-in slide-in-from-bottom-5 duration-200">
            <span className="text-xs font-medium font-sans">
              {undoToastMessage}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={undoLastAction}
              className="h-7 text-xs px-2.5 bg-paper text-ink border-none hover:bg-paper/90"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Undo
            </Button>
          </div>
        )}

        {/* Edit Task Modal */}
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
        />

        {/* Settings BYOK Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        {/* Signature Transition Modal */}
        <SignatureTransitionModal
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          transcript={signatureTranscript}
          createdTask={newlyCreatedTask}
        />

        {/* Ask Solli Assistant Modal (Feature F10) */}
        <AskSolliModal
          isOpen={isAskSolliOpen}
          onClose={() => setIsAskSolliOpen(false)}
          onEditTask={(t) => setEditingTask(t)}
        />

        {/* Data Controls Modal */}
        <Modal
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
          title="Data Controls"
          description="Export, backup or manage your local browser data."
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-paper border border-rule text-xs text-ink-muted">
              Solli stores all tasks and captures inside your device&apos;s browser. Nothing is sent to an external server. You can export or import your data anytime.
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                onClick={handleExportJSON}
                className="justify-start gap-2"
              >
                <Download className="w-4 h-4 text-ink-muted" />
                <span>Export All Tasks as JSON</span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => downloadICS(generateBoardICS(tasks), `solli-calendar-${Date.now()}.ics`)}
                className="justify-start gap-2"
              >
                <CalendarPlus className="w-4 h-4 text-ink-muted" />
                <span>Download All as .ics Calendar (Google / Apple / Outlook)</span>
              </Button>

              <Button
                variant="secondary"
                onClick={resetToSampleData}
                className="justify-start gap-2"
              >
                <RotateCcw className="w-4 h-4 text-ink-muted" />
                <span>Reset to Sample Tasks</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (confirm("Are you sure you want to clear all tasks from this browser?")) {
                    clearAllTasks();
                    setIsDataModalOpen(false);
                  }
                }}
                className="justify-start gap-2 text-vermilion hover:bg-vermilion-light border-vermilion/30"
              >
                <X className="w-4 h-4" />
                <span>Clear All Tasks</span>
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

