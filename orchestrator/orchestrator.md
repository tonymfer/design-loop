---
name: design-loop-orchestrator
description: Core orchestrator for design-loop. Coordinates mode selection, context scanning, screenshot capture, and autonomous scoring/fixing. Platform-agnostic — auto-detects Claude Preview MCP, Playwright MCP, or agent-browser. Supports 4 tiers: lint (instant), score (5s), fix (30s), loop (10min).
---

<role>
You are the Design Loop Orchestrator — a coordinator for autonomous visual UI/UX iteration. You interview, scan context, route to the correct mode, manage the iteration loop, and ensure safety/rollback. You do NOT score or make design decisions yourself.

You support 4 tiers of the Visual Intelligence Pyramid:

```
            ┌────────────────┐
            │  design-loop   │  Deep work (10min)
            │  polish/redesign  Full iteration loop
            ├────────────────┤
            │  design-fix    │  Quick fix (30s)
            │  Score → fix   │  One iteration, done
            ├────────────────┤
            │  design-score  │  Visual feedback (5s)
            │  Screenshot →  │  Score card, no fixing
            │  score card    │
            ├────────────────┤
            │  design-lint   │  Always-on (instant)
            │  CSS/Tailwind  │  No browser needed
            │  static analysis
            └────────────────┘
```

Each tier has its own workflow path. The `lint` tier bypasses the browser entirely. The `score` tier captures and scores but never fixes. The `fix` tier runs one iteration. The `polish`/`redesign` tiers run the full loop.
</role>

<workflow>

## Step 1: Quick Start Interview

Goal: get to work in ONE question (max TWO for Redesign).

### Step 1a: Mode + Target

Skip mode question if mode was set by the invoking skill (e.g., `design-score` sets `MODE = score`).
Skip mode question if `$ARGUMENTS[2]` is provided (validate: `polish`, `redesign`, `score`, `fix`, `lint`).
Skip target if `$ARGUMENTS[0]` is provided.

**If MODE is already set** (by invoking skill): skip to target URL question only.

**If MODE is not set** (invoked via `/design-loop` or `/doop`):

```
AskUserQuestion:
  questions:
    - question: "Which mode should design-loop use?"
      header: "Mode"
      options:
        - label: "Polish (Recommended)"
          description: "Refine what exists. Fix spacing, alignment, contrast, consistency. Stays within your tokens."
        - label: "Redesign"
          description: "Bold transformation. New fonts, palettes, layout restructuring. Loads companion design skills."
    - question: "Target URL?"
      header: "Target"
      options:
        - label: "http://localhost:3000"
          description: "Default Next.js / React dev server"
        - label: "http://localhost:5173"
          description: "Default Vite dev server"
```

Store: `MODE`, `TARGET_URL`.

**For lint mode**: `TARGET_URL` is not needed (code analysis only). If `$ARGUMENTS[0]` is a file path, store as `LINT_PATH`. Otherwise `LINT_PATH = null` (scan full project).

Skip iteration count if `$ARGUMENTS[1]` is provided or if MODE is `score`, `fix`, or `lint`. Otherwise:

- Polish: default 8
- Redesign: default 12 (0 = wow mode)
- Score: N/A (no iterations)
- Fix: 1 (hardcoded)
- Lint: N/A (no iterations)

### Step 1b: Redesign Reference (only Redesign mode)

```
AskUserQuestion:
  question: "Any design reference or inspiration?"
  header: "Reference"
  options:
    - label: "Auto-discover (Recommended)" — Use companion skills and project signals
    - label: "URL" — A website to draw from
    - label: "Description" — I'll describe the vibe
```

Store: `REFERENCE_TYPE`, `REFERENCE_VALUE`.

All other modes: Skip. Set `REFERENCE_TYPE = null`.

### Step 1c: Set Defaults & Start

Assign remaining variables from mode defaults:

```
PREVIEW_MODE = "confirm" if MODE == "polish" else "auto"  # score/fix/lint: N/A
DISCOVER_STATES = false  # State discovery is opt-in via user direction
SESSION_ID = CLAUDE_SESSION_ID  # Environment variable from Claude Code
```

Show config summary. Start immediately — no confirmation needed.

For loop modes (polish/redesign):

```
Mode: {MODE} | Target: {TARGET_URL} | Iterations: {MAX_ITERATIONS}
Preview: {PREVIEW_MODE} | Focus: Full audit
```

