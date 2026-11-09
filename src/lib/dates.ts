import type { DueExpr } from "@/types";

/**
 * Resolves a structured DueExpr into an ISO date string (YYYY-MM-DD)
 * based on a reference date (defaults to current date or 2026-11-09).
 */
export function resolveDueDate(
  expr: DueExpr,
  referenceDateISO: string = new Date().toISOString().split("T")[0]
): {
  dateISO: string | null;
  needsConfirmation: boolean;
} {
  const refDate = new Date(referenceDateISO + "T00:00:00Z");

  switch (expr.kind) {
    case "relative": {
      const d = new Date(refDate);
      d.setUTCDate(d.getUTCDate() + expr.days);
      return {
        dateISO: d.toISOString().split("T")[0],
        needsConfirmation: expr.days < 0, // confirm if in past
      };
    }

    case "absolute": {
      const year = expr.year || refDate.getUTCFullYear();
      const monthStr = expr.month.toString().padStart(2, "0");
      const dayStr = expr.day.toString().padStart(2, "0");
      const targetISO = `${year}-${monthStr}-${dayStr}`;
      
      const targetDate = new Date(targetISO + "T00:00:00Z");
      // If date is in past without year specified, try next year
      if (!expr.year && targetDate < refDate) {
        const nextYearISO = `${year + 1}-${monthStr}-${dayStr}`;
        return {
          dateISO: nextYearISO,
          needsConfirmation: true,
        };
      }

      return {
        dateISO: targetISO,
        needsConfirmation: false,
      };
    }

    case "weekday": {
      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const currentDay = refDate.getUTCDay();
      let diff = expr.weekday - currentDay;

      if (expr.modifier === "next") {
        // Next week occurrence
        diff = diff <= 0 ? diff + 7 : diff + 7;
        const d = new Date(refDate);
        d.setUTCDate(d.getUTCDate() + diff);
        return {
          dateISO: d.toISOString().split("T")[0],
          needsConfirmation: true, // PRD: speakers use "next weekday" ambiguously
        };
      }

      // "none" or "this"
      if (diff <= 0) {
        diff += 7; // next occurrence
      }

      const d = new Date(refDate);
      d.setUTCDate(d.getUTCDate() + diff);
      return {
        dateISO: d.toISOString().split("T")[0],
        needsConfirmation: expr.modifier === "this" && diff > 7,
      };
    }

    case "unknown":
    default:
      return {
        dateISO: null,
        needsConfirmation: false,
      };
  }
}
