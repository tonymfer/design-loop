# design-loop

Claude Code plugin for autonomous visual UI/UX iteration.

## Structure

- `skills/design-loop/SKILL.md` — Entry point wrapper (delegates to orchestrator)
- `orchestrator/orchestrator.md` — Core workflow coordinator (v2.0 thin orchestrator)
- `skills/modes/precision-polish/SKILL.md` — Surgical CSS fixes, tight constraints
- `skills/modes/theme-respect-elevate/SKILL.md` — Design-token-aware, elevate within system
- `skills/modes/creative-unleash/SKILL.md` — Bold redesign, all companion skills loaded
- `references/common/` — Shared references (rubric, screenshots, constraints, output-format)
- `agents/visual-reviewer.md` — Visual scoring agent (accepts mode weight overrides)
- `commands/design-loop.md` — `/design-loop` slash command entry point
- `commands/doop.md` — `/doop` shorthand alias
- `commands/export-loop.md` — `/export-loop` slash command
- `commands/version.md` — `/version` command (check for updates)
- `hooks/hooks.json` — Plugin hook manifest
- `hooks/stop-hook.sh` — Stop hook for autonomous iteration
- `site/` — Interactive demo site (Next.js, deployed to design-loop.vercel.app)
- `.claude-plugin/` — Plugin manifest for Claude Code marketplace

## Architecture

v2.0 uses a Thin Orchestrator pattern:
- `SKILL.md` is a 15-line wrapper that delegates to `orchestrator/orchestrator.md`
- The orchestrator handles shared phases: dependency check, context scan, interview, screenshots, loop control
- Mode skills (`skills/modes/*/SKILL.md`) define only scoring weights + fix constraints (~80-120 lines each)
- Shared references (`references/common/`) are loaded by the orchestrator, not duplicated per mode
- Adding a new mode = 1 new file + 1 table row in the orchestrator

## Development

- The plugin has no runtime code — the orchestrator + mode skills ARE the product
- Demo site: `cd site && npm run dev` → http://localhost:3000
- Site uses `data-iteration` CSS custom property switching to demo 5 visual states

## Conventions

- SKILL.md delegates to the orchestrator — do not put workflow logic in SKILL.md
- Mode skills are declarative (weights + constraints), not procedural
- Keep `*.png` gitignored — screenshots are development artifacts
- Plugin version lives in `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
