# Solli — Agent Tooling & MCP Setup

## 1. Installed Tools & Skills

| Tool / Skill | Status | Location / Configuration | Purpose |
|---|---|---|---|
| **UI UX Pro Max** | Installed | `.agents/skills/ui-ux-pro-max` | Design system intelligence, UX checklists, WCAG rules |
| **Python 3.12.4** | Installed & Active | Global environment | Executes UI UX Pro Max CLI search scripts locally |
| **Node.js v23.1.0 & npm 11.5.2** | Installed & Active | Global environment | App runtime, package manager, build scripts |

---

## 2. MCP Tools Assessment & Recommendations

Following `AGENTS.md` Section 9:

1. **21st.dev Magic MCP:**
   - **Status:** Requires user 21st.dev API key.
   - **Recommendation:** Can be configured if user provides `21ST_API_KEY`. In the meantime, we implement custom accessible primitives styled to Solli's design tokens.

2. **Playwright MCP / Browser Verification:**
   - **Status:** Playwright test runner will be integrated into the test suite (`@playwright/test`) for automated browser verification and visual regression testing across mobile, tablet, and desktop viewports.

3. **shadcn MCP / Context7 MCP:**
   - **Status:** Optional doc retrieval; Next.js 15 App Router, Tailwind CSS, and Motion specifications are directly referenced in the PRD and implemented cleanly.

