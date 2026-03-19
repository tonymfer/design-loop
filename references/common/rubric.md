# Scoring Rubric

## The 5 Criteria (anti-slop)

| #   | Criterion            | What it measures                                 | Anti-slop flags                                   |
| --- | -------------------- | ------------------------------------------------ | ------------------------------------------------- |
| 1   | **Composition**      | Layout, spacing, visual flow                     | Reject uniform grids — asymmetry creates interest |
| 2   | **Typography**       | Hierarchy through size/weight/tracking           | Flag Inter/Roboto/system-ui defaults              |
| 3   | **Color & Contrast** | Intentional palette, WCAG AA, interactive states | Flag purple gradients, rainbow decorations        |
| 4   | **Visual Identity**  | Looks designed, not generated. "Portfolio test." | Flag generic cards, stock-photo heroes            |
| 5   | **Polish**           | Alignment, consistency, details, edge cases      | Flag mixed spacing, rendering defects             |

## Rendering Defects (caps Polish at 2/5)

| Defect           | What it looks like                                  | Common locations                                  |
| ---------------- | --------------------------------------------------- | ------------------------------------------------- |
| SOLID_BLOCK      | Opaque where gradient/transparency expected         | Gradient text without -webkit-background-clip     |
| MISSING_GRADIENT | CSS gradient fallback to solid color                | Older browser rendering, missing vendor prefixes  |
| CLIPPED_TEXT     | Text cut off, overflowing container                 | Long headings in cards, FAQ answers, mobile views |
| BROKEN_ELEMENT   | Empty box, SVG not loading                          | Missing assets, font icons, lazy-loaded images    |
| STACKING_ERROR   | Z-index overlap hiding content                      | Modals, sticky headers, dropdown menus            |
| MISSING_EFFECT   | backdrop-filter/clip-path not rendering             | Frosted glass effects, shaped containers          |
| ANIMATION_FREEZE | CSS transition/animation defined but element static | Hover states on touch devices, scroll animations  |

## Scoring Scale

| Score | Meaning                                             | Decision                           |
| ----- | --------------------------------------------------- | ---------------------------------- |
| 1     | Broken or clearly wrong                             | Must fix before anything else      |
| 2     | Functional but generic / AI-default                 | Needs significant improvement      |
| 3     | Acceptable, some intentional choices                | Room for improvement, not blocking |
| 4     | Good — most designers would approve                 | Production-ready                   |
| 5     | Excellent — distinctive, polished, portfolio-worthy | Completion-ready                   |

## AI-Generic Detection (Identity scoring guide)

These patterns are strong signals of AI-generated design. Their presence should lower Identity scores:

| Pattern                                 | Impact on Identity score        | Why it matters                |
| --------------------------------------- | ------------------------------- | ----------------------------- |
| Purple gradient hero + centered text    | Cap at 2 if sole design element | The #1 most common AI default |
| Uniform card grid (all same size/style) | Cap at 3                        | No visual rhythm or hierarchy |
| Inter/Roboto/system-ui as only font     | Lower by 1                      | No typographic personality    |
| Centered-everything (>80% sections)     | Lower by 1                      | No layout variety             |
| Purple-to-blue gradient buttons         | Lower by 1 (cumulative)         | Cookie-cutter CTA             |
| Rainbow accent colors per section       | Cap at 2                        | No palette coherence          |

**If 3+ AI-generic patterns present**: Identity MUST score 2. No exceptions.

## Issue Prioritization (for recommended fixes)

When multiple issues exist, prioritize by impact:

1. **WCAG AA contrast failures** — accessibility is non-negotiable
2. **Rendering defects** — broken visual output
3. **Missing responsive behavior** — breaks on common viewports
4. **Flat typography hierarchy** — highest visual improvement per fix
5. **Spacing/alignment inconsistencies** — affects perceived quality
6. **Missing interactive states** — hover, focus, active
7. **Identity/personality** — hardest to fix, lowest priority per-fix

## Visual-First Principle

Scores reflect VISUAL quality — what the page looks like. Code-level improvements (token compliance, semantic naming) improve maintainability but do not independently raise visual scores.

## Fix Specificity Requirement

Every recommended fix MUST include:

- Target element (CSS selector or component name)
- Specific CSS property and value to change
- Which criterion it improves

Vague fixes ("improve spacing", "make it consistent") are not acceptable.

## Companion Skill Enrichment

If companion design skills were discovered, apply their guidance when scoring:

1. Project-specific (design tokens, component library conventions)
2. Companion skills with project-scoped install
3. Companion skills with user-scoped install
4. Built-in anti-slop flags (always active)
