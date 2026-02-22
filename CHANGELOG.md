# Changelog

## [2.0.0] - 2026-02-22
### Added
- **3 Operational Modes**: Precision Polish (surgical CSS), Theme-Respect Elevate (design-system-aware), Creative Unleash (bold redesign)
- **Thin Orchestrator** (`orchestrator/orchestrator.md`): Smart coordinator that handles all shared phases and delegates mode-specific behavior
- **Mode skills** (`skills/modes/*/SKILL.md`): Declarative ~80-120 line files defining scoring weights and fix constraints per mode
- **Shared references** (`references/common/`): Extracted rubric, screenshot strategy, constraints, and output format into reusable files
- **Context & Skill Scanner** (`orchestrator/scan-context.md`): Mode-aware companion skill discovery with progressive frontmatter scanning and install suggestions for Elevate/Unleash modes
- **Brand Fingerprint** (`orchestrator/code-fingerprint.md` + `orchestrator/visual-fingerprint.md`): Opt-in Step 4 extracting color palette, typography, spacing, shape language. Visual analysis interface designed, wired by future Screenshot Mastery step. Persists to `.claude/brand-guideline.md`.
- **Preview Agent** (`agents/preview-agent.md`): Per-iteration change preview with code diffs, risk assessment, visual impact, and mode-adaptive confirmation gate. PP/TRE default to `confirm` (pause for user approval), CU defaults to `auto`. Interview Q3.5, stop hook `<preview-await>` detection, loop-engine Step 5.5. T19 integration tests (17 assertions).
- **Full Loop Integration** (Step 7.4): Closed cross-file wiring gaps — REFERENCE_ANALYSIS passed to CU reviewer, LOOP_RESULT safety fields, output-format safety line. Full-loop Beeper few-shot examples (3D/Spline reference with checkpoint rollback, TRE fidelity gate blocking). T18 integration test suite (20 cross-file assertions).
- **Safety Engine** (`orchestrator/safety-engine.md`): Centralized safety coordinator. File-level checkpoints to `~/.claude/backups/`, test suite verification (`npm test` alongside build), JSONL safety audit log (`.claude/design-loop-safety.log`), per-iteration safety status summaries. Delegates to existing rollback, fidelity gating, and constraint enforcement.
- **Loop Engine** (`orchestrator/loop-engine.md`): Extracted iteration loop from orchestrator into dedicated file. 7-step workflow (load, capture, score, fix, diff, check, decide). LOOP_STATE tracks full iteration history and feeds reviewers for trend-aware scoring. Delta-based plateau detection (< 0.2 for 2 iterations). Mode-configurable `goal_threshold` weighted average targets (PP=4.0, TRE=4.2, CU=4.7). XML decision tree with 6 paths. Stop hook recognizes PLATEAU/REGRESSION/MAX_REACHED signals.
- **Reference Analyzer** (`orchestrator/reference-analyzer.md`): Creative Unleash one-time reference analysis. Accepts URL, image, or text description as design inspiration. Analyzes for patterns, recommends compatible libraries via 21st.dev search, optional safe npm install with backup/rollback. Produces `REFERENCE_ANALYSIS` feeding into brand fingerprint, scoring, and fix strategy.
- **Screenshot & Diff Mastery** (`orchestrator/screenshot-engine/`): Step 5 visual engine split into 3 sub-modules (baseline-init, iteration-workflow, fidelity-scoring). Features `diff screenshot --baseline`, viewport cycling with explicit recovery, `visual_fidelity` + `theme_fidelity` scoring, `snapshot -i --json` element inventory, divergence highlight cleanup. Wires `visual-fingerprint.md` for brand enrichment from baseline screenshots.
- **Mode-Specific Reviewers** (`agents/reviewers/`): Three specialized scoring agents extending the base visual-reviewer with mode-appropriate Chain-of-Thought, a11y scope (contrast-only to full keyboard/screen-reader), scoring calibration examples, and output enrichments. Orchestrator Step 6b.3 routes to matching reviewer via `<reviewer-routing>` table.
- Rich mode selection interview with real-world examples, mode-adaptive questions, and confirmation step
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
