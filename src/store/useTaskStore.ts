import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, Settings, UrgencyCategory } from "@/types";

export const SAMPLE_TASKS: Task[] = [
  {
    id: "task-sample-1",
    captureId: "sample-cap-1",
    title: "OS Lab Record",
    subject: "OS",
    type: "submission",
    due: {
      raw: "Sat 7 Nov",
      expr: { kind: "relative", days: -2 },
      dateISO: "2026-11-07",
      time: null,
      needsConfirmation: false,
      confirmedByUser: true,
    },
    resources: [
      { label: "Lab manual", kind: "book", detail: "Experiment 4 & 5" },
    ],
    notes: "Get signature from Ravi sir before final submission.",
    sourceQuote: "Naalaiku morning 9 mani-ku lab record submit pannanum. Ravi sir kitta sign vaanganum.",
    done: false,
    createdAt: "2026-11-05T10:00:00Z",
    updatedAt: "2026-11-05T10:00:00Z",
  },
  {
    id: "task-sample-2",
    captureId: "sample-cap-2",
    title: "Maths quiz revision",
    subject: "MATHS",
    type: "exam",
    due: {
      raw: "Today 4:00 PM",
      expr: { kind: "relative", days: 0 },
      dateISO: "2026-11-09",
      time: "16:00",
      needsConfirmation: false,
      confirmedByUser: true,
    },
    resources: [
      { label: "Formula sheet", kind: "chapter", detail: "Unit 2 & 3" },
    ],
    notes: "Probability and random processes chapter formulas.",
    sourceQuote: "Innaiku evening 4 PM maths quiz revision irukku.",
    done: false,
    createdAt: "2026-11-09T08:30:00Z",
    updatedAt: "2026-11-09T08:30:00Z",
  },
  {
    id: "task-sample-3",
    captureId: "sample-cap-3",
    title: "DBMS Assignment",
    subject: "DBMS",
    type: "assignment",
    due: {
      raw: "Friday",
      expr: { kind: "weekday", weekday: 5, modifier: "this" },
      dateISO: "2026-11-13",
      time: null,
      needsConfirmation: true,
      confirmedByUser: false,
    },
    resources: [
      { label: "Chapter 7", kind: "chapter", detail: "Normalization" },
      { label: "ER diagram", kind: "other", detail: "Draw neatly" },
    ],
    notes: "Refer chapter 7 for ER to relational mapping rules.",
    sourceQuote: "Sir sonnaru, DBMS assignment Friday-kulla submit pannanum. ER diagram vara venum, chapter 7 refer pannunga.",
    done: false,
    createdAt: "2026-11-09T09:15:00Z",
    updatedAt: "2026-11-09T09:15:00Z",
  },
  {
    id: "task-sample-4",
    captureId: "sample-cap-4",
    title: "CN mini project demo",
    subject: "CN",
    type: "submission",
    due: {
      raw: "Thu 12 Nov",
      expr: { kind: "weekday", weekday: 4, modifier: "this" },
      dateISO: "2026-11-12",
      time: null,
      needsConfirmation: false,
      confirmedByUser: true,
    },
    resources: [
      { label: "Packet tracer", kind: "link", detail: "Topology file v2" },
    ],
    notes: "Test socket connection on LAN first.",
    sourceQuote: "Mini project demo Thursday fixed. Everyone must show working packet tracer topology.",
    done: false,
    createdAt: "2026-11-08T14:20:00Z",
    updatedAt: "2026-11-08T14:20:00Z",
  },
  {
    id: "task-sample-5",
    captureId: "sample-cap-5",
    title: "Exam hall ticket notice",
    subject: "ADMIN",
    type: "reminder",
    due: {
      raw: "Mon 30 Nov",
      expr: { kind: "absolute", day: 30, month: 11, year: 2026 },
      dateISO: "2026-11-30",
      time: null,
      needsConfirmation: false,
      confirmedByUser: true,
    },
    resources: [
      { label: "Admin portal", kind: "link", detail: "Clear dues first" },
    ],
    notes: "Collect stamped hall ticket from department office.",
    sourceQuote: "Semester exam hall tickets will be issued from November 30th. Clear your college dues before that.",
    done: false,
    createdAt: "2026-11-07T11:00:00Z",
    updatedAt: "2026-11-07T11:00:00Z",
  },
  {
    id: "task-sample-6",
    captureId: "sample-cap-6",
    title: "Bring graph paper for tutorial",
    subject: "MATHS",
    type: "reminder",
    due: {
      raw: null,
      expr: { kind: "unknown" },
      dateISO: null,
      time: null,
      needsConfirmation: false,
      confirmedByUser: true,
    },
    resources: [
      { label: "Graph sheet", kind: "other", detail: "2mm grid" },
    ],
    notes: "For curve tracing problems.",
    sourceQuote: "Next class graph sheet eduthutu vaanga ellarum.",
    done: false,
    createdAt: "2026-11-09T10:00:00Z",
    updatedAt: "2026-11-09T10:00:00Z",
  },
];

