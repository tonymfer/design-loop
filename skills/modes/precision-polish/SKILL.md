---
name: precision-polish
description: "Surgical CSS fixes only. Minimal risk. Stays within existing layout. Recommended for production sites."
---

# Precision Polish Mode

Conservative, targeted CSS fixes. Zero layout changes. The safest mode for production sites where visual regression risk must be minimal.

## Scoring Weights

All 5 criteria are scored at equal weight. This mode cares most about alignment, consistency, and spacing — not creative ambition.

| Criterion | Weight | Sensitivity |
|-----------|--------|-------------|
| Composition | 1.0x | Flag spacing inconsistencies > 4px, misaligned elements |
| Typography | 1.0x | Flag only: wrong hierarchy, unreadable sizes, clipped text |
| Color & Contrast | 1.0x | Flag only: WCAG AA failures, invisible interactive states |
| Visual Identity | 1.0x | Acknowledge but do NOT attempt to fix — out of scope |
| Polish | 1.0x | Core focus — every pixel inconsistency matters. No structural changes. Basic rendering check. |

### What "score 5" means in this mode

- **Composition 5**: Every element has consistent spacing. Grid items align. Sections breathe evenly.
- **Typography 5**: Clear hierarchy. No orphaned headings, no text clipping, readable at all sizes.
- **Color 5**: All text passes WCAG AA. Interactive elements have visible hover/focus states.
- **Identity 5**: N/A — this mode does not target identity improvements.
- **Polish 5**: Pixel-perfect consistency. Same border-radius everywhere. No mixed spacing scales.

## Fix Constraints

### Allowed Changes

- Padding, margin, gap adjustments (spacing fixes)
- Border-radius normalization
- Font-size, font-weight, line-height corrections
- Color value adjustments for contrast compliance
- Flexbox/grid alignment properties (align-items, justify-content)
- Opacity, visibility for interactive state fixes
- Max-width, overflow for clipping/overflow bugs

### Prohibited Changes

- Layout restructuring (changing flex→grid, reordering sections)
- Adding or removing HTML elements
- Changing fonts or font families
- Adding new colors not in the existing palette
- Background images, gradients, or decorative elements
- Animation or transition changes
- Any change that would be visible in a side-by-side layout comparison

### Fix Strategy

1. **One property at a time** — change a single CSS property, verify, move on
2. **Prefer utility classes** — if project uses Tailwind, adjust utility classes rather than custom CSS
3. **Match existing patterns** — find how the same property is used elsewhere and mirror it
4. **Maximum 3 fixes per iteration** — conservative pace prevents regression
5. **Skip if uncertain** — if a fix could break layout on other viewports, skip it

## Diff Configuration

- `diff_threshold`: 0.05 (tight — only significant pixel changes register)
- `visual_fidelity`: computed, warn if < 0.3 (possible regression)
- `theme_fidelity`: N/A (brand fingerprinting skipped for this mode)

## Completion Threshold

- `goal_threshold`: 4.0
- Per-criterion: All 5 criteria >= 4/5 raw for 2 consecutive iterations.
- Exemption: Visual Identity < 4 does NOT block completion.
- `completion_exemptions`: ["identity"]
