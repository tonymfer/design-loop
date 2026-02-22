# Scoring Rubric

## The 5 Criteria (anti-slop)

Score each 1-5 after every screenshot set:

| # | Criterion | What it measures | Anti-slop flags |
|---|-----------|-----------------|-----------------|
| 1 | **Composition** | Layout, spacing, visual flow. Elements breathe. Sections have rhythm. | Reject uniform grids — asymmetry and varied spacing create interest |
| 2 | **Typography** | Hierarchy through size/weight/tracking. Font pairing works. | Flag Inter/Roboto/system-ui defaults — consider display fonts for headings |
| 3 | **Color & Contrast** | Intentional palette, WCAG AA text contrast, interactive states visible | Flag purple gradients, gratuitous gradients, rainbow decorations |
| 4 | **Visual Identity** | Looks designed, not generated. Has a point of view. Passes the "portfolio test" — would a designer put this in their portfolio? | Flag generic card layouts, stock-photo hero patterns, default shadows |
| 5 | **Polish** | Alignment, consistency, details. Same pattern = same treatment. Edge cases handled. | Flag inconsistent border-radius, mixed spacing scales, orphaned elements. Flag rendering defects by category: SOLID_BLOCK (opaque where gradient expected), MISSING_GRADIENT (CSS gradient fallback), CLIPPED_TEXT (overflow/truncation), MISSING_EFFECT (mask/clip-path/backdrop-filter), BROKEN_ELEMENT (empty box/missing SVG), STACKING_ERROR (z-index overlap), ANIMATION_FREEZE (transition not firing). Any defect caps Polish at 2/5. |

## Scoring Scale

| Score | Meaning |
|-------|---------|
| 1 | Broken or clearly wrong |
| 2 | Functional but generic / AI-default |
| 3 | Acceptable, some intentional choices |
| 4 | Good — most designers would approve |
| 5 | Excellent — distinctive, polished, portfolio-worthy |

## Visual-First Scoring Principle

Scores reflect VISUAL quality — what the page looks like. Code-level improvements
(token compliance, semantic naming) improve maintainability but do not independently
raise visual scores. A page that looks identical before and after should receive
approximately the same scores.

Compliance modifiers are subtractive (penalizing rogue values), not additive
(rewarding identical visuals). This ensures that 39 token swaps resolving to
the same computed color do not inflate scores — the visual output is what matters.

## Companion Skill Enrichment

If DESIGN_SKILLS were discovered during context scan, apply their guidance when scoring and fixing:

- Read each companion skill's extracted guidance before scoring
- Use their aesthetic principles to inform what "score 5" looks like for each criterion
- When fixing issues, prefer approaches aligned with companion skill guidance
- If companion skills conflict with each other, prefer the most specific guidance
  (e.g., a design-system-rules skill overrides generic aesthetic guidance)

Priority order for guidance:
1. Project-specific (design tokens, component library conventions)
2. Companion skills with project-scoped install
3. Companion skills with user-scoped install
4. Built-in anti-slop flags (baseline — always active)
