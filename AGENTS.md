# SOLLI — Agent Build Instructions

> **Mission:** Rebuild Solli's complete user interface to a polished, distinctive, production-quality standard, using the existing project as a reference, while treating `SOLLI_PRD.md` as the product source of truth.
>
> **Priority order:** 1) inspect the project and references, 2) redesign and implement the UI, 3) verify the UI visually and functionally, 4) connect/finish product logic in the PRD's milestone order.
>
> **Do not start by building backend features. Do not start coding before reading the PRD and auditing the existing UI.**

---

## 0. Non-negotiable operating rules

1. Read **all of `SOLLI_PRD.md`** before making changes. Do not rely on summaries or memory.
2. Inspect the repository, current app, screenshots/images, assets, routes, components, package scripts, and existing implementation before deciding what to replace.
3. Treat the existing design as a **reference and source of evidence**, not as a design to copy blindly. Preserve useful product ideas and working behavior; redesign weak hierarchy, layout, spacing, typography, visual identity, interactions, and responsive behavior.
4. Build in small, reviewable milestones. Finish and verify one milestone before moving to the next.
5. **UI-first is the immediate priority.** First establish the design direction, tokens, page structure, responsive layouts, reusable components, realistic states, and key interactions. Do not spend the first phase on API integrations, database work, authentication, or unrelated backend refactoring.
6. The PRD is authoritative for product behavior, data, privacy, API details, and scope. This file is authoritative for the agent's workflow and quality bar. If they conflict, do not silently guess: document the conflict in `docs/decisions.md` and follow the PRD for product truth.
7. Do not invent product capabilities, API endpoints, API parameters, model IDs, voice IDs, integrations, pricing, usage statistics, testimonials, customer logos, or performance claims.
8. Do not remove a working feature merely because replacing it is easier. Audit it, preserve or improve it, and record material changes.
9. Do not claim a feature works until it has been exercised in the browser and its relevant checks pass.
10. Keep secrets out of source control, screenshots, console logs, generated documentation, and client-visible error messages.
11. After every milestone run the available lint, typecheck, tests, and build checks. Fix failures before continuing.
12. Keep `docs/decisions.md`, `docs/design-system.md`, and `docs/ui-audit.md` current.
13. If a reference file mentioned by the user is missing or inaccessible, report its exact missing path and ask for it. Never pretend to have inspected it.
14. Do not install tools globally or execute unfamiliar install scripts without checking the package/repository, the install target, and the current agent environment. Prefer project-local, reversible setup.
15. Work autonomously on clear implementation tasks. Ask a question only when a genuine blocker or a consequential product/design decision cannot be resolved from the PRD and references.

---

## 1. Phase 0 — repository and reference audit (mandatory, before code changes)

### 1.1 Discover the actual project

- Print and inspect the project tree (exclude `node_modules`, `.next`, build output, caches, and large generated folders).
- Identify the framework, package manager, scripts, dependencies, app entry points, route structure, styling system, component library, icon library, fonts, animation library, state management, and test setup.
- Read `package.json`, lockfile, framework config, Tailwind config, global styles, root layouts, route files, and any existing agent instructions (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, `.windsurfrules`, etc.).
- Run the current app before changing it. Record how to run it and any existing errors.
- Identify which existing components and flows are functional versus static placeholders.

### 1.2 Find and inspect the user's current design references

Search the project and its parent/workspace directories for:
- PNG, JPG, JPEG, WEBP, SVG, GIF, MP4, PDF design references;
- exported Figma assets or screenshots;
- current landing-page and dashboard code;
- existing prototypes, design notes, and README files.

Create an inventory in `docs/ui-audit.md` with:
- file path and type;
- what screen/section/state it represents;
- visible strengths worth retaining;
- problems to fix;
- whether the reference is desktop, tablet, or mobile;
- any uncertainty (for example, a cropped screenshot or missing interaction state).

Open and visually inspect every relevant image. Do not infer the image's content from its filename. Compare screenshots with the live app at the same viewport where possible. Inspect the actual source code behind the referenced UI; do not judge only from screenshots.

**If the user's images/code are not present in the active project:** search the accessible workspace once, list what was actually found, then stop and ask the user to provide the correct folder/repository path or attach the missing files. Do not invent an analysis of assets you cannot see. Continue only with tasks that can safely be completed from the PRD if the missing references are not a blocker.