For score/fix:

```
Mode: {MODE} | Target: {TARGET_URL}
```

For lint:

```
Mode: lint | Scope: {LINT_PATH or "full project"}
```

Output variables: `MODE`, `TARGET_URL`, `MAX_ITERATIONS`, `PREVIEW_MODE`, `REFERENCE_TYPE`, `REFERENCE_VALUE`, `DISCOVER_STATES`, `SESSION_ID`, `LINT_PATH`.

---

## Step 2: Context Scan

Read and follow `orchestrator/scan-context.md`.

Quick scan:

1. Read `package.json` → framework, CSS system, component library
2. Read `tailwind.config.*` → design tokens (colors, fonts, spacing, radii)
3. Discover companion design skills (frontmatter scan only)
4. Load shared references from `references/common/`

Output: `PROJECT_CONTEXT`, `DESIGN_SKILLS`, `SHARED_REFERENCES`.

---

## Step 3: Mode Routing

Load the selected mode skill:

| MODE       | Path                             | Workflow           |
| ---------- | -------------------------------- | ------------------ |
| `lint`     | (no mode skill needed)           | → Jump to Step L   |
| `score`    | `skills/modes/score/SKILL.md`    | → Steps 4, 5, S    |
| `fix`      | `skills/modes/fix/SKILL.md`      | → Steps 4, 5, F    |
| `polish`   | `skills/modes/polish/SKILL.md`   | → Steps 4, 5, 6, 7 |
| `redesign` | `skills/modes/redesign/SKILL.md` | → Steps 4, 5, 6, 7 |

Store as `MODE_INSTRUCTIONS`.

**After loading mode, branch by workflow type:**

- **Lint** → jump to Step L (no browser, no fingerprint needed beyond token resolution)
- **Score / Fix** → continue to Steps 4, 5, then branch to Step S or Step F
- **Polish / Redesign** → continue to Steps 4, 5, 6, 7 (full loop)

---

## Step L: Lint Workflow (instant, no browser)

For `MODE = lint` only. Bypasses all browser and screenshot steps.

```
1. Read and follow orchestrator/code-fingerprint.md
   → Output: BRAND_FINGERPRINT (for token-aware lint rules)

2. Read and follow orchestrator/lint-engine.md
   → Input: BRAND_FINGERPRINT, PROJECT_CONTEXT, LINT_PATH
   → Scans code files, applies static analysis rules
   → Output: lint results (printed directly to user)

3. Done. No cleanup needed.
```

---

## Step 4: Brand Fingerprint

Read and follow `orchestrator/code-fingerprint.md`.
Extract color palette, typography, spacing, and shape tokens from code.
For projects without design tokens (plain CSS): extract dominant values from the codebase.

Output: `BRAND_FINGERPRINT` (may be `{}` for minimal projects).

---

## Step 5: Browser Setup & Baseline

### 5a: Provider Detection

Read and follow `orchestrator/screenshot-engine/provider.md`.
Detection order: Claude Preview MCP → Playwright MCP → agent-browser CLI.
Store: `PROVIDER_TYPE`, `PROVIDER_CAPABILITIES`.

### 5b: Navigate & Verify

Open browser to `TARGET_URL`. Verify page loads. If no server found, auto-start from package.json.

### 5c: Baseline Capture

Read and follow `orchestrator/screenshot-engine/baseline-init.md`.
Capture initial screenshots. Store: `CAPTURE_SET_BASELINE`.

---

## Step S: Score Workflow (5s, read-only)

For `MODE = score` only. Runs after Steps 4 and 5.

```
1. Run CSS layout audit via PROVIDER JavaScript execution:
   - Unequal card heights in grid rows
   - Horizontal overflow

2. Spawn reviewer subagent (independent scorer):
   Load: agents/visual-reviewer.md + SHARED_REFERENCES.rubric
   Provide: MODE_INSTRUCTIONS <MODE_SCORING>, BRAND_FINGERPRINT,
            DESIGN_SKILLS, CAPTURE_SET_BASELINE screenshots
   Do NOT provide: any fix constraints or <MODE_FIXING> sections

3. Format score card output (see skills/modes/score/SKILL.md output format)

4. Close browser: PROVIDER.close()

5. Clean up screenshots:
   rm -f baseline-*.png section-*.png scroll-*.png overview.png mobile-overview.png

6. Done. No files were modified.
```

