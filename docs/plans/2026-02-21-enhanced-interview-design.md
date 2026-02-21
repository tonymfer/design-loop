# Enhanced Interview Flow for Design-Loop

**Date:** 2026-02-21
**Approach:** Smart Extend — 10 questions with adaptive skip via project detection
**Files changed:** `skills/design-loop/SKILL.md`, `skills/design-loop/REFERENCE.md`

## Problem

The current 6-question interview captures operational parameters (URL, viewport, iterations, focus areas, theme, creative direction) but misses strategic context: why the user is iterating, who the audience is, what "done" looks like beyond scores, and what visual references exist. This leads to generic AI outputs, unnecessary revision cycles, and missed opportunities for targeted fixes.

## Goals

1. **Better AI outputs** — richer context produces more targeted iterations
2. **Reduce revision cycles** — better upfront capture = fewer wasted iterations
3. **Premium experience** — the interview itself should feel like working with a senior designer

## Design

### New Question Architecture

10 questions total in two tiers. Every new question has an auto-skip rule tied to Phase 1 project detection.

#### Tier 1 — Operational (existing)

| # | Question | Skip Logic |
|---|----------|-----------|
| Q1 | Target URL | `$ARGUMENTS[0]` |
| Q2 | Focus areas | — |
| Q3 | Iterations | `$ARGUMENTS[2]` |
| Q4 | Viewport | `$ARGUMENTS[1]` |

#### Tier 2 — Strategic (new + existing)

| # | Question | Auto-skip when... |
|---|----------|-------------------|
| Q5 | **Project Vision** | CLAUDE.md contains design goals/brief |
| Q6 | **Audience & Context** | CLAUDE.md mentions target users/demographics |
| Q7 | **Inspirations** | `frontend-design` skill already provided creative direction |
| Q8 | **Constraints** (existing) | CLAUDE.md specifies theme/mode |
| Q9 | **Creative Direction** (existing) | `frontend-design` skill available |
| Q10 | **Success Metrics** | Default threshold (>=4/5) is sufficient; no custom goals |

### New Questions — Exact Specification

**Q5: Project Vision** (inserted before Q2: Focus)

```
"What's the primary goal of this iteration?"
Options:
  - Improve usability (clearer navigation, better flows)
  - Enhance aesthetics (look more polished/premium)
  - Boost conversion (CTAs, trust signals, engagement)
  - Accessibility compliance (WCAG AA/AAA)
  - All of the above — general polish
```

Skip if: CLAUDE.md or docs/DESIGN.md contains design goal keywords ("goal", "vision", "objective", "brief"). Extract and use as default.

Impact on loop: Sets the tone for ANALYZE step — "usability" prioritizes hierarchy/touch targets, "aesthetics" prioritizes spacing/consistency, "conversion" prioritizes contrast/density, "accessibility" elevates WCAG checks.

**Q6: Audience & Context** (inserted after Q2: Focus)

```
"Who's the target audience?"
Options:
  - General web users
  - Mobile-first young audience (18-35)
  - Enterprise / business users
  - Developers / technical audience
  - [enter custom description]
```

Skip if: CLAUDE.md mentions "users", "audience", "demographic", "persona". Extract and use.

Impact on loop: Influences density (enterprise = more info-dense), touch target priority (mobile-first = higher weight), aesthetic tone (developer = clean/minimal, young = bold/colorful).

**Q7: Inspirations** (inserted after Q8: Constraints)

```
"Any design inspiration? Paste a URL and describe what you like about it."
Options:
  - [enter URL + description] (e.g., "stripe.com — clean spacing and typography")
  - Use detected design system conventions
  - Skip — let design-loop decide
```

Skip if: `frontend-design` skill was run before this session, or docs/DESIGN.md has a "References" section.

Impact on loop: At iteration 1, Claude screenshots the reference URL alongside the target, establishing a visual benchmark. The description constrains what to emulate (layout? colors? typography?). Reference screenshot retaken at phase boundaries for comparison.

