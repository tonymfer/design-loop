---
name: design-loop-interview
description: Reference document for design-loop interview question content, rationale, and option lists. The orchestrator (orchestrator.md Step 1a-1e) drives actual AskUserQuestion calls. Not user-invocable.
---

<role>
This file is a reference for question content and rationale. The orchestrator (orchestrator.md Step 1a-1e) drives the actual AskUserQuestion tool calls. This file provides detailed option lists, examples, and the output contract that the orchestrator sub-steps reference.
</role>

<interview>

<question id="Q0">
## Mode Selection

What kind of design iteration do you want?

1. **Precision Polish**
   Surgical CSS fixes. Spacing, alignment, contrast, consistency.
   Your layout stays exactly as-is — just tighter and more refined.
   Best for: production sites, pre-launch cleanup, quick confidence boost.
   Example: "My SaaS dashboard works fine but the spacing feels off
   and the cards aren't quite aligned."

2. **Theme-Respect Elevate**
   Reads your design tokens (Tailwind config, CSS variables) and
   elevates using only what your theme already provides.
   Nothing foreign introduced — every change maps to a token you own.
   Best for: design-system projects, component libraries, brand-critical pages.
   Example: "My Beeper-style contacts screen uses shadcn but the color
   usage feels flat and the typography doesn't use our type scale well."

3. **Creative Unleash**
   Bold moves. New fonts, palette shifts, layout restructuring.
   Loads all your installed companion design skills for maximum creative input.
   Best for: greenfield projects, redesigns, portfolio pieces.
   Example: "I built a clean analytics dashboard but it looks like
   every other AI-generated admin panel. Make it stand out."

Store selection as `MODE` (one of: `precision-polish`, `theme-respect-elevate`, `creative-unleash`).
</question>

<question id="Q1">
## Target URL

<think>
Skip this question if $ARGUMENTS[0] was provided.
</think>

Which page should I iterate on?

Options:
- A running URL (e.g., `http://localhost:3000`)
- A file path to a component (will attempt to find the running page)
- "current" to use the currently open page

Store as `TARGET_URL`.
</question>

<question id="Q2">
## Focus Area

<think>
The focus options adapt per mode. Precision Polish omits "Visual Identity" because
that mode's scoring weights de-emphasize it (0.8x). Creative Unleash highlights
"Visual Identity" as a primary concern because the whole point is standing out.
</think>

What aspects need the most improvement?

**If MODE = `precision-polish`:**
1. Spacing & Alignment
2. Typography
3. Color & Contrast
4. Full audit — all criteria (Recommended)

**If MODE = `theme-respect-elevate`:**
1. Composition & Layout
2. Typography
3. Color & Contrast
4. Visual Identity
5. Full audit — all criteria (Recommended)

**If MODE = `creative-unleash`:**
1. Composition & Layout
2. Typography & Fonts
3. Color & Palette
4. Visual Identity (primary focus)
5. Full audit — all criteria (Recommended)

Store selection as `FOCUS`.
</question>

<question id="Q2.5">
## Sub-screen Discovery

<think>
Default flips per mode:
- Precision Polish → default "No" (state-level fixes are more invasive, not surgical)
- Theme-Respect Elevate → default "Yes" (tokens should be consistent across states)
- Creative Unleash → default "Yes" (redesign should cover the full experience)
</think>

Should I discover and iterate on sub-screens within this page (tabs, modals, drawers, accordions)?

**If MODE = `precision-polish`:**
1. Yes, discover all interactive states
2. No, just the default view (Recommended)

**If MODE = `theme-respect-elevate` or `creative-unleash`:**
1. Yes, discover all interactive states (Recommended)
2. No, just the default view

Store as `DISCOVER_STATES` (true/false).
</question>

<question id="Q2.6">
## Boldness Level (Theme-Respect Elevate only)

<!-- MANDATORY-BOLDNESS-GATE: Q2.6 MUST be asked when MODE = theme-respect-elevate.
     Without BOLDNESS_LEVEL, TRE falls back to null defaults and the user loses
     control over how aggressively the loop modifies their design. -->

