# Solli — Screen Map & State Inventory

## 1. Route Map

```
/
├─ Marketing Landing Page (/)
│   ├─ Header (Brand, Navigation, Explore CTA)
│   ├─ Hero (Editorial headline, interactive transcript-to-card preview)
│   ├─ Problem Stories (College, WhatsApp, Freelancing)
│   ├─ Process Steps (Capture → Understand → Organise → Act)
│   ├─ Honest Competitor Comparison Table
│   ├─ Privacy & Bring-Your-Own-Keys Architecture
│   ├─ Pre-Footer Dark Callout Banner
│   └─ Footer (Links, Thanigai Velan attribution, Gnani credits)
│
└─ Application (/board or /app)
    ├─ Desktop Sidebar / Mobile Nav Drawer
    │   ├─ Logo & Brand
    │   ├─ Nav Links (My Board, Ask your list, Usage, Data controls, Settings)
    │   └─ Keyboard shortcut hints
    ├─ Top Capture Header & Bar
    │   ├─ Mode Tabs: Record Voice | Upload Audio | Paste Text
    │   ├─ Record View (Live audio waveform, timer, start/stop/cancel)
    │   ├─ Upload View (Drag-and-drop zone, format validator, chunk split)
    │   └─ Paste Text View (Textarea with 8,000 char counter, instant extract)
    ├─ Board Controls (Search tasks, subject filters, Board / List toggle)
    ├─ Urgency Kanban Columns:
    │   ├─ Overdue (Urgency vermilion badge)
    │   ├─ Today (Accent pill)
    │   ├─ This week (Grouped cards)
    │   ├─ Later (Upcoming tasks)
    │   └─ No date (Tasks with null deadline)
    ├─ Modal / Sheets:
    │   ├─ First-run Welcome & Try Sample Mode
    │   ├─ BYOK API Key Setup Modal (Gnani & LLM keys with test connection)
    │   ├─ Task Detail & Edit Modal (Edit title, subject, date, resources, notes, quote)
    │   ├─ Signature Transcript-to-Card Transition Overlay
    │   └─ Settings & Data Controls (Export/Import JSON, clear data)
```

## 2. State Inventory per Screen

| Screen / Component | States Required |
|---|---|
| **Board View** | Empty (no tasks), Loading skeleton, Active cards, Filtered/No results, List view |
| **Task Card** | Normal, Overdue, Due Today, Unconfirmed Date (dashed border + prompt), Completed (strikethrough + slide out), Source Quote Expanded, Editing |
| **Voice Capture** | Idle, Permission requested, Permission denied (actionable instructions), Recording (live waveform), Stopped/Review, Processing chunks (1 of N progress), Success, Error |
| **Audio Upload** | Idle, File dragging/hover, Validating, Unsupported format warning, Size limit exceeded, Converting to WAV, Transcribing |
| **Text Capture** | Idle, Typing, Whitespace/Empty warning, Extracting tasks, Success |
| **API Key Setup** | Unconfigured, Validating/Testing key, Validated (Success check), Error (Provider-specific 401/402/403/429), Saved |
| **Signature Transition** | Transcript displayed → Token highlighting (blue/vermilion/green) → Shared element lift-off → Settle into column card |

