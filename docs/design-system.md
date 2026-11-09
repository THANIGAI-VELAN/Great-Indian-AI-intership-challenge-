# Solli — Design System Specification

> Single source of truth for design tokens, typography, card anatomy, and visual guidelines.
> Visual Identity: **Campus Notebook, not generic SaaS.**

---

## 1. Color Tokens

### 1.1 Light Theme (Campus Notebook Paper)

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| **Warm Paper** | `--color-paper` | `#F6F1E7` | Primary page background |
| **Card Surface** | `--color-card` | `#FFFDF8` | Pinned task cards, modals, capture bar |
| **Rich Ink** | `--color-ink` | `#1B1A17` | Primary headings, prominent body text |
| **Muted Ink** | `--color-ink-muted` | `#6B665B` | Subheadings, labels, secondary metadata |
| **Notebook Rule** | `--color-rule` | `#D9D1C0` | Dividers, card borders, column rules |
| **Urgency Vermilion** | `--color-vermilion` | `#D9441F` | Overdue cards, urgent deadlines, record button |
| **Done Green** | `--color-done` | `#2F7D4F` | Completed state, checked items, resource highlight |
| **Info Ink-Blue** | `--color-info` | `#2B4C7E` | Informational chips, task phrase highlights |
| **Highlight Task** | `--color-highlight-task` | `#DBEAFE` / `#2B4C7E` | Blue highlight for task phrases in transcript |
| **Highlight Date** | `--color-highlight-date` | `#FFEDD5` / `#D9441F` | Vermilion highlight for dates in transcript |
| **Highlight Resource**| `--color-highlight-res` | `#DCFCE7` / `#2F7D4F` | Green highlight for resources in transcript |

### 1.2 Dark Theme (Night Study)

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| **Charcoal Paper** | `--color-paper-dark` | `#171612` | Dark background |
| **Card Surface** | `--color-card-dark` | `#1F1E19` | Dark card surface |
| **Light Ink** | `--color-ink-dark` | `#F6F1E7` | Dark primary text |
| **Muted Ink** | `--color-ink-muted-dark` | `#A8A296` | Dark secondary text |
| **Rule Dark** | `--color-rule-dark` | `#33312B` | Dark border rule |

---

## 2. Typography

| Role | Font Family | Fallback | Usage |
|---|---|---|---|
| **Display / Headings** | Fraunces, Noto Serif Tamil | Georgia, serif | Page titles, hero headlines, card titles |
| **UI Body / Controls** | Instrument Sans, Noto Sans Tamil | Inter, system-ui, sans-serif | Button labels, inputs, navigation, body copy |
| **Metadata / Code / Numbers** | JetBrains Mono | monospace | Timers, dates (`Fri 13 Nov`), counters, API keys |
| **Tamil Text Support** | Noto Sans Tamil, Noto Serif Tamil | sans-serif / serif | Tanglish/Tamil scripts, ensuring correct rendering |

---

## 3. Spacing & Elevation

- **Scale:** 4px baseline (`0.25rem` = 4px, `0.5rem` = 8px, `0.75rem` = 12px, `1rem` = 16px, `1.5rem` = 24px, `2rem` = 32px, `3rem` = 48px).
- **Radius System:**
  - `rounded-sm`: 4px (badges, tiny tags)
  - `rounded-md`: 8px (buttons, input fields, deadline pills)
  - `rounded-lg`: 12px (task cards, capture container)
  - `rounded-xl`: 16px (dialog modals, sheets)
  - `rounded-full`: 9999px (record button, circular counters)
- **Shadows:** Soft paper elevation with warm ambient occlusion:
  - `shadow-paper`: `0 1px 3px rgba(27, 26, 23, 0.06), 0 1px 2px rgba(27, 26, 23, 0.04)`
  - `shadow-paper-hover`: `0 4px 12px rgba(27, 26, 23, 0.08), 0 2px 4px rgba(27, 26, 23, 0.04)`

---

## 4. Task Card Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ▌ TITLE IN FRAUNCES SERIF                   [X] Checkbox    │
│ ▌ SUBJECT · TYPE (e.g., DBMS · ASSIGNMENT)                  │
│                                                             │
│ [ Deadline Pill in Mono ]   [ Relative: "in 2 days" ]       │
│                                                             │
│ [ Resource Chip 1 ]   [ Resource Chip 2 ]                   │
│                                                             │
│ ▾ From: "Sir said DBMS assignment Friday-kulla submit..."   │
│                                                             │
│ ┌─ (If unconfirmed date) ─────────────────────────────────┐ │
│ │ ❓ Sir said Friday. Is that 13 Nov?  [Confirm]  [Edit]   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- **Subject Left Border:** 3px solid color line on card left edge.
- **Unconfirmed Date:** Dashed border vermilion pill + inline question block.
- **Checkbox:** Circular check on top right. Completing draws strikethrough across title before exiting.

---

## 5. Motion Rules

- **Transcript-to-Card Transition:** Shared layout ID spring animation (stiffness: 260, damping: 26, stagger: 60ms).
- **Urgency Pulse:** Only for tasks due within ≤ 24 hours (2.4s cycle, max 4% opacity pulse).
- **Completion:** 200ms strikethrough SVG draw, followed by card slide-out and 5-second undo toast.
- **Respect `prefers-reduced-motion`:** Instant fade-in (150ms opacity), no spatial shifts.

