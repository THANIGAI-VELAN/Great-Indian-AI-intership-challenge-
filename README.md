# Great-Indian-AI-intership-challenge-

# Solli — Classroom Announcement to Urgency Task Board

> **Built by Thanigai Velan for The Great Indian AI Internship Challenge 2026**

Solli turns spoken classroom announcements, voice notes, and WhatsApp messages into structured, urgency-sorted task cards on a Kanban board. It supports code-mixed Indic languages (Tamil, Tanglish, Hindi, Hinglish, and English) and operates with a local-first, zero-database architecture.

---

## Key Features

1. **Three Capture Modes**:
   - **Live Voice Recording**: Browser microphone capture with live audio waveform, real-time Web Speech transcription, and optional Gnani Prisma v3.0 STT proxy.
   - **Audio Note Upload**: Drag-and-drop audio files (WAV, MP3, M4A, AAC, OGG, Opus) up to 25 MB.
   - **Pasted Text**: Paste announcements or WhatsApp messages (up to 8,000 characters) with zero speech credits required.

2. **Indic Code-Mixed Dynamic Extraction**:
   - Accurately parses Tamil, Tanglish, Hindi, Hinglish, and English.
   - Resolves temporal expressions (*"naalaiku"*, *"innaiku"*, *"Friday-kulla"*, *"kal"*, *"parso"*, relative weekdays, and absolute dates) into ISO dates.
   - Preserves original spoken quotes and identifies textbook chapters, lab manuals, and diagrams as structured resource chips.

3. **Urgency-Sorted Task Board**:
   - 5 Urgency Columns: **OVERDUE**, **TODAY**, **THIS WEEK**, **LATER**, and **NO DATE**.
   - Dual View Modes: Kanban columns or clean List view.
   - Subject Filtering: Filter tasks by subjects (DBMS, OS, MATHS, PHYSICS, DSA, etc.) or search instantly.

4. **"Ask Solli" AI Assistant (Feature F10)**:
   - Voice and text query interface to ask questions about your tasks (*"What is due tomorrow?"*, *"Any DBMS assignments pending?"*).
   - Hybrid answering: Uses your LLM when configured, or a local deterministic engine with zero keys required.
   - Audio read-back for spoken answers.

5. **Local-First Zero Cloud Logging (BYOK)**:
   - **Bring Your Own Keys**: Keys are stored strictly in your browser's `localStorage` and sent directly to official proxies.
   - **Supported LLM Providers**:
     - Google AI Studio (`gemini-3.8-flash` recommended)
     - Groq LPU (`llama-3.1-8b-instant` recommended, 100% free access)
     - Cerebras (`llama3.1-8b`)
     - OpenRouter (`google/gemini-2.0-flash-001`)
   - **Speech Services**: Gnani Prisma v3.0 (`X-API-Key-ID`).

6. **Calendar Export (.ics) & Audio Read-Back**:
   - One-click `.ics` calendar export per task or for the entire board (compatible with Google Calendar, Apple Calendar, and Outlook).
   - Audio read-back on individual task cards.

7. **Campus Notebook Visual Design**:
   - Distinctive warm paper aesthetic (`#F6F1E7` background, `#FFFDF8` cards, `#1B1A17` rich ink).
   - Light and Dark Theme Switcher with persistent state.
   - Fraunces serif display typography, Instrument Sans UI, and JetBrains Mono metadata.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with `persist` middleware in `localStorage`)
- **Icons**: Lucide Icons
- **Animation**: Motion & CSS Transitions
- **Validation**: Zod
- **Date Handling**: date-fns

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v22/v23)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/THANIGAI-VELAN/Great-Indian-AI-intership-challenge-.git
cd Great-Indian-AI-intership-challenge-

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3005](http://localhost:3005) to view the application:
- **Marketing Landing Page**: `/`
- **Interactive Board**: `/board`

### Building for Production

```bash
npm run build
npm start
```

---

## Verification & Checks

```bash
# Typecheck
npm run typecheck

# Production build
npm run build
```

---

## License & Attribution

Built with care by **Thanigai Velan** for **The Great Indian AI Internship Challenge 2026**.
Speech recognition integrations powered by Gnani.ai.
