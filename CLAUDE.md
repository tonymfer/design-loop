# design-loop

Claude Code plugin for autonomous visual UI/UX iteration.

## Structure

- `skills/design-loop/SKILL.md` — Core workflow (the product)
- `commands/design-loop.md` — `/design-loop` slash command entry point
- `commands/export-loop.md` — `/export-loop` slash command
- `commands/version.md` — `/version` command (check for updates)
- `hooks/hooks.json` — Plugin hook manifest
- `hooks/stop-hook.sh` — Stop hook for autonomous iteration
- `site/` — Interactive demo site (Next.js, deployed to design-loop.vercel.app)
- `.claude-plugin/` — Plugin manifest for Claude Code marketplace

## Development

- The plugin has no runtime code — SKILL.md IS the product
- Demo site: `cd site && npm run dev` → http://localhost:3000
- Site uses `data-iteration` CSS custom property switching to demo 5 visual states

## Conventions

- SKILL.md is the single source of truth for workflow logic
- Keep `*.png` gitignored — screenshots are development artifacts
- Plugin version lives in `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
