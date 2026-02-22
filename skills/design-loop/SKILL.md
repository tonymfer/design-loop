---
name: design-loop
description: Use when user wants to visually iterate on UI/UX design using screenshots, when they say "design loop", "visual loop", "polish the UI", or want autonomous screenshot-driven frontend refinement
argument-hint: "[url] [iterations]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
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
1. CHECK agent-browser — run `agent-browser --version` via Bash
   If unavailable: run `npm install -g agent-browser && agent-browser install` via Bash
2. GUARD: Check for concurrent design-loop sessions:
   - Run: ls .claude/design-loop.state-*.md 2>/dev/null
   - For each state file found, check if status is "running"
   - If any running session found: warn user:
     "Another design-loop is already running. Finish it first or run /design-loop on a different project."
   - Stop — do NOT proceed with a second concurrent session
3. OPEN browser session: `agent-browser --headed open <url>`
   --headed shows the browser window so the user can watch the loop work.
   The browser daemon persists between commands — no re-launch per step.
4. WAIT for page load: `agent-browser wait --load networkidle`
5. CHECK target URL — verify the page loaded (check for errors in output)
   If it responds: proceed
   If not: run the dev server recovery sequence below
```

### Dev Server Recovery

When the target URL doesn't respond:

```
1. SCAN for running dev servers:
   - Run: lsof -i :3000 -i :3001 -i :4321 -i :5173 -i :5174 -i :8080 -i :8081
   - If a server is found on a different port, ask: "Found a dev server on port [X]. Use that instead?"

2. If no server found, AUTO-START based on package.json:
   - Read package.json scripts for "dev", "start", or "serve"
   - Run the dev command in background: `npm run dev &` (or yarn/pnpm/bun equivalent)
   - Wait up to 15 seconds, polling every 2s with curl
   - If it starts: proceed with the detected URL
   - If it fails: tell user "Could not start dev server. Run it manually and try again."

3. VERIFY the URL actually serves HTML (not a JSON API or error page):
   - Check Content-Type header contains "text/html"
   - If not HTML: warn user "URL returns [content-type], not HTML. Is this the right page?"
```

This runs ONCE at the start. If the server dies mid-loop, the infrastructure stuck detection (Phase 4) handles it.

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

**Q2.5: Sub-screens**
```
"Should I discover and iterate on sub-screens within this page (tabs, modals, drawers)?"
Options:
1. Yes, discover all interactive states (Recommended)
2. No, just the default view
```

Store the answer as `DISCOVER_STATES` (true/false).

**Q3: Iterations** (skip if `$ARGUMENTS[1]` provided)
```
"How many visual iterations?"
Options: 5 (quick polish) / 10 (thorough) / 20 (deep redesign) / No limit
```

`No limit` maps to `max_iterations: 0` in the state file.

## Phase 3: Section Screenshots

The core innovation — high-resolution section-level captures instead of tiny full-page images.

### Screenshot Strategy

Find semantic landmarks via `agent-browser eval --stdin`:

```bash
agent-browser eval --stdin <<'JS'
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
JS
```

**Decision: NODE MODE vs SCROLL MODE**

- **>= 3 landmarks found → NODE MODE**: For each section, scroll it into view and take an annotated viewport screenshot. This gives high-resolution captures of each logical section.

  Scroll each section into view:
  ```bash
  agent-browser eval "document.querySelectorAll('section, header, main, footer, article')[N].scrollIntoView({block:'start',behavior:'instant'})"
  ```
  Then capture with annotated element labels:
  ```bash
  agent-browser screenshot section-N.png --annotate
  ```
  The `--annotate` flag overlays numbered labels on interactive elements — these correspond to `@e` refs and give richer context for scoring. Use `Read` tool to view the saved image.

- **< 3 landmarks → SCROLL MODE**: Take viewport-sized screenshots stepping down the page with 30% overlap.
  ```bash
  agent-browser eval --stdin <<'JS'
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
  JS
  ```
  For each position: `agent-browser eval "window.scrollTo(0, <position>)"` then `agent-browser screenshot scroll-N.png --annotate`. Use `Read` tool to view the saved image.

**Always take 1 overview shot** at the default viewport (no scroll) for context:
```bash
agent-browser screenshot overview.png --annotate
```
Use `Read` tool to view the saved image.

### Responsive Pass

After completing the desktop screenshots above, cycle through a mobile viewport:

```bash
agent-browser set viewport 375 667
agent-browser screenshot mobile-overview.png --annotate
agent-browser set viewport 1440 900
```

Use `Read` tool to view the mobile screenshot. Flag any responsive breakage (overflow, stacked elements colliding, text too small) as Polish issues in Phase 4.

## Phase 3.5: State Discovery

**Skip this phase if `DISCOVER_STATES` is false.**

After initial screenshots, discover interactive states within the page. Run a JS probe via `agent-browser eval --stdin`:

```bash
agent-browser eval --stdin <<'JS'
(() => {
  const states = { tabs: [], modals: [], navItems: [], accordions: [] };

  // Tab panels: [role="tablist"], [data-state], .tab, [aria-selected]
  document.querySelectorAll('[role="tablist"] [role="tab"], [data-state], [aria-selected]').forEach(el => {
    const label = el.textContent?.trim().slice(0, 50) || el.getAttribute('aria-label') || '';
    const isActive = el.getAttribute('aria-selected') === 'true'
      || el.getAttribute('data-state') === 'active'
      || el.classList.contains('active');
    if (label) {
      states.tabs.push({
        label,
        selector: el.id ? '#' + el.id : `[role="tab"]:nth-child(${Array.from(el.parentElement.children).indexOf(el) + 1})`,
        active: isActive
      });
    }
  });

  // Navigation items: bottom nav, sidebar links, screen switchers
  document.querySelectorAll('nav a, [role="navigation"] a, [data-screen]').forEach(el => {
    const label = el.textContent?.trim().slice(0, 50) || el.getAttribute('aria-label') || '';
    const href = el.getAttribute('href') || '';
    if (label && !states.navItems.find(n => n.label === label)) {
      states.navItems.push({ label, href, selector: el.id ? '#' + el.id : null });
    }
  });

  // Modals/drawers: buttons with aria-haspopup, data-dialog-trigger
  document.querySelectorAll('[aria-haspopup], [data-dialog-trigger], [data-modal-trigger]').forEach(el => {
    const label = el.textContent?.trim().slice(0, 50) || el.getAttribute('aria-label') || '';
    if (label) {
      states.modals.push({
        trigger: el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
        label
      });
    }
  });

  // Accordions/collapsibles
  document.querySelectorAll('details > summary, [role="button"][aria-expanded]').forEach(el => {
    const label = el.textContent?.trim().slice(0, 50) || '';
    if (label) {
      states.accordions.push({ label, expanded: el.parentElement?.open || el.getAttribute('aria-expanded') === 'true' });
    }
  });

  const total = states.tabs.length + states.modals.length + states.navItems.length + states.accordions.length;
  return JSON.stringify({ ...states, totalStates: total });
})()
JS
```

Store the result as `DISCOVERED_STATES`.

If `totalStates > 0`, iterate through each discovered state:

```
For each inactive tab in DISCOVERED_STATES.tabs:
  1. Click the tab: agent-browser eval "document.querySelector('<selector>').click()"
  2. Wait for render: agent-browser wait 500
  3. Screenshot using Phase 3 strategy (node mode or scroll mode)
     - Name files: state-tab-<label>-section-N.png
  4. Store screenshots with state metadata: { state: "tab:<label>", screenshots: [...] }
  5. Return to default state by clicking the originally-active tab

