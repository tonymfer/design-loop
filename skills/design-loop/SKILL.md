---
name: design-loop
description: Use when user wants to visually iterate on UI/UX design using screenshots, when they say "design loop", "visual loop", "polish the UI", or want autonomous screenshot-driven frontend refinement
argument-hint: "[url] [viewport] [iterations]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_close, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__computer, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__find, mcp__claude-in-chrome__javascript_tool
---

# Design Loop

Autonomous visual iteration loop for frontend UI/UX. Takes screenshots after each change, analyzes against 8 design criteria, fixes issues, repeats until polished.

## Overview

Design Loop = Playwright Screenshots + Design Analysis + In-session Iteration.
Playwright MCP is auto-installed on first run. No other dependencies.

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

## Phase 0: Dependency Check (auto-install)

Before anything else, verify dependencies are available:

```
1. CHECK Playwright MCP — try calling mcp__plugin_playwright_playwright__browser_navigate
   If unavailable: run `claude mcp add playwright -- npx -y @playwright/mcp@latest` via Bash
2. CHECK dev server — verify target URL responds
   If not running: tell user to start it and wait
```

Only block on the dev server — Playwright MCP is installed automatically.

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
6. DETECT available skills: check if frontend-design is installed for optional chaining
7. CSS CASCADE AUDIT — critical for Tailwind v4 projects:
   - GREP globals.css / global stylesheets for unlayered resets: `* {`, `body {`, `html {`
   - If found OUTSIDE a `@layer` block, flag as HIGH RISK — unlayered styles
     always beat `@layer utilities` in CSS cascade regardless of specificity
   - Check for: margin: 0, padding: 0, box-sizing resets outside @layer
   - Tailwind v4 preflight already handles resets inside @layer base —
     redundant unlayered resets will silently break utility classes like
     mx-auto, px-*, py-*, gap-*, etc.
   - If detected: FIX IMMEDIATELY before starting iterations (wrap in @layer
     base or delete if redundant with Tailwind preflight)
   - Also check for CSS-in-JS global styles that inject unlayered resets

8. SCAN CLAUDE.md and docs/DESIGN.md for design brief signals:
   - Keywords "goal|vision|objective|brief" near design context → store as DETECTED_VISION
   - Keywords "audience|users|demographic|persona" → store as DETECTED_AUDIENCE
   - Keywords "reference|inspiration|like the design of" + URLs → store as DETECTED_REFERENCES
   - Keywords "success|metric|KPI|done when" → store as DETECTED_METRICS
   - If docs/DESIGN.md or docs/design-brief.md exists, parse its sections:
     Vision, Audience, References, Success Criteria → use as defaults

9. CHECK for previous design-loop runs:
   - If .claude/design-loop-history.md exists, extract the most recent run's
     focus areas and final scores
   - Store as PREVIOUS_RUN — suggest "Continue from previous focus?" in Q2

10. CHECK for frontend-design creative direction:
    - If frontend-design skill was invoked earlier in this session, or if
      .claude/design-direction.md exists, store as DETECTED_CREATIVE_DIRECTION
    - This auto-skips Q7 (Inspirations) and Q9 (Creative Direction)
```

Store findings as `PROJECT_CONTEXT` — inject into the generated prompt.

## Phase 2: Interview (3-8 questions via AskUserQuestion)

Adaptive interview: 10 questions total, but most are auto-skipped via Phase 1 detection
and `$ARGUMENTS`. Well-configured projects see 3-5 questions. New projects see 6-8.

If arguments were passed via `$ARGUMENTS`, use them to skip questions:
- `$ARGUMENTS[0]` (url) → skip Q1, use as target URL
- `$ARGUMENTS[1]` (viewport) → skip Q4, use as viewport mode (mobile/desktop/both)
- `$ARGUMENTS[2]` (iterations) → skip Q3, use as max iterations

**Q1: Target** (skip if `$ARGUMENTS[0]` provided)
```
"Which page should I iterate on?"
Options: [current page URL] / [enter URL] / [file path to component]
```

**Q5: Vision** (skip if `DETECTED_VISION` found in Phase 1)
```
"What's the primary goal of this iteration?"
Options:
  - Improve usability (clearer navigation, better flows)
  - Enhance aesthetics (look more polished/premium)
  - Boost conversion (CTAs, trust signals, engagement)
  - Accessibility compliance (WCAG AA/AAA)
  - All of the above — general polish
```
If skipped, use `DETECTED_VISION`. Default if no signal: "All of the above — general polish".

**Q2: Focus**
```
"What aspects need improvement?"
Options: Layout & Spacing / Color & Contrast / Typography / Visual Hierarchy / All of the above
```
If `PREVIOUS_RUN` exists, prepend option: "Continue from previous run ([previous focus areas])".

**Q6: Audience** (skip if `DETECTED_AUDIENCE` found in Phase 1)
```
"Who's the target audience?"
Options:
  - General web users
  - Mobile-first young audience (18-35)
  - Enterprise / business users
  - Developers / technical audience