### 1.3 Produce a baseline audit

In `docs/ui-audit.md`, document:
- current route/page inventory;
- current component inventory;
- visual consistency issues;
- UX and navigation issues;
- responsive issues;
- accessibility issues;
- interaction gaps;
- performance risks;
- existing behavior that must not regress;
- screenshots captured at 360px, 390px, 768px, 1024px, 1440px (and 1920px if useful).

End the audit with a prioritized list:
- P0: blocks use, breaks core flow, or makes UI unusable;
- P1: materially damages clarity, polish, trust, or responsive behavior;
- P2: refinement that can follow.

Do not rewrite everything before completing this audit.

---

## 2. Phase 1 — understand Solli before designing

Read the full PRD, especially:
- Sections 1–7: product promise, problem, users, goals, principles, features, and user flows;
- Sections 8–12: data model, architecture, APIs, extraction, error cases;
- Section 13: design system, visual direction, card anatomy, motion, copy, accessibility;
- Sections 14–15: technology, security, and privacy;
- Section 16: official build order;
- Sections 17–20: testing, release, and agent tooling.

Write a concise product/design brief in `docs/design-brief.md`:
- user and primary use case;
- core user journey;
- user anxiety/friction to remove;
- key trust moments;
- core screens and states;
- product personality;
- visual principles;
- PRD constraints and non-goals;
- unresolved questions.

### Product truth — do not dilute it

Solli turns a classroom announcement into a to-do board. It accepts:
1. live voice recording;
2. an uploaded recorded voice note;
3. pasted text.

It extracts structured tasks, subjects, deadlines, resources, notes, and source quotes from Tamil, Tanglish, Hinglish, and English. It displays tasks in urgency-based columns and lets the user review, edit, confirm, and complete them.

Important:
- Text input runs extraction only; it must **never** call speech-to-text.
- The product is local-first and has no account/database in v1.
- Users bring their own Gnani speech key and LLM key.
- Demo content must be labelled **Sample**.
- Uncertain dates must be visibly marked and confirmed by the user.
- No task, date, resource, URL, or fact may be fabricated.
- Do not present P1/P2 features as shipped if they are not implemented.

---

## 3. Phase 2 — design direction and system before page implementation

### 3.1 Solli's established visual identity

The PRD's direction is **campus notebook, not generic SaaS**. Keep this recognizable even when adding premium motion and polish.

Use the PRD's design tokens as the starting source of truth:

| Token | Value |
|---|---|
| Warm paper | `#F6F1E7` |
| Card | `#FFFDF8` |
| Ink | `#1B1A17` |
| Muted ink | `#6B665B` |
| Rule | `#D9D1C0` |
| Urgency vermilion | `#D9441F` |
| Done green | `#2F7D4F` |
| Info ink-blue | `#2B4C7E` |
| Dark background | `#171612` |
| Dark surface | `#1F1E19` |

Typography:
- Display: Fraunces.
- UI: Instrument Sans or Geist.
- Dates and technical metadata: JetBrains Mono.
- Tamil: Noto Sans Tamil or Noto Serif Tamil.
- Confirm that Tamil glyphs render correctly in every font fallback and weight.
- Avoid using one font for every role.

Use CSS variables/design tokens for color, spacing, radius, shadows, type scale, borders, motion durations, and z-index. Components must consume tokens rather than scattering arbitrary values throughout the code.

### 3.2 Design the actual product, not a Dribbble concept

Create a coherent system for:
- marketing site;
- first-run welcome/demo entry;
- key setup;
- main task board;
- capture interface;
- recording and processing states;
- transcript review;
- task cards and task details;
- date confirmation;
- edit, complete, delete, and undo;
- settings and data controls;
- responsive navigation and mobile capture sheet;
- empty, loading, error, permission-denied, offline, and success states.

The marketing website and application dashboard are distinct experiences but must share the same brand system.

### 3.3 Required design deliverables before full build

Create:
- `docs/design-system.md` — tokens, type, spacing, grids, radii, elevation, icon rules, component rules, and motion;
- `docs/design-brief.md` — product and visual brief;
- `docs/ui-audit.md` — analysis of existing UI and references;
- `docs/screen-map.md` — route/screen/state inventory and navigation map.

