# Solli — UI and Design Reference Audit

## 1. Project & Asset Inventory

### 1.1 Repository State
- **Workspace path:** `c:\Users\govin\Documents\AI intership website`
- **Existing application code:** None. No `package.json`, lockfile, or `src/` directory exists in the workspace.
- **Node.js Environment:** Node `v23.1.0`, npm `11.5.2`, Python `3.12.4`.
- **Reference Files Found:**
  1. `Application — My Board@1x.png` (132 KB, 1344 × 960) — Desktop dashboard board reference.
  2. `Marketing site@1x.png` (592 KB, 800 × 2380) — Complete vertical marketing landing page reference.
  3. `SOLLI_PRD.md` — Product Requirements Document (master spec v1.0).
  4. `AGENTS.md` — Agent build instructions and quality rules.

---

## 2. Visual Reference Analysis

### 2.1 Reference 1: `Application — My Board@1x.png`
- **File:** `Application — My Board@1x.png` (Desktop / Tablet view)
- **Screen Represented:** Main application dashboard (`/app` or `/board`) in desktop viewport.
- **Anatomy & Sections:**
  - **Left Sidebar / Navigation:**
    - Logo: "Solli" (editorial serif, Fraunces).
    - Navigation items: "My Board" (active pill), "Ask your list", "Usage", "Data controls", "Settings".
  - **Header Area:**
    - Heading: "Your board." (Fraunces serif) + subhead "Everything important, in one place."
    - Actions: Search input ("Search tasks"), "Filter" outline button, "Board" view toggle.
  - **Capture Bar:**
    - Mode tabs: `[ Record ]` (active black pill), `[ Upload ]`, `[ Paste text ]`.
    - Recording controls: Vermilion round mic button, mono timer (`00:00 / 05:00`), microcopy: *"Tap to record. Text capture never calls Gnani."*
  - **Kanban Urgency Columns:**
    - `OVERDUE · 1`: OS Lab Record (Navy border, `Sat 7 Nov · 2 days ago` vermilion pill, `Sample` badge).
    - `TODAY · 1`: Maths quiz revision (Green border, `Today 4:00 PM` soft red pill, `Sample` badge).
    - `THIS WEEK · 2`:
      - DBMS Assignment (Navy border, `Fri 13 Nov?` dashed vermilion pill, `Sample` badge).
      - CN mini project demo (Olive border, `Thu 12 Nov` beige pill, `Sample` badge).
    - `LATER · 1`: Exam hall ticket notice (Navy border, `Mon 30 Nov` pill, `Sample` badge).
    - `NO DATE · ...`: Bring graph paper (Green border, `No date` pill).
- **Visible Strengths (To Retain):**
  - Warm paper campus aesthetic (`#F6F1E7` background, `#FFFDF8` card surface).
  - Clear, intuitive urgency column hierarchy (Overdue → Today → This week → Later → No date).
  - Subject left-border color accents on cards.
  - Transparent "Sample" labelling on demo cards.
  - Honest microcopy: *"Text capture never calls Gnani."*
  - Prominent unconfirmed date indicator with dashed border (`Fri 13 Nov?`).
- **Problems to Fix (To Redesign):**
  - **Date confirmation affordance:** The prompt *"Sir said Friday. Is that 13 Nov? Confirm · Edit"* floats awkwardly under the card in the column flow, breaking grid rhythm. This must be integrated directly into the card component anatomy.
  - **Capture bar layout:** Excessive empty white space to the right of the mic controls. Lacks live waveform visualization, chunk indicators, and cancel/stop controls.
  - **Card anatomy gaps:** Cards lack interactive completion checkboxes, inline action triggers (edit, delete, inspect source quote), and resource chip styling.
  - **Scroll and overflow behavior:** Hard horizontal scrollbar clipping columns. Board must support smooth scrolling on desktop and responsive swipe/tab navigation on mobile.
  - **Sidebar:** Static appearance, lacks Lucide outline icons, keyboard shortcuts, or responsive collapse to a bottom bar / drawer on mobile.

---

