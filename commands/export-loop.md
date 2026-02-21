---
name: export-loop
description: Export a shareable summary of the most recent design-loop run
arguments: []
---

# /export-loop

Generate a rich, visually satisfying summary of the most recent design-loop run.

## Instructions

1. Read `.claude/design-loop-history.md`
2. If the file doesn't exist, tell the user: "No design-loop history found. Run /design-loop first."
3. Extract the most recent run (everything after the last `## Run` header, or the entire file if only one run)
4. Parse the score table rows. The table may use either format:
   - **5-criteria** (v1.0.0): Comp, Typo, Color, Ident, Polish
   - **8-criteria** (legacy): S, H, C, A, D, Co, T, E — map to Avg only
5. Also read `.claude/design-loop.state.md` for timing info (started_at) if available.
6. Read `package.json` for the project name, or use the git repo name.

## Output Format

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

## Output Rules

- Output the full summary as a single code block so the user can copy it
- After the code block, say: "Copy this into a PR description, tweet, or README."
- If the run achieved all criteria ≥ 4/5, add a congratulatory note: "All 5 criteria hit 4/5+. Your UI is polished."
- Keep it concise — the visual bars and table do the heavy lifting
