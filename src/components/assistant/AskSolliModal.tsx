"use client";

import * as React from "react";
import {
  MessageSquare,
  Sparkles,
  Mic,
  Send,
  X,
  Volume2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTaskStore, getUrgencyCategory } from "@/store/useTaskStore";
import { Task } from "@/types";
import { cn } from "@/lib/utils";

export interface AskSolliModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTask?: (task: Task) => void;
}

interface Message {
  id: string;
  sender: "user" | "solli";
  text: string;
  timestamp: string;
  relatedTasks?: Task[];
}

const QUICK_QUESTIONS = [
  "What's due today?",
  "What is due this week?",
  "Any DBMS assignments?",
  "Show overdue tasks",
  "What resources do I need to bring?",
];

export function AskSolliModal({ isOpen, onClose, onEditTask }: AskSolliModalProps) {
  const { tasks, settings } = useTaskStore();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "initial",
      sender: "solli",
      text: "Vanakkam! I'm Solli. Ask me anything about your classroom assignments, deadlines, lab records, or exam dates in English, Tamil, Tanglish, or Hinglish.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [speechTranscript, setSpeechTranscript] = React.useState("");
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = React.useRef<any>(null);

  // Auto-scroll messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  // Local rule-based answerer (100% reliable without any API keys or network)
  const answerLocally = (query: string): { reply: string; matchedTasks: Task[] } => {
    const q = query.toLowerCase().trim();
    const todayISO = new Date().toISOString().split("T")[0];

    // 1. Overdue
    if (q.includes("overdue") || q.includes("late") || q.includes("pending past")) {
      const matched = tasks.filter((t) => getUrgencyCategory(t, todayISO) === "overdue" && !t.done);
      if (matched.length === 0) {
        return { reply: "Great news! You have no overdue tasks on your board right now.", matchedTasks: [] };
      }
      return {
        reply: `You have ${matched.length} overdue task${matched.length > 1 ? "s" : ""}: ${matched.map((m) => `"${m.title}"`).join(", ")}. Please review or submit them soon.`,
        matchedTasks: matched,
      };
    }

    // 2. Today / Innaiku
    if (q.includes("today") || q.includes("innaiku") || q.includes("inru")) {
      const matched = tasks.filter((t) => getUrgencyCategory(t, todayISO) === "today" && !t.done);
      if (matched.length === 0) {
        return { reply: "Nothing on the board scheduled for today! You're all clear.", matchedTasks: [] };
      }
      return {
        reply: `You have ${matched.length} task${matched.length > 1 ? "s" : ""} scheduled for today: ${matched.map((m) => `"${m.title}"`).join(", ")}.`,
        matchedTasks: matched,
      };
    }

    // 3. This week / Week
    if (q.includes("this week") || q.includes("week") || q.includes("varam")) {
      const matched = tasks.filter((t) => getUrgencyCategory(t, todayISO) === "this_week" && !t.done);
      if (matched.length === 0) {
        return { reply: "Nothing on the board due this week.", matchedTasks: [] };
      }
      return {
        reply: `You have ${matched.length} task${matched.length > 1 ? "s" : ""} due this week: ${matched.map((m) => `"${m.title}" (${m.due.raw || m.due.dateISO})`).join(", ")}.`,
        matchedTasks: matched,
      };
    }

    // 4. Tomorrow / Naalaiku / Kal
    if (q.includes("tomorrow") || q.includes("naalaiku") || q.includes("kal")) {
      const matched = tasks.filter((t) => {
        const raw = (t.due.raw || "").toLowerCase();
        return raw.includes("tomorrow") || raw.includes("naalaiku");
      });
      if (matched.length === 0) {
        return { reply: "Nothing on the board marked for tomorrow.", matchedTasks: [] };
      }
      return {
        reply: `Due tomorrow: ${matched.map((m) => `"${m.title}"`).join(", ")}.`,
        matchedTasks: matched,
      };
    }

    // 5. Subject query (DBMS, OS, Maths, Physics, etc.)
    const subjectTokens = ["dbms", "os", "maths", "math", "cn", "ai", "physics", "chemistry", "dsa"];
    for (const sub of subjectTokens) {
      if (q.includes(sub)) {
        const matched = tasks.filter(
          (t) =>
            (t.subject && t.subject.toLowerCase().includes(sub)) ||
            t.title.toLowerCase().includes(sub)
        );
        if (matched.length === 0) {
          return { reply: `Nothing on your board found for ${sub.toUpperCase()}.`, matchedTasks: [] };
        }
        return {
          reply: `Found ${matched.length} task${matched.length > 1 ? "s" : ""} for ${sub.toUpperCase()}: ${matched.map((m) => `"${m.title}" (Due: ${m.due.raw || m.due.dateISO || "No date"})`).join(", ")}.`,
          matchedTasks: matched,
        };
      }
    }

    // 6. Resources / Books / Chapter query
    if (q.includes("resource") || q.includes("bring") || q.includes("chapter") || q.includes("book") || q.includes("manual")) {
      const matched = tasks.filter((t) => t.resources && t.resources.length > 0);
      const allRes = matched.flatMap((m) => m.resources.map((r) => `${r.label} (for ${m.title})`));
      if (allRes.length === 0) {
        return { reply: "No specific resources or textbooks listed on your board right now.", matchedTasks: [] };
      }
      return {
        reply: `Resources noted on your board: ${allRes.slice(0, 5).join(", ")}.`,
        matchedTasks: matched,
      };
    }

    // 7. General search fallback across titles & notes
    const generalMatched = tasks.filter((t) => {
      const words = q.split(" ").filter((w) => w.length > 2);
      return words.some(
        (w) =>
          t.title.toLowerCase().includes(w) ||
          (t.notes && t.notes.toLowerCase().includes(w)) ||
          (t.subject && t.subject.toLowerCase().includes(w))
      );
    });

    if (generalMatched.length > 0) {
      return {
        reply: `Found ${generalMatched.length} relevant task${generalMatched.length > 1 ? "s" : ""}: ${generalMatched.map((m) => `"${m.title}"`).join(", ")}.`,
        matchedTasks: generalMatched,
      };
    }

    return {
      reply: `Nothing on the board for "${query}". You have ${tasks.length} total tasks currently tracked.`,
      matchedTasks: [],
    };
  };

  // Submit Query
  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputText).trim();
    if (!text || isProcessing) return;

    setInputText("");
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    const hasLlmKey = settings.llm.apiKey && settings.llm.apiKey.trim().length > 5;

    if (hasLlmKey) {
      try {
        const boardContext = tasks.map((t) => ({
          title: t.title,
          subject: t.subject,
          type: t.type,
          due: t.due.raw || t.due.dateISO,
          done: t.done,
          resources: t.resources.map((r) => r.label),
          notes: t.notes,
        }));

        const res = await fetch("/api/llm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: settings.llm.provider,
            apiKey: settings.llm.apiKey,
            model: settings.llm.model,
            text: `Student Question: "${text}"\n\nCurrent Board Tasks:\n${JSON.stringify(boardContext, null, 2)}\n\nInstructions: Answer the student's question accurately and concisely using strictly the tasks provided. If there is no relevant task, say 'Nothing on the board for that.' Answer in the same language/mix as the query.`,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          // Extract reply text from completion
          const replyText =
            typeof data === "string"
              ? data
              : data.spokenSummary || data.reply || (data.items ? JSON.stringify(data.items) : null);

          if (replyText) {
            const botMsg: Message = {
              id: `solli-${Date.now()}`,
              sender: "solli",
              text: replyText,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, botMsg]);
            setIsProcessing(false);
            return;
          }
        }
      } catch (err) {
        console.warn("LLM query failed, falling back to local answerer:", err);
      }
    }

    // Local deterministic answer
    const { reply, matchedTasks } = answerLocally(text);
    const botMsg: Message = {
      id: `solli-${Date.now()}`,
      sender: "solli",
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      relatedTasks: matchedTasks,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsProcessing(false);
  };

  // Voice Input via Browser Web Speech
  const toggleListening = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert("Browser speech recognition is not supported in this browser. Please type your question.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = settings.gnani?.languageHints?.[0] || "ta-IN";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSpeechTranscript(transcript);
        if (event.results[0].isFinal) {
          setInputText(transcript);
          handleSend(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
      setIsListening(true);
      setSpeechTranscript("");
    } catch (e) {
      console.warn("Could not start speech recognition:", e);
      setIsListening(false);
    }
  };

  // Text-to-Speech Playback
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl h-[620px] max-h-[90vh] rounded-3xl glass-panel text-ink dark:text-ink-dark overflow-hidden shadow-2xl border border-rule/70 dark:border-rule-dark/70 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rule/60 dark:border-rule-dark/60 flex items-center justify-between shrink-0 bg-paper/60 dark:bg-card-dark/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-vermilion/10 text-vermilion border border-vermilion/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl font-bold">Ask Solli</h2>
                <Badge variant="neutral" className="text-[10px] font-mono">
                  {tasks.length} tasks on board
                </Badge>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                Query deadlines, subjects &amp; resources via voice or text
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-b border-rule/40 dark:border-rule-dark/40 bg-paper/30 dark:bg-card-dark/30 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[11px] font-mono text-ink-muted dark:text-ink-muted-dark whitespace-nowrap">
            Suggestions:
          </span>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs px-2.5 py-1 rounded-full bg-card dark:bg-card-dark border border-rule/70 dark:border-rule-dark/70 text-ink dark:text-ink-dark hover:border-vermilion/40 hover:text-vermilion transition-all whitespace-nowrap cursor-pointer shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                msg.sender === "user"
                  ? "ml-auto bg-ink text-card dark:bg-white dark:text-ink shadow-sm"
                  : "mr-auto bg-card dark:bg-card-dark text-ink dark:text-ink-dark border border-rule/70 dark:border-rule-dark/70 shadow-sm"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] opacity-75 font-mono">
                <span className="font-semibold">{msg.sender === "user" ? "You" : "Solli Assistant"}</span>
                <span>{msg.timestamp}</span>
              </div>

              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Related Task Cards (if any) */}
              {msg.relatedTasks && msg.relatedTasks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-rule/50 dark:border-rule-dark/50 space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
                    Matching Tasks ({msg.relatedTasks.length})
                  </p>
                  <div className="space-y-1.5">
                    {msg.relatedTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onEditTask?.(t);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2 rounded-lg bg-paper/60 dark:bg-paper-dark/20 border border-rule/50 dark:border-rule-dark/50 hover:border-vermilion cursor-pointer transition-all text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              t.done ? "bg-done" : "bg-vermilion"
                            )}
                          />
                          <span className="font-medium truncate">{t.title}</span>
                        </div>
                        <span className="font-mono text-[10px] text-ink-muted shrink-0 ml-2">
                          {t.due.raw || t.due.dateISO || "No date"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speaker read-back for Solli's answers */}
              {msg.sender === "solli" && (
                <div className="mt-2 pt-2 flex items-center justify-end">
                  <button
                    onClick={() => speakText(msg.text)}
                    className="text-[11px] text-ink-muted hover:text-ink dark:hover:text-ink-dark flex items-center gap-1 cursor-pointer transition-colors"
                    title="Read back answer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? "Stop" : "Read aloud"}</span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-card dark:bg-card-dark border border-rule/70 dark:border-rule-dark/70 text-xs text-ink-muted max-w-[50%] mr-auto animate-pulse">
              <Sparkles className="w-4 h-4 text-vermilion animate-spin" />
              <span>Checking your tasks on the board...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Live speech feedback banner */}
        {isListening && (
          <div className="px-4 py-2 bg-vermilion/10 border-t border-vermilion/30 text-xs text-vermilion flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-vermilion animate-ping" />
              <span>Listening to your question... {speechTranscript && `"${speechTranscript}"`}</span>
            </div>
            <button
              onClick={toggleListening}
              className="text-[11px] font-bold uppercase tracking-wider underline cursor-pointer"
            >
              Stop
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-rule/60 dark:border-rule-dark/60 bg-paper/60 dark:bg-card-dark/60 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "p-2.5 rounded-xl transition-all cursor-pointer shrink-0 border",
                isListening
                  ? "bg-vermilion text-white border-vermilion animate-pulse"
                  : "bg-card dark:bg-card-dark border-rule dark:border-rule-dark text-ink-muted hover:text-ink dark:hover:text-ink-dark"
              )}
              title={isListening ? "Listening..." : "Ask by voice"}
              aria-label={isListening ? "Listening..." : "Ask by voice"}
            >
              <Mic className="w-4 h-4" />
            </button>

            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about deadlines, subjects, or tasks... (e.g. 'What is due tomorrow?')"
              className="flex-1 text-xs sm:text-sm h-10"
              disabled={isProcessing}
            />

            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!inputText.trim() || isProcessing}
              className="h-10 px-4 rounded-xl gap-1.5 shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

