# Generator Skill — design-loop-hints Template

For skills that **build UI from scratch** (frontend-design, super-frontend, etc.)

## How to use

Copy the `## design-loop-hints` section below into your SKILL.md. Customize the scoring-enrichment values to match your skill's aesthetic philosophy.

## Template

```markdown
## design-loop-hints

scoring-enrichment:
composition: "Generated layouts should use asymmetric grids and varied section heights"
typography: "Generated pages must include a display font for headings — system-ui alone caps at 3"
color: "Generated palettes should have personality — not just blue-accent-on-gray"
identity: "The page should not look AI-generated — avoid uniform card grids and purple gradients"
polish: "All generated components should use consistent spacing from the project's token scale"
trigger: auto
tier: design-score
generator: true
```

## What happens

1. **Discovery**: design-loop finds your skill via keyword matching
2. **Generator offer**: In Redesign mode, your skill is offered as an initial generator ("Run [your-skill] first to generate a design, then iterate?")
3. **After generation**: `trigger: auto` suggests `/design-score` to the user
4. **Scoring enrichment**: Your criteria are layered onto the reviewer's calibration
5. **Full loop**: If the user runs `/design-loop`, your full SKILL.md body is loaded for creative direction
