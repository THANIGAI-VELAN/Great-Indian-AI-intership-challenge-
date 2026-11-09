export interface ProviderConfig {
  id: "gemini" | "groq" | "cerebras" | "openrouter";
  name: string;
  badge: string;
  defaultModel: string;
  models: Array<{ id: string; label: string; recommended?: boolean }>;
  consoleUrl: string;
  endpoint: string;
  note: string;
}

export const PROVIDERS: Record<string, ProviderConfig> = {
  gemini: {
    id: "gemini",
    name: "Google AI Studio (Gemini)",
    badge: "Official & Recommended",
    defaultModel: "gemini-3.8-flash",
    models: [
      { id: "gemini-3.8-flash", label: "gemini-3.8-flash (Latest Official & Recommended)", recommended: true },
      { id: "gemini-2.5-flash", label: "gemini-2.5-flash (Fast Flash)" },
      { id: "gemini-1.5-flash", label: "gemini-1.5-flash (Standard legacy)" },
      { id: "gemini-1.5-pro", label: "gemini-1.5-pro (Deep reasoning)" },
    ],
    consoleUrl: "https://aistudio.google.com/apikey",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    note: "Free keys from Google AI Studio. Excellent Tamil, Tanglish, and structured JSON accuracy.",
  },
  groq: {
    id: "groq",
    name: "Groq LPU",
    badge: "Ultra-Fast (100% Free)",
    defaultModel: "llama-3.1-8b-instant",
    models: [
      { id: "llama-3.1-8b-instant", label: "llama-3.1-8b-instant (Fastest & 100% Free Access)", recommended: true },
      { id: "llama-3.3-70b-versatile", label: "llama-3.3-70b-versatile (Large reasoning)" },
      { id: "mixtral-8x7b-32768", label: "mixtral-8x7b-32768 (MoE model)" },
      { id: "gemma2-9b-it", label: "gemma2-9b-it (Google Gemma on Groq)" },
    ],
    consoleUrl: "https://console.groq.com/keys",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    note: "Free API keys without credit card. Note: llama-3.1-8b-instant is guaranteed on all free accounts.",
  },
  cerebras: {
    id: "cerebras",
    name: "Cerebras Inference",
    badge: "Fast Wafer-scale",
    defaultModel: "llama3.1-8b",
    models: [
      { id: "llama3.1-8b", label: "llama3.1-8b (Recommended)", recommended: true },
      { id: "llama3.3-70b", label: "llama3.3-70b" },
    ],
    consoleUrl: "https://cloud.cerebras.ai/",
    endpoint: "https://api.cerebras.ai/v1/chat/completions",
    note: "Free tier with 1M tokens per day.",
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    badge: "Multi-Model Gateway",
    defaultModel: "google/gemini-2.0-flash-001",
    models: [
      { id: "google/gemini-2.0-flash-001", label: "google/gemini-2.0-flash-001 (Recommended)", recommended: true },
      { id: "meta-llama/llama-3.1-8b-instruct:free", label: "meta-llama/llama-3.1-8b-instruct:free" },
    ],
    consoleUrl: "https://openrouter.ai/keys",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    note: "Access multiple AI providers via a unified key.",
  },
};

/**
 * Sanitizes and validates a model ID for a given provider,
 * ensuring no cross-provider model mismatches or deprecated models.
 */
export function sanitizeModel(provider: string, model?: string): string {
  const p = PROVIDERS[provider] || PROVIDERS.gemini;
  if (!model || !model.trim()) return p.defaultModel;

  const m = model.trim();

  // If user selected Gemini
  if (provider === "gemini") {
    // If deprecated gemini-2.0-flash was saved or a LLaMA model
    if (m === "gemini-2.0-flash" || m === "models/gemini-2.0-flash" || m.toLowerCase().includes("llama")) {
      return "gemini-3.8-flash";
    }
  }

  // If user selected Groq/Cerebras but has a Gemini model
  if ((provider === "groq" || provider === "cerebras") && m.toLowerCase().includes("gemini")) {
    return p.defaultModel;
  }

  return m;
}
