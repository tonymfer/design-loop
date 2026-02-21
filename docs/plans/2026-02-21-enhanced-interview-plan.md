# Enhanced Interview Flow — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand design-loop's interview from 6 operational questions to 10 adaptive questions that capture strategic context (vision, audience, inspirations, success metrics), with auto-skip via project detection.

**Architecture:** Edit two existing markdown files (SKILL.md, REFERENCE.md). No code, no infrastructure. All changes are prompt engineering — adding questions to Phase 2, detection rules to Phase 1, and new sections to the Phase 3 prompt template.

**Tech Stack:** Markdown (SKILL.md prompt definition), Playwright MCP (reference screenshots)

**Design doc:** `docs/plans/2026-02-21-enhanced-interview-design.md`

---

### Task 1: Add detection rules 8-10 to Phase 1 in SKILL.md

**Files:**
- Modify: `skills/design-loop/SKILL.md:101` (after the CSS cascade audit closing backticks, before "Store findings")

**Step 1: Add three new detection rules**

Insert after line 101 (`\`\`\``) and before line 103 (`Store findings as...`). The new rules extend the numbered list (currently 1-7) with rules 8-10:

```markdown
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

The closing backticks (\`\`\`) remain, then `Store findings as \`PROJECT_CONTEXT\`` stays unchanged.

**Step 2: Verify the edit**

Read `skills/design-loop/SKILL.md` lines 90-115 to confirm rules 8-10 appear after rule 7 and before "Store findings".

**Step 3: Commit**

```bash
git add skills/design-loop/SKILL.md
git commit -m "feat(interview): add detection rules 8-10 for adaptive question skipping

Phase 1 now scans CLAUDE.md/DESIGN.md for vision, audience, references,
and metrics keywords. Checks for previous runs and frontend-design output.
These signals auto-skip strategic questions in Phase 2."
```

---

### Task 2: Rewrite Phase 2 interview with 10 questions in SKILL.md

**Files:**
- Modify: `skills/design-loop/SKILL.md:105-146` (the entire Phase 2 section)

**Step 1: Replace the Phase 2 section**

Replace everything from `## Phase 2: Interview (3-5 questions via AskUserQuestion)` (line 105) through line 146 (end of Q6: Creative Direction) with the new 10-question flow:

```markdown
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
```

**Step 2: Verify the edit**

Read `skills/design-loop/SKILL.md` lines 105-200 to confirm all 10 questions appear in the correct order with skip logic.

**Step 3: Commit**

```bash
git add skills/design-loop/SKILL.md
git commit -m "feat(interview): expand Phase 2 from 6 to 10 adaptive questions

New questions: Q5 Vision, Q6 Audience, Q7 Inspirations, Q10 Success Metrics.
All new questions have auto-skip rules tied to Phase 1 detection.
Reordered flow: Target → Vision → Focus → Audience → Iterations →
Metrics → Viewport → Constraints → Inspirations → Creative Direction."
```

---

### Task 3: Update Phase 3 prompt template in SKILL.md

**Files:**
- Modify: `skills/design-loop/SKILL.md:148-155` (the prompt template header in Phase 3)

**Step 1: Add new prompt sections**

In the Phase 3 prompt template, replace the existing header block:

```
TASK: Visual polish iteration on [PAGE] — [FOCUS AREAS]

URL: [target URL, e.g., http://localhost:3000/page]
COMPONENT: [primary component file path(s)]
```

With the enhanced header:

```
TASK: Visual polish iteration on [PAGE] — [FOCUS AREAS]
VISION: [from Q5 — e.g., "Enhance aesthetics" or "All of the above — general polish"]

URL: [target URL, e.g., http://localhost:3000/page]
COMPONENT: [primary component file path(s)]
REFERENCE: [from Q7 — URL + description, or "none"]

TARGET AUDIENCE: [from Q6 — e.g., "Mobile-first young audience (18-35)"]
SUCCESS METRICS: [from Q10 — e.g., ">=4/5 all criteria + hero section draws eye first"]
```

**Step 2: Add audience-aware weighting and reference comparison**

After the `VIEWPORT:` line and `WIDE VIEWPORT CHECK` block (around line 182), insert before `PROCESS (each iteration):`:

```
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
```

**Step 3: Verify the edit**

Read `skills/design-loop/SKILL.md` lines 148-200 to confirm the prompt template includes VISION, REFERENCE, TARGET AUDIENCE, SUCCESS METRICS, AUDIENCE-AWARE WEIGHTING, REFERENCE COMPARISON, and CUSTOM SUCCESS CHECK.

**Step 4: Commit**

```bash
git add skills/design-loop/SKILL.md
git commit -m "feat(interview): update Phase 3 prompt template with strategic context

Prompt now includes VISION, REFERENCE, TARGET AUDIENCE, SUCCESS METRICS.
Added AUDIENCE-AWARE WEIGHTING section for criterion priority adjustment.
Added REFERENCE COMPARISON for side-by-side screenshots at phase boundaries.
Added CUSTOM SUCCESS CHECK for user-defined metrics."
```

