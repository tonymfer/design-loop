# Changelog

## [1.0.0] - 2026-02-22
### Added
- Core design-loop skill: autonomous visual iteration via Playwright CLI screenshots
- Section-level screenshot intelligence: semantic landmark detection (`header`, `main`, `section`, `footer`, `article`) with scroll-based fallback and 30% overlap
- 5 anti-slop design criteria: Composition, Typography, Color & Contrast, Visual Identity, Polish
- CSS layout audit (grid card heights, horizontal overflow detection)
- Adaptive skill discovery: auto-detects companion design skills and uses their guidance to enrich scoring — zero config
- Plugin structure: agents/, settings.json, SessionStart hook, Stop hook
- Stuck detection: per-criterion (3 attempts), plateau (3 iterations), infrastructure (retry once)
- No-limit iteration mode (`max_iterations: 0`) — runs until all criteria >= 4/5
- `/design-loop`, `/export-loop`, and `/version` slash commands
- Iteration logging to `.claude/design-loop-history.md`
- Interactive demo site at design-loop.vercel.app

[1.0.0]: https://github.com/tonymfer/design-loop/releases/tag/v1.0.0