For each modal trigger in DISCOVERED_STATES.modals:
  1. Click the trigger: agent-browser eval "document.querySelector('<trigger>').click()"
  2. Wait for animation: agent-browser wait 800
  3. Screenshot the modal overlay: agent-browser screenshot state-modal-<label>.png --annotate
  4. Close the modal: agent-browser eval "document.querySelector('[data-dismiss], [aria-label=\"Close\"], dialog button, .modal-close')?.click() || document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))"
  5. Wait: agent-browser wait 500

For each accordion in DISCOVERED_STATES.accordions (if not expanded):
  1. Click to expand
  2. Screenshot
  3. Click to collapse (restore state)
```

All state screenshots feed into Phase 4 alongside the default-view screenshots. Each discovered state gets its own score row in the evaluation.

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

### CSS Layout Audit

Run this once per iteration alongside screenshots via `agent-browser eval --stdin`. It catches structural bugs invisible at screenshot scale (e.g., unequal card heights in grids, overflow clipping):

```bash
agent-browser eval --stdin <<'JS'
(() => {
  const issues = [];

  // Check grid rows for unequal card heights.
  // CSS Grid stretches direct children (wrappers), but visible cards
  // inside wrappers may not fill them — causing ragged row bottoms.
  document.querySelectorAll('[class*="grid"]').forEach(grid => {
    const style = getComputedStyle(grid);
    if (style.display !== 'grid') return;
    const children = [...grid.children].filter(c => c.offsetHeight > 0);
    if (children.length < 2) return;

    // Group children by row (bucket by approximate top position)
    const rows = {};
    children.forEach(c => {
      const key = Math.round(c.getBoundingClientRect().top / 10) * 10;
      (rows[key] = rows[key] || []).push(c);
    });

    // For each row, compare inner card heights (first child of each wrapper)
    Object.values(rows).forEach(row => {
      if (row.length < 2) return;
      const cards = row.map(w => w.firstElementChild).filter(Boolean);
      if (cards.length < 2) return;
      const heights = cards.map(c => c.offsetHeight);
      const max = Math.max(...heights);
      const min = Math.min(...heights);
      if (max - min > 4) {
        issues.push({
          type: 'unequal-card-heights-in-row',
          grid: grid.className.split(' ').slice(0, 3).join(' '),
          delta: max - min + 'px',
          cards: cards.map(c => ({
            class: c.className.split(' ').slice(0, 3).join(' '),
            height: c.offsetHeight
          }))
        });
      }
    });
  });

  // Check for horizontal overflow
  const body = document.body;
  if (body.scrollWidth > body.clientWidth) {
    issues.push({
      type: 'horizontal-overflow',
      overflow: (body.scrollWidth - body.clientWidth) + 'px'
    });
  }

  return JSON.stringify({ issues, count: issues.length });
})()
JS
```

If issues are found, include them alongside screenshot-based observations when scoring. These count as Polish issues.

### Process (each iteration)

1. **SCREENSHOT**: Use Phase 3 strategy (node mode or scroll mode + responsive pass). If `DISCOVER_STATES` is true, also re-run Phase 3.5 to capture all discovered states.
2. **AUDIT**: Run the CSS Layout Audit JS above. Merge any issues found into the analysis.
3. **ANALYZE**: Review ALL screenshots (default view + discovered states) against all 5 criteria. Score each state independently. List top 3 issues by severity across all states. Show score deltas from previous iteration.
4. **FIX**: Targeted CSS/component edits for top 3 issues.
   - Before editing code, save browser state for rollback:
     `agent-browser state save .claude/design-loop-state-N.json`
     (where N = current iteration number)
   - If a fix breaks the page (blank screen, crash), rollback:
     `agent-browser state load .claude/design-loop-state-N.json`
   - Edit ONLY component/style files — no API/backend changes
   - Prefer existing design tokens and utility classes
   - One fix at a time, verify build passes
   - After each fix, explain WHY in one line
5. **VERIFY**: Re-screenshot after fixes. Confirm issues resolved. If new issues introduced, fix first.
6. **REPORT**: Output after each iteration:
   ```
   ITERATION [N]: Fixed [issue1], [issue2], [issue3]
   Scores: Comp:[x] Typo:[x] Color:[x] Ident:[x] Polish:[x] = Avg [x.x]/5
   Trend: [↑/↓/→] from [prev avg] → [current avg]
   ```
7. **LOG**: Append row to `.claude/design-loop-history.md`:
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

**Per-criterion**: If a criterion score is unchanged after targeting it in the previous iteration:
- Try alternative approach (padding fix → layout restructure, color fix → font change)
- After 3 attempts on same criterion with no improvement: skip with documented reason, add TODO comment

**Overall loop**: If the average score has not improved for 3 consecutive iterations:
- Stop the loop early, output `<promise>POLISHED</promise>` with a note: "Plateau reached — further iterations unlikely to improve scores."
- This prevents infinite churning when all easy wins are exhausted

**Infrastructure**: If a screenshot or navigation fails:
- Check `agent-browser errors` for page errors
- Retry once after `agent-browser wait 3000`
- If it fails again, stop the loop with status "error" and tell the user: "Screenshot failed — is the dev server still running?"
- Do NOT keep iterating blindly without visual feedback

## Phase 5: Loop Control

**State file naming:** Use session-scoped state files to allow concurrent sessions on different projects:

```
.claude/design-loop.state-${CLAUDE_SESSION_ID}.md
```

Where `$CLAUDE_SESSION_ID` is the session ID from the Claude Code environment. If unavailable, fall back to `.claude/design-loop.state.md`.

**Write state file BEFORE iteration 1** — the stop hook depends on it:

```yaml
---
status: running
iteration: 0
max_iterations: [from Q3, 0 for no limit]
started_at: "[ISO timestamp]"
discover_states: [true/false from Q2.5]
---

