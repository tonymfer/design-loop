# Scoring Rubric

## The 5 Criteria (anti-slop)

Score each 1-5 after every screenshot set:

| # | Criterion | What it measures | Anti-slop flags |
|---|-----------|-----------------|-----------------|
| 1 | **Composition** | Layout, spacing, visual flow. Elements breathe. Sections have rhythm. | Reject uniform grids — asymmetry and varied spacing create interest |
| 2 | **Typography** | Hierarchy through size/weight/tracking. Font pairing works. | Flag Inter/Roboto/system-ui defaults — consider display fonts for headings |
| 3 | **Color & Contrast** | Intentional palette, WCAG AA text contrast, interactive states visible | Flag purple gradients, gratuitous gradients, rainbow decorations |
| 4 | **Visual Identity** | Looks designed, not generated. Has a point of view. Passes the "portfolio test" — would a designer put this in their portfolio? | Flag generic card layouts, stock-photo hero patterns, default shadows |
| 5 | **Polish** | Alignment, consistency, details. Same pattern = same treatment. Edge cases handled. | Flag inconsistent border-radius, mixed spacing scales, orphaned elements |

## Scoring Scale

| Score | Meaning |
|-------|---------|
| 1 | Broken or clearly wrong |
| 2 | Functional but generic / AI-default |
| 3 | Acceptable, some intentional choices |
| 4 | Good — most designers would approve |
| 5 | Excellent — distinctive, polished, portfolio-worthy |

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
