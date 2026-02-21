---
name: design-loop
description: Use when user wants to visually iterate on UI/UX design using screenshots, when they say "design loop", "visual loop", "polish the UI", or want autonomous screenshot-driven frontend refinement
argument-hint: "[url] [iterations]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_run_code, mcp__plugin_playwright_playwright__browser_close, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__computer, mcp__claude-in-chrome__read_page, mcp__claude-in-chrome__find, mcp__claude-in-chrome__javascript_tool
---

# design-loop

Autonomous visual iteration loop for frontend UI/UX. Takes section-level screenshots, scores against 5 design criteria, fixes issues, repeats until polished. Automatically discovers and uses installed companion design skills (frontend-design, web-design-guidelines, etc.) to enrich its scoring with richer design taste.

Each iteration:
1. Take section-level screenshots of the target page
2. Score against 5 design criteria (anti-slop), enriched by companion skill guidance
3. Fix top 3 issues in code
4. Re-screenshot to verify
5. Repeat until all criteria met

## Phase 0: Dependency Check

```
1. CHECK Playwright MCP — try calling mcp__plugin_playwright_playwright__browser_navigate
   If unavailable: run `claude mcp add playwright -- npx -y @playwright/mcp@latest` via Bash
2. CHECK dev server — verify target URL responds
   If not running: tell user to start it and wait
```

## Phase 1: Context Scan

```
1. READ package.json → detect framework, component library, CSS approach
2. READ tailwind.config.* → extract design tokens (colors, spacing, fonts) if present
3. CHECK for component libraries (shadcn components.json, @radix-ui/*, @chakra-ui/*, etc.)
```

Store findings as `PROJECT_CONTEXT`.

```
4. DISCOVER companion design skills:
   a. Read ~/.claude/plugins/installed_plugins.json
   b. For each plugin, resolve its installPath
   c. Glob for skills/*/SKILL.md within each plugin path
   d. Read the frontmatter (name + description) of each skill found
   e. Filter to design-related skills by matching keywords in name or description:
      "design", "frontend", "ui", "ux", "css", "style", "animation", "visual"
   f. For each match, read the SKILL.md body and extract sections containing
      design guidance — look for headings with: "Guidelines", "Aesthetics",
      "Anti-pattern", "Rules", "Principles", "Constraints", "Do/Don't"
   g. Store as DESIGN_SKILLS: [{name, description, guidance_excerpt}]
   h. If no design skills found, note: "No companion design skills detected.
      Using built-in criteria only."
```

## Phase 2: Interview (3 questions via AskUserQuestion)

If arguments were passed via `$ARGUMENTS`:
- `$ARGUMENTS[0]` (url) → skip Q1, use as target URL
- `$ARGUMENTS[1]` (iterations) → skip Q3, use as max iterations

**Q1: Target** (skip if `$ARGUMENTS[0]` provided)
```
"Which page should I iterate on?"
Options: [current page URL] / [enter URL] / [file path to component]
```

**Q2: Focus**
```
"What aspects need the most improvement?"
Options (present in this exact order):
1. Composition & Layout
2. Typography
3. Color & Contrast
4. Visual Identity & Polish
5. Full audit — all criteria (Recommended)
```

**Q3: Iterations** (skip if `$ARGUMENTS[1]` provided)
```
"How many visual iterations?"
Options: 5 (quick polish) / 10 (thorough) / 20 (deep redesign) / No limit
```

`No limit` maps to `max_iterations: 0` in the state file.

## Phase 3: Section Screenshots

The core innovation — high-resolution section-level captures instead of tiny full-page images.

### Screenshot Strategy

Run this JS via `browser_run_code` or `browser_evaluate` to find semantic landmarks:

```js
(() => {
  const selectors = 'section, header, main, footer, article, [role="banner"], [role="main"], [role="contentinfo"]';
  const elements = [...document.querySelectorAll(selectors)]
    .filter(el => el.offsetHeight > 50 && el.offsetWidth > 100);
  return JSON.stringify({
    count: elements.length,
    sections: elements.map((el, i) => ({
      index: i,
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      className: (el.className || '').toString().split(' ').slice(0, 3).join(' '),
      height: el.offsetHeight,
      top: el.getBoundingClientRect().top + window.scrollY
    }))
  });
})()
```

**Decision: NODE MODE vs SCROLL MODE**

- **>= 3 landmarks found → NODE MODE**: For each section, scroll it into view and take a viewport screenshot. This gives high-resolution captures of each logical section.
  ```js
  // For each section:
  el.scrollIntoView({ block: 'start', behavior: 'instant' });
  ```
  Then call `browser_take_screenshot` for each.

- **< 3 landmarks → SCROLL MODE**: Take viewport-sized screenshots stepping down the page with 30% overlap.
  ```js
  (() => {
    const totalHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const step = Math.floor(viewportHeight * 0.7);
    const positions = [];
    for (let y = 0; y < totalHeight; y += step) {
      positions.push(y);
    }
    return JSON.stringify({ totalHeight, viewportHeight, step, positions });
  })()
  ```
  For each position: `window.scrollTo(0, position)` then `browser_take_screenshot`.

**Always take 1 overview shot** at the default viewport (no scroll) for context.

## Phase 4: Evaluate & Fix

