# Solli — Product & Design Brief

## 1. Product Identity & Promise
Solli turns a classroom announcement or voice note into a dated, structured to-do board.
A student records what the professor said, pastes a WhatsApp forward, or drops an audio file. Solli extracts tasks, subjects, deadlines, resources, and source quotes from Tamil, Tanglish, Hinglish, or English, and organizes them on an urgency-sorted board.

## 2. Target Audience & Primary Use Case
- **Primary:** Engineering and arts college students (initially Tamil Nadu, expanding across India).
- **Secondary:** Freelancers and small business operators receiving audio requirements via WhatsApp.
- **Friction to eliminate:** Anxiety of forgetting spoken deadlines, chapter numbers, and submission formats buried in class voice notes or forwarded group chats.
- **Key Trust Moments:**
  1. **Honest AI:** Every card can show the exact source quote it originated from.
  2. **Explicit Confirmation:** Ambiguous or uncertain dates (e.g. "Friday", "kal") are clearly flagged with dashed borders and require a single tap to confirm.
  3. **Zero Fabrications:** No links, dates, or resources are ever invented.
  4. **Privacy & Cost:** BYOK (Bring Your Own Keys), 100% browser-local storage, zero server-side database. Text capture never calls the speech API.

## 3. Product Personality & Aesthetic
- **Metaphor:** Campus notebook, student desk journal — not sterile SaaS.
- **Tone:** Direct, plain, warm, trustworthy, student-friendly. No corporate buzzwords ("synergy", "supercharge", "unleash").
- **Visuals:** Warm paper backgrounds, rich ink text, ruled lines, pinned paper cards, vermilion urgency accents, and deliberate, purposeful motion.

## 4. Core Screen Map & Navigation
1. **Marketing Site (`/`):**
   - Editorial hero with live interactive preview.
   - Authentic 3-part problem narrative.
   - 4-step workflow (Capture → Understand → Organise → Act).
   - Category comparison table.
   - BYOK privacy architecture.
   - Dark banner callout + authentic footer with Thanigai Velan attribution.
2. **First-Run & Demo Flow:**
   - Welcome banner / modal.
   - "Try Sample Mode" (instant board exploration with mock data labelled "Sample").
   - "Connect Your Keys" (clear step-by-step setup for Gnani + LLM provider).
3. **Task Board (`/board`):**
   - Top capture bar (Record / Upload / Paste text).
   - Search, subject filter, and Board/List view switcher.
   - 5 Urgency Columns: Overdue, Today, This week, Later, No date.
   - Integrated task cards with deadline pills, resource chips, source expander, and inline date confirmation.
4. **Capture Modal / Bottom Sheet (Mobile):**
   - Live microphone waveform visualization, timer, chunk progress.
   - Drag-and-drop audio file validator (wav, mp3, m4a, aac, ogg, opus).
   - Pasted text area (up to 8,000 chars) with instant offline extraction indication.
5. **Signature Transcript-to-Card Transition:**
   - Transcript view with color-coded token highlights (blue = task, vermilion = deadline, green = resource).
   - Spring physics animation lifting phrases from the transcript into board cards.
6. **Settings & Data Controls:**
   - API key management with connectivity testing.
   - Local data export/import (JSON) and clear data option.
   - Usage meter and budget guard.

## 5. Non-Goals (v1)
- No user accounts or login.
- No server-side database.
- No multi-user boards or cloud sync.
- No third-party trackers or analytics.

