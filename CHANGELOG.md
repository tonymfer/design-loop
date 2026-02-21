# Changelog

## [1.1.0] - 2026-02-22
### Changed
- **Migrate from Playwright MCP to Playwright CLI** — 4x token savings by using `playwright-cli` commands via Bash instead of MCP tool calls. Screenshots are saved to disk and read as files rather than passed inline as base64.
- Upgrade plugin structure per official Claude Code docs: added `agents/`, `settings.json`, SessionStart hook

### Fixed
- Equal-height grid cards in CSS layout audit
- Added CSS layout audit documentation to SKILL.md

## [1.0.0] - 2026-02-21
### Added
- Core design-loop skill: autonomous visual iteration via Playwright screenshots
- Section-level screenshot intelligence: semantic landmark detection (`header`, `main`, `section`, `footer`, `article`) with scroll-based fallback and 30% overlap
- 5 anti-slop design criteria: Composition, Typography, Color & Contrast, Visual Identity, Polish
- Adaptive skill discovery: auto-detects companion design skills (frontend-design, web-design-guidelines, etc.) and uses their guidance to enrich scoring and fixes — zero config
- Companion skill priority ordering: project-specific > project-scoped > user-scoped > built-in flags
- Stop hook for autonomous multi-iteration loops
- Stuck detection with strategy rotation (alternative approach after 2 iterations, TODO after 3)
- No-limit iteration mode (`max_iterations: 0`) — runs until all criteria >= 4/5
- `/design-loop`, `/export-loop`, and `/version` slash commands
- Iteration logging to `.claude/design-loop-history.md`
- Interactive demo site at design-loop.vercel.app

[1.1.0]: https://github.com/tonymfer/design-loop/releases/tag/v1.1.0
[1.0.0]: https://github.com/tonymfer/design-loop/releases/tag/v1.0.0