<think>
MANDATORY: ASK this question when MODE = theme-respect-elevate.
For precision-polish: set BOLDNESS_LEVEL = null, skip this question.
For creative-unleash: set BOLDNESS_LEVEL = null, skip this question.
If $ARGUMENTS[5] is provided, parse as integer 1-3.

Boldness level also sets max_iterations ceiling:
  Level 1 → cap MAX_ITERATIONS at 8
  Level 2 → cap MAX_ITERATIONS at 12
  Level 3 → cap MAX_ITERATIONS at 15
If Q3 answer exceeds the cap, silently reduce to the cap.
</think>

**When MODE = `theme-respect-elevate`: ASK this question. It is MANDATORY for TRE mode.**
**When MODE = `precision-polish` or `creative-unleash`: skip, set BOLDNESS_LEVEL = null.**

Within your brand theme, how bold should the structural improvements be?

1. **Minimal** — Safe cleaning only.
   Token compliance, spacing normalization, consistent dim-text.
   The page looks the same but the code is healthier.
   (Max 8 iterations)

2. **Medium** — Card rearrangement, section reordering allowed. (Recommended)
   Visibly improved emphasis hierarchy, interactive states, whitespace rhythm.
   Still 100% within your design tokens.
   (Max 12 iterations)

3. **Bold** — Full layout restructuring + new component introduction.
   Dramatic structural UX improvements while respecting your theme 100%.
   New components from your existing library (shadcn, radix, etc.).
   Maximum visible impact within brand boundaries.
   (Max 15 iterations)

Store as `BOLDNESS_LEVEL` (integer: 1, 2, or 3).
</question>

<question id="Q2.7">
## Design Reference (Creative Unleash only)

<think>
This question ONLY appears when MODE = creative-unleash.
For PP and TRE, skip entirely — set REFERENCE_TYPE = null, REFERENCE_VALUE = null.
If $ARGUMENTS[3] is provided (4th CLI arg), parse it as REFERENCE_VALUE and auto-detect type.

DEFAULT: Option 4 (Auto-discover) is the recommended default for CU mode.
It uses the full inspiration matching pipeline (21st.dev, Spline, Awwwards, etc.)
to find the best sources for the project's personality, focus, and stack.
Only offer URL/Image/Description if the user has a specific reference in mind.
</think>

**When MODE = `creative-unleash`: ASK this question.**
**When MODE = `precision-polish` or `theme-respect-elevate`: skip, set REFERENCE_TYPE = null, REFERENCE_VALUE = null.**

Do you have a design reference or inspiration for this redesign?

1. URL — a website I want to draw inspiration from
2. Image — a screenshot or mockup (provide file path)
3. Description — I'll describe the vibe I'm going for
4. Auto-discover — search 21st.dev, inspiration libraries, and companion skills for the best match (Recommended)

Store as `REFERENCE_TYPE` ("url" | "image" | "description" | null) and `REFERENCE_VALUE` (the URL, path, or text).
</question>

<question id="Q3">
## Iteration Count

<think>
Skip this question if $ARGUMENTS[1] was provided.

Defaults vary per mode:
- Precision Polish → 5 (quick, low-risk changes converge fast)
- Theme-Respect Elevate → 10 (thorough token application takes more passes)
- Creative Unleash → 15 (bold changes need more iteration to refine)
</think>

How many visual iterations?

**If MODE = `precision-polish`:**
1. 3 (light touch)
2. 5 (quick polish) (Recommended)
3. 10 (thorough)
4. No limit — run until all criteria >= 4/5

**If MODE = `theme-respect-elevate`:**
Options depend on BOLDNESS_LEVEL:

*Level 1 (Minimal):*
1. 3 (light touch)
2. 5 (Recommended)
3. 8 (maximum for Level 1)
4. No limit — run until all criteria >= 4/5 (capped at 8)

*Level 2 (Medium):*
1. 5 (quick pass)
2. 8 (Recommended)
3. 12 (maximum for Level 2)
4. No limit — run until all criteria >= 4/5 (capped at 12)

*Level 3 (Bold):*
1. 8 (focused)
2. 12 (Recommended)
3. 15 (maximum for Level 3)
4. No limit — run until all criteria >= 4/5 (capped at 15)

