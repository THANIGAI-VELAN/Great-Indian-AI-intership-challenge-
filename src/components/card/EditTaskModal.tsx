"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskType } from "@/types";
import { useTaskStore } from "@/store/useTaskStore";

export interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTaskModal({ task, isOpen, onClose }: EditTaskModalProps) {
  const updateTask = useTaskStore((state) => state.updateTask);

  const [title, setTitle] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [type, setType] = React.useState<TaskType>("assignment");
  const [dateISO, setDateISO] = React.useState("");
  const [time, setTime] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setSubject(task.subject || "");
      setType(task.type);
      setDateISO(task.due.dateISO || "");
      setTime(task.due.time || "");
      setNotes(task.notes || "");
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask(task.id, {
      title,
      subject: subject.trim() ? subject.trim().toUpperCase() : null,
      type,
      due: {
        ...task.due,
        dateISO: dateISO || null,
        time: time || null,
        needsConfirmation: false,
        confirmedByUser: true,
      },
      notes: notes.trim() || null,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      description="Update assignment details, subject, or deadline."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
            Task Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. DBMS Assignment Chapter 7"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
              Subject
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. DBMS, OS, MATHS"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="flex h-10 w-full rounded-md border border-rule bg-card px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:border-ink focus-visible:ring-1 focus-visible:ring-ink"
            >
              <option value="assignment">Assignment</option>
              <option value="submission">Submission</option>
              <option value="exam">Exam / Quiz</option>
              <option value="reading">Reading</option>
              <option value="reminder">Reminder</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
              Time (Optional)
            </label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
            Notes
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Additional requirements, chapter numbers, teacher instructions..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-rule">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

