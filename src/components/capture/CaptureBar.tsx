"use client";

import * as React from "react";
import { Mic, Upload, FileText, Square, RotateCcw, Sparkles, Loader2, Volume2, ArrowRight, AlertCircle, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTaskStore } from "@/store/useTaskStore";
import { extractTasks } from "@/lib/extract";
import { Task } from "@/types";
import { cn } from "@/lib/utils";

export interface CaptureBarProps {
  onSignatureTransition?: (sampleTranscript: string, createdTask?: Task) => void;
}

export function CaptureBar({ onSignatureTransition }: CaptureBarProps) {
  const [activeTab, setActiveTab] = React.useState<"record" | "upload" | "text">("record");
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingSeconds, setRecordingSeconds] = React.useState(0);
  const [pastedText, setPastedText] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingStep, setProcessingStep] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [micError, setMicError] = React.useState<string | null>(null);
  const [recordedAudioPrompt, setRecordedAudioPrompt] = React.useState<string | null>(null);
  const [liveSpeechText, setLiveSpeechText] = React.useState("");

  const { settings, addTask, setIsSettingsOpen } = useTaskStore();

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const speechRecognitionRef = React.useRef<any>(null);
  const liveSpeechTextRef = React.useRef<string>("");

  // Recording Timer
  React.useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Real Microphone Capture
  const handleStartRecord = async () => {
    setMicError(null);
    setRecordedAudioPrompt(null);
    setLiveSpeechText("");
    liveSpeechTextRef.current = "";
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError("Microphone access is not supported by your browser. Please use text paste or upload.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await processRecordedAudio(audioBlob);
      };

      // Also start live browser speech recognition if supported
      const SpeechRecognition =
        typeof window !== "undefined" &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = settings.gnani?.languageHints?.[0] || "ta-IN";

          recognition.onresult = (event: any) => {
            let combined = "";
            for (let i = 0; i < event.results.length; i++) {
              combined += event.results[i][0].transcript + " ";
            }
            const clean = combined.trim();
            if (clean) {
              liveSpeechTextRef.current = clean;
              setLiveSpeechText(clean);
            }
          };

          recognition.onerror = (e: any) => {
            console.warn("Browser SpeechRecognition warning:", e);
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (e) {
          console.warn("Could not start Web Speech Recognition:", e);
        }
      }

      mediaRecorder.start(250);
      setIsRecording(true);
    } catch (err: any) {
      console.error("Mic access error:", err);
      setMicError(
        err.name === "NotAllowedError"
          ? "Microphone permission denied. Please allow microphone access in your browser or paste text."
          : `Microphone error: ${err.message || "Could not access audio device."}`
      );
    }
  };

  const handleStopRecord = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCancelRecord = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.abort();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
      setRecordingSeconds(0);
      setLiveSpeechText("");
      liveSpeechTextRef.current = "";
    }
  };

  // Process the actual recorded audio
  const processRecordedAudio = async (blob: Blob) => {
    const hasGnaniKey = settings.gnani.apiKey && settings.gnani.apiKey.trim().length > 5;

    setIsProcessing(true);

    if (hasGnaniKey) {
      setProcessingStep("Transcribing spoken audio via Gnani Prisma v3.0...");
      try {
        const formData = new FormData();
        formData.append("audio_file", blob, "recording.wav");
        formData.append("language_code", settings.gnani.languageHints.join(",") || "ta-IN,en-IN");
        formData.append("model", settings.gnani.model || "prisma-v3.0");
        formData.append("format", "codemix");

        const res = await fetch("/api/stt", {
          method: "POST",
          headers: {
            "x-api-key-id": settings.gnani.apiKey,
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          const transcript = data.transcript || "";
          if (transcript.trim()) {
            await extractAndAddTasks(transcript);
            return;
          }
        }
      } catch (e) {
        console.warn("STT proxy failed:", e);
      }
    }

    // 2. Read liveSpeechTextRef (avoids React closure stale value)
    const recognizedSpeech = (liveSpeechTextRef.current || liveSpeechText).trim();
    if (recognizedSpeech) {
      setProcessingStep("Structuring your spoken words into urgency cards...");
      await extractAndAddTasks(recognizedSpeech);
      liveSpeechTextRef.current = "";
      setLiveSpeechText("");
      return;
    }

    // 3. Fallback: Prompt user with rich actions if silence or unsupported
    setIsProcessing(false);
    setRecordedAudioPrompt(
      "Microphone recorded successfully! What was announced? Choose a quick sample or type below to create your board card:"
    );
  };

  // Extract from text and add to Zustand
  const extractAndAddTasks = async (rawText: string) => {
    setIsProcessing(true);
    setProcessingStep(
      settings.llm.apiKey
        ? `Extracting tasks via ${settings.llm.provider.toUpperCase()}...`
        : "Extracting tasks with on-device parser (0 speech credits)..."
    );

    const { tasks: extractedTasks, source } = await extractTasks(rawText, settings);
    setIsProcessing(false);

    if (extractedTasks.length > 0) {
      for (const t of extractedTasks) {
        addTask({
          captureId: t.captureId,
          title: t.title,
          subject: t.subject,
          type: t.type,
          due: t.due,
          resources: t.resources,
          notes: t.notes,
          sourceQuote: t.sourceQuote,
          done: false,
        });
      }

      onSignatureTransition?.(rawText, extractedTasks[0]);
    } else {
      // Create fallback task directly from user's text
      const fallbackTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
        captureId: `cap-${Date.now()}`,
        title: rawText.slice(0, 60),
        subject: null,
        type: "reminder",
        due: {
          raw: null,
          expr: { kind: "unknown" },
          dateISO: null,
          time: null,
          needsConfirmation: true,
          confirmedByUser: false,
        },
        resources: [],
        notes: rawText,
        sourceQuote: rawText,
        done: false,
      };
      addTask(fallbackTask);
      onSignatureTransition?.(rawText, {
        ...fallbackTask,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    const textToProcess = pastedText.trim();
    setPastedText("");
    await extractAndAddTasks(textToProcess);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;

    const hasGnaniKey = settings.gnani.apiKey && settings.gnani.apiKey.trim().length > 5;
    setIsProcessing(true);

    if (hasGnaniKey) {
      setProcessingStep(`Uploading ${selectedFile.name} to Gnani Prisma...`);
      try {
        const formData = new FormData();
        formData.append("audio_file", selectedFile);
        formData.append("language_code", settings.gnani.languageHints.join(",") || "indic-auto");
        formData.append("model", "prisma-v3.0");
        formData.append("format", "codemix");

        const res = await fetch("/api/stt", {
          method: "POST",
          headers: {
            "x-api-key-id": settings.gnani.apiKey,
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          const transcript = data.transcript || "";
          if (transcript.trim()) {
            setSelectedFile(null);
            await extractAndAddTasks(transcript);
            return;
          }
        }
      } catch (err) {
        console.warn("Upload transcription error:", err);
      }
    }

    // If no Gnani key, extract based on file name or prompt
    setIsProcessing(false);
    await extractAndAddTasks(`Audio Note: ${selectedFile.name.replace(/\.[^/.]+$/, "")}`);
    setSelectedFile(null);
  };

  return (
    <div className="relative rounded-2xl glass-panel p-4 sm:p-5 shadow-paper transition-all">
      {/* Top Tabs */}
      <div className="flex items-center justify-between gap-2 mb-4 border-b border-rule/50 dark:border-rule-dark/50 pb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("record")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "record"
                ? "bg-ink text-card dark:bg-card-dark dark:text-ink-dark shadow-sm"
                : "text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            <Mic className="w-3.5 h-3.5 text-vermilion" />
            <span>Record Voice</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "upload"
                ? "bg-ink text-card dark:bg-card-dark dark:text-ink-dark shadow-sm"
                : "text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Audio Note</span>
          </button>

          <button
            onClick={() => setActiveTab("text")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeTab === "text"
                ? "bg-ink text-card dark:bg-card-dark dark:text-ink-dark shadow-sm"
                : "text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
        </div>

        {/* API Key Status Pill */}
        <div className="flex items-center gap-2">
          {settings.llm.apiKey ? (
            <span className="text-[11px] font-mono text-done flex items-center gap-1 px-2 py-0.5 rounded-full bg-done/10 border border-done/30">
              <Sparkles className="w-3 h-3" />
              {settings.llm.provider.toUpperCase()} Connected
            </span>
          ) : (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-[11px] font-mono text-vermilion hover:underline flex items-center gap-1 px-2 py-0.5 rounded-full bg-vermilion/10 border border-vermilion/30 cursor-pointer"
            >
              <Key className="w-3 h-3" />
              Add API Keys
            </button>
          )}
        </div>
      </div>

      {/* Mic Permission / Device Error Banner */}
      {micError && (
        <div className="mb-3 p-3 rounded-xl bg-vermilion/10 border border-vermilion/30 text-xs text-vermilion flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{micError}</p>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-center animate-in fade-in">
          <Loader2 className="w-6 h-6 animate-spin text-vermilion" />
          <p className="text-sm font-semibold text-ink dark:text-ink-dark">{processingStep}</p>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark font-mono">
            Extracting tasks into urgency board
          </p>
        </div>
      )}

      {/* Manual transcription prompt when no Gnani key */}
      {recordedAudioPrompt && !isProcessing && (
        <div className="mb-3 p-4 rounded-xl bg-highlight-date/60 dark:bg-amber-950/40 border border-dashed border-vermilion/40 space-y-3 animate-in fade-in">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-ink dark:text-ink-dark font-medium leading-relaxed">
              {recordedAudioPrompt}
            </p>
            <button
              type="button"
              onClick={() => setRecordedAudioPrompt(null)}
              className="text-ink-muted hover:text-ink dark:hover:text-ink-dark text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Physics lab record unit 4 submit pannanum tomorrow morning..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-rule bg-card dark:bg-card-dark text-ink dark:text-ink-dark focus:outline-none focus:ring-1 focus:ring-ink"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  const val = e.currentTarget.value;
                  setRecordedAudioPrompt(null);
                  extractAndAddTasks(val);
                }
              }}
            />
            <Button
              size="sm"
              variant="vermilion"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input && input.value.trim()) {
                  const val = input.value;
                  setRecordedAudioPrompt(null);
                  extractAndAddTasks(val);
                }
              }}
            >
              Add Task
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
            <span className="text-ink-muted dark:text-ink-muted-dark">Or click 1-click test announcement:</span>
            {[
              "DBMS Assignment Friday-kulla submit pannanum",
              "Naalaiku morning 9 AM OS lab record submit pannanum",
              "Maths quiz Monday evening 4 PM",
            ].map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setRecordedAudioPrompt(null);
                  extractAndAddTasks(sample);
                }}
                className="px-2 py-0.5 rounded-md bg-paper dark:bg-card-dark border border-rule/60 text-ink dark:text-ink-dark hover:border-vermilion hover:text-vermilion cursor-pointer"
              >
                {sample.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Live Record Voice */}
      {!isProcessing && activeTab === "record" && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {!isRecording ? (
              <button
                onClick={handleStartRecord}
                className="w-12 h-12 rounded-full bg-vermilion text-white flex items-center justify-center hover:bg-vermilion-dark active:scale-95 transition-all shadow-paper cursor-pointer shrink-0"
                title="Tap to record"
                aria-label="Tap to record"
              >
                <Mic className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleStopRecord}
                  className="w-12 h-12 rounded-full bg-ink dark:bg-card-dark text-white flex items-center justify-center hover:bg-ink/90 active:scale-95 transition-all shadow-paper cursor-pointer"
                  title="Stop recording and extract"
                  aria-label="Stop recording and extract"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
                <button
                  onClick={handleCancelRecord}
                  className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-paper transition-all cursor-pointer"
                  title="Cancel"
                  aria-label="Cancel"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-ink dark:text-ink-dark">
                  {formatTimer(recordingSeconds)} / 05:00
                </span>
                {isRecording && (
                  <span className="flex items-center gap-1.5 text-xs text-vermilion font-bold">
                    <span className="w-2 h-2 rounded-full bg-vermilion animate-ping" />
                    Recording live microphone...
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5 font-sans">
                {isRecording
                  ? (liveSpeechText ? (
                      <span className="text-ink dark:text-ink-dark font-medium italic">
                        Heard: &ldquo;{liveSpeechText}&rdquo;
                      </span>
                    ) : (
                      "Speak your announcement in Tamil, Tanglish, Hinglish, or English..."
                    ))
                  : "Tap to record what your professor said. Uses local mic audio."}
              </p>
            </div>
          </div>

          {/* Live Waveform graphic */}
          {isRecording && (
            <div className="flex items-center gap-1 h-8 px-4 py-1 rounded-xl bg-paper dark:bg-card-dark border border-rule/60 dark:border-rule-dark/60">
              {[40, 75, 55, 90, 65, 30, 85, 45, 95, 60, 80, 50, 70, 35].map((height, i) => (
                <span
                  key={i}
                  className="w-1 bg-vermilion rounded-full animate-pulse"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 75}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {!isRecording && (
            <div className="text-right hidden md:block">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPastedText("Sir sonnaru, DBMS assignment Friday-kulla submit pannanum. ER diagram vara venum, chapter 7 refer pannunga.");
                  setActiveTab("text");
                }}
                className="text-xs text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark"
              >
                Insert sample announcement
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Upload Audio Note */}
      {!isProcessing && activeTab === "upload" && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-rule dark:border-rule-dark rounded-xl bg-paper/40 dark:bg-card-dark/40 text-center hover:bg-paper/70 transition-colors"
        >
          <Upload className="w-8 h-8 text-ink-muted mb-2" />
          <p className="text-sm font-semibold text-ink dark:text-ink-dark">
            {selectedFile ? selectedFile.name : "Drag & drop your recorded voice note here"}
          </p>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">
            Accepts WAV, MP3, M4A, AAC, OGG, Opus (WhatsApp). Max 25 MB &amp; 10 mins.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <label className="cursor-pointer">
              <span className="inline-flex items-center justify-center font-medium transition-all h-8 px-3 text-xs rounded-md border border-rule dark:border-rule-dark bg-card dark:bg-card-dark hover:bg-paper text-ink dark:text-ink-dark">
                Browse file
              </span>
              <input
                type="file"
                accept="audio/*,.opus"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </label>

            {selectedFile && (
              <Button size="sm" variant="primary" onClick={handleProcessFile}>
                Process Audio Note
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Paste Text */}
      {!isProcessing && activeTab === "text" && (
        <form onSubmit={handleTextSubmit} className="space-y-3">
          <Textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            maxLength={8000}
            rows={3}
            placeholder="Type or paste your classroom announcement, WhatsApp message, or assignment details here... (e.g. 'Maths assignment chapter 3 due tomorrow morning 10 AM')"
            className="text-sm"
          />
          <div className="flex items-center justify-between text-xs text-ink-muted dark:text-ink-muted-dark flex-wrap gap-2">
            <span className="font-mono">
              {pastedText.length} / 8,000 chars · <strong>Always extracts your exact input</strong>
            </span>
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!pastedText.trim()}
              className="gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Extract &amp; Add to Board</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