---

### Task 4: Update Phase 4 state file in SKILL.md

**Files:**
- Modify: `skills/design-loop/SKILL.md` (Phase 4 state frontmatter, around line 317)

**Step 1: Extend state frontmatter**

Replace the existing state template:

```yaml
---
status: running
iteration: 0
max_iterations: [from Q3]
started_at: "[ISO timestamp]"
---
```

With:

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
```

**Step 2: Verify the edit**

Read the Phase 4 section to confirm state frontmatter includes the new fields.

**Step 3: Commit**

```bash
git add skills/design-loop/SKILL.md
git commit -m "feat(interview): persist strategic context in state file

State frontmatter now tracks vision, audience, reference_url, and
success_metrics for context preservation across iterations."
```

---

### Task 5: Add Project Detection reference section to REFERENCE.md

**Files:**
- Modify: `skills/design-loop/REFERENCE.md` (insert new section after "CSS Cascade Audit" at line 107, before "Fallback: Chrome MCP")

**Step 1: Insert new section**

After line 106 (end of CSS Cascade Audit section), add:

```markdown

## Project Detection for Interview Skip

Phase 1 scans for signals that auto-skip strategic interview questions. Detection is keyword-based — extract the relevant context, don't just detect presence.

### Keyword Patterns

| Signal | Scan Location | Keywords (regex) | Maps To |
|--------|--------------|------------------|---------|
| Vision | CLAUDE.md, docs/DESIGN.md | `goal\|vision\|objective\|brief\|purpose` near "design" context | Q5 default |
| Audience | CLAUDE.md, docs/DESIGN.md | `audience\|users\|demographic\|persona\|target` | Q6 default |
| References | CLAUDE.md, docs/DESIGN.md | `reference\|inspiration\|like the design\|emulate` + URL pattern | Q7 default |
| Metrics | CLAUDE.md, docs/DESIGN.md | `success\|metric\|KPI\|done when\|acceptance` | Q10 default |

### DESIGN.md Section Mapping

If `docs/DESIGN.md` or `docs/design-brief.md` exists, parse these sections:

```
## Vision / ## Goal / ## Objective    → DETECTED_VISION
## Audience / ## Users / ## Personas   → DETECTED_AUDIENCE
## References / ## Inspiration         → DETECTED_REFERENCES
## Success / ## Metrics / ## KPIs      → DETECTED_METRICS
```

### Previous Run Detection

If `.claude/design-loop-history.md` exists:
1. Parse the most recent run's summary block
2. Extract: focus areas, final average, skipped issues
3. Present as Q2 default: "Continue from previous run (Layout & Spacing, avg 3.5)?"

### frontend-design Detection

If the `frontend-design` skill was invoked in this session:
1. Check for `.claude/design-direction.md` or equivalent output
2. Extract: palette, typography, layout strategy, creative tone
3. Auto-skip Q7 (Inspirations) and Q9 (Creative Direction)
4. Inject creative direction into PROJECT_CONTEXT
```

**Step 2: Verify the edit**

Read `skills/design-loop/REFERENCE.md` lines 107-155 to confirm the new section appears correctly.

**Step 3: Commit**

```bash
git add skills/design-loop/REFERENCE.md
git commit -m "docs(reference): add Project Detection for Interview Skip section

Keyword patterns, DESIGN.md section mapping, previous run detection,
and frontend-design detection rules for adaptive question skipping."
```

---

### Task 6: Add Reference Screenshot Comparison section to REFERENCE.md

**Files:**
- Modify: `skills/design-loop/REFERENCE.md` (insert after the new Project Detection section, before "Fallback: Chrome MCP")

**Step 1: Insert new section**

```markdown

## Reference Screenshot Comparison

When the user provides a reference URL in Q7, capture it alongside the target for visual benchmarking.

### Capture Protocol

**Iteration 1 (initial comparison):**
```
1. Navigate to reference URL via Playwright
2. Resize to same viewport as target
3. Take screenshot → save as .claude/design-loop-reference.png
4. Navigate back to target URL
5. Take target screenshot as usual
6. In ANALYZE step, note key differences between target and reference
   for the DESCRIBED aspects only (e.g., if "spacing and typography",
   ignore color differences)
```

**Phase boundaries (iter 4, 7, 10):**
```
1. Re-screenshot reference URL (design may be dynamic)
2. Compare progress: how much closer is the target to the reference
   on the described aspects?
3. Log comparison notes in design-loop-history.md
```

### Comparison Scope

Only compare what the user described. Common patterns:

| User Description | Compare | Ignore |
|-----------------|---------|--------|
| "clean spacing" | Padding, margins, whitespace | Colors, fonts, content |
| "typography" | Font sizes, weights, hierarchy | Layout, colors, imagery |
| "layout" | Grid, flow, component arrangement | Colors, fonts, content |
| "overall feel" | All visual aspects | Content, functionality |
| "card design" | Card components specifically | Page-level layout |
```

**Step 2: Verify the edit**

Read the relevant lines to confirm the section appears with correct formatting.

**Step 3: Commit**

```bash
git add skills/design-loop/REFERENCE.md
git commit -m "docs(reference): add Reference Screenshot Comparison protocol

