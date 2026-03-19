# Refiner Skill — design-loop-hints Template

For skills that **review code quality** (react-best-practices, code-review, etc.)

## How to use

Copy the `## design-loop-hints` section below into your SKILL.md. Focus on code-level visual checks that complement your existing review criteria.

## Template

```markdown
## design-loop-hints

scoring-enrichment:
composition: "Components should use consistent spacing props — no magic numbers"
polish: "All Tailwind classes should map to design tokens — flag arbitrary values like p-[24px]"
trigger: auto
tier: design-lint
```

## What happens

1. **Discovery**: design-loop finds your skill via keyword matching
2. **After review**: `trigger: auto` + `tier: design-lint` suggests `/design-lint` after your skill runs
3. **Lightweight integration**: Only 2 criteria enriched (composition + polish) — refiners care about consistency, not aesthetics
4. **No browser needed**: `/design-lint` runs instantly from code — matches the refiner workflow
