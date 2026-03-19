---
name: fix
description: "Quick fix. Score, fix top 1-2 issues, re-score. One iteration, 30 seconds, done."
---

# Fix Mode

Score it. Fix the top issue. Re-score. Done.

Fix mode runs exactly ONE iteration of the design-loop engine: capture, score, fix the top 1-2 issues, verify, show before/after delta. It uses Polish-style constraints by default (safe, within tokens) unless the page has no design system, in which case it allows broader changes.

<MODE_SCORING>

## Scoring Weights

Fix mode uses **neutral weights** — same as score mode. The goal is accurate diagnosis, not mode-biased scoring.

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

<MODE_FIXING>

## Fix Constraints

Fix mode applies **conservative constraints** — like Polish, but limited to 1-2 fixes.

### Allowed

- Padding, margin, gap adjustments
- Border-radius normalization
- Font-size, font-weight, line-height corrections
- Color adjustments for contrast compliance
- Flexbox/grid alignment properties
- Max-width, overflow for clipping bugs
- Interactive state enrichment (hover, focus, active using existing tokens)
- Whitespace rhythm improvements

### Prohibited

- Changing font families (use /design-loop redesign for that)
- Adding colors not in existing palette/tokens
- Layout system changes (flex to grid, column count)
- Adding decorative elements, backgrounds, gradients
- Adding animations beyond hover/focus transitions
- Adding/removing HTML elements
- Adding npm dependencies

### Fix Strategy

1. **Pick the highest-impact fix** from the reviewer's top_issues
2. **Maximum 2 fixes** — fix mode is surgical, not comprehensive
3. **Token audit first** — verify which tokens exist before touching anything
4. **Build-verify each fix** — revert on failure (safety engine)
5. **Skip if uncertain** — when in doubt, report it instead of breaking it

## Theme Awareness

If BRAND_FINGERPRINT is available:

- ALL values must trace to tokens
- Theme fidelity hard gate: < 0.8 on re-score → revert
- If no tokens: fall back to matching existing patterns in the code

</MODE_FIXING>

## Completion

Fix mode has NO completion threshold — it always runs exactly once and stops.

- `max_iterations`: 1 (hardcoded, not configurable)
- No plateau/regression detection needed
- No satisfaction gate

## Output Format

```
Quick fix applied:
  Before: {before_avg}/5 → After: {after_avg}/5 ({delta:+0.0})
  Fixed: {description of what was fixed}
  Skipped: {issues noted but not fixed, if any}

Score card:
| Criterion   | Before | After | Delta |
|-------------|--------|-------|-------|
| Composition | {N}/5  | {N}/5 | {+/-} |
| Typography  | {N}/5  | {N}/5 | {+/-} |
| Color       | {N}/5  | {N}/5 | {+/-} |
| Identity    | {N}/5  | {N}/5 | {+/-} |
| Polish      | {N}/5  | {N}/5 | {+/-} |

Next steps:
  /design-fix {url}  — fix the next issue (30s)
  /design-loop {url} — full iteration loop (10min)
```