**Q10: Success Metrics** (inserted after Q3: Iterations)

```
"Beyond the 8 criteria scores, what defines success?"
Options:
  - Score threshold is enough (>=4/5 on all criteria)
  - Specific UX goal (e.g., "hero section must draw eye first")
  - Match the reference design closely
  - Production-ready (a11y, responsive, edge cases handled)
  - [enter custom metric]
```

Skip if: User selected default focus areas and iteration count — standard >=4/5 threshold is implicit.

Impact on loop: Custom metrics become additional stopping criteria. "Match reference" triggers side-by-side comparison screenshots. "Production-ready" adds edge case checks (dark mode, empty states, error states) to every iteration.

### Enhanced Phase 1 Detection

New detection rules added to the existing project context scan:

```
8. SCAN CLAUDE.md for design brief keywords:
   - "goal|vision|objective|brief" → extract as default for Q5
   - "audience|users|demographic|persona" → extract as default for Q6
   - "reference|inspiration|like the design of" → extract as default for Q7
   - "success|metric|KPI|done when" → extract as default for Q10

9. CHECK for docs/DESIGN.md or docs/design-brief.md:
   - If exists, parse for vision/audience/references sections
   - Use as defaults, show user for confirmation rather than open questions

10. CHECK for previous design-loop runs:
    - If .claude/design-loop-history.md exists, extract previous focus areas
    - Suggest: "Continue from previous run's focus?" as Q2 default
```

### Updated Prompt Template

Phase 3 prompt gains new sections:

```
TASK: Visual polish iteration on [PAGE] — [FOCUS AREAS]
VISION: [from Q5]

URL: [target URL]
COMPONENT: [primary component file path(s)]
REFERENCE: [from Q7 — URL + description, or "none"]

TARGET AUDIENCE: [from Q6]
SUCCESS METRICS: [from Q10]

PROJECT CONTEXT:
[... existing fields unchanged ...]

DESIGN CRITERIA:
[... existing 8 criteria unchanged ...]

AUDIENCE-AWARE WEIGHTING:
[Dynamically generated based on Q5+Q6 answers — e.g., if mobile-first young audience:
 "Prioritize TOUCH TARGETS and DENSITY. Bold aesthetics preferred over conservative."]

REFERENCE COMPARISON (if inspiration provided):
At iteration 1 and each phase boundary, screenshot the reference URL
and compare against the target. Note: emulate the DESCRIBED aspects only,
don't clone the entire design.

[... rest of prompt unchanged ...]
```

### Question Flow Order

Final interview sequence:

1. Q1: Target URL (skip via `$ARGUMENTS[0]`)
2. Q5: Project Vision (skip via CLAUDE.md detection) — NEW
3. Q2: Focus Areas
4. Q6: Audience & Context (skip via CLAUDE.md detection) — NEW
5. Q3: Iterations (skip via `$ARGUMENTS[2]`)
6. Q10: Success Metrics (skip if defaults sufficient) — NEW
7. Q4: Viewport (skip via `$ARGUMENTS[1]`)
8. Q8: Constraints (skip via CLAUDE.md)
9. Q7: Inspirations (skip via frontend-design) — NEW
10. Q9: Creative Direction (skip via frontend-design)

### Files Changed

| File | Changes |
|------|---------|
| `skills/design-loop/SKILL.md` | Add Q5, Q6, Q7, Q10 to Phase 2. Add detection rules 8-10 to Phase 1. Update Phase 3 prompt template with VISION, REFERENCE, TARGET AUDIENCE, SUCCESS METRICS, AUDIENCE-AWARE WEIGHTING, REFERENCE COMPARISON sections. |
| `skills/design-loop/REFERENCE.md` | Add "Project Detection for Interview Skip" section with keyword patterns. Add "Reference Screenshot Comparison" instructions for Playwright. Add "Audience-Aware Criterion Weighting" table. |

No new files created. No infrastructure changes. No dependency additions.