export const DEFAULT_SETTINGS: Settings = {
  version: 1,
  gnani: {
    apiKey: "",
    model: "prisma-v3.0",
    languageHints: ["ta-IN", "en-IN"],
    useContext: true,
  },
  tts: {
    model: "timbre-v3.0",
    voice: "Shivani",
    language: "ta-IN",
    speed: 1.0,
  },
  llm: {
    provider: "gemini",
    apiKey: "",
    model: "gemini-3.8-flash",
  },
  keyterms: ["DBMS", "OS", "Maths", "CN", "Lab Record"],
  maxRecordingSeconds: 180,
  budget: {
    transcribeSecondsPerDay: 300,
    ttsCharsPerDay: 2000,
  },
  rememberKeys: true,
  timezone: "Asia/Kolkata",
};

interface TaskStore {
  tasks: Task[];
  settings: Settings;
  searchQuery: string;
  selectedSubject: string | null;
  viewMode: "board" | "list";
  lastDeletedTask: Task | null;
  undoToastMessage: string | null;
  isSettingsOpen: boolean;
  isCaptureModalOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedSubject: (subject: string | null) => void;
  setViewMode: (mode: "board" | "list") => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsCaptureModalOpen: (open: boolean) => void;
  
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskDone: (id: string) => void;
  confirmTaskDate: (id: string) => void;
  deleteTask: (id: string) => void;
  undoLastAction: () => void;
  clearUndoToast: () => void;
  resetToSampleData: () => void;
  clearAllTasks: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: SAMPLE_TASKS,
      settings: DEFAULT_SETTINGS,
      searchQuery: "",
      selectedSubject: null,
      viewMode: "board",
      lastDeletedTask: null,
      undoToastMessage: null,
      isSettingsOpen: false,
      isCaptureModalOpen: false,

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedSubject: (subject) => set({ selectedSubject: subject }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
      setIsCaptureModalOpen: (open) => set({ isCaptureModalOpen: open }),

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      toggleTaskDone: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        const newDone = !task.done;
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, done: newDone, updatedAt: new Date().toISOString() } : t
          ),
          undoToastMessage: newDone ? `Completed "${task.title}"` : `Marked "${task.title}" active`,
        }));
      },

      confirmTaskDate: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  due: {
                    ...t.due,
                    needsConfirmation: false,
                    confirmedByUser: true,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      deleteTask: (id) => {
        const taskToDelete = get().tasks.find((t) => t.id === id);
        if (!taskToDelete) return;
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          lastDeletedTask: taskToDelete,
          undoToastMessage: `Deleted "${taskToDelete.title}"`,
        }));
      },

      undoLastAction: () => {
        const { lastDeletedTask } = get();
        if (lastDeletedTask) {
          set((state) => ({
            tasks: [lastDeletedTask, ...state.tasks],
            lastDeletedTask: null,
            undoToastMessage: null,
          }));
        }
      },

      clearUndoToast: () => set({ undoToastMessage: null }),

      resetToSampleData: () => set({ tasks: SAMPLE_TASKS }),
      clearAllTasks: () => set({ tasks: [] }),

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
    }),
    {
      name: "solli.tasks.v1",
    }
  )
);

// Categorization helper for urgency columns
export function getUrgencyCategory(task: Task, todayISO: string = "2026-11-09"): UrgencyCategory {
  if (!task.due.dateISO) return "no_date";
  if (task.due.dateISO < todayISO) return "overdue";
  if (task.due.dateISO === todayISO) return "today";
  
  // Compute difference in days
  const today = new Date(todayISO).getTime();
  const dueDate = new Date(task.due.dateISO).getTime();
  const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return "this_week";
  return "later";
}

// Subject color border mapping
export function getSubjectBorderColor(subject: string | null): string {
  if (!subject) return "border-l-ink/40";
  const s = subject.toUpperCase();
  if (s.includes("DBMS")) return "border-l-[#2B4C7E]"; // Navy/Ink blue
  if (s.includes("OS")) return "border-l-[#1E3A8A]"; // Slate Blue
  if (s.includes("MATH")) return "border-l-[#2F7D4F]"; // Green
  if (s.includes("CN")) return "border-l-[#92400E]"; // Warm ochre
  if (s.includes("ADMIN")) return "border-l-[#475569]"; // Slate gray
  return "border-l-vermilion";
}