Generate a design-system proposal using UI UX Pro Max after installation. Compare it with the PRD. Do not let a skill overwrite the PRD's established identity. If a generated recommendation conflicts with the campus-notebook visual direction, reject it and explain why.

Before implementing all pages, build a small high-quality visual slice:
1. navigation/header;
2. typography and color system;
3. primary button and input;
4. one realistic task card;
5. one dashboard/board section;
6. the transcript-to-card transition prototype.

Review this slice in the browser at desktop and mobile sizes. Lock the tokens only after the slice is coherent.

---

## 4. Phase 3 — rebuild the UI in deliberate milestones

### Milestone UI-0 — design foundations

- Add/clean global tokens and typography.
- Establish layout primitives, responsive containers, spacing scale, border/radius/shadow rules.
- Establish button, input, textarea, chip, badge, tooltip, dialog, drawer/sheet, toast, tabs, and navigation patterns.
- Use accessible primitives (Radix/shadcn where compatible) and restyle them to Solli.
- Define icon rules. Prefer a consistent outline icon set such as Lucide; use icons with labels where clarity matters.
- Avoid emoji as interface icons.
- Verify focus, hover, pressed, disabled, loading, and error states.

**Exit criteria:** design tokens are documented; Tamil text is verified; primitives look coherent; no generic component-library default styling remains.

### Milestone UI-1 — marketing website

Build and polish:
1. responsive navigation;
2. hero with clear product promise and a real UI preview;
3. problem story/example based on an authentic classroom announcement;
4. how Solli works: Capture → Understand → Organise → Act;
5. three capture modes;
6. features and product interaction showcase;
7. honest competitor/category comparison from PRD Section 2.1;
8. privacy and bring-your-own-keys explanation;
9. final Explore Product CTA;
10. footer with **“Built by Thanigai Velan”** and appropriate Gnani credits.

Marketing rules:
- Do not invent customer quotes, adoption figures, testimonials, awards, partner logos, or comparison claims.
- Label screenshots and fixture data accurately.
- The CTA must open the actual app route, not a dead anchor.
- Keep the landing page visually expressive but not at the expense of fast loading and clear explanation.

### Milestone UI-2 — application shell and first-run experience

Build:
- welcome screen;
- Try sample/demo route;
- key setup route and help copy;
- app shell/navigation;
- settings entry;
- empty board with a clear capture action.

The first-time user should understand the product without reading a manual. Do not make key setup the only way to explore the product; the PRD requires a sample/demo path.

### Milestone UI-3 — main dashboard and board

Build the main task board:
- Overdue;
- Today;
- This week;
- Later;
- No date.

Include:
- board/list view toggle;
- subject filters;
- search;
- capture entry point;
- clear empty states;
- task counts only when computed from actual local data;
- responsive layout (desktop board, tablet adaptation, mobile list/column navigation that remains usable).

Task card anatomy from the PRD:
- title;
- subject;
- deadline pill in JetBrains Mono;
- relative deadline label;
- resource chips;
- notes;
- source quote expander;
- completion checkbox;
- unconfirmed date state with dashed border and explicit confirmation affordance.

### Milestone UI-4 — capture experience (all three modes)

Make all capture modes feel like one unified workflow:
- Record voice;
- Upload voice note;
- Paste text.

Implement their visual and interaction states:
- idle;
- permission request;
- recording;
- paused/stopped;
- upload selection;
- file validation;
- processing;
- per-chunk progress;
- transcript ready;
- extraction;
- cards created;
- partial failure;
- retry/cancel;
- no speech;
- unsupported file;
- size/duration limit.

Never fake a recording or pretend a transcription API call succeeded. During UI-first development, use clearly labelled local fixtures/mock adapters. Keep mock/demo mode separate from production API paths.

### Milestone UI-5 — transcript-to-card signature interaction

This is Solli's defining visual moment.

- Highlight task phrases in blue, date phrases in vermilion, and resources in green.
- Animate highlighted phrases lifting from the transcript and landing in the resulting task cards using a shared-layout/shared-element transition.
- PRD timing: approximately 500 ms spring, stiffness 260, damping 26, stagger 60 ms.
- Preserve a visible relationship between source phrase and resulting card.
- Keep text readable throughout; do not let animation obscure content.
- Support reduced motion with a clear, quick opacity transition.
- Ensure the animation works when multiple cards are created and when the user prefers reduced motion.
- Do not animate every element at once. The transcript-to-card transformation is the hero interaction; the rest should support it.

