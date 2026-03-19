---
name: score
description: "Visual score card. One screenshot, one score, done. No fixing, no loop. Fast visual feedback in 5 seconds."
---

# Score Mode

See where you stand. One screenshot, one score card, zero changes.

Score mode takes a single screenshot of your page, runs the full 5-criteria visual review, and returns a score card with the top issues and recommended fixes. It never modifies any files.

This is the fastest way to get visual feedback that requires a browser. For code-only analysis, use `/design-lint`.

<MODE_SCORING>

## Scoring Weights

Score mode uses **neutral weights** — all criteria scored equally with no mode bias.

| Criterion        | Weight | Sensitivity                                    |
| ---------------- | ------ | ---------------------------------------------- |
| Composition      | 1.0x   | Standard composition evaluation                |
| Typography       | 1.0x   | Standard hierarchy and readability check       |
| Color & Contrast | 1.0x   | Standard palette + WCAG AA check               |
| Visual Identity  | 1.0x   | Standard "does this look designed?" evaluation |
| Polish           | 1.0x   | Standard consistency + rendering defect check  |

### Score 5 Calibration

- **Composition 5**: Intentional layout with varied spacing, asymmetric sections, clear visual flow.
- **Typography 5**: Clear hierarchy, complementary fonts, dramatic size jumps, tuned line-height.
- **Color 5**: Intentional palette with personality. All text passes WCAG AA.
- **Identity 5**: Looks designed, not generated. Portfolio-worthy.
- **Polish 5**: Pixel-perfect. Consistent radii, shadows, spacing. No rendering defects.

</MODE_SCORING>

## Output Format

Score mode outputs a **score card** — a compact summary designed for quick reading:

```
Design Score: {weighted_average}/5

| Criterion   | Score | Issue                          |
|-------------|-------|--------------------------------|
| Composition | {N}/5 | {top issue or "—"}             |
| Typography  | {N}/5 | {top issue or "—"}             |
| Color       | {N}/5 | {top issue or "—"}             |
| Identity    | {N}/5 | {top issue or "—"}             |
| Polish      | {N}/5 | {top issue or "—"}             |

Top 3 fixes:
1. {most impactful fix with specific CSS/Tailwind values}
2. {second fix}
3. {third fix}

Next steps:
  /design-fix {url}  — auto-fix top issues (30s)
  /design-loop {url} — full iteration loop (10min)
```

## Workflow

Score mode follows a **shortened orchestrator path** — no loop, no fixing:

```
Step 1: Quick start — get target URL (skip mode question, mode is "score")
Step 2: Context scan — project detection + companion skill discovery
Step 3: Brand fingerprint — token extraction
Step 4: Browser setup + single screenshot (baseline-init)
Step 5: Spawn reviewer subagent (visual-reviewer.md, neutral weights)
Step 6: Format score card output
Step 7: Close browser, clean up screenshots
```

No iteration loop. No file modifications. No safety engine needed.
