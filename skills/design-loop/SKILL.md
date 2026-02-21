---
name: design-loop
description: Use when user wants to visually iterate on UI/UX design using screenshots, when they say "design loop", "visual loop", "polish the UI", or want autonomous screenshot-driven frontend refinement
---

# Design Loop

Autonomous visual iteration loop for frontend UI/UX. Takes screenshots after each change, analyzes against 8 design criteria, fixes issues, repeats until polished.

**Runs on Ralph Loop infrastructure** — requires `ralph-loop` plugin installed.

## Overview

Design Loop = Ralph Loop + Playwright Screenshots + Design Analysis.

Each iteration:
1. Take screenshot of the target page (Playwright MCP)
2. Analyze screenshot against 8 design criteria
3. Identify top 3 visual issues
4. Fix them in code
5. Re-screenshot to verify
6. Repeat until criteria met

## When to Use

- UI needs visual polish but no Figma mockup exists
- User says "make it look better" or "polish the design"
- After building a feature, need iterative visual refinement
- User shares a screenshot and says "fix this"

## When NOT to Use

- Pure backend/API work
- When a Figma design exists (use Figma MCP to implement it instead)
- Single CSS fix (just do it directly)
- Performance optimization

## Phase 1: Project Context Scan

Before interviewing the user, auto-detect the project's design system:

```
1. READ package.json → detect framework and ecosystem:
   Frameworks:
   - Next.js (`next`): check `app/` (App Router) vs `pages/` (Pages Router)
   - Nuxt (`nuxt`): check `nuxt.config.ts` version
   - SvelteKit (`@sveltejs/kit`): check `svelte.config.js`
   - Remix (`@remix-run/react`): check for `root.tsx`
   - Gatsby (`gatsby`): check for `gatsby-config`
   - Solid.js (`solid-js`): check for `solid-start`
   - Astro (`astro`): check for `astro.config.*`

   CSS-in-JS:
   - styled-components (`styled-components`)
   - Emotion (`@emotion/react`, `@emotion/styled`)
   - vanilla-extract (`@vanilla-extract/css`)

   Component libraries:
   - shadcn/ui (check `components.json`)
   - Radix (`@radix-ui/*`)
   - Headless UI (`@headlessui/react`)
   - Chakra UI (`@chakra-ui/react`)
   - Ant Design (`antd`)
   - Material UI (`@mui/material`)
   - DaisyUI (`daisyui`)

2. READ tailwind.config.* → extract design tokens (colors, spacing, fonts)
3. READ CLAUDE.md → find icon rules, component conventions, style constraints
4. GLOB for design system files:
   - **/tokens.{css,ts,js}
   - **/theme.{ts,js}
   - **/design-system/**
   - **/ui/**/*.{tsx,vue,svelte}
5. CHECK for component libraries (from list above)
6. DETECT available skills: check if frontend-design, super-frontend, or
   ralph-prompt-builder are installed for optional chaining
```

Store findings as `PROJECT_CONTEXT` — inject into the generated prompt.

## Phase 2: Interview (3-5 questions via AskUserQuestion)

**Q1: Target**
```
"Which page should I iterate on?"
Options: [current page URL] / [enter URL] / [file path to component]
```

**Q2: Focus**
```
"What aspects need improvement?"
Options: Layout & Spacing / Color & Contrast / Typography / Visual Hierarchy / All of the above
```

**Q3: Iterations**
```
"How many visual iterations?"
Options: 5 (quick polish) / 10 (thorough) / 20 (deep redesign)
```

**Q4: Viewport**
```
"Which viewport(s)?"
Options: Mobile (390px) / Desktop (1280px) / Both (mobile-first, verify desktop)
```

**Q5: Constraints** (optional — only if CLAUDE.md doesn't specify)
```
"Any design constraints?"
Options: Dark mode only / Light mode only / Both modes / No preference
```

**Q6: Creative Direction** (optional — only if frontend-design skill is NOT available)
```
"Any creative direction?"
Options: Conservative (safe, professional) / Editorial (bold, opinionated) / Playful (colorful, energetic) / Let design-loop decide
```

## Phase 3: Build the Design Loop Prompt

Generate a prompt containing these EXACT sections, filled with project context:

```
TASK: Visual polish iteration on [PAGE] — [FOCUS AREAS]

