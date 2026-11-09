"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/store/useTaskStore";
import { PROVIDERS, ProviderConfig, sanitizeModel } from "@/lib/providers";
import { ShieldCheck, Key, CheckCircle2, AlertCircle, ExternalLink, Sparkles } from "lucide-react";

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetToSampleData, clearAllTasks } = useTaskStore();

  const [gnaniKey, setGnaniKey] = React.useState(settings.gnani.apiKey);
  const [llmProvider, setLlmProvider] = React.useState<"gemini" | "groq" | "cerebras" | "openrouter">(
    settings.llm.provider as any
  );
  const [llmKey, setLlmKey] = React.useState(settings.llm.apiKey);
  const [llmModel, setLlmModel] = React.useState(
    sanitizeModel(settings.llm.provider, settings.llm.model)
  );
  const [rememberKeys, setRememberKeys] = React.useState(settings.rememberKeys);

  const [gnaniStatus, setGnaniStatus] = React.useState<"idle" | "testing" | "success" | "error">("idle");
  const [gnaniErrorMsg, setGnaniErrorMsg] = React.useState<string | null>(null);
  const [llmStatus, setLlmStatus] = React.useState<"idle" | "testing" | "success" | "error">("idle");
  const [llmErrorMsg, setLlmErrorMsg] = React.useState<string | null>(null);
  const [verifiedModel, setVerifiedModel] = React.useState<string | null>(null);

  const activeProviderConfig: ProviderConfig = PROVIDERS[llmProvider] || PROVIDERS.gemini;

  // Keep state synced when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setGnaniKey(settings.gnani.apiKey);
      setLlmProvider(settings.llm.provider as any);
      setLlmKey(settings.llm.apiKey);
      setLlmModel(sanitizeModel(settings.llm.provider, settings.llm.model));
      setRememberKeys(settings.rememberKeys);
      setGnaniStatus("idle");
      setLlmStatus("idle");
      setGnaniErrorMsg(null);
      setLlmErrorMsg(null);
    }
  }, [isOpen, settings]);

  const handleProviderChange = (newProvider: "gemini" | "groq" | "cerebras" | "openrouter") => {
    setLlmProvider(newProvider);
    const defModel = PROVIDERS[newProvider]?.defaultModel || "gemini-2.0-flash";
    setLlmModel(defModel);
    setLlmStatus("idle");
    setLlmErrorMsg(null);
    setVerifiedModel(null);
  };

  const handleTestGnani = async () => {
    if (!gnaniKey.trim()) {
      setGnaniStatus("error");
      setGnaniErrorMsg("Please enter a Gnani API key");
      return;
    }
    setGnaniStatus("testing");
    setGnaniErrorMsg(null);
    try {
      const res = await fetch("/api/stt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key-id": gnaniKey.trim(),
        },
        body: JSON.stringify({ isTest: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGnaniStatus("success");
      } else {
        setGnaniStatus("error");
        setGnaniErrorMsg(data.error || "Gnani verification failed");
      }
    } catch (e: any) {
      setGnaniStatus("error");
      setGnaniErrorMsg(e?.message || "Failed to connect to Gnani STT proxy");
    }
  };

  const handleTestLlm = async () => {
    if (!llmKey.trim()) {
      setLlmStatus("error");
      setLlmErrorMsg(`Please enter an API key for ${activeProviderConfig.name}`);
      return;
    }
    setLlmStatus("testing");
    setLlmErrorMsg(null);
    setVerifiedModel(null);

    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: llmProvider,
          apiKey: llmKey.trim(),
          model: llmModel,
          isTest: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLlmStatus("success");
        setVerifiedModel(data.model || llmModel);
        if (data.model && data.model !== llmModel) {
          setLlmModel(data.model);
        }
      } else {
        setLlmStatus("error");
        setLlmErrorMsg(data.error || "LLM test call failed");
      }
    } catch (e: any) {
      setLlmStatus("error");
      setLlmErrorMsg(e?.message || "Failed to reach LLM endpoint");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      gnani: {
        ...settings.gnani,
        apiKey: gnaniKey.trim(),
      },
      llm: {
        ...settings.llm,
        provider: llmProvider,
        apiKey: llmKey.trim(),
        model: llmModel,
      },
      rememberKeys,
    });
    onClose();
  };

  const handleForgetAllKeys = () => {
    setGnaniKey("");
    setLlmKey("");
    updateSettings({
      gnani: { ...settings.gnani, apiKey: "" },
      llm: { ...settings.llm, apiKey: "" },
    });
    setGnaniStatus("idle");
    setLlmStatus("idle");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="BYOK — Bring Your Own Keys"
      description="Your keys are stored only in your browser's localStorage and forwarded per request. No server database."
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Privacy Callout */}
        <div className="flex items-start gap-2.5 rounded-xl bg-card dark:bg-card-dark p-3.5 border border-rule/70 dark:border-rule-dark/70 text-xs">
          <ShieldCheck className="w-4 h-4 text-done shrink-0 mt-0.5" />
          <div className="space-y-1 text-ink dark:text-ink-dark">
            <p className="font-semibold">Local-First Zero Cloud Logging Guarantee</p>
            <p className="text-ink-muted dark:text-ink-muted-dark leading-relaxed">
              Solli has no account system and no server database. Your API keys are transmitted directly to the official provider proxies and never saved on our servers.
            </p>
          </div>
        </div>

        {/* 1. LLM Provider Key (Priority for Structured Tasks & Ask) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-vermilion" />
              <span>LLM Provider &amp; Model</span>
            </label>
            <a
              href={activeProviderConfig.consoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-vermilion hover:underline flex items-center gap-1 font-mono"
            >
              <span>Get free key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-mono text-ink-muted dark:text-ink-muted-dark block mb-1">
                Provider
              </label>
              <select
                value={llmProvider}
                onChange={(e) => handleProviderChange(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-rule dark:border-rule-dark bg-card dark:bg-card-dark px-3 text-xs text-ink dark:text-ink-dark focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="gemini">Google AI Studio (Gemini)</option>
                <option value="groq">Groq (Ultra-fast LPU)</option>
                <option value="cerebras">Cerebras</option>
                <option value="openrouter">OpenRouter</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-ink-muted dark:text-ink-muted-dark block mb-1">
                Model ({activeProviderConfig.badge})
              </label>
              <select
                value={llmModel}
                onChange={(e) => {
                  setLlmModel(e.target.value);
                  setLlmStatus("idle");
                  setLlmErrorMsg(null);
                }}
                className="w-full h-9 rounded-lg border border-rule dark:border-rule-dark bg-card dark:bg-card-dark px-3 text-xs font-mono text-ink dark:text-ink-dark focus:outline-none focus:ring-1 focus:ring-ink"
              >
                {activeProviderConfig.models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              type="password"
              placeholder={`Paste your ${activeProviderConfig.name} API Key...`}
              value={llmKey}
              onChange={(e) => {
                setLlmKey(e.target.value);
                setLlmStatus("idle");
                setLlmErrorMsg(null);
              }}
              className="text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestLlm}
              disabled={llmStatus === "testing"}
              className="shrink-0 text-xs px-4"
            >
              {llmStatus === "testing" ? "Testing..." : "Test Connection"}
            </Button>
          </div>

          {llmStatus === "success" && (
            <p className="text-xs text-done flex items-center gap-1 font-medium animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified with {activeProviderConfig.name} ({verifiedModel || llmModel})
            </p>
          )}
          {llmStatus === "error" && (
            <div className="p-2.5 rounded-lg bg-vermilion/10 border border-vermilion/30 text-xs text-vermilion flex items-start gap-1.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold">Connection Failed</p>
                <p className="text-[11px] leading-relaxed break-all">{llmErrorMsg}</p>
                {llmProvider === "groq" && (
                  <p className="text-[11px] text-ink dark:text-ink-dark mt-1 font-sans">
                    Tip: For Groq free tier, select <strong>llama-3.1-8b-instant</strong> for instant verification.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. Gnani Speech Services Key */}
        <div className="space-y-2 pt-2 border-t border-rule/50 dark:border-rule-dark/50">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-vermilion" />
              <span>Gnani API Key (STT &amp; TTS)</span>
            </label>
            <a
              href="https://app.gnani.ai/voice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-vermilion hover:underline flex items-center gap-1 font-mono"
            >
              <span>app.gnani.ai/voice</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Optional for Prisma v3.0 Indic speech recognition. (If blank, Solli automatically uses high-accuracy browser speech recognition &amp; on-device extraction with 0 speech credits).
          </p>

          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Paste Gnani API Key (X-API-Key-ID)..."
              value={gnaniKey}
              onChange={(e) => {
                setGnaniKey(e.target.value);
                setGnaniStatus("idle");
                setGnaniErrorMsg(null);
              }}
              className="text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestGnani}
              disabled={gnaniStatus === "testing"}
              className="shrink-0 text-xs px-4"
            >
              {gnaniStatus === "testing" ? "Testing..." : "Test"}
            </Button>
          </div>

          {gnaniStatus === "success" && (
            <p className="text-xs text-done flex items-center gap-1 font-medium animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Gnani key connected successfully
            </p>
          )}
          {gnaniStatus === "error" && (
            <p className="text-xs text-vermilion flex items-center gap-1 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5" /> {gnaniErrorMsg || "Please enter a valid Gnani key"}
            </p>
          )}
        </div>

        {/* 3. Key Storage Preferences */}
        <div className="pt-2 border-t border-rule/50 dark:border-rule-dark/50">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-ink dark:text-ink-dark">
            <input
              type="checkbox"
              checked={rememberKeys}
              onChange={(e) => setRememberKeys(e.target.checked)}
              className="rounded border-rule text-ink focus:ring-ink"
            />
            <span>Remember API keys in this browser&apos;s localStorage</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-rule/70 dark:border-rule-dark/70">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleForgetAllKeys}
            className="text-xs text-vermilion hover:bg-vermilion/10"
          >
            Clear Keys
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="px-5">
              Save Settings
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