**If MODE = `creative-unleash`:**
1. 10 (focused redesign)
2. 15 (deep redesign) (Recommended)
3. 25 (exhaustive)
4. No limit — run until all criteria >= 4/5

`No limit` = `MAX_ITERATIONS: 0`.

Store as `MAX_ITERATIONS`.
</question>

<question id="Q3.5">
## Preview Mode

<think>
Defaults vary per mode:
- Precision Polish → default "confirm" (surgical, user wants control)
- Theme-Respect Elevate → default "confirm" (brand-critical, verify compliance)
- Creative Unleash → default "auto" (bold changes, trust the loop)
Skip if $ARGUMENTS[4] is provided.
</think>

Should I show you a preview of changes before continuing each iteration?

**If MODE = `precision-polish` or `theme-respect-elevate`:**
1. Yes, preview and confirm each iteration (Recommended)
2. No, auto-apply

**If MODE = `creative-unleash`:**
1. Yes, preview and confirm each iteration
2. No, auto-apply (Recommended)

Store as `PREVIEW_MODE` ("confirm" | "auto").
</question>

<confirmation>
## Configuration Summary

<!-- MANDATORY-BOLDNESS-VALIDATION: Before displaying the summary, verify that
     BOLDNESS_LEVEL is set for TRE mode. If MODE = theme-respect-elevate and
     BOLDNESS_LEVEL is null/unset, Q2.6 was skipped in error — go back and ask it. -->

**Pre-confirmation validation:**
If MODE = `theme-respect-elevate` and BOLDNESS_LEVEL is null or unset:
  → Q2.6 was skipped in error. Go back and ask Q2.6 before showing the summary.
  → Log: "Validation catch: BOLDNESS_LEVEL missing for TRE mode, re-asking Q2.6"

After all questions are answered (or skipped via CLI arguments), display:

```
Here's your design loop configuration:

  Mode:         [MODE display name]
  Target:       [TARGET_URL]
  Focus:        [FOCUS display name]
  Sub-screens:  [Yes/No description]
  Boldness:     [Minimal/Medium/Bold] (Level [N])   ← only if MODE = theme-respect-elevate
  Reference:    [REFERENCE_TYPE]: [REFERENCE_VALUE summary] or "Auto-discover (21st.dev + inspiration libraries)"   ← only if MODE = creative-unleash
  Iterations:   [MAX_ITERATIONS or "No limit (capped at [level max])"]
  Preview:      [Confirm each iteration / Auto-approve]

Ready to start, or want to change something?
1. Start the loop
2. Change something
```

If the user selects **"Change something"**, re-present the list:
```
What would you like to change?
1. Mode ([current])
2. Target ([current])
3. Focus ([current])
4. Sub-screens ([current])
5. Boldness level ([current])   ← only if MODE = theme-respect-elevate
6. Iterations ([current])
7. Preview mode ([current])
8. Reference ([current or "Auto-discover"])   ← only if MODE = creative-unleash
```

Then re-ask only the selected question and return to the confirmation summary.

If the user selects **"Start the loop"**, proceed.
</confirmation>

</interview>

<output-contract>
The interview produces exactly 9 output variables consumed by the orchestrator:

| Variable | Type | Values |
|----------|------|--------|
| `MODE` | string | `precision-polish` \| `theme-respect-elevate` \| `creative-unleash` |
| `TARGET_URL` | string | URL or file path |
| `FOCUS` | string | Specific criterion name or `full-audit` |
| `DISCOVER_STATES` | boolean | `true` \| `false` |
| `BOLDNESS_LEVEL` | integer \| null | `1` (Minimal), `2` (Medium), `3` (Bold). `null` for PP/CU. |
| `MAX_ITERATIONS` | integer | `0` (no limit) or positive integer. Capped by BOLDNESS_LEVEL for TRE. |
| `REFERENCE_TYPE` | string \| null | `url` \| `image` \| `description` \| `null` (PP/TRE always null; CU null = auto-discover from 21st.dev + inspiration KB) |
| `REFERENCE_VALUE` | string \| null | The reference URL, file path, description text, or `null` |
| `PREVIEW_MODE` | string | `confirm` \| `auto` (PP/TRE default confirm, CU default auto) |

These feed directly into orchestrator Steps 2-6.
</output-contract>