Capture protocol for iteration 1 and phase boundaries.
Comparison scope table for filtering described vs ignored aspects."
```

---

### Task 7: Add Audience-Aware Criterion Weighting table to REFERENCE.md

**Files:**
- Modify: `skills/design-loop/REFERENCE.md` (insert after Reference Screenshot Comparison, before "Fallback: Chrome MCP")

**Step 1: Insert new section**

```markdown

## Audience-Aware Criterion Weighting

Based on Q5 (Vision) and Q6 (Audience), adjust which criteria get priority in scoring and fixing.

### Vision-Based Weights

| Vision | Primary Criteria | Secondary Criteria | De-prioritize |
|--------|-----------------|-------------------|---------------|
| Usability | Hierarchy, Touch Targets | Spacing, Density | Consistency |
| Aesthetics | Spacing, Consistency | Contrast, Alignment | Touch Targets |
| Conversion | Contrast, Density | Hierarchy, Touch Targets | Empty States |
| Accessibility | Contrast, Touch Targets | Hierarchy, Spacing | Density |
| General polish | All equal | — | — |

### Audience-Based Adjustments

| Audience | Adjustment |
|----------|------------|
| General web users | No adjustment (baseline weights) |
| Mobile-first young (18-35) | Touch Targets MUST be 5/5. Bold colors preferred. Higher Density tolerance. |
| Enterprise / business | Higher Density expected (more info-dense). Conservative aesthetics. Consistency critical. |
| Developers / technical | Clean/minimal aesthetic. Hierarchy paramount. Low Density (breathing room). |

### How Weighting Applies

In the ANALYZE step of each iteration:
1. Score all 8 criteria normally (1-5)
2. When selecting "top 3 issues", prefer issues in Primary Criteria
3. If all Primary Criteria are >=4, then fix Secondary Criteria
4. De-prioritized criteria are still scored but only fixed after others are >=4

This is soft weighting — all 8 criteria must still reach >=4/5 for POLISHED status.
```

**Step 2: Verify the edit**

Read the relevant lines to confirm tables render correctly.

**Step 3: Commit**

```bash
git add skills/design-loop/REFERENCE.md
git commit -m "docs(reference): add Audience-Aware Criterion Weighting tables

Vision-based and audience-based criterion priority matrices.
Soft weighting system: influences fix ordering, not completion criteria."
```

---

### Task 8: Final verification and squash-ready summary

**Files:**
- Read: `skills/design-loop/SKILL.md` (full file)
- Read: `skills/design-loop/REFERENCE.md` (full file)

**Step 1: Verify SKILL.md completeness**

Confirm:
- [ ] Phase 1 has rules 1-10 (original 7 + new 8-10)
- [ ] Phase 2 header says "3-8 questions" (not "3-5")
- [ ] Phase 2 has all 10 questions in order: Q1, Q5, Q2, Q6, Q3, Q10, Q4, Q8, Q7, Q9
- [ ] Each new question (Q5, Q6, Q7, Q10) has skip logic documented
- [ ] Phase 3 prompt template includes: VISION, REFERENCE, TARGET AUDIENCE, SUCCESS METRICS
- [ ] Phase 3 has AUDIENCE-AWARE WEIGHTING, REFERENCE COMPARISON, CUSTOM SUCCESS CHECK sections
- [ ] Phase 4 state frontmatter includes: vision, audience, reference_url, success_metrics

**Step 2: Verify REFERENCE.md completeness**

Confirm:
- [ ] "Project Detection for Interview Skip" section exists with keyword patterns table
- [ ] "Reference Screenshot Comparison" section exists with capture protocol
- [ ] "Audience-Aware Criterion Weighting" section exists with vision + audience tables

**Step 3: Verify no broken formatting**

Skim both files for:
- Unclosed code blocks
- Broken table formatting
- Missing section headers
- Inconsistent question numbering

**Step 4: Final commit (if any fixes needed)**

```bash
git add skills/design-loop/SKILL.md skills/design-loop/REFERENCE.md
git commit -m "fix: address formatting issues from enhanced interview implementation"
```

---

## Summary

| Task | File | What |
|------|------|------|
| 1 | SKILL.md Phase 1 | Add detection rules 8-10 |
| 2 | SKILL.md Phase 2 | Rewrite with 10 adaptive questions |
| 3 | SKILL.md Phase 3 | Extend prompt template with strategic sections |
| 4 | SKILL.md Phase 4 | Extend state frontmatter |
| 5 | REFERENCE.md | Add Project Detection section |
| 6 | REFERENCE.md | Add Reference Screenshot Comparison |
| 7 | REFERENCE.md | Add Audience-Aware Weighting |
| 8 | Both files | Final verification |

Total: 8 tasks, 2 files, 7 commits. No new dependencies. No infrastructure.
