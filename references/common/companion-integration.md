# Companion Skill Integration Spec

How any Claude Code skill can plug into design-loop's Visual Intelligence Pyramid.

## Overview

design-loop auto-discovers companion skills via keyword matching on SKILL.md frontmatter. Any skill with "design", "frontend", "ui", "ux", "css", "style", "animation", "visual", or "aesthetic" in its name or description gets discovered.

Skills can optionally add a `## design-loop-hints` section for richer integration.

## Integration Levels

### Level 0: Auto-discovered (zero effort)

If your skill's frontmatter mentions design-related keywords, design-loop finds it automatically. Your skill's headings ("Guidelines", "Principles", "Style", etc.) are scanned for ~200 words of guidance, which enriches the scorer.

**What you get for free:**

- Polish mode: your guidance excerpts enrich scoring
- Redesign mode: your full SKILL.md body is loaded for creative direction
- Score/Fix/Lint: your guidance enriches all tiers

### Level 1: design-loop-hints (10 lines)

Add a `## design-loop-hints` section to your SKILL.md for precise scoring enrichment:

```yaml
## design-loop-hints

scoring-enrichment:
  composition: "What score 5 means for composition when your skill is active"
  typography: "What score 5 means for typography"
  color: "What score 5 means for color"
  identity: "What score 5 means for identity"
  polish: "What score 5 means for polish"
trigger: auto # Optional: suggest running design-loop after this skill
tier: design-score # Optional: which tier to suggest (design-lint|design-score|design-fix|design-loop)
```

**Fields:**

| Field                            | Required | Description                                                                             |
| -------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| `scoring-enrichment`             | Yes      | Per-criterion guidance that enriches what "score 5" means                               |
| `scoring-enrichment.{criterion}` | No       | Omit criteria you don't have opinions about                                             |
| `trigger`                        | No       | `auto` = suggest design-loop after this skill runs. Default: none.                      |
| `tier`                           | No       | Which pyramid tier to suggest. Default: `design-score`.                                 |
| `generator`                      | No       | `true` = this skill can generate initial designs. Redesign mode offers to run it first. |

**How it's used:**

- `scoring-enrichment` values are appended to the reviewer's calibration for each criterion
- `trigger: auto` causes design-loop to suggest itself after your skill completes
- `tier` determines which command is suggested (e.g., `/design-score` vs `/design-fix`)
- `generator: true` makes the skill available as an initial generator in Redesign mode

### Level 2: Tier-specific calls (in your skill's workflow)

Your skill can call specific pyramid tiers as part of its own workflow:

```markdown
## After generating code:

Run `/design-score` on the target URL to get visual feedback.
If score < 3.5, suggest `/design-fix` to address top issues.
```

**Tier selection guide for skill authors:**

| Your skill type                           | When to call            | Which tier                      | Why                                             |
| ----------------------------------------- | ----------------------- | ------------------------------- | ----------------------------------------------- |
| **Generator** (builds UI from scratch)    | After generating code   | `/design-score`                 | Quick feedback on what you just built           |
| **Refiner** (code review, best practices) | During review           | `/design-lint`                  | Code-level visual issues, no browser needed     |
| **Aesthetic** (design guidelines)         | As scoring enrichment   | hints only                      | Your guidance enriches the scorer automatically |
| **Animator** (adds motion/transitions)    | After adding animations | `/design-score`                 | Verify ANIMATION_FREEZE defect check            |
| **Sprint** (multi-phase workflows)        | At each phase gate      | `/design-score` → `/design-fix` | Feedback loop within the sprint                 |

## What Gets Loaded Where

| Mode         | What design-loop loads from your skill                                           |
| ------------ | -------------------------------------------------------------------------------- |
| **Lint**     | `scoring-enrichment` hints for token-aware rules (via context scan)              |
| **Score**    | `design-loop-hints` scoring-enrichment, OR heading-scanned excerpts (~200 words) |
| **Fix**      | Same as Score                                                                    |
| **Polish**   | Same as Score (guidance excerpts only)                                           |
| **Redesign** | Full SKILL.md body + hints (for creative direction AND scoring)                  |

## Discovery Sources (priority order)

1. **Plugin registry** (highest) — `~/.claude/plugins/installed_plugins.json` → each plugin's skills
2. **User skills** — `~/.claude/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md`
3. **Project skills** — `.claude/skills/*/SKILL.md`

Dedup: plugin > user > project. "design-loop" itself is always excluded.

## Keyword Filter

Your skill is discovered if its `name` or `description` contains any of:
`design`, `frontend`, `ui`, `ux`, `css`, `style`, `animation`, `visual`, `aesthetic`

## Testing Your Integration

1. Install your skill
2. Run `/design-score http://localhost:3000` on a test page
3. Check if the score card mentions your skill's guidance
4. For `trigger: auto` — run your skill, verify it suggests design-loop after
5. For `generator: true` — run `/design-loop` in Redesign mode, verify your skill is offered

## Examples

See `references/examples/` for complete hint templates for each skill type:

- `generator-hints.md` — for skills that build UI
- `aesthetic-hints.md` — for skills that provide design guidelines
- `refiner-hints.md` — for skills that review code quality
- `animator-hints.md` — for skills that add motion/animation