```
If skipped, use `DETECTED_AUDIENCE`. Default if no signal: "General web users".

**Q3: Iterations** (skip if `$ARGUMENTS[2]` provided)
```
"How many visual iterations?"
Options: 5 (quick polish) / 10 (thorough) / 20 (deep redesign)
```

**Q10: Success Metrics** (skip if user chose default focus + iterations)
```
"Beyond the 8 criteria scores, what defines success?"
Options:
  - Score threshold is enough (>=4/5 on all criteria)
  - Specific UX goal (e.g., "hero section must draw eye first")
  - Match the reference design closely
  - Production-ready (a11y, responsive, edge cases handled)
```
If skipped, default: "Score threshold is enough". If `DETECTED_METRICS` found, use that.

**Q4: Viewport** (skip if `$ARGUMENTS[1]` provided)
```
"Which viewport(s)?"
Options: Mobile (390px) / Desktop (1280px) / Both (mobile-first, verify desktop)
```

**Q8: Constraints** (skip if CLAUDE.md specifies theme/mode)
```
"Any design constraints?"
Options: Dark mode only / Light mode only / Both modes / No preference
```

**Q7: Inspirations** (skip if `DETECTED_CREATIVE_DIRECTION` or `DETECTED_REFERENCES` found)
```
"Any design inspiration? Paste a URL and describe what you like about it."
Options:
  - [enter URL + description] (e.g., "stripe.com — clean spacing and typography")
  - Use detected design system conventions
  - Skip — let design-loop decide
```
If a reference URL is provided, Claude will screenshot it at iteration 1 for visual comparison.

**Q9: Creative Direction** (skip if frontend-design skill is available or `DETECTED_CREATIVE_DIRECTION` found)
```
"Any creative direction?"
Options: Conservative (safe, professional) / Editorial (bold, opinionated) / Playful (colorful, energetic) / Let design-loop decide
```

## Phase 3: Build the Design Loop Prompt

Generate a prompt containing these EXACT sections, filled with project context:

```
TASK: Visual polish iteration on [PAGE] — [FOCUS AREAS]
VISION: [from Q5 — e.g., "Enhance aesthetics" or "All of the above — general polish"]