### The 5 Criteria (anti-slop)

Score each 1–5 after every screenshot set:

| # | Criterion | What it measures | Anti-slop flags |
|---|-----------|-----------------|-----------------|
| 1 | **Composition** | Layout, spacing, visual flow. Elements breathe. Sections have rhythm. | Reject uniform grids — asymmetry and varied spacing create interest |
| 2 | **Typography** | Hierarchy through size/weight/tracking. Font pairing works. | Flag Inter/Roboto/system-ui defaults — consider display fonts for headings |
| 3 | **Color & Contrast** | Intentional palette, WCAG AA text contrast, interactive states visible | Flag purple gradients, gratuitous gradients, rainbow decorations |
| 4 | **Visual Identity** | Looks designed, not generated. Has a point of view. Passes the "portfolio test" — would a designer put this in their portfolio? | Flag generic card layouts, stock-photo hero patterns, default shadows |
| 5 | **Polish** | Alignment, consistency, details. Same pattern = same treatment. Edge cases handled. | Flag inconsistent border-radius, mixed spacing scales, orphaned elements |

### Companion Skill Enrichment

If DESIGN_SKILLS were discovered in Phase 1, apply their guidance when scoring and fixing:

- Read each companion skill's extracted guidance before scoring
- Use their aesthetic principles to inform what "score 5" looks like for each criterion
- When fixing issues, prefer approaches aligned with companion skill guidance
- If companion skills conflict with each other, prefer the most specific guidance
  (e.g., a design-system-rules skill overrides generic aesthetic guidance)

Priority order for guidance:
1. Project-specific (design tokens, component library conventions from Phase 1)
2. Companion skills with project-scoped install
3. Companion skills with user-scoped install
4. Built-in anti-slop flags (baseline — always active)

This means: if a user has `frontend-design` installed, its bold anti-slop
aesthetics (unique fonts, intentional palettes, unexpected layouts) enrich
the scoring. If they have `web-design-guidelines`, WCAG compliance and
interface patterns are weighted higher. If they have both, all of it applies.

If no companion skills are found, the built-in anti-slop flags in the
criteria table above are the sole design guidance.

### Scoring rubric

| Score | Meaning |
|-------|---------|
| 1 | Broken or clearly wrong |
| 2 | Functional but generic / AI-default |
| 3 | Acceptable, some intentional choices |
| 4 | Good — most designers would approve |
| 5 | Excellent — distinctive, polished, portfolio-worthy |

### Process (each iteration)

1. **SCREENSHOT**: Use Phase 3 strategy (node mode or scroll mode)
2. **ANALYZE**: Review screenshots against all 5 criteria. Score each 1–5. List top 3 issues by severity. Show score deltas from previous iteration.
3. **FIX**: Targeted CSS/component edits for top 3 issues.
   - Edit ONLY component/style files — no API/backend changes
   - Prefer existing design tokens and utility classes
   - One fix at a time, verify build passes
   - After each fix, explain WHY in one line
4. **VERIFY**: Re-screenshot after fixes. Confirm issues resolved. If new issues introduced, fix first.
5. **REPORT**: Output after each iteration:
   ```
   ITERATION [N]: Fixed [issue1], [issue2], [issue3]
   Scores: Comp:[x] Typo:[x] Color:[x] Ident:[x] Polish:[x] = Avg [x.x]/5
   Trend: [↑/↓/→] from [prev avg] → [current avg]
   ```
6. **LOG**: Append row to `.claude/design-loop-history.md`:
   ```
   | [N] | [Comp] | [Typo] | [Color] | [Ident] | [Polish] | [Avg] | [Focus] | [Changes] |
   ```
   Create file with header on first iteration if it doesn't exist.
   On completion, append summary block with start → finish avg and key improvements.

### Constraints

- ONLY edit frontend files (components, styles, layout)
- NEVER change API routes, services, or database code
- NEVER add npm dependencies
- Preserve existing functionality — visual-only changes
- Use project's existing design system and tokens

### Stuck handling

If a criterion score is unchanged after targeting it in the previous iteration:
- Try alternative approach (padding fix → layout restructure, color fix → font change)
- After 3 attempts on same criterion with no improvement: skip with documented reason, add TODO comment

## Phase 5: Loop Control

**Write state file BEFORE iteration 1** — the stop hook depends on it:

```yaml
---
status: running
iteration: 0
max_iterations: [from Q3, 0 for no limit]
started_at: "[ISO timestamp]"
---

[Phase 4 process prompt — fed back by stop hook each iteration]
```

Execute iterations. After each:
1. Update `iteration` count in `.claude/design-loop.state.md` frontmatter
2. Check completion:
   - ALL 5 criteria >= 4/5 for 2 consecutive iterations → output `<promise>POLISHED</promise>`
   - `max_iterations > 0` and iteration >= max_iterations → stop with final summary
   - `max_iterations = 0` → no iteration limit, continue until POLISHED
3. The stop hook intercepts session exit:
   - If `<promise>POLISHED</promise>` was output → session exits cleanly
   - If max iterations reached → session exits with summary
   - Otherwise → same prompt fed back for next iteration

On completion, update state to `status: completed`.
Suggest: "Run /export-loop to generate a shareable summary of this run."