URL: [target URL, e.g., http://localhost:3000/page]
COMPONENT: [primary component file path(s)]

PROJECT CONTEXT:
- Framework: [detected framework]
- Design tokens: [key tokens from tailwind.config or theme file]
- Component library: [detected library or "custom"]
- Icon system: [detected icon approach]
- Constraints from CLAUDE.md: [relevant rules]

DESIGN CRITERIA (check EVERY iteration):
1. SPACING: Consistent scale (4/8/12/16/24/32px). No cramped elements. Breathing room.
2. HIERARCHY: Clear visual weight order. Primary action obvious. Secondary muted.
3. CONTRAST: Text readable against background. Interactive elements distinguishable.
4. ALIGNMENT: Elements on consistent grid. No orphaned items. Edges line up.
5. DENSITY: Right amount of content per viewport. Not too sparse, not too cluttered.
6. CONSISTENCY: Same patterns for same concepts. Colors meaningful, not random.
7. TOUCH TARGETS: Buttons/links >= 44px touch area on mobile.
8. EMPTY STATES: Graceful when data is missing. Not broken, not blank.

VIEWPORT: [mobile 390x844 | desktop 1280x800 | both]

PROCESS (each iteration):
1. SCREENSHOT: Use Playwright MCP to screenshot the page:
   - Call mcp__plugin_playwright_playwright__browser_navigate to open the URL
   - Call mcp__plugin_playwright_playwright__browser_resize with viewport dimensions
   - Call mcp__plugin_playwright_playwright__browser_take_screenshot
   - If Playwright unavailable, use mcp__claude-in-chrome tools as fallback

2. ANALYZE: Review the screenshot against all 8 design criteria above.
   Score each criterion 1-5. List the top 3 issues by severity.
   Show score DELTAS from previous iteration (e.g., Spacing: 3→4 (+1)).

3. FIX: Make targeted CSS/component edits to address the top 3 issues.
   - Edit ONLY the component file(s) — don't refactor architecture
   - Prefer existing design tokens and utility classes over new CSS
   - Use project's icon system, component library, and conventions
   - One fix at a time, verify build passes between fixes
   - After each fix, explain WHY in one line:
     "Increased section padding 48px→64px — breathing room improves scannability (Spacing)"
     "Darkened body text #94a3b8→#64748b — WCAG AA requires 4.5:1 ratio (Contrast)"
     "Bumped h1 to 700 weight — primary heading must dominate secondary (Hierarchy)"

4. VERIFY: Re-screenshot after fixes. Confirm issues resolved.
   If new issues introduced, fix those first.

5. REPORT: After each iteration, output:
   ```
   ITERATION [N]/[MAX]: Fixed [issue1], [issue2], [issue3]
   Scores: S:[x] H:[x] C:[x] A:[x] D:[x] Co:[x] T:[x] E:[x] = Avg [x.x]/5
   Trend: [↑/↓/→] from [prev avg] → [current avg]
   ```

6. LOG: Append iteration data to `.claude/design-loop-history.md`:
   - Create file with header on first iteration if it doesn't exist
   - Add row: `| [N] | [S] | [H] | [C] | [A] | [D] | [Co] | [T] | [E] | [Avg] | [Focus] | [Changes] |`
   - On completion, append summary block:
     ```
     ## Summary
     Started: [initial avg] → Finished: [final avg]
     Key improvements: [top 3 criterion improvements]
     Skipped issues: [any skipped, or "none"]
     Duration: [iteration count] iterations
     ```

7. PHASE MARKERS: At phase boundaries (iter 4, 7, 10), output:
   ```
   ── PHASE SHIFT: [Previous Focus] → [New Focus] ──
   Phase avg: [avg for completed phase iterations]
   ```
   Suggest saving a screenshot at each phase boundary:
   `.claude/design-loop-iter-[N].png`

PHASE-AWARE ITERATION STRATEGY:
Iteration 1-3:  Layout & spacing fixes (biggest visual impact first)
Iteration 4-6:  Hierarchy, contrast, typography
Iteration 7-9:  Alignment, consistency, edge cases
Iteration 10+:  Empty states, loading states, density, final polish

CONSTRAINTS:
- ONLY edit frontend files (components, styles, layout)
- NEVER change API routes, services, or database code
- NEVER add npm dependencies
- Preserve existing functionality — visual-only changes
- Use project's existing design system and tokens
- Run build/typecheck after each change to verify no errors

COMPLETION:
When ALL 8 criteria score >= 4/5 for TWO consecutive screenshots,
output: <promise>POLISHED</promise>
Then suggest: "Run /export-loop to generate a shareable summary of this run."

STUCK HANDLING:
Objective detection: if a criterion score is UNCHANGED and the SAME criterion
was targeted in the previous iteration, trigger strategy rotation.

Strategy rotation (try the alternative approach):
  padding/margin fix failed  →  try layout change (flex→grid, reorder)
  color fix failed           →  try font-size/weight change
  border fix failed          →  try background/shadow change
  single-element fix failed  →  try parent-container restructure

Terminal skip: After 3 attempts on the same criterion with no score improvement,
SKIP with documented reason in the LOG and a TODO comment in code.
NEVER repeat the same fix that already failed.
```

## Phase 4: Launch via Ralph Loop

Write the prompt to `.claude/ralph-loop.local.md` and let Ralph's stop hook handle the loop:

```bash
# The skill writes the state file directly:
cat > .claude/ralph-loop.local.md <<'STATE'
---
active: true
iteration: 1
max_iterations: [from Q3]
completion_promise: "POLISHED"
started_at: "[ISO timestamp]"
---

[generated prompt from Phase 3]
STATE
```

Then begin working on iteration 1 immediately.

## Design Criteria Quick Reference

| Criterion | Score 1 | Score 3 | Score 5 |
|-----------|---------|---------|---------|
| Spacing | Cramped/inconsistent | Mostly ok, some tight spots | Consistent scale, room to breathe |
| Hierarchy | Everything same weight | Primary clear, secondary unclear | Clear 3-level hierarchy |
| Contrast | Text hard to read | Readable but dull | Clear contrast, vibrant where needed |
| Alignment | Random placement | Mostly aligned | Pixel-perfect grid |
| Density | Too sparse or cluttered | Acceptable | Right info per viewport |
| Consistency | Random patterns | Mostly consistent | Same pattern = same meaning |
| Touch | Tiny targets | Most ok | All >= 44px |
| Empty states | Broken/blank | Basic message | Helpful + on-brand |

## Iteration History Format

Track scores across iterations to show trends:

```
Iter  S  H  C  A  D  Co T  E  Avg
  1   2  2  3  2  3  2  3  2  2.4
  2   3  2  3  3  3  3  3  2  2.8  ↑
  3   4  3  3  3  3  3  4  3  3.3  ↑
  4   4  4  4  3  3  3  4  3  3.5  ↑
  5   4  4  4  4  4  4  4  4  4.0  ↑ POLISHED
```

## Framework Detection Reference

| package.json dep | Framework | Default viewport |
|------------------|-----------|-----------------|
| `next` | Next.js | mobile-first |
| `nuxt` | Nuxt | mobile-first |
| `@sveltejs/kit` | SvelteKit | mobile-first |
| `@remix-run/react` | Remix | mobile-first |
| `gatsby` | Gatsby | desktop |
| `solid-js` | Solid.js | desktop |
| `vue` | Vue | desktop |
| `react` (no next) | React SPA | desktop |
| `svelte` (no kit) | Svelte | desktop |
| `astro` | Astro | desktop |

### CSS-in-JS Detection

| package.json dep | Library | Notes |
|------------------|---------|-------|
| `styled-components` | styled-components | Check for `styled.div` patterns |
| `@emotion/react` | Emotion | Check for `css` prop or `styled` |
| `@vanilla-extract/css` | vanilla-extract | Check for `.css.ts` files |

### Component Library Detection

| package.json dep | Library | Token source |
|------------------|---------|-------------|
| `components.json` (file) | shadcn/ui | `components.json` theme |
| `@radix-ui/*` | Radix Primitives | Custom styling needed |
| `@headlessui/react` | Headless UI | Custom styling needed |
| `@chakra-ui/react` | Chakra UI | `extendTheme()` config |
| `antd` | Ant Design | `ConfigProvider` theme |
| `@mui/material` | Material UI | `createTheme()` config |
| `daisyui` | DaisyUI | Tailwind plugin config |

**Advanced features**: See [REFERENCE.md](REFERENCE.md)