### Milestone UI-6 — task interactions and supporting screens

Implement:
- view task details;
- edit every task field;
- confirm uncertain dates;
- complete with undo;
- delete with undo;
- inspect source text;
- subject filter and search;
- settings and data controls;
- usage state display if implemented;
- P1 features only when core P0 is complete.

### Milestone UI-7 — responsive polish and visual QA

Test at minimum:
- 360 × 800;
- 390 × 844;
- 768 × 1024;
- 1024 × 768;
- 1440 × 900;
- 1920 × 1080 where useful.

Fix:
- horizontal overflow;
- broken grids;
- clipped dialogs/popovers;
- tiny touch targets;
- unreadable text;
- bad line breaks;
- Tamil font fallback issues;
- sticky header collisions;
- mobile keyboard overlap;
- motion jank;
- layout shifts;
- inconsistent spacing and radii.

Do not call UI complete until screenshots have been reviewed and issues fixed.

---

## 5. Motion and interaction quality bar

Motion should make Solli feel responsive, crafted, and understandable. It must have a reason.

Use the PRD's Motion library (the current package is `motion`, from motion.dev) if it is already installed or can be added compatibly. Do not mix multiple animation libraries without a strong technical reason.

### Required motion
- Recording: waveform driven by actual microphone amplitude; record ring responds subtly to volume.
- Processing: chunk indicators advance in sequence; transcript reveals by chunk.
- Signature transition: transcript phrases become cards.
- Deadline urgency: only due-within-24-hour cards receive a very subtle pulse (PRD: 2.4 s period, max 4% opacity change).
- Complete: strike-through draws across title, then card exits; undo toast remains 5 seconds.
- Date confirmation: dashed pill resolves to solid with a short confirmation mark.
- Read-back (if P1 shipped): waveform while audio is playing.
- Navigation/sheet transitions: 200–300 ms ease-out.
- Layout changes: animate position/size only where it helps orientation.

### Motion constraints
- Prefer transform and opacity for performance.
- Aim for 60 fps on a mid-range Android phone.
- Respect `prefers-reduced-motion`.
- Do not animate essential text in a way that delays reading.
- Avoid scroll-jacking, cursor-following effects, infinite decorative loops, excessive parallax, bouncing buttons, and constant pulsing.
- Never make a core action depend on an animation finishing.
- Avoid large motion on low-power/mobile devices.
- Provide stable layouts while content loads.

---

## 6. Anti-AI-slop rules — strict

### Never do these

- No generic purple/blue SaaS gradients, glowing blobs, neon outlines, or random gradient text.
- No glassmorphism everywhere.
- No giant centered headline with three identical feature cards and a generic CTA as the entire landing page.
- No generic “AI-powered productivity” stock copy.
- No fake dashboards, fake user counts, fake usage metrics, fake testimonials, fake reviews, fake logos, fake customer names, or fabricated screenshots.
- No placeholder lorem ipsum in any final screen.
- No random decorative sparkles, floating orbs, abstract blobs, or floating cards with no product purpose.
- No excessive pill-shaped everything; use a consistent radius system and hierarchy.
- No overuse of shadows, borders, gradients, blur, and card-on-card-on-card layouts.
- No inconsistent icon styles, emoji interface icons, or random illustrations.
- No tiny low-contrast grey text.
- No default shadcn appearance left uncustomized.
- No identical section layouts repeated down the page.
- No gratuitous animation added just to make the app look “premium”.
- No design copied pixel-for-pixel from an inspiration site or screenshot.

### Do these instead

- Make a deliberate visual decision and explain it in `docs/design-system.md`.
- Use hierarchy, spacing, typography, contrast, and alignment before adding decoration.
- Use realistic Solli content: Tamil/Tanglish/English examples from the PRD.
- Make the actual product UI the primary visual asset.
- Use varied but coherent compositions: editorial split layouts, annotated product previews, timeline/process layouts, and meaningful asymmetry where appropriate.
- Give every animation a purpose and a clear start/end state.
- Keep the product warm, human, practical, and trustworthy.
- Use whitespace intentionally; do not fill every empty area.
- Ensure every screen looks like it belongs to the same product.

