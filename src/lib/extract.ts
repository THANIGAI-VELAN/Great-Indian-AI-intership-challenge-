import type { Task, Settings, TaskType, DueExpr } from "@/types";
import { resolveDueDate } from "@/lib/dates";

/**
 * Smart Client-side Heuristic Parser
 * When no LLM API key is provided, extracts tasks dynamically from the user's actual text
 * instead of returning a hardcoded dummy task.
 */
export function extractHeuristic(text: string, keyterms: string[] = []): Task[] {
  const cleanText = text.trim();
  if (!cleanText) return [];

  // Split into sentences or lines
  const lines = cleanText
    .split(/\n|\. |\? |! /)
    .map((s) => s.trim())
    .filter(Boolean);

  const primaryLine = lines[0] || cleanText;

  // 1. Detect Subject
  let detectedSubject: string | null = null;
  const commonSubjects = [
    "DBMS", "OS", "MATHS", "MATH", "CN", "AI", "ML", "WEB", "DEV",
    "PHYSICS", "CHEMISTRY", "ENGLISH", "TAMIL", "CIRCUITS", "DSA", "DATA STRUCTURES"
  ];
  const allSubjectCandidates = [...keyterms.map(k => k.toUpperCase()), ...commonSubjects];

  for (const sub of allSubjectCandidates) {
    const regex = new RegExp(`\\b${sub}\\b`, "i");
    if (regex.test(cleanText)) {
      detectedSubject = sub;
      break;
    }
  }

  // 2. Detect Type
  let detectedType: TaskType = "assignment";
  const lowerText = cleanText.toLowerCase();
  if (lowerText.includes("lab") || lowerText.includes("record") || lowerText.includes("submit") || lowerText.includes("submission")) {
    detectedType = "submission";
  } else if (lowerText.includes("exam") || lowerText.includes("quiz") || lowerText.includes("test") || lowerText.includes("viva")) {
    detectedType = "exam";
  } else if (lowerText.includes("read") || lowerText.includes("chapter") || lowerText.includes("book")) {
    detectedType = "reading";
  } else if (lowerText.includes("reminder") || lowerText.includes("remember") || lowerText.includes("bring")) {
    detectedType = "reminder";
  }

  // 3. Detect Due Date / Temporal expressions
  let rawDate: string | null = null;
  let expr: DueExpr = { kind: "unknown" };
  let detectedTime: string | null = null;

  // Time detection (e.g. "9 AM", "4:00 PM", "9 mani-ku")
  const timeMatch = cleanText.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))|(\d{1,2}\s*mani-ku)/i);
  if (timeMatch) {
    detectedTime = timeMatch[0];
  }

  // Weekdays
  const weekdays = [
    { name: "sunday", num: 0 },
    { name: "monday", num: 1 },
    { name: "tuesday", num: 2 },
    { name: "wednesday", num: 3 },
    { name: "thursday", num: 4 },
    { name: "friday", num: 5 },
    { name: "saturday", num: 6 },
  ];

  for (const wd of weekdays) {
    if (lowerText.includes(wd.name) || lowerText.includes(wd.name + "-kulla")) {
      rawDate = wd.name.charAt(0).toUpperCase() + wd.name.slice(1);
      const isNext = lowerText.includes("next " + wd.name);
      expr = {
        kind: "weekday",
        weekday: wd.num as any,
        modifier: isNext ? "next" : "this",
      };
      break;
    }
  }

  // Relative dates (tomorrow / naalaiku / innaiku / kal / parso)
  if (expr.kind === "unknown") {
    if (lowerText.includes("tomorrow") || lowerText.includes("naalaiku") || lowerText.includes("naalaikku") || lowerText.includes("kal")) {
      rawDate = "Tomorrow";
      expr = { kind: "relative", days: 1 };
    } else if (lowerText.includes("today") || lowerText.includes("innaiku") || lowerText.includes("inru")) {
      rawDate = "Today";
      expr = { kind: "relative", days: 0 };
    } else if (lowerText.includes("day after tomorrow") || lowerText.includes("parso") || lowerText.includes("naalai marunaal")) {
      rawDate = "Day after tomorrow";
      expr = { kind: "relative", days: 2 };
    }
  }

  // 4. Detect Resources (chapter X, ER diagram, lab manual, link)
  const resources: Array<{ label: string; kind: "chapter" | "book" | "link" | "video" | "other"; detail: string | null }> = [];
  const chapterMatch = cleanText.match(/chapter\s*\d+|unit\s*\d+/i);
  if (chapterMatch) {
    resources.push({ label: chapterMatch[0], kind: "chapter", detail: null });
  }
  if (lowerText.includes("diagram") || lowerText.includes("er diagram")) {
    resources.push({ label: "ER Diagram", kind: "other", detail: "Draw neatly" });
  }
  if (lowerText.includes("record") || lowerText.includes("manual")) {
    resources.push({ label: "Lab Manual", kind: "book", detail: null });
  }

  // Compute resolved ISO date
  const { dateISO, needsConfirmation } = resolveDueDate(expr);

  // Generate Title from the user's actual text
  let generatedTitle = primaryLine.slice(0, 60);
  if (generatedTitle.length < primaryLine.length) {
    generatedTitle += "...";
  }

  const task: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    captureId: `cap-${Date.now()}`,
    title: generatedTitle,
    subject: detectedSubject,
    type: detectedType,
    due: {
      raw: rawDate,
      expr,
      dateISO,
      time: detectedTime,
      needsConfirmation: needsConfirmation || expr.kind === "unknown",
      confirmedByUser: false,
    },
    resources,
    notes: lines.length > 1 ? lines.slice(1).join(" ") : null,
    sourceQuote: cleanText,
    done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return [task];
}

/**
 * Main Extraction Controller
 * Uses LLM if key is configured, otherwise gracefully falls back to client-side heuristic.
 */
export async function extractTasks(
  text: string,
  settings: Settings
): Promise<{ tasks: Task[]; source: "llm" | "heuristic" }> {
  // If LLM key is configured, call /api/llm
  if (settings.llm.apiKey && settings.llm.apiKey.trim().length > 5) {
    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: settings.llm.provider,
          apiKey: settings.llm.apiKey,
          model: settings.llm.model,
          text,
          todayISO: new Date().toISOString().split("T")[0],
          keyterms: settings.keyterms,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          const tasks: Task[] = data.items.map((item: any) => {
            const dueExpr: DueExpr = item.due?.expr || { kind: "unknown" };
            const { dateISO, needsConfirmation } = resolveDueDate(dueExpr);

            return {
              id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              captureId: `cap-llm-${Date.now()}`,
              title: item.title || "Assignment",
              subject: item.subject ? item.subject.toUpperCase() : null,
              type: item.type || "assignment",
              due: {
                raw: item.due?.raw || null,
                expr: dueExpr,
                dateISO,
                time: item.due?.time || null,
                needsConfirmation: needsConfirmation || !!item.due?.needsConfirmation,
                confirmedByUser: false,
              },
              resources: item.resources || [],
              notes: item.notes || null,
              sourceQuote: item.sourceQuote || text,
              done: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });

          return { tasks, source: "llm" };
        }
      }
    } catch (err) {
      console.warn("LLM API call failed, falling back to heuristic extraction:", err);
    }
  }

  // Graceful fallback to dynamic heuristic extraction based on user's actual text
  const heuristicTasks = extractHeuristic(text, settings.keyterms);
  return { tasks: heuristicTasks, source: "heuristic" };
}
