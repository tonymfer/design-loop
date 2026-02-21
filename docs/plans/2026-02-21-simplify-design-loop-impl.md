# Simplify design-loop — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite design-loop from ~930 lines (SKILL.md + REFERENCE.md) to ~180 lines with hybrid section-based screenshots, anti-slop criteria, and ralph-loop completion.

**Architecture:** Replace the entire SKILL.md content with a streamlined 5-phase workflow. Delete REFERENCE.md. Update both command files and the stop hook to match new criteria and no-limit mode.

**Tech Stack:** Markdown skill files, Playwright MCP, Claude Code plugin system, Bash (stop hook)

**Design doc:** `docs/plans/2026-02-21-simplify-design-loop.md`

---

### Task 1: Rewrite SKILL.md

This is the core task — replacing the entire skill file with the simplified version.

**Files:**
- Rewrite: `skills/design-loop/SKILL.md` (replace all ~550 lines)

**Step 1: Write the new SKILL.md**

Replace the entire contents of `skills/design-loop/SKILL.md` with the following:

```markdown
---
name: design-loop
description: Use when user wants to visually iterate on UI/UX design using screenshots, when they say "design loop", "visual loop", "polish the UI", or want autonomous screenshot-driven frontend refinement
argument-hint: "[url] [iterations]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_run_code, mcp__plugin_playwright_playwright__browser_close, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__computer, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__find, mcp__claude-in-chrome__javascript_tool
---

# design-loop

Autonomous visual iteration loop for frontend UI/UX. Screenshots each section of your page at full resolution, scores against 5 design criteria, fixes issues, repeats until polished.

## Overview

design-loop = Section Screenshots + Design Scoring + Autonomous Iteration.

Each iteration:
1. Screenshot every section of the page at full resolution
2. Score each section against 5 design criteria (with anti-slop checks)
3. Identify top 3 issues by severity
4. Fix them in code
5. Re-screenshot to verify
6. Repeat until all scores >= 4/5

## When to Use

- UI needs visual polish but no Figma mockup exists
- User says "make it look better" or "polish the design"
- After building a feature, need iterative visual refinement

## When NOT to Use

- Pure backend/API work
- When a Figma design exists (use Figma MCP instead)
- Single CSS fix (just do it directly)

## Phase 0: Setup

```
1. CHECK Playwright MCP — try calling mcp__plugin_playwright_playwright__browser_navigate
   If unavailable: run `claude mcp add playwright -- npx -y @playwright/mcp@latest` via Bash
2. CHECK dev server — verify target URL responds
   If not running: tell user to start it and wait
```

## Phase 1: Quick Context Scan

Auto-detect project basics before interviewing the user:

```
1. READ package.json → framework, component library, animation library
2. READ tailwind.config.* OR theme file → design tokens (colors, spacing, fonts)
3. Store as PROJECT_CONTEXT for use during fixes
```

Keep it light. No detection tables, no exhaustive scanning.

## Phase 2: Interview (2-3 questions)

If arguments were passed via `$ARGUMENTS`:
- `$ARGUMENTS[0]` (url) → skip Q1
- `$ARGUMENTS[1]` (iterations) → skip Q3

**Q1: Target URL** (skip if `$ARGUMENTS[0]` provided)
```
"Which page should I iterate on?"
Options: http://localhost:3000 / [enter URL]
```

**Q2: Focus area**
```
"What needs improvement?"
Options: General polish / Layout & spacing / Typography / Color & contrast
```

**Q3: Max iterations** (skip if `$ARGUMENTS[1]` provided)
```
"How many iterations?"
Options: 5 (quick polish) / 10 (thorough) / 20 (deep redesign) / No limit (loop until polished)
```

## Phase 3: Section-Based Screenshot Capture

The core of design-loop. Inspired by Chrome DevTools' "Capture node screenshot" — each section captured at its natural pixel dimensions instead of one tiny full-page image.

**CAPTURE PROCESS:**

```
1. Navigate to page via Playwright
2. Take one OVERVIEW screenshot at viewport size (1280x800 desktop)
   — this captures overall composition and inter-section flow