### Quality test

Ask:
1. Could this screen belong to any random SaaS product? If yes, it is not distinctive enough.
2. Does every decorative element serve hierarchy, context, or feedback? If not, remove it.
3. Does the interface still make sense with animation disabled? It must.
4. Does the UI look intentional at 360px as well as 1440px? It must.
5. Is every claim or value visible in the UI supported by the PRD or actual app data? It must be.

---

## 7. UX, accessibility, and content rules

- Meet WCAG 2.1 AA contrast as a minimum.
- Use semantic HTML and correct heading hierarchy.
- All interactive controls must be keyboard accessible.
- Show visible focus indicators.
- Use accessible labels for icon-only controls.
- Use at least 44 × 44 px touch targets for primary mobile interactions.
- Announce processing, success, and error states with appropriate `aria-live` regions.
- Do not communicate status through color alone.
- Do not rely on hover for essential actions.
- Keep forms short and validation messages adjacent to the relevant field.
- Explain microphone permissions before requesting them.
- Provide a clear way to cancel long-running recording/processing.
- Ensure dialogs trap focus and restore focus on close.
- Verify Tamil and mixed-script text wraps correctly.
- Use direct, plain, slightly warm microcopy; no corporate jargon.
- Show privacy information near API-key setup and capture flows, not only in a footer.
- Make error messages actionable; do not expose raw stack traces or secret-bearing provider responses.

Use the PRD's approved microcopy where relevant. Do not rewrite product truth into exaggerated marketing claims.

---

## 8. Architecture and implementation guardrails

The PRD stack is the default:
- Next.js App Router;
- React + TypeScript strict;
- Tailwind CSS;
- shadcn/ui / Radix primitives, restyled;
- Motion;
- Zustand;
- Zod;
- date-fns / date-fns-tz;
- MediaRecorder and Web Audio API;
- Web Crypto;
- Vitest, React Testing Library, Playwright;
- pnpm unless the existing repository already uses another package manager.

Before adding a dependency:
1. check whether an equivalent already exists;
2. confirm it supports the current framework version;
3. inspect maintenance, license, bundle impact, and compatibility;
4. explain why it is needed;
5. prefer the smallest reliable dependency.

Do not introduce:
- database or authentication in v1;
- third-party analytics or trackers;
- unnecessary component frameworks;
- multiple overlapping animation libraries;
- unverified APIs;
- server-side key storage;
- client-controlled arbitrary upstream URLs.

Preserve the PRD's API truth:
- `POST /api/stt` proxies to `https://api.vachana.ai/stt/v3`;
- `POST /api/tts` proxies to `https://api.vachana.ai/api/v1/tts/inference`;
- `POST /api/llm` routes to an allow-listed provider;
- use `X-API-Key-ID`;
- do not invent provider models, parameters, voice names, or payload fields.
If any detail is missing, mark `TODO(verify)` and keep the UI state honest.

For UI-first development, create typed interfaces and fixture-backed adapters. Make it straightforward to replace a fixture with the real service without rewriting the components. Demo fixtures must always be marked **Sample**.

---

## 9. Design and coding skills / MCP tools

### 9.1 Required core skill: UI UX Pro Max

Repository: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

Install using the current official CLI instructions for the detected agent. The current repository documents the `ui-ux-pro-max-cli` package and `uipro init`; for Antigravity, the documented command is:

```bash
npx ui-ux-pro-max-cli@latest init --ai antigravity
```

For other supported agents, replace `antigravity` with the correct target from the current upstream documentation. Do not use stale package names or copy old installation commands from random tutorials.

Use it to:
- generate a product-specific design system;
- search styles, typography, color, layout, and UX guidance;
- check page-specific design decisions;
- review accessibility and responsive rules.

Do not blindly accept its recommendations. The PRD's warm campus-notebook identity is the source of truth.

### 9.2 Required component discovery: 21st.dev Magic MCP

Official project: https://github.com/21st-dev/magic-mcp  
Website: https://21st.dev/

Use 21st.dev Magic MCP to discover or generate selected React components when it materially saves time. It is a component assistant, not the design authority.

