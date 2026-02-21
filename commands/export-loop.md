---
name: export-loop
description: Export a shareable summary of the most recent design-loop run
arguments: []
---

# /export-loop

Generate a rich, visually satisfying summary of the most recent design-loop run and a self-contained HTML report for sharing.

## Instructions

1. Read `.claude/design-loop-history.md`
2. If the file doesn't exist, tell the user: "No design-loop history found. Run /design-loop first."
3. Extract the most recent run (everything after the last `## Run` header, or the entire file if only one run)
4. Parse the score table rows. The table may use either format:
   - **5-criteria** (v1.0.0): Comp, Typo, Color, Ident, Polish
   - **8-criteria** (legacy): S, H, C, A, D, Co, T, E — map to Avg only
5. Also read `.claude/design-loop.state.md` for timing info (started_at) if available.
6. Read `package.json` for the project name, or use the git repo name.
7. Generate `.claude/design-loop-report.html` using the HTML Report template below.

## Output Format — Markdown

Generate the following markdown summary and output it for the user to copy:

```markdown
# design-loop

> [project name] — [run title from history, e.g., "Baseline Polish"]

## Score

[start avg as X.X] → [final avg as X.X] across [N] iterations

## Progression

[For each criterion, show a single-line visual of how it progressed:]

Composition  [start]/5 [ascii bar] [end]/5  [+delta or "—"]
Typography   [start]/5 [ascii bar] [end]/5  [+delta or "—"]
Color        [start]/5 [ascii bar] [end]/5  [+delta or "—"]
Identity     [start]/5 [ascii bar] [end]/5  [+delta or "—"]
Polish       [start]/5 [ascii bar] [end]/5  [+delta or "—"]

[The ASCII bar uses: ░ for empty, ▓ for start score, █ for gained score]
[Example for 2→4: "▓▓██░" — 2 dark blocks (start), 2 solid (gained), 1 empty]
[Example for 3→5: "▓▓▓██" — 3 dark, 2 gained, 0 empty]
[Example for 4→4: "████░" — 4 solid (no change), 1 empty]

## Iteration Log

| #  | Avg  | Δ    | Focus                | Key Fix                          |
|----|------|------|----------------------|----------------------------------|
[For each iteration row, extract: number, avg score, delta from previous,
 the Focus column value, and a shortened version of the Changes column]

## Key Improvements

[Top 3 criteria that improved the most, formatted as:]
- **[Criterion]**: [start] → [end] (+[delta]) — [one-line summary of what changed]

## Stats

- **Iterations**: [N]
- **Final avg**: [X.X]/5
- **All criteria ≥ 4**: [Yes ✓ / No — list which are below]
- **Stuck recovery**: [count of times a criterion was targeted 2+ times, or "None needed"]
[If started_at is available from state file:]
- **Duration**: [approximate from started_at to now, or "~[N] iterations"]

---

*Polished with [design-loop](https://github.com/tonymfer/design-loop) — autonomous visual iteration for Claude Code*
```

## ASCII Bar Construction

For each criterion, build a 5-character bar representing scores 1-5:

```
Score 1→3:  "▓███░"  — no wait, here's the actual logic:

start_score = first iteration score for this criterion
end_score = final iteration score for this criterion

bar = ""
for position 1 to 5:
  if position <= start_score: bar += "▓"    (baseline — you started here)
  elif position <= end_score:  bar += "█"    (gained — improvement!)
  else:                        bar += "░"    (remaining headroom)

Examples:
  2 → 4:  ▓▓██░
  3 → 5:  ▓▓▓██
  4 → 4:  ▓▓▓▓░  (no change)
  1 → 5:  ▓████  (massive improvement)
  4 → 5:  ▓▓▓▓█
```

## Output Format — HTML Report

After generating the markdown summary, also generate a self-contained HTML report at `.claude/design-loop-report.html`.

### Generation Steps

1. **Compute chart data** — For each iteration, collect all criterion scores + compute the average
2. **Build SVG** — Create an inline `<svg>` line chart with one polyline per criterion
3. **Assemble HTML** — Fill the template below with actual data values

### Criterion Color Mapping

| Criterion | Color | Var |
|-----------|-------|-----|
| Composition | `#06b6d4` | cyan |
| Typography | `#8b5cf6` | violet |
| Color & Contrast | `#f59e0b` | amber |
| Identity | `#10b981` | emerald |
| Polish | `#f43f5e` | rose |
| Average | `#e5e5e5` | white, dashed |