3. Run section detection JS via browser_run_code:

   const sections = await page.locator('section, header, main, footer, article').all();
   if (sections.length >= 3) {
     // NODE MODE — screenshot each semantic section at natural size
     for (let i = 0; i < sections.length; i++) {
       await sections[i].screenshot({ path: `/tmp/design-loop-section-${i}.png` });
     }
   } else {
     // SCROLL MODE — fallback for pages without semantic HTML
     const height = await page.evaluate(() => document.body.scrollHeight);
     const vh = 800; // viewport height
     const step = Math.round(vh * 0.7); // 30% overlap between folds
     for (let y = 0; y < height; y += step) {
       await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
       await page.screenshot({ path: `/tmp/design-loop-fold-${Math.floor(y/step)}.png` });
     }
   }

4. Read each screenshot for evaluation
```

**WHY HYBRID:**
- Node screenshots → full-resolution per-section (a hero captured at 800px tall, not squished)
- Overview shot → catches section transitions, overall flow, color continuity
- Scroll fallback → works on any page regardless of HTML quality

## Phase 4: Evaluate & Fix

**SCORE each section against 5 criteria (1-5):**

| Criterion | Score 5 | Anti-slop |
|-----------|---------|-----------|
| **Composition** | Consistent spacing scale, breathing room, intentional visual flow | No safe symmetry — expect purposeful layout decisions |
| **Typography** | Clear 3-level hierarchy, distinctive font pairing, excellent readability | Flag Inter/Roboto/Arial/system-ui defaults as generic |
| **Color & Contrast** | Cohesive palette, WCAG AA, dominant color with sharp accents | Flag purple-gradient-on-white, evenly-distributed timid palettes |
| **Visual Identity** | Memorable, feels handcrafted by a designer, has distinctive character | "Would a designer put this in their portfolio?" |
| **Polish** | Pixel-perfect alignment, consistent patterns, edge cases handled | Micro-detail: shadows, borders, radius, hover states |

**PROCESS (each iteration):**

```
1. SCREENSHOT: Capture all sections (first iteration) or only changed sections (subsequent)

2. SCORE: Review each section screenshot against all 5 criteria.
   Score 1-5 per criterion per section.
   Show deltas from previous iteration: Composition: 3→4 (+1)

3. IDENTIFY: List top 3 issues across all sections, ranked by severity.
   Format: "[Section N] [Issue] — [Criterion] — [Fix approach]"

4. FIX: Make targeted CSS/component edits.
   - One fix at a time, verify build passes between fixes
   - Use existing design tokens and utility classes
   - After each fix, explain WHY in one line:
     "Increased section padding 48→64px — breathing room improves scannability (Composition)"
     "Swapped Inter for Space Grotesk — distinctive display font elevates the header (Typography)"

5. VERIFY: Re-screenshot affected sections. Confirm issues resolved.
   If new issues introduced, fix those first.

6. REPORT:
   ITERATION [N]/[MAX]: Fixed [issue1], [issue2], [issue3]
   Scores: Co:[x] Ty:[x] CC:[x] VI:[x] Po:[x] = Avg [x.x]/5
   Trend: [↑/↓/→] from [prev avg] → [current avg]
```

**LOG** each iteration to `.claude/design-loop-history.md`:
```
| [N] | [Co] | [Ty] | [CC] | [VI] | [Po] | [Avg] | [Changes] |
```

## Phase 5: Loop Control

Write initial state to `.claude/design-loop.state.md` before starting iteration 1:

```yaml
---
status: running
iteration: 0
max_iterations: [from Q3, or 0 for no limit]
---

