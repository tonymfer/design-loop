# design-loop

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/tonymfer/design-loop/releases)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin-blueviolet.svg)](https://docs.anthropic.com/en/docs/claude-code)

**AI can code your UI. But it can't *see* it.**

design-loop is a [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin that gives Claude eyes. It captures **section-level screenshots** of your running page — detecting semantic landmarks like `<header>`, `<main>`, `<section>`, and `<footer>`, or falling back to scroll-based captures with overlap — scores each section against **5 anti-slop design criteria**, fixes the top issues, and repeats autonomously until your UI is polished. It also **discovers companion design skills** you've installed and absorbs their guidelines — zero config.

**[See the interactive demo](https://design-loop.vercel.app)** — click the iteration buttons and watch the page transform.

---

## Table of Contents

- [How it works](#how-it-works)
- [Modes](#modes)
- [The 5 Criteria](#the-5-criteria)
- [Install](#install)
- [Usage](#usage)
- [Ecosystem Detection](#ecosystem-detection)
- [Adaptive Design Intelligence](#adaptive-design-intelligence)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [License](#license)

---

## How it works

1. **Choose a mode** — Precision Polish (safe CSS fixes), Theme-Respect Elevate (design-system-aware), or Creative Unleash (bold redesign)
2. **Screenshot** — Section-level captures via [agent-browser](https://github.com/vercel-labs/agent-browser). Detects semantic HTML landmarks (`header`, `main`, `section`, `footer`, `article`) and screenshots each one individually to disk with `--annotate` labels on interactive elements. If the page lacks landmarks, falls back to scroll-based captures with 30% overlap so nothing is missed. The headed browser daemon persists between commands — no re-launch per step.
3. **Score** — 5 design criteria evaluated 1–5 with anti-slop detection, weighted by your chosen mode
4. **Fix** — Top 3 issues fixed in code within mode constraints, build verified
5. **Preview** — Code diff + risk assessment shown for approval (PP/TRE) or auto-logged (CU)
6. **Repeat** — Loop continues until all criteria hit 4/5+

design-loop prioritizes the highest-impact issues first and adapts its focus as scores improve. If it gets stuck on a criterion after 3 attempts, it documents the issue and moves on.

### Stuck detection

Three levels of protection against wasted iterations:

- **Per-criterion** — If the same issue persists for 2 iterations, tries an alternative approach (e.g., padding fixes → layout restructuring). After 3 failed attempts, documents a TODO and moves on.
- **Plateau** — If the average score hasn't improved for 3 consecutive iterations, stops early. Further iterations are unlikely to help.
- **Infrastructure** — If a screenshot or navigation fails, retries once. If it fails again, stops with a clear error ("is the dev server still running?") instead of iterating blindly.

---

## Modes

v2.0 introduces 3 operational modes that control how aggressive the design iteration is:

| Mode | Best For | Constraints | Creative Latitude |
|------|----------|-------------|-------------------|
| **Precision Polish** | Production sites, quick fixes | CSS-only, no layout changes, single property at a time | Low |
| **Theme-Respect Elevate** | Design-system projects | Token-aware, all values must map to theme tokens | Medium |
| **Creative Unleash** | Greenfield, redesigns | Layout restructuring, font exploration, bold color moves | High |

### Precision Polish

Surgical CSS fixes. Changes padding, margins, border-radius, font sizes — nothing that would be visible in a side-by-side layout comparison. Safest mode for production sites.

### Theme-Respect Elevate

Reads your design tokens (Tailwind config, CSS custom properties) and elevates using only values from your theme. Never introduces foreign design elements. Ideal for design-system projects.

### Creative Unleash

Maximum creative latitude. Loads all companion design skills and applies their full aesthetic guidance. May restructure layout, swap fonts, change color palettes. For greenfield projects and redesigns.

---

## The 5 Criteria

Every screenshot set is scored against these design fundamentals, with built-in anti-slop detection:

| # | Criterion | What it measures | Anti-slop flags |
|---|-----------|-----------------|-----------------|
| 1 | **Composition** | Layout, spacing, visual flow. Sections have rhythm. | Rejects uniform grids — asymmetry creates interest |
| 2 | **Typography** | Hierarchy through size/weight/tracking. Font pairing. | Flags Inter/Roboto defaults |
| 3 | **Color & Contrast** | Intentional palette, WCAG AA, interactive states | Flags purple gradients, rainbow decorations |
| 4 | **Visual Identity** | Looks designed, not generated. "Portfolio test." | Flags generic card layouts, stock-photo heroes |
| 5 | **Polish** | Alignment, consistency, details, edge cases | Flags mixed spacing scales, orphaned elements |

---

## Install

```bash
claude plugin add https://github.com/tonymfer/design-loop
```

That's it. agent-browser is auto-installed on first run (`npm install -g agent-browser && agent-browser install`). No other dependencies — no MCP server, no heavy Playwright test runner.

---

## Usage

### Quick start

```bash
# Start a design loop on your running dev server
/design-loop http://localhost:3000

# Or use the shorthand
/doop http://localhost:3000
```

### With options

```bash
# 20 iterations
/design-loop http://localhost:3000/dashboard 20

# No iteration limit — runs until all criteria >= 4/5
/design-loop http://localhost:5173 0

# Specify mode directly (skip mode question)
/design-loop http://localhost:3000 10 precision-polish
/doop http://localhost:3000 10 creative-unleash
```

### What happens

1. **Mode selection** — Rich interview with real-world examples, mode-adaptive follow-up questions, and a confirmation summary. Choose Precision Polish, Theme-Respect Elevate, or Creative Unleash (or pass as 3rd argument to skip)
2. **agent-browser check** — Installs agent-browser if missing, opens a headed browser session with `wait --load networkidle`
3. **Dev server check** — Verifies the target URL responds. If not, scans common ports for a running server or auto-starts one via `package.json`
4. **Context scan** — Reads your `package.json` and `tailwind.config`, discovers companion design skills
5. **Brand fingerprint** (opt-in) — Extracts color palette, typography, spacing, and shape language from design tokens. Persists to `.claude/brand-guideline.md`
6. **Screenshot baseline** — Captures initial annotated screenshots, runs visual fingerprint enrichment, establishes before state for diff tracking
7. **Interview** — Questions about target, focus areas, and iterations
7. **Section screenshots** — High-resolution annotated captures of each page section (semantic landmarks or scroll fallback)
7. **Loop** — Autonomous iteration: screenshot, score with mode-specific weights, fix within mode constraints, repeat
8. **Completion** — Stops when all 5 criteria score 4/5+ for two consecutive iterations. Cleans up all screenshot files automatically.

### Export results

After a loop completes, generate a shareable summary:

```bash
/export-loop
```

This produces a rich summary with ASCII score progression bars, an iteration log with deltas, key improvements ranked by impact, and stats — ready for PR descriptions or social sharing.

### Check for updates

```bash
/version
```

Compares your installed version against the latest release on GitHub and shows update instructions if needed.

---

## Ecosystem Detection

design-loop auto-detects your framework and component library from `package.json` and adapts its fixes accordingly. It reads your tailwind config for design tokens and checks for component libraries like shadcn/ui, Radix, Chakra UI, Material UI, and others — using your existing tokens rather than introducing conflicting styles.

---

## Adaptive Design Intelligence

Install any frontend or design skill alongside design-loop and it automatically gets smarter. design-loop discovers companion skills at runtime, extracts their guidelines, and uses them to sharpen what "score 5" means for each criterion. No configuration needed — no integration work from skill authors. design-loop is the iteration engine; other skills plug into it.

### How discovery works

During context scan, design-loop reads your installed plugins and looks for skills with design-related keywords. It extracts guidelines, principles, and aesthetic rules, then layers them on top of its built-in criteria with priority ordering: project-specific skills > user-scoped skills > built-in flags.

### Known compatible skills

| Skill | What it adds |
|-------|-------------|
| `frontend-design` | Bold anti-slop aesthetics — unique fonts, intentional palettes, unexpected layouts |
| `web-design-guidelines` | Web Interface Guidelines compliance, WCAG patterns |
| `designing-beautiful-websites` | UX/UI strategy and visual design principles |
| `figma/create-design-system-rules` | Design system conventions and consistency |
| `frontend-ui-animator` | Purposeful UI animation guidance |
| `ui-skills` | Opinionated UI constraints |
| `super-frontend` | Design + build orchestration |

Any skill with design guidelines in its SKILL.md works automatically — no integration required from the skill author.

### Without companion skills

design-loop's 5 built-in criteria with anti-slop flags remain fully functional. Companion skills enrich, they don't replace.

### Manual skill chaining

You can also chain skills explicitly for a directed workflow:

| Chain | Purpose |
|-------|---------|
| `frontend-design` then `design-loop` | Get creative direction first, then iterate visually |
| `design-loop` then `export-loop` | Polish the UI, then generate a shareable summary |

---

## Architecture

v2.0 uses a **Thin Orchestrator** pattern. SKILL.md is a lightweight wrapper that delegates to `orchestrator/orchestrator.md`, which coordinates all shared phases and routes to mode-specific skills for scoring weights and fix constraints.

```
SKILL.md (wrapper)
  → orchestrator/orchestrator.md (coordinator)
      ├── orchestrator/interview-flow.md (mode selection interview)
      ├── orchestrator/scan-context.md (context & skill scanner)
      ├── orchestrator/code-fingerprint.md (brand token extraction)
      ├── orchestrator/reference-analyzer.md (CU-only reference analysis)
      ├── orchestrator/loop-engine.md (7-step iteration loop + decision tree)
      ├── orchestrator/safety-engine.md (checkpoints, test runner, audit log)
      ├── orchestrator/visual-fingerprint.md (visual analysis — future wiring)
      ├── orchestrator/screenshot-engine/ (baseline-init, iteration-workflow, fidelity-scoring)
      ├── references/common/ (rubric, screenshots, constraints, output-format)
      ├── agents/visual-reviewer.md (scoring with mode weight overrides)
      ├── agents/preview-agent.md (per-iteration change preview + confirmation gate)
      ├── agents/reviewers/ (precision-reviewer, theme-respect-reviewer, creative-unleash-reviewer)
      └── skills/modes/
          ├── precision-polish/SKILL.md (CSS-only, tight constraints)
          ├── theme-respect-elevate/SKILL.md (token-aware, medium latitude)
          └── creative-unleash/SKILL.md (bold redesign, high latitude)
```

Adding a new mode requires only 1 new file + 1 table row in the orchestrator.

---

## Project Structure

```
design-loop/
  skills/design-loop/
    SKILL.md              # Entry point wrapper → orchestrator
  orchestrator/
    orchestrator.md       # Core workflow coordinator
    interview-flow.md     # Rich mode selection interview
    scan-context.md       # Mode-aware context & skill scanner
    code-fingerprint.md   # Brand token extraction from code
    reference-analyzer.md # CU-only reference & inspiration analysis
    loop-engine.md        # 7-step iteration loop with LOOP_STATE + plateau detection
    safety-engine.md      # Safety coordinator: checkpoints, tests, audit log
    visual-fingerprint.md # Visual analysis (interface designed, wired by Screenshot Mastery)
    screenshot-engine/        # Visual capture, diff, and fidelity scoring
      baseline-init.md        # One-time baseline capture
      iteration-workflow.md   # Phase A/B capture & diff workflow
      fidelity-scoring.md     # visual_fidelity + theme_fidelity algorithms
  skills/modes/
    precision-polish/     # CSS-only, production-safe
    theme-respect-elevate/# Design-token-aware
    creative-unleash/     # Bold redesign latitude
  references/common/
    rubric.md             # 5-criteria scoring definitions
    screenshots.md        # Screenshot capture strategy
    constraints.md        # Shared edit guardrails
    output-format.md      # Report and log format
  commands/
    design-loop.md        # /design-loop slash command
    doop.md               # /doop — shorthand alias
    export-loop.md        # /export-loop slash command
    version.md            # /version — check for updates
  hooks/
    hooks.json            # Plugin hook manifest
    session-start-hook.sh # Validates agent-browser on session start
    stop-hook.sh          # Stop hook for autonomous iteration
  agents/
    visual-reviewer.md    # UI screenshot analysis agent
    preview-agent.md  # Per-iteration change preview + confirmation gate
    reviewers/
      precision-reviewer.md     # Pixel-level regression specialist
      theme-respect-reviewer.md # Token compliance auditor
      creative-unleash-reviewer.md # Design conviction evaluator
  .claude-plugin/
    plugin.json           # Plugin manifest
    marketplace.json      # Marketplace manifest
  settings.json           # Plugin settings (default agent)
  site/                   # Interactive demo (design-loop.vercel.app)
  CHANGELOG.md
  LICENSE
```

---

## License

MIT
