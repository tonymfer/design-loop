# Changelog

## [2.0.0] - 2026-02-22
### Added
- **3 Operational Modes**: Precision Polish (surgical CSS), Theme-Respect Elevate (design-system-aware), Creative Unleash (bold redesign)
- **Thin Orchestrator** (`orchestrator/orchestrator.md`): Smart coordinator that handles all shared phases and delegates mode-specific behavior
- **Mode skills** (`skills/modes/*/SKILL.md`): Declarative ~80-120 line files defining scoring weights and fix constraints per mode
- **Shared references** (`references/common/`): Extracted rubric, screenshot strategy, constraints, and output format into reusable files
- Mode selection interview (Q0) before target/focus questions
- Mode-specific scoring weight overrides in visual-reviewer agent
- Stop hook displays active mode in system message
- CLI mode argument: `/design-loop http://localhost:3000 10 precision-polish`

### Changed
- SKILL.md is now a 15-line wrapper delegating to orchestrator (backward-compatible entry point)
- Visual reviewer accepts mode weight overrides for weighted scoring
- Commands updated with `mode` argument and mode documentation

### Architecture
- Smart Coordinator pattern: orchestrator handles shared logic centrally, mode skills define only what differs
- Adding a new mode requires only 1 new file + 1 table row in orchestrator
- No shared logic duplication across modes

## [1.0.2] - 2026-02-22
### Enhanced
- `/doop` command alias for `/design-loop`
- Phase 3: Responsive viewport cycling — mobile pass (375x667) after desktop screenshots
- Phase 4: Browser state save/rollback before code edits (`state save` / `state load`)
- Visual reviewer: Structured JSON output format for machine-parseable scoring with deltas
- Export loop: HTML report output with SVG score progression chart

### Rejected (Grok patch triage)
- `screenshot --selector` — flag doesn't exist
- `install --yes --quiet` — flags don't exist
- `snapshot -s` with comma-separated selectors — only takes one selector
- `diff screenshot --before/--after/-t` — wrong flag names (real: `--baseline`)
- HTML dashboard, smart change detection, multi-agent split — scope creep

## [1.0.1] - 2026-02-22
### Fixed
- Replace hallucinated `playwright-cli` / `@playwright/cli@latest` with `agent-browser` (real CLI tool, npm `agent-browser`)
- All screenshot, eval, open, and close commands now use `agent-browser` subcommands
- Updated session-start hook, slash command, README, and plugin manifests

### Enhanced
- Phase 0: `--headed` flag shows browser window; `wait --load networkidle` ensures page-ready
- Phase 3: `--annotate` flag on all screenshots overlays numbered interactive element labels
- Phase 3: Multi-line JS uses `eval --stdin` heredocs instead of fragile inline quoting
- Phase 4: `agent-browser errors` for page error detection in stuck handling

## [1.0.0] - 2026-02-22
### Added
- Core design-loop skill: autonomous visual iteration via agent-browser screenshots
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

[2.0.0]: https://github.com/tonymfer/design-loop/compare/v1.0.2...v2.0.0
[1.0.2]: https://github.com/tonymfer/design-loop/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/tonymfer/design-loop/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/tonymfer/design-loop/releases/tag/v1.0.0
