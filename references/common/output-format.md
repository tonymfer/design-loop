# Output Format

## Iteration Report

Output after each iteration:

```
ITERATION [N]: Fixed [issue1], [issue2], [issue3]
Scores: Comp:[x] Typo:[x] Color:[x] Ident:[x] Polish:[x] = Avg [x.x]/5
Trend: [up/down/flat] from [prev avg] → [current avg]
```

## History Log

Append row to `.claude/design-loop-history.md`:

```
| [N] | [Comp] | [Typo] | [Color] | [Ident] | [Polish] | [Avg] | [Focus] | [Changes] |
```

Create file with header on first iteration if it doesn't exist:

```markdown
# Design Loop History

| Iter | Comp | Typo | Color | Ident | Polish | Avg | Focus | Changes |
|------|------|------|-------|-------|--------|-----|-------|---------|
```

On completion, append summary block with start → finish avg and key improvements.

## Completion Message

```
POLISHED — all criteria >= 4/5 for 2 consecutive iterations.
  Mode: [MODE] | [start avg]/5 → [final avg]/5 across [N] iterations.
  Cleaned up [N] screenshot files.

Run /design-loop:export-loop to generate a shareable summary.
```

## Cleanup

On completion (POLISHED or max iterations reached):

```bash
agent-browser close
rm -f design-loop-*.png section-*.png scroll-*.png overview.png mobile-overview.png
rm -f state-tab-*.png state-modal-*.png state-accordion-*.png
rm -f .claude/design-loop-state-*.json
```

These are ephemeral working files — the scores and changes are preserved in `.claude/design-loop-history.md`.