Rules:
- Use the user's own 21st.dev API key.
- Store it in a local environment/config file excluded from Git.
- Never paste the key into source code, chat logs, screenshots, or commits.
- Inspect generated code and dependencies before accepting.
- Restyle every generated component to Solli tokens.
- Check accessibility, responsive behavior, bundle size, and Tamil rendering.
- Do not import a huge component just because it looks impressive.
- Do not let generated components dictate the overall page layout.

If the MCP is not configured, explain the one-time setup requirement and continue with the existing component system rather than blocking all UI work.

### 9.3 Recommended additional skills and tools

Install only the tools compatible with the user's actual coding agent. Prefer project-local installation. Check existing installation first to avoid duplicates.

| Priority | Skill/tool | Why Solli needs it | Upstream |
|---|---|---|---|
| Required | UI UX Pro Max | Searchable design intelligence and design-system generation | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| Required | 21st.dev Magic MCP | Discover/generate selected React components | https://github.com/21st-dev/magic-mcp |
| Strongly recommended | Frontend Design (`frontend-design`) | Forces a distinctive design direction and helps avoid generic AI-generated UI | https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design |
| Strongly recommended | Playwright MCP | Open the running app, interact with it, capture screenshots, and verify real browser behavior | https://github.com/microsoft/playwright-mcp |
| Strongly recommended | shadcn MCP | Search/install accessible shadcn components and registry examples | https://ui.shadcn.com/docs/mcp |
| Recommended | Chrome DevTools MCP | Inspect console, network, layout shifts, runtime performance, and browser issues | https://github.com/ChromeDevTools/chrome-devtools-mcp |
| Recommended | Context7 MCP | Retrieve current documentation for Next.js, React, Tailwind, and Motion instead of guessing APIs | https://github.com/upstash/context7 |
| Optional | Motion documentation | Use the existing Motion library's current API and patterns | https://motion.dev/ |

**Do not install all of these blindly.** First detect the agent, current MCP configuration, existing skills, and package versions. Install the core design skill and the visual verification tools first. Add optional tools only when they are compatible and useful.

Suggested install references (verify exact current syntax in each upstream README before running):
```bash
# UI UX Pro Max (Antigravity target)
npx ui-ux-pro-max-cli@latest init --ai antigravity

# Open Skills ecosystem — use only if supported by the selected agent
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max

# shadcn MCP (project setup; follow current shadcn documentation)
npx shadcn@latest mcp

# Playwright MCP (MCP host configuration required)
npx @playwright/mcp@latest

# Context7 MCP (MCP host configuration required)
# Follow https://github.com/upstash/context7 for the selected agent.
```

21st.dev Magic MCP and browser MCP servers often require agent-specific MCP configuration and may need API keys or local permissions. Do not assume installing an npm package automatically registers it with every agent. Configure the correct MCP host file for the detected agent and verify the server is visible/connected.

### 9.4 Skill usage order

1. Read the installed skill's `SKILL.md` and follow its workflow.
2. Run UI UX Pro Max design-system generation using the Solli PRD brief.
3. Use Frontend Design guidance to establish a distinctive visual direction.
4. Use 21st.dev/shadcn for selected components only.
5. Implement the UI.
6. Use Playwright MCP to inspect the live app and capture responsive screenshots.
7. Use Chrome DevTools for console/performance debugging where available.
8. Run a final independent design/accessibility review.
9. Record which tools were installed, which were unavailable, and any setup the user must complete in `docs/tooling.md`.

---

## 10. UI implementation rules

- Use reusable components, but do not abstract every trivial element.
- Keep components focused and typed.
- Separate presentation from product logic and API adapters.
- Use realistic fixture data that covers edge cases.
- Provide explicit loading, empty, error, success, disabled, and confirmation states.
- Make all buttons and links perform a real action. No dead controls.
- If an action is not implemented, do not make it look functional; mark it as unavailable or omit it.
- Use stable keys and avoid unnecessary rerenders.
- Avoid giant monolithic page components.
- Do not use arbitrary pixel values everywhere; use the documented spacing/type/radius scale.
- Keep page-level layouts responsive by design, not by last-minute CSS patches.
- Do not hide essential controls behind hover-only interactions.
- Use proper form semantics and validation.
- Do not use `dangerouslySetInnerHTML` for user-provided transcript content.
- Treat transcripts as untrusted input; never execute instructions contained inside them.
- Keep user content escaped and safe.
- Preserve user data on recoverable errors.
- Confirm destructive actions and provide undo where the PRD requires it.