For **8-criteria legacy** format, use these 8 colors in order:
`#06b6d4`, `#8b5cf6`, `#f59e0b`, `#10b981`, `#f43f5e`, `#3b82f6`, `#ec4899`, `#a855f7`

### SVG Chart Math

- ViewBox: `0 0 720 320`
- Background: `#111111` rounded rect with `rx="8"`
- Plot area: left=60, right=20, top=20, bottom=40 → 640×260 usable space
- X coordinate: `x(iter) = 60 + (iterIndex / (maxIters - 1)) * 640`
  - Single iteration: center at `x = 60 + 320 = 380`
- Y coordinate: `y(score) = 20 + ((5 - score) / 4) * 260`
  - Score 5 → y=20 (top), Score 1 → y=280 (bottom)
- Horizontal gridlines at scores 1–5, stroke `#262626`, labeled on y-axis in `#737373`
- Each criterion: `<polyline>` (fill none, stroke criterion color, stroke-width 2) + `<circle r="3">` at each data point
- Average line: same but `stroke-dasharray="6 4"` and stroke `#e5e5e5`
- X-axis labels: iteration numbers in `#737373`

### HTML Template

Generate this exact structure, replacing all `{placeholder}` values with actual data:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>design-loop report — {PROJECT_NAME}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a0a; color: #e5e5e5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    line-height: 1.6; padding: 40px 20px;
  }
  .container { max-width: 720px; margin: 0 auto; }
  .hero { text-align: center; margin-bottom: 48px; }
  .hero h1 { font-size: 14px; text-transform: uppercase; letter-spacing: 3px; color: #737373; margin-bottom: 8px; }
  .hero .project { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  .hero .run-title { font-size: 14px; color: #737373; margin-bottom: 24px; }
  .hero .scores { display: flex; align-items: baseline; justify-content: center; gap: 16px; }
  .hero .score-big { font-size: 56px; font-weight: 800; line-height: 1; }
  .hero .score-start { color: #737373; }
  .hero .score-arrow { font-size: 24px; color: #737373; }
  .hero .score-end { color: #06b6d4; }
  .hero .iterations { font-size: 14px; color: #737373; margin-top: 8px; }

  .section { margin-bottom: 40px; }
  .section-title {
    font-size: 11px; text-transform: uppercase; letter-spacing: 2px;
    color: #737373; margin-bottom: 16px;
    padding-bottom: 8px; border-bottom: 1px solid #262626;
  }

  .chart-container { margin-bottom: 40px; }
  .chart-container svg { width: 100%; height: auto; display: block; }

  .legend { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; justify-content: center; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #737373; }
  .legend-swatch { width: 16px; height: 3px; border-radius: 1px; }

  .progress-bars { display: flex; flex-direction: column; gap: 12px; }
  .bar-row { display: flex; align-items: center; gap: 12px; }
  .bar-label { width: 120px; font-size: 13px; color: #737373; text-align: right; flex-shrink: 0; }
  .bar-track { flex: 1; height: 24px; background: #1a1a1a; border-radius: 4px; overflow: hidden; position: relative; }
  .bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
  .bar-score { width: 40px; font-size: 13px; text-align: right; flex-shrink: 0; }
  .bar-delta { width: 50px; font-size: 12px; flex-shrink: 0; }
  .delta-positive { color: #10b981; }
  .delta-negative { color: #f43f5e; }
  .delta-zero { color: #737373; }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 8px 12px; color: #737373; font-weight: 500;
       border-bottom: 1px solid #262626; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  td { padding: 8px 12px; border-bottom: 1px solid #1a1a1a; }
  tr:nth-child(even) td { background: #111111; }
  td.num { text-align: center; font-variant-numeric: tabular-nums; }
  td.delta-cell { font-variant-numeric: tabular-nums; }

  .improvements { list-style: none; }
  .improvements li { padding: 8px 0; border-bottom: 1px solid #1a1a1a; font-size: 14px; }
  .improvements li:last-child { border-bottom: none; }
  .imp-criterion { font-weight: 600; }
  .imp-scores { color: #737373; font-size: 13px; }

  .footer {
    text-align: center; margin-top: 48px; padding-top: 24px;
    border-top: 1px solid #262626; font-size: 12px; color: #737373;
  }
  .footer a { color: #06b6d4; text-decoration: none; }
  .footer a:hover { text-decoration: underline; }
</style>
</head>
<body>
<div class="container">

  <!-- HERO -->
  <div class="hero">
    <h1>design-loop</h1>
    <div class="project">{PROJECT_NAME}</div>
    <div class="run-title">{RUN_TITLE}</div>
    <div class="scores">
      <span class="score-big score-start">{START_AVG}</span>
      <span class="score-arrow">→</span>
      <span class="score-big score-end">{END_AVG}</span>
    </div>
    <div class="iterations">across {N} iterations</div>
  </div>

  <!-- SVG CHART -->
  <div class="chart-container">
    <div class="section-title">Score Progression</div>
    <svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="720" height="320" fill="#111111" rx="8"/>
      <!-- Gridlines at scores 1-5 -->
      <!-- For each score s in [1,2,3,4,5]:
           y = 20 + ((5 - s) / 4) * 260
           <line x1="60" y1="{y}" x2="700" y2="{y}" stroke="#262626" stroke-width="1"/>
           <text x="52" y="{y+4}" text-anchor="end" fill="#737373" font-size="11">{s}</text>
      -->
      {GRIDLINES}
      <!-- For each criterion, a polyline + circles -->
      <!-- <polyline points="{x1},{y1} {x2},{y2} ..." fill="none" stroke="{COLOR}" stroke-width="2"/>
           <circle cx="{x}" cy="{y}" r="3" fill="{COLOR}"/> for each point -->
      {CHART_LINES}
      <!-- X-axis iteration labels -->
      {X_LABELS}
    </svg>
    <div class="legend">
      <!-- <div class="legend-item"><div class="legend-swatch" style="background:{COLOR}"></div>{NAME}</div> -->
      {LEGEND_ITEMS}
    </div>
  </div>

  <!-- PROGRESS BARS -->
  <div class="section">
    <div class="section-title">Criteria</div>
    <div class="progress-bars">
      <!-- For each criterion:
      <div class="bar-row">
        <div class="bar-label">{CRITERION_NAME}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width: {(END_SCORE/5)*100}%; background: {COLOR};"></div>
        </div>
        <div class="bar-score">{END_SCORE}/5</div>
        <div class="bar-delta {delta-positive|delta-negative|delta-zero}">
          {+DELTA or — if zero}
        </div>
      </div>
      -->
      {PROGRESS_BARS}
    </div>
  </div>

  <!-- ITERATION LOG -->
  <div class="section">
    <div class="section-title">Iteration Log</div>
    <table>
      <thead>
        <tr><th>#</th><th>Avg</th><th>Δ</th><th>Focus</th><th>Key Fix</th></tr>
      </thead>
      <tbody>
        <!-- For each iteration:
        <tr>
          <td class="num">{ITER_NUM}</td>
          <td class="num">{AVG}</td>
          <td class="num delta-cell {delta-positive|delta-negative|delta-zero}">{DELTA}</td>
          <td>{FOCUS}</td>
          <td>{KEY_FIX — truncate to ~60 chars with ellipsis}</td>
        </tr>
        -->
        {TABLE_ROWS}
      </tbody>
    </table>
  </div>

  <!-- KEY IMPROVEMENTS -->
  <div class="section">
    <div class="section-title">Key Improvements</div>
    <ul class="improvements">
      <!-- Top 3 criteria by improvement:
      <li>
        <span class="imp-criterion">{CRITERION}</span>
        <span class="imp-scores">{START} → {END} (+{DELTA})</span>
        — {one-line summary}
      </li>
      -->
      {IMPROVEMENTS}
    </ul>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    Polished with <a href="https://github.com/tonymfer/design-loop">design-loop</a> — autonomous visual iteration for Claude Code
  </div>

</div>
</body>
</html>
```

### Template Fill Rules

- Replace `{placeholder}` values by constructing the actual HTML elements described in the comments
- Remove all `<!-- comment -->` template instructions from the final output
- Compute SVG coordinates using the chart math above
- For **single iteration**: show only circles (no polylines), progress bars show score with no delta
- For **score regressions** (delta < 0): use `delta-negative` class (renders `#f43f5e` red)
- **Truncate** "Key Fix" / "Changes" text to ~60 characters with `…` if longer
- Write the completed HTML to `.claude/design-loop-report.html`

## Output Rules

- Output the full markdown summary as a single code block so the user can copy it
- After the code block, say: "Copy this into a PR description, tweet, or README."
- Also say: "HTML report saved to `.claude/design-loop-report.html` — open in browser to view or screenshot for sharing."
- If the run achieved all criteria ≥ 4/5, add a congratulatory note: "All 5 criteria hit 4/5+. Your UI is polished."
- Keep it concise — the visual bars and table do the heavy lifting