### 2.2 Reference 2: `Marketing site@1x.png`
- **File:** `Marketing site@1x.png` (Desktop page, 800px width preview)
- **Screen Represented:** Full marketing landing page (`/`).
- **Anatomy & Sections:**
  1. **Header / Nav:** Logo `[S] Solli`, menu links (Home, How it works, Why Solli, Features, About), CTA `Explore Product →`.
  2. **Hero Section:**
     - Tagline kicker: `YOUR VOICE NOTES, FINALLY ORGANISED.` (vermilion uppercase).
     - Headline: "Don't listen twice. Get things done." (bold Fraunces serif).
     - Subtitle explaining classroom/client voice note context.
     - Dual CTAs: `[ Explore Solli ]` (primary black button) and `[ See how it works ]` (secondary outline button).
     - Trust footer: "Free for students · Bring your own API keys · Your data stays on your device".
     - Hero UI Preview (right): Visual card showing audio waveform with timer `00:12`, colored transcript highlights (task: blue, date: vermilion, resource: green), and resulting `DBMS Assignment` card.
  3. **Problem Narrative:** "Ever forgotten something important because you didn't write it down?" with 3 authentic scenarios:
     - A · COLLEGE: Professor assignment deadline.
     - B · WHATSAPP: 3-minute voice note with 5 tasks.
     - C · FREELANCING: Client voice note with 10 requirements.
     - Pull statement: "Important information shouldn't disappear inside conversations."
  4. **How It Works (4 Steps):**
     - 01 · CAPTURE: Record, upload, or paste.
     - 02 · UNDERSTAND: Prisma speech recognition + LLM task/deadline/resource extraction.
     - 03 · ORGANISE: Structured, editable task cards.
     - 04 · TAKE ACTION: Confirm deadlines, complete tasks, optional spoken summary.
  5. **Category & Competitor Comparison Table:**
     - Honest, truthful comparison table (WhatsApp transcripts vs Otter/Fireflies vs General todo apps vs Solli).
     - Footnote reminding users to verify current features.
  6. **Privacy & BYOK Architecture:**
     - 3-column breakdown: No account/database; Bring your own Gnani & LLM keys; Frugal credit usage (audio to Gnani, text to LLM, text input uses 0 speech credits).
  7. **Pre-Footer Dark Banner:**
     - Dark charcoal `#171612` background.
     - "Next time someone says something important, just Solli it."
     - CTAs: `[ Explore the product ]` and `[ Try sample mode ]`.
  8. **Footer:**
     - Product description, navigation links, and mandatory author attribution:
     - *"Designed and built by Thanigai Velan."*
     - *"Speech intelligence by Gnani AI — Prisma and Timbre. Built for The Great Indian AI Internship Challenge 2026."*
- **Visible Strengths (To Retain):**
  - High editorial quality, authentic problem statement, strictly truthful copy with no AI buzzwords.
  - Real transcript examples (Tamil/Tanglish: *"Sir sonnaru, DBMS assignment Friday-kulla submit pannanum..."*).
  - Clear BYOK privacy architecture explained upfront.
  - Compelling signature hero interaction preview.
- **Problems to Fix (To Redesign):**
  - Static hero graphic: Should be an interactive preview widget allowing users to click sample audio or transcript phrases and watch cards animate.
  - Mobile responsiveness: 4-step cards and 3-column layouts must stack gracefully without awkward line breaks.
  - Navigation links: All links must navigate to real sections/routes rather than dead anchor tags.
  - Refined typography: Enhance Fraunces display font pairing with crisp Instrument Sans and JetBrains Mono metadata pills.

---

## 3. Prioritized UI Issues & Gaps

### P0 (Must be resolved in initial UI rebuild)
- Establish the complete Next.js + Tailwind + shadcn design token foundation adhering to the campus notebook aesthetic (`#F6F1E7`, `#FFFDF8`, `#1B1A17`, `#D9441F`, `#2F7D4F`, `#2B4C7E`).
- Build responsive app shell with desktop sidebar, mobile bottom capture bar, and mobile sheet.
- Build the 5-column urgency board (Overdue, Today, This week, Later, No date) with board/list view toggle, search, and filters.
- Redesign the task card anatomy so confirmation buttons, source quotes, and resource pills are integrated inside the card container.
- Build the unified 3-mode capture interface (Record, Upload, Paste text) with realistic states (idle, recording, upload validation, processing progress, transcript display).
- Implement the signature transcript-to-card motion with spring physics and `prefers-reduced-motion` support.

### P1 (Polish, Clarity & Trust)
- Interactive hero preview on the marketing landing page.
- Try Sample / Demo Mode route with pre-populated sample cards.
- BYOK settings modal with provider testing, remember toggle, and clear security notices.
- Keyboard navigation shortcuts on the task board (`Enter` toggle done, `E` edit, `Del` delete).
- Empty states with authentic, encouraging microcopy.

### P2 (Refinement)
- Audio read-back waveform animation (Timbre TTS integration state).
- In-tab browser notification reminders and `.ics` calendar export.
- Usage counter meter and daily budget guards.