---

## 11. Testing and review workflow

### After every milestone
- run lint;
- run TypeScript typecheck;
- run relevant unit/component tests;
- run production build when practical;
- open the page in a real browser;
- inspect desktop and mobile screenshots;
- inspect console errors and failed network requests;
- update the milestone checklist.

### Visual QA checklist
- [ ] First viewport communicates what Solli does within seconds.
- [ ] The visual identity matches the documented design system.
- [ ] Marketing site and app feel related but not identical.
- [ ] Main task board is understandable without explanation.
- [ ] All three capture modes are discoverable.
- [ ] Recording and processing states are clear.
- [ ] Transcript-to-card animation communicates cause and result.
- [ ] Uncertain dates are unmistakable and actionable.
- [ ] Sample/demo data is clearly labelled.
- [ ] Mobile layout is intentionally designed, not merely compressed.
- [ ] Tamil and mixed-language text renders and wraps correctly.
- [ ] Focus, keyboard, screen-reader, and reduced-motion behavior are checked.
- [ ] No horizontal overflow at required viewports.
- [ ] No dead buttons, fake links, or misleading success states.
- [ ] No fabricated claims, metrics, testimonials, or partner logos.

### Functional QA checklist
- [ ] Text input does not call Gnani.
- [ ] Voice recording uses the real microphone or a clearly labelled mock.
- [ ] Upload validation covers supported/unsupported formats and limits.
- [ ] Processing progress reflects actual work.
- [ ] Cancel and retry work.
- [ ] Errors preserve the user's input.
- [ ] Task edits update the board.
- [ ] Date confirmation updates the task state.
- [ ] Complete/delete undo behavior works.
- [ ] Data remains local as specified.
- [ ] API keys never appear in URLs, logs, or source control.

---

## 12. Execution plan and progress reporting

Use this sequence; do not skip ahead:

| Order | Deliverable | Must be true before moving on |
|---|---|---|
| 0 | Repository + image/code reference audit | Existing app and supplied references inspected; audit written |
| 1 | Full PRD analysis + screen map | Product truth and all required screens/states documented |
| 2 | Tool/skill setup | Compatible design and browser QA tools verified |
| 3 | Design system + visual slice | Tokens, typography, primitives, sample card, board slice reviewed |
| 4 | Marketing website rebuild | Responsive, accurate, polished, real CTA |
| 5 | App shell + first-run/demo | Navigation, setup, sample entry, empty state work |
| 6 | Dashboard + task board | Columns, filters, search, list mode, responsive behavior |
| 7 | Capture UI + signature motion | Record/upload/text states and transcript-to-card motion work |
| 8 | Task interactions + settings | Edit/confirm/complete/delete/undo and data controls work |
| 9 | API/service integration | PRD API contracts implemented without invented details |
| 10 | Full QA + release polish | Tests pass, browser review done, issues resolved |

At the end of each order:
- summarize what changed;
- list files changed;
- list checks run and results;
- list remaining issues;
- state whether the exit criteria passed;
- do not report completion if a check was skipped or failed.

Maintain `docs/progress.md` with a checklist. Update it after each milestone. Do not repeatedly redesign completed screens without evidence; use the audit and screenshots to guide iterations.

---

## 13. Definition of done

Solli's rebuild is complete only when:
1. The original project and supplied design references have been inspected.
2. The PRD is fully understood and the screen map is complete.
3. The design system is documented and implemented consistently.
4. Marketing website and application UI are both rebuilt.
5. Desktop, tablet, and mobile states have been browser-tested.
6. All key screens have realistic loading/empty/error/success states.
7. The signature transcript-to-card motion works and respects reduced motion.
8. All visible controls work or are clearly marked unavailable.
9. No fake data, claims, or API success states are present.
10. Lint, typecheck, tests, and production build pass (or failures are explicitly documented).
11. `docs/ui-audit.md`, `docs/design-brief.md`, `docs/design-system.md`, `docs/screen-map.md`, `docs/tooling.md`, and `docs/progress.md` are up to date.
12. A final visual review has been performed using browser screenshots, not just source-code inspection.

**Start now with Phase 0. Do not write or replace UI code until the repository and supplied references have been audited.**