[Phase 4 process prompt — fed back by stop hook each iteration]
```

Execute iterations. After each:
1. Update `iteration` count in the session-scoped state file frontmatter
2. Check completion:
   - ALL 5 criteria >= 4/5 for 2 consecutive iterations (across ALL states if discovery is on) → output `<promise>POLISHED</promise>`
   - `max_iterations > 0` and iteration >= max_iterations → stop with final summary
   - `max_iterations = 0` → no iteration limit, continue until POLISHED
3. The stop hook intercepts session exit:
   - If `<promise>POLISHED</promise>` was output → session exits cleanly
   - If max iterations reached → session exits with summary
   - Otherwise → same prompt fed back for next iteration

On completion, update state to `status: completed`.

### Cleanup

On completion (POLISHED or max iterations reached), close the browser and delete all screenshot files created during this run:

```bash
agent-browser close
rm -f design-loop-*.png section-*.png scroll-*.png overview.png mobile-overview.png
rm -f state-tab-*.png state-modal-*.png state-accordion-*.png
rm -f .claude/design-loop-state-*.json
```

These are ephemeral working files — the scores and changes are preserved in `.claude/design-loop-history.md`.

### Completion Message

Output this at the end of a successful run:

```
✓ POLISHED — all criteria ≥ 4/5 for 2 consecutive iterations.
  [start avg]/5 → [final avg]/5 across [N] iterations.
  Cleaned up [N] screenshot files.

Run /design-loop:export-loop to generate a shareable summary with score progression.
```