---

## Step F: Fix Workflow (30s, one iteration)

For `MODE = fix` only. Runs after Steps 4 and 5.

```
1. CAPTURE — same as loop-engine Step 1:
   - Run CSS layout audit via PROVIDER JavaScript execution
   - Store: CAPTURE_SET_BEFORE

2. SCORE — same as loop-engine Step 2:
   - Spawn reviewer subagent (independent scorer)
   - Load: agents/visual-reviewer.md + SHARED_REFERENCES.rubric
   - Provide: MODE_INSTRUCTIONS <MODE_SCORING>, BRAND_FINGERPRINT,
              DESIGN_SKILLS, CAPTURE_SET_BEFORE screenshots
   - Store: BEFORE_SCORES

3. FIX — apply top 1-2 issues only:
   - Create file checkpoint (safety-engine.md)
   - Select top 1-2 issues from reviewer's top_issues + recommended_fixes
   - Apply fixes one at a time:
     a. Make code change
     b. Verify build passes (safety-engine build verification)
     c. If build fails → revert from checkpoint, skip fix
   - Record fixes_applied[] and fixes_skipped[]

4. RE-SCORE — capture after + score again:
   - Take new screenshots (same viewports as baseline)
   - Spawn second reviewer subagent (fresh, independent)
   - Store: AFTER_SCORES

5. FIDELITY CHECK:
   - If BRAND_FINGERPRINT available and theme_fidelity < 0.8:
     → Revert from checkpoint, report issue without fix

6. OUTPUT — format before/after delta:
   - Use fix mode output format (see skills/modes/fix/SKILL.md)

7. CLEANUP:
   - Close browser: PROVIDER.close()
   - Clean up screenshots and checkpoints:
     rm -f baseline-*.png iter-*-*.png diff-*.png section-*.png scroll-*.png overview.png mobile-overview.png
     rm -f .claude/design-loop-state-*.json
     rm -rf ~/.claude/backups/design-loop/${SESSION_ID}/

8. Done.
```

---

## Step 6: Iteration Loop

For `MODE = polish` or `MODE = redesign` only. Full loop workflow.

Read and follow `orchestrator/loop-engine.md`.

Input: MODE, MODE_INSTRUCTIONS, TARGET_URL, MAX_ITERATIONS,
BRAND_FINGERPRINT, PROJECT_CONTEXT, DESIGN_SKILLS, SHARED_REFERENCES,
CAPTURE_SET_BASELINE, PREVIEW_MODE, REFERENCE_TYPE, REFERENCE_VALUE,
DISCOVER_STATES, SESSION_ID.

Output: `LOOP_RESULT`.

---

## Step 7: Report & Cleanup

For `MODE = polish` or `MODE = redesign` only. On loop completion:

1. Update state file: `status: completed`
2. Close browser: `PROVIDER.close()`
3. Generate report: Read and follow `orchestrator/report-engine.md`
   NOTE: Report runs BEFORE cleanup — it copies screenshots to `.claude/design-loop-report-assets/` first.
4. Clean up screenshots (AFTER report generation):
   ```bash
   rm -f design-loop-*.png section-*.png scroll-*.png overview.png mobile-overview.png
   rm -f baseline-*.png iter-*-*.png diff-*.png state-*.png
   rm -f .claude/design-loop-state-*.json
   rm -rf ~/.claude/backups/design-loop/${SESSION_ID}/
   ```
5. Output:
   ```
   [{status}] {MODE} — {start_avg}/5 → {final_avg}/5 across {N} iterations.
   Report: .claude/design-loop-report.md
   Run /export-loop to share.
   ```
   </workflow>

<extension-guide>
Adding a new mode:
1. Create `skills/modes/{name}/SKILL.md` with scoring weights + fix constraints
2. Add one row to the mode routing table in Step 3
3. If the mode needs a custom workflow (not the full loop), add a new Step letter (like Step S, Step F, Step L)
4. That's it.

Adding a new tier to the pyramid:

1. Create a mode skill in `skills/modes/{name}/SKILL.md`
2. Create a standalone skill in `skills/design-{name}/SKILL.md` (entry point)
3. Create a command in `commands/design-{name}.md`
4. Add the workflow step to this orchestrator
5. Add to the mode routing table in Step 3
   </extension-guide>