URL: [target URL, e.g., http://localhost:3000/page]
COMPONENT: [primary component file path(s)]
REFERENCE: [from Q7 — URL + description, or "none"]

TARGET AUDIENCE: [from Q6 — e.g., "Mobile-first young audience (18-35)"]
SUCCESS METRICS: [from Q10 — e.g., ">=4/5 all criteria + hero section draws eye first"]

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

WIDE VIEWPORT CHECK (run once at iteration 1 and again at final iteration):
- Screenshot at 1920x1080 in addition to the normal viewport
- Centering bugs, alignment drift, and max-width failures are
  invisible at narrow widths but obvious at wide viewports
- If the main container is not centered at 1920px, the CSS is broken
  even if it looks fine at 1280px

AUDIENCE-AWARE WEIGHTING:
Based on VISION and TARGET AUDIENCE, adjust criterion priority:
- Usability vision → weight HIERARCHY and TOUCH TARGETS higher
- Aesthetics vision → weight SPACING and CONSISTENCY higher
- Conversion vision → weight CONTRAST and DENSITY higher
- Accessibility vision → enforce WCAG AA on all CONTRAST scores, weight TOUCH TARGETS
- Mobile-first audience → TOUCH TARGETS must score 5/5, DENSITY adjusted for small screens
- Enterprise audience → DENSITY can be higher (more info-dense is expected)
- Developer audience → prefer clean/minimal aesthetic, high CONSISTENCY weight

REFERENCE COMPARISON (only if Q7 provided a URL):
At iteration 1, screenshot the reference URL at the same viewport as the target.
At each phase boundary (iter 4, 7, 10), re-screenshot the reference.
Compare ONLY the described aspects (e.g., "spacing and typography" means
ignore the reference's colors and imagery).
Note differences and incorporate into the next iteration's fix priorities.

CUSTOM SUCCESS CHECK (only if Q10 specified custom metrics):
At each phase boundary, evaluate custom success metrics in addition to
the 8 criteria scores. If the custom metric is subjective (e.g., "hero draws eye"),
assess it against the screenshot and note progress.

PROCESS (each iteration):
1. SCREENSHOT: Use Playwright MCP to screenshot the page:
   - Call mcp__plugin_playwright_playwright__browser_navigate to open the URL
   - Call mcp__plugin_playwright_playwright__browser_resize with viewport dimensions
   - Call mcp__plugin_playwright_playwright__browser_take_screenshot
   - If Playwright unavailable, use mcp__claude-in-chrome tools as fallback

2. MEASURE: Use browser_evaluate (Playwright) or javascript_tool (Chrome) to
   programmatically check layout properties. Screenshots can miss CSS cascade bugs.
   Run this JS on the page and check for anomalies:
   ```js
   (() => {
     const results = {};
     // Check main container centering
     const container = document.querySelector('[class*="container"], [class*="max-w"], main, [style*="max-width"]')
       || document.body.firstElementChild;
     if (container) {
       const rect = container.getBoundingClientRect();
       const vw = window.innerWidth;
       const leftGap = rect.left;
       const rightGap = vw - rect.right;
       const drift = Math.abs(leftGap - rightGap);
       results.centering = {
         left: Math.round(leftGap),
         right: Math.round(rightGap),
         drift: Math.round(drift),
         centered: drift < 20
       };
     }
     // Check if Tailwind utilities are actually applied
     const el = document.querySelector('.mx-auto, .px-4, .gap-4');
     if (el) {
       const cs = getComputedStyle(el);
       results.utilityCheck = {
         marginLeft: cs.marginLeft,
         marginRight: cs.marginRight,
         selector: el.className.split(' ').slice(0, 3).join(' ')
       };
     }
     return JSON.stringify(results, null, 2);
   })()
   ```
   RED FLAGS:
   - centering.drift > 20px → container is NOT centered, investigate CSS cascade
   - mx-auto element with marginLeft: "0px" → utility is being overridden
   - Any layout property showing "0px" when Tailwind class expects otherwise
   If a red flag fires, CHECK global CSS for unlayered resets before proceeding.

3. ANALYZE: Review the screenshot AND measurement data against all 8 criteria.
   Score each criterion 1-5. List the top 3 issues by severity.
   Show score DELTAS from previous iteration (e.g., Spacing: 3→4 (+1)).

4. FIX: Make targeted CSS/component edits to address the top 3 issues.
   - Edit ONLY the component file(s) — don't refactor architecture
   - Prefer existing design tokens and utility classes over new CSS
   - Use project's icon system, component library, and conventions
   - One fix at a time, verify build passes between fixes
   - After each fix, explain WHY in one line:
     "Increased section padding 48px→64px — breathing room improves scannability (Spacing)"
     "Darkened body text #94a3b8→#64748b — WCAG AA requires 4.5:1 ratio (Contrast)"
     "Bumped h1 to 700 weight — primary heading must dominate secondary (Hierarchy)"

5. VERIFY: Re-screenshot after fixes. Confirm issues resolved.
   If new issues introduced, fix those first.
   Re-run MEASURE step to confirm layout metrics are healthy.

6. REPORT: After each iteration, output:
   ```
   ITERATION [N]/[MAX]: Fixed [issue1], [issue2], [issue3]
   Scores: S:[x] H:[x] C:[x] A:[x] D:[x] Co:[x] T:[x] E:[x] = Avg [x.x]/5
   Trend: [↑/↓/→] from [prev avg] → [current avg]
   ```

7. LOG: Append iteration data to `.claude/design-loop-history.md`:
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

8. PHASE MARKERS: At phase boundaries (iter 4, 7, 10), output:
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
output "POLISHED" and stop iterating.
Then suggest: "Run /export-loop to generate a shareable summary of this run."

STUCK HANDLING:
Objective detection: if a criterion score is UNCHANGED and the SAME criterion
was targeted in the previous iteration, trigger strategy rotation.

Strategy rotation (try the alternative approach):
  padding/margin fix failed  →  try layout change (flex→grid, reorder)
  color fix failed           →  try font-size/weight change
  border fix failed          →  try background/shadow change
  single-element fix failed  →  try parent-container restructure
  utility class not working  →  check CSS cascade (unlayered resets override @layer)
  centering broken           →  run MEASURE step, check for global * resets

Terminal skip: After 3 attempts on the same criterion with no score improvement,
SKIP with documented reason in the LOG and a TODO comment in code.
NEVER repeat the same fix that already failed.
```

## Phase 4: Begin Iteration Loop

Write initial state to `.claude/design-loop.state.md`:

```yaml
---
status: running
iteration: 0
max_iterations: [from Q3]
started_at: "[ISO timestamp]"
vision: "[from Q5]"
audience: "[from Q6]"
reference_url: "[from Q7, or null]"
success_metrics: "[from Q10]"
---

[generated prompt from Phase 3]
```

Then execute the loop directly. For each iteration 1 to max_iterations:

1. Execute PROCESS steps (Screenshot → Measure → Analyze → Fix → Verify → Report → Log → Phase Markers)
2. Check COMPLETION:
   - ALL 8 criteria >= 4/5 for 2 consecutive iterations → STOP, output "POLISHED"
   - Max iterations reached → STOP, output final summary
3. Update `.claude/design-loop.state.md` frontmatter (iteration count, last_avg)
4. Continue to next iteration

On completion, update state to `status: completed` with `final_avg` and `completed_at`.
Begin iteration 1 immediately.

## Design Criteria Quick Reference

| Criterion | Score 1 | Score 3 | Score 5 |
|-----------|---------|---------|---------|
| Spacing | Cramped/inconsistent | Mostly ok, some tight spots | Consistent scale, room to breathe |
| Hierarchy | Everything same weight | Primary clear, secondary unclear | Clear 3-level hierarchy |
| Contrast | Text hard to read | Readable but dull | Clear contrast, vibrant where needed |
| Alignment | Random placement | Mostly aligned, verify with MEASURE | Pixel-perfect grid, centered at 1920px |
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
