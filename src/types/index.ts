export type DueExpr =
  | { kind: "absolute"; day: number; month: number; year?: number }
  | { kind: "weekday"; weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6; modifier: "none" | "this" | "next" }
  | { kind: "relative"; days: number } // tomorrow = 1, day after tomorrow = 2
  | { kind: "unknown" };

export interface TaskResource {
  label: string;
  kind: "chapter" | "book" | "link" | "video" | "other";
  detail: string | null;
}

export type TaskType = "assignment" | "exam" | "submission" | "reading" | "reminder" | "other";

export interface Task {
  id: string; // uuid
  captureId: string;
  title: string;
  subject: string | null;
  type: TaskType;
  due: {
    raw: string | null; // exactly as said or typed
    expr: DueExpr;
    dateISO: string | null; // yyyy-mm-dd
    time: string | null; // HH:mm (24h)
    needsConfirmation: boolean;
    confirmedByUser: boolean;
  };
  resources: TaskResource[];
  notes: string | null;
  sourceQuote: string; // excerpt from transcript or text
  done: boolean;
  createdAt: string; // ISO
  updatedAt: string;
}

export interface Capture {
  id: string;
  source: "voice" | "upload" | "text";
  transcript: string;
  chunkCount: number;
  detectedLanguages: string[];
  createdAt: string;
}

export interface Settings {
  version: 1;
  gnani: {
    apiKey: string;
    model: "prisma-v3.0" | "prisma-v2.5";
    languageHints: string[];
    useContext: boolean;
  };
  tts: {
    model: "timbre-v3.0";
    voice: string;
    language: string;
    speed: number;
  };
  llm: {
    provider: "gemini" | "groq" | "cerebras" | "openrouter";
    apiKey: string;
    model: string;
  };
  llmFallback?: {
    provider: string;
    apiKey: string;
    model: string;
  };
  keyterms: string[];
  maxRecordingSeconds: number;
  budget: {
    transcribeSecondsPerDay?: number;
    ttsCharsPerDay?: number;
  };
  rememberKeys: boolean;
  timezone: string;
}

export type UrgencyCategory = "overdue" | "today" | "this_week" | "later" | "no_date";

