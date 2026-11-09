# Solli — Architecture & Design Decisions Log

## Decision 001: Initial Codebase Audit & Project Discovery
- **Date:** 2026-11-09
- **Context:** Inspecting the workspace per Phase 0 of `AGENTS.md`.
- **Finding:** The workspace `C:\Users\govin\Documents\AI intership website` contained no pre-existing application code or `package.json`. It contained only:
  - `SOLLI_PRD.md` (Product Requirements Document)
  - `AGENTS.md` (Build Instructions)
  - `Application — My Board@1x.png` (Dashboard reference)
  - `Marketing site@1x.png` (Marketing landing page reference)
- **Decision:** Scaffolded a fresh Next.js App Router application with strict TypeScript, Tailwind CSS, shadcn/ui primitives, Motion, and Zustand, following the PRD Section 14 specifications.

---

## Decision 002: UI UX Pro Max Skill Installation & Design System Evaluation
- **Date:** 2026-11-09
- **Context:** Installed UI UX Pro Max skill (`npx ui-ux-pro-max-cli@latest init --ai antigravity`) and executed the design system generator script for Solli.
- **Generator Output:**
  - Recommended Style: Flat Design.
  - Palette: Teal (`#0D9488`), Orange accent (`#EA580C`), Light cyan background (`#F0FDFA`).
  - Fonts: Inter / Playfair Display.
- **Evaluation & Conflict:** The generated palette is generic SaaS/Fintech. Section 13 of `SOLLI_PRD.md` and `AGENTS.md` Section 3.1 explicitly establish that Solli's identity is **"campus notebook, not generic SaaS"**.
- **Decision:**
  - **Reject** the teal/cyan/orange color palette and Inter-only font stack.
  - **Uphold** the PRD Section 13 tokens:
    - Background: Warm Paper (`#F6F1E7`)
    - Cards: Pinned Paper Card (`#FFFDF8`)
    - Text: Rich Ink (`#1B1A17`), Muted Ink (`#6B665B`)
    - Accents: Urgency Vermilion (`#D9441F`), Done Green (`#2F7D4F`), Info Ink-Blue (`#2B4C7E`)
    - Display font: Fraunces; UI font: Instrument Sans; Metadata & dates: JetBrains Mono; Tamil: Noto Sans Tamil & Noto Serif Tamil.
  - **Adopt** the UI UX Pro Max structural UX recommendations:
    - Pre-delivery checklist (no emoji as icons, Lucide SVGs, cursor-pointer, 150-300ms transitions, WCAG 4.5:1 contrast, visible focus rings, prefers-reduced-motion, responsive testing across 360px, 390px, 768px, 1024px, 1440px).
    - Hero with interactive product preview and clear conversion flow.

---

## Decision 003: Task Card Confirmation UX Refactoring
- **Date:** 2026-11-09
- **Context:** In `Application — My Board@1x.png`, the unconfirmed date text (*"Sir said Friday. Is that 13 Nov? Confirm · Edit"*) sits as free-floating text beneath the card in the column flow, causing layout irregularities and horizontal scroll issues.
- **Decision:** Integrated the confirmation prompt and action buttons directly into the task card container anatomy with a dashed border state, clear question pill, and inline "Confirm" / "Edit" button triggers.

---

## Decision 004: Google Web Fonts & Dev Server Port
- **Date:** 2026-11-09
- **Context:** `next/font/google` attempts to fetch font binaries at build time, which experiences `ECONNRESET` in isolated or firewalled environments. Additionally, port 3000 was already bound by an existing process.
- **Decision:**
  - Configured Google Web Fonts via HTML `<link>` preconnect in `src/app/layout.tsx` with CSS variable fallbacks in `src/app/globals.css`, ensuring 100% offline/isolated build resilience while rendering Fraunces, Instrument Sans, JetBrains Mono, and Noto Sans Tamil in the browser.
  - Launched the dev server on port `3005` with `outputFileTracingRoot` set to the project root.

---

