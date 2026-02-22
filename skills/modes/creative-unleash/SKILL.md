---
name: creative-unleash
description: "Bold redesign latitude. Loads all companion design skills. May restructure layout. For greenfield projects and redesigns."
---

# Creative Unleash Mode

Maximum creative latitude. Layout restructuring, font exploration, bold color moves, asymmetric compositions. Loads ALL discovered companion design skills and uses their full guidance. This is the mode for making a page look like a designer touched it.

## Companion Skill Loading

Unlike other modes, Creative Unleash loads the **full content** of every discovered companion skill (not just guidance excerpts). This means:

```
For each skill in DESIGN_SKILLS:
  1. Read the entire SKILL.md body
  2. Apply ALL its aesthetic principles, not just headings
  3. Weight companion skill guidance equal to built-in criteria
```

If `frontend-design` is installed: use its bold anti-slop aesthetics. Unique fonts, intentional palettes, unexpected layouts.
If `designing-beautiful-websites` is installed: apply its full UX/UI strategy.
If `ui-skills` is installed: follow its opinionated constraints.
All companion skills stack — the more installed, the richer the creative direction.

## Scoring Weights

| Criterion | Weight | Sensitivity |
|-----------|--------|-------------|
| Composition | 1.5x | Actively penalize uniform/symmetric layouts. Reward asymmetry, varied spacing, visual hierarchy through size. |
| Typography | 1.3x | Actively penalize system-ui/Inter defaults. Reward display fonts for headings, intentional size jumps. |
| Color & Contrast | 1.2x | Reward bold, intentional palettes. Penalize safe grey-on-white. Still enforce WCAG AA. |
| Visual Identity | 2.0x | **Primary criterion.** Does this look designed? Would it make a portfolio? Penalize generic AI output heavily. |
| Polish | 1.0x | Important but secondary to identity — some roughness is acceptable if the design has a point of view. |

### What "score 5" means in this mode

- **Composition 5**: Asymmetric layout with clear visual hierarchy. Varied section heights. Unexpected but functional arrangements. White space used as a design element.
- **Typography 5**: Display font for headings that sets a tone. Body font that complements it. Size jumps that create drama. Tracking and line-height tuned per context.
- **Color 5**: A palette that tells you something about the brand. Not just "blue primary." Could be a warm terracotta, electric lime, or monochrome with a single accent. Intentional and memorable.
- **Identity 5**: You could not tell this was AI-generated. It has a point of view — minimal, brutal, playful, refined, whatever — but it's consistent and intentional. The "portfolio test" passes easily.
- **Polish 5**: Consistent but not rigid. The design rules are visible and applied, but with the confidence to break them when it serves the composition.

## Fix Constraints

### Allowed Changes

- Layout restructuring (flex→grid, column changes, section reordering)
- Adding or swapping font families (from Google Fonts CDN link or existing imports)
- Bold color palette changes (swap entire palette direction)
- Background treatments (gradients, subtle patterns, color blocks)
- Asymmetric spacing and varied section proportions
- Component restyling (card variants, button styles, hero layouts)
- Adding decorative elements via CSS (borders, dividers, shapes)
- Shadow and depth changes
- Adding CSS transitions/animations for micro-interactions

### Prohibited Changes (still enforced)

- Adding npm dependencies (use CDN links for fonts if needed)
- Changing API routes, services, or database code
- Removing existing functionality
- Breaking accessibility (WCAG AA contrast is always required)

### Fix Strategy

1. **Identity-first** — lead with the biggest visual identity improvement
2. **Bold moves** — prefer one dramatic change over three timid tweaks
3. **Composition before color** — layout changes have the highest visual impact
4. **Font before fine-tuning** — a display font change transforms the entire page
5. **Maximum 5 fixes per iteration** — each fix can be substantial
6. **Commit to a direction** — don't hedge between styles. Pick one and execute fully.

### Creative Direction Process

Before the first fix in each iteration:

```
1. Review all screenshots and scores
2. Identify the page's current design personality (or lack thereof)
3. Choose ONE design direction to push toward:
   - Minimal & sophisticated (lots of white space, refined type, muted palette)
   - Bold & expressive (strong colors, display fonts, asymmetric layout)
   - Warm & approachable (rounded shapes, warm colors, friendly type)
   - Technical & precise (monospace accents, sharp edges, high contrast)
   - Or derive direction from companion skill guidance
4. All fixes in this iteration serve that chosen direction
5. Document the chosen direction in the iteration report
```

## Completion Threshold

All 5 criteria >= 4/5 for 2 consecutive iterations. **Visual Identity must score >= 4** — this mode does NOT pass without a strong design point of view.