[The prompt text that the stop hook feeds back each iteration]
```

The stop hook (`hooks/stop-hook.sh`) reads this file to control the loop.
`max_iterations: 0` = no limit (loop until POLISHED or user stops).

**COMPLETION:**
When ALL sections score >= 4/5 on ALL criteria for TWO consecutive iterations,
output <promise>POLISHED</promise> and stop.
Then suggest: "Run /export-loop to generate a shareable summary."

**NO-LIMIT MODE:**
If user chose "No limit", set `max_iterations: 0`. Loop until POLISHED or user stops.

**MAX ITERATIONS:**
If max reached without POLISHED, output final summary and stop.

**STUCK HANDLING:**
If a criterion score is UNCHANGED after being targeted in the previous iteration:
- Try an alternative approach (padding fix failed → try layout restructure)
- After 3 attempts on the same criterion with no improvement → SKIP with documented reason
- NEVER repeat the same fix that already failed

**CONSTRAINTS:**
- ONLY edit frontend files (components, styles, layout)
- NEVER change API routes, services, or database code
- NEVER add npm dependencies
- Preserve existing functionality — visual-only changes
- Use project's existing design tokens and utility classes
- Run build/typecheck after each change
```

**Step 2: Verify the new file reads cleanly**

Read back the file and confirm:
- Frontmatter is valid YAML
- ~180 lines total
- All 5 phases present
- Section screenshot JS is syntactically correct
- Criteria table renders properly

**Step 3: Commit**

```bash
git add skills/design-loop/SKILL.md
git commit -m "feat: rewrite SKILL.md — section screenshots, 5 criteria, simplified loop"
```

---

### Task 2: Delete REFERENCE.md

**Files:**
- Delete: `skills/design-loop/REFERENCE.md`

**Step 1: Delete the file**

```bash
git rm skills/design-loop/REFERENCE.md
```

**Step 2: Commit**

```bash
git commit -m "chore: remove REFERENCE.md — all content consolidated into SKILL.md"
```

---

### Task 3: Update /design-loop command

**Files:**
- Modify: `commands/design-loop.md`

**Step 1: Rewrite the command file**

Replace the entire contents of `commands/design-loop.md` with:

```markdown
---
name: design-loop
description: Start an autonomous visual polish loop — screenshots each section, scores, fixes, repeats
arguments:
  - name: url
    description: Target page URL (default: http://localhost:3000)
    required: false
  - name: iterations
    description: Max iterations — number or "unlimited" (default: 10)
    required: false
---

# /design-loop

Starts an autonomous visual iteration loop. This command:
1. Scans the project for framework and design tokens
2. Asks 2-3 quick questions (target, focus, iterations)
3. Begins section-based screenshot iteration

## Instructions

Invoke the `design-loop` skill. It handles the full workflow:
- Phase 0: Setup (auto-install Playwright MCP if needed)
- Phase 1: Quick context scan (package.json + tailwind config)
- Phase 2: Interview (2-3 questions)
- Phase 3-5: Screenshot sections → score → fix → repeat

If arguments were provided:
- `url`: Skip Q1, use provided URL
- `iterations`: Skip Q3, use provided value (number or "unlimited")

## Prerequisites (auto-installed)

1. **Playwright MCP** — auto-installed if missing via `claude mcp add playwright -- npx -y @playwright/mcp@latest`
2. **Dev server** — must be running at the target URL. If not, tells the user to start it.
```

**Step 2: Verify the file reads cleanly**

Read back and confirm frontmatter is valid, arguments section updated (viewport arg removed, iterations accepts "unlimited").

**Step 3: Commit**

```bash
git add commands/design-loop.md
git commit -m "feat: update /design-loop command for simplified phases"
```

---

### Task 4: Update /export-loop command

**Files:**
- Modify: `commands/export-loop.md`

**Step 1: Update the column names in the template**

Replace the old 8-column table header in the export template:

Old: `| Iter | S | H | C | A | D | Co | T | E | Avg |`
New: `| Iter | Comp | Typo | Color | Identity | Polish | Avg |`

The full updated file:

```markdown
---
name: export-loop
description: Export a shareable summary of the most recent design-loop run
arguments: []
---

# /export-loop

Generate a shareable summary of the most recent design-loop run.

## Instructions

1. Read `.claude/design-loop-history.md`
2. If the file doesn't exist, tell the user: "No design-loop history found. Run /design-loop first."
3. Extract the most recent run (everything after the last `## Run` header, or the entire file if only one run)
4. Format as a shareable markdown summary:

\```markdown
## design-loop results

**Project**: [repo name from git or package.json]
**Date**: [run date]
**Iterations**: [count]

### Score Progression

| Iter | Comp | Typo | Color | Identity | Polish | Avg |
|------|------|------|-------|----------|--------|-----|
[rows from history]

### Key Improvements
- [top 3 criterion improvements, e.g., "Composition: 2 → 5 (+3)"]

### Summary
[started avg] → [final avg] across [N] iterations

---
*Polished with [design-loop](https://github.com/tonymfer/design-loop) — autonomous visual iteration for Claude Code*
\```

5. Output the formatted summary so the user can copy it
6. Suggest: "Copy this into a PR description, README, or share on social media."
```

**Step 2: Commit**

```bash
git add commands/export-loop.md
git commit -m "feat: update /export-loop with new 5-criteria column names"
```

---

### Task 5: Update stop hook

The stop hook is what makes the autonomous loop work. It needs two changes.

**Files:**
- Modify: `hooks/stop-hook.sh`

**Step 1: Update criteria count in system message (line 164)**

Change:
```
SYSTEM_MSG="🔄 design-loop iteration $NEXT_ITERATION/$MAX_ITERATIONS | To complete: all 8 criteria >= 4/5 for 2 consecutive iterations, then output <promise>POLISHED</promise>"
```

To:
```
SYSTEM_MSG="🔄 design-loop iteration $NEXT_ITERATION/$MAX_ITERATIONS | To complete: all 5 criteria >= 4/5 for 2 consecutive iterations, then output <promise>POLISHED</promise>"
```

**Step 2: Handle no-limit mode (max_iterations=0)**

The existing code on line 51 validates `MAX_ITERATIONS` is numeric (`^[0-9]+$`), and line 64 already checks `$MAX_ITERATIONS -gt 0` before comparing to iteration count. This means `max_iterations: 0` naturally means "no limit" — the max-iterations check is skipped.

Verify this by reading lines 51 and 64. If the logic is correct, only the system message needs a tweak for display:

Change the system message to handle the display of unlimited:
```bash
if [[ $MAX_ITERATIONS -eq 0 ]]; then
  SYSTEM_MSG="🔄 design-loop iteration $NEXT_ITERATION (no limit) | To complete: all 5 criteria >= 4/5 for 2 consecutive iterations, then output <promise>POLISHED</promise>"
else
  SYSTEM_MSG="🔄 design-loop iteration $NEXT_ITERATION/$MAX_ITERATIONS | To complete: all 5 criteria >= 4/5 for 2 consecutive iterations, then output <promise>POLISHED</promise>"
fi
```

**Step 3: Commit**

```bash
git add hooks/stop-hook.sh
git commit -m "feat: update stop hook — 5 criteria, no-limit mode display"
```

---

### Task 6: Final verification

**Step 1: Check file structure is clean**

```bash
ls -la skills/design-loop/
# Should show: SKILL.md only (no REFERENCE.md)

ls -la commands/
# Should show: design-loop.md, export-loop.md
```

**Step 2: Count lines to verify reduction**

```bash
wc -l skills/design-loop/SKILL.md
# Target: ~180 lines (down from ~550)
```

**Step 3: Verify no broken references**

Search the codebase for any remaining references to REFERENCE.md or the old 8 criteria names:

```bash
grep -r "REFERENCE.md" skills/ commands/ hooks/
grep -r "Touch Targets\|Empty States\|Density" skills/ commands/ hooks/
grep -r "all 8 criteria" skills/ commands/ hooks/
```

All should return empty.

**Step 4: Verify stop hook references 5 criteria**

```bash
grep "criteria" hooks/stop-hook.sh
# Should show "all 5 criteria"
```

**Step 5: Commit any fixes if needed, then done**