## Decision 005: Premium Glassmorphic Redesign of Marketing Landing Page & Theme Switcher
- **Date:** 2026-11-09
- **Context:** User requested rebuilding the Marketing Landing page to be significantly more premium, incorporating glassmorphism cards (`glass-panel`, `glass-pill`), subtle ambient glow meshes, dynamic animated components, and a light (Warm Paper) / dark (Night Study) mode toggle.
- **Decision:**
  - Implemented `ThemeToggle.tsx` supporting light/dark theme persistence via `document.documentElement` class `dark` and `localStorage`.
  - Rebuilt `InteractiveHeroPreview.tsx` featuring multi-scenario interactive audio previews (DBMS Tanglish, OS Lab Record Tamil, OS Viva Hinglish) with live audio waveforms, real-time transcript color token highlighting, and interactive task cards.
  - Rebuilt `WorkflowShowcase.tsx` as a 4-step glassmorphic interactive tabbed showcase (Capture, Understand, Organise, Take Action).
  - Maintained Solli's distinct campus notebook essence while elevating visual sophistication with subtle frosted glass blur, radial gradient ambient backdrops, and JetBrains Mono metadata typography.

---

## Decision 006: Dynamic User Input Extraction & Live Speech Recognition
- **Date:** 2026-11-09
- **Context:** Previous prototype placeholder hardcoded new tasks to "DBMS Assignment Chapter 7", ignoring user typed or spoken input.
- **Decision:**
  - Implemented `src/lib/extract.ts` and `src/lib/dates.ts`:
    - Full proxy integration with `/api/llm` (Gemini, Groq, Cerebras, OpenRouter) with real schema validation.
    - Smart client-side heuristic parser when no LLM key is configured: extracts subject, deadline expressions, task type, and resources directly from the user's input string, ensuring the created card reflects their exact text with `sourceQuote`.
  - Upgraded `CaptureBar.tsx`:
    - Real browser microphone recording using `MediaRecorder`.
    - Integrated Web Speech API (`SpeechRecognition`) for zero-configuration live browser speech transcription so spoken voice displays live and is directly parsed into cards.
    - Real multipart proxy to Gnani Prisma v3.0 via `/api/stt` when `settings.gnani.apiKey` is provided.


---

## Decision 007: Provider Model Registry, Fallback Resilience & Groq Resolution
- **Date:** 2026-11-09
- **Context:** Groq API keys returned `404 model_not_found` when requesting `llama-3.3-70b-versatile` due to account tier gating. Cross-provider model mismatch also occurred if a user switched providers while retaining the previous model ID.
- **Decision:**
  - Created `src/lib/providers.ts` establishing verified model registries, default models, and provider console links.
  - Set `llama-3.1-8b-instant` as Groq's primary recommended model (100% accessible across all free accounts).
  - Added automatic fallback in `/api/llm`: if any custom model returns 404, it immediately retries with the provider's verified default model.
  - Added `sanitizeModel` to prevent cross-provider leaks (e.g. sending LLaMA to Gemini or Gemini to Groq).

---

## Decision 008: Feature F10 — "Ask Solli" AI Assistant (Voice & Text with Audio Readback)
- **Date:** 2026-11-09
- **Context:** User requested a dedicated place to ask queries about their to-do list through both text and voice.
- **Decision:**
  - Implemented `AskSolliModal.tsx` accessible via the sidebar and top dashboard header.
  - Supports live microphone questioning via Web Speech API, manual text typing, and quick suggestion chips ("What's due today?", "What is due this week?", "Show DBMS assignments").
  - Hybrid answering:
    - If LLM key is configured: queries `/api/llm` with the board's real task context JSON.
    - If no key/offline: intelligent deterministic local answerer that matches urgency categories, subjects, and dates, answering "Nothing on the board for that" if no match exists.
  - Speech readback via browser SpeechSynthesis.


---

## Decision 009: Google AI Studio Model Migration to `gemini-3.8-flash`
- **Date:** 2026-11-09
- **Context:** Google AI Studio returned `404 NOT_FOUND` indicating `models/gemini-2.0-flash` is retired and instructing callers to use `models/gemini-3.8-flash`.
- **Decision:**
  - Migrated primary Google AI Studio model to `gemini-3.8-flash` across `src/lib/providers.ts`, `src/store/useTaskStore.ts`, and `SettingsModal.tsx`.
  - Added automatic model sanitization and auto-recovery in `/api/llm`: any legacy requests referencing `gemini-2.0-flash` or receiving Google's upgrade suggestion are automatically rewritten to `gemini-3.8-flash`.
