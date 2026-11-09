import { Task } from "@/types";

/**
 * Formats a Date or ISO string into iCalendar date format (YYYYMMDDTHHMMSSZ or YYYYMMDD)
 */
function formatICSDate(dateStr?: string | null, timeStr?: string | null): string {
  if (!dateStr) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  const cleanDate = dateStr.replace(/-/g, "");
  if (timeStr && timeStr.includes(":")) {
    const [hours, mins] = timeStr.split(":");
    return `${cleanDate}T${hours.padStart(2, "0")}${mins.padStart(2, "0")}00Z`;
  }

  // Default to 09:00 AM UTC
  return `${cleanDate}T090000Z`;
}

/**
 * Generates an iCalendar (.ics) string for a single Task
 */
export function generateTaskICS(task: Task): string {
  const dtStart = formatICSDate(task.due.dateISO, task.due.time);
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const title = (task.subject ? `[${task.subject}] ` : "") + task.title;
  const description = [
    task.notes ? `Notes: ${task.notes}` : "",
    task.resources?.length ? `Resources: ${task.resources.map((r) => r.label).join(", ")}` : "",
    task.sourceQuote ? `Original Quote: "${task.sourceQuote}"` : "",
  ]
    .filter(Boolean)
    .join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Solli//Campus Notebook Task Board//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${task.id}@solli.app`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `SUMMARY:${title.replace(/[\r\n]+/g, " ")}`,
    `DESCRIPTION:${description.replace(/[\r\n]+/g, " ")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Generates an iCalendar (.ics) string for multiple tasks
 */
export function generateBoardICS(tasks: Task[]): string {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const events = tasks
    .filter((t) => !t.done)
    .map((task) => {
      const dtStart = formatICSDate(task.due.dateISO, task.due.time);
      const title = (task.subject ? `[${task.subject}] ` : "") + task.title;
      const description = [
        task.notes ? `Notes: ${task.notes}` : "",
        task.resources?.length ? `Resources: ${task.resources.map((r) => r.label).join(", ")}` : "",
        task.sourceQuote ? `Original Quote: "${task.sourceQuote}"` : "",
      ]
        .filter(Boolean)
        .join("\\n");

      return [
        "BEGIN:VEVENT",
        `UID:${task.id}@solli.app`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART:${dtStart}`,
        `SUMMARY:${title.replace(/[\r\n]+/g, " ")}`,
        `DESCRIPTION:${description.replace(/[\r\n]+/g, " ")}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Solli//Campus Notebook Task Board//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Triggers a browser download of the .ics file
 */
export function downloadICS(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
