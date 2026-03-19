# Animator Skill — design-loop-hints Template

For skills that **add motion and animation** (frontend-ui-animator, etc.)

## How to use

Copy the `## design-loop-hints` section below into your SKILL.md. Focus on the ANIMATION_FREEZE defect check — this is the primary integration point.

## Template

```markdown
## design-loop-hints

scoring-enrichment:
polish: "After adding animations, verify ANIMATION_FREEZE defect — transitions must actually execute. Static elements with transition classes cap Polish at 2/5."
identity: "Micro-animations add personality — a page with intentional motion scores higher on identity than a static equivalent"
trigger: auto
tier: design-score
```

## What happens

1. **Discovery**: design-loop finds your skill via keyword matching
2. **After animating**: `trigger: auto` suggests `/design-score` to check for ANIMATION_FREEZE
3. **Defect focus**: The polish enrichment specifically calls out the ANIMATION_FREEZE rendering defect — this is the #1 issue when animations are added but don't execute
4. **Identity bonus**: Acknowledges that good animation improves perceived design quality
