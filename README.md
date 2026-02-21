# design-loop

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/tonymfer/design-loop/releases)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin-blueviolet.svg)](https://docs.anthropic.com/en/docs/claude-code)

**AI can code your UI. But it can't *see* it.**

design-loop is a [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin that gives Claude eyes. It captures **section-level screenshots** of your running page — detecting semantic landmarks like `<header>`, `<main>`, `<section>`, and `<footer>`, or falling back to scroll-based captures with overlap — scores each section against **5 anti-slop design criteria**, fixes the top issues, and repeats autonomously until your UI is polished. It also **discovers companion design skills** you've installed and absorbs their guidelines — zero config.

**[See the interactive demo](https://design-loop.vercel.app)** — click the iteration buttons and watch the page transform.

---

## Table of Contents

- [How it works](#how-it-works)
- [The 5 Criteria](#the-5-criteria)
- [Install](#install)
- [Usage](#usage)
- [Ecosystem Detection](#ecosystem-detection)
- [Adaptive Design Intelligence](#adaptive-design-intelligence)
- [Project Structure](#project-structure)
- [License](#license)

---

## How it works

1. **Screenshot** — Section-level captures via Playwright. Detects semantic HTML landmarks (`header`, `main`, `section`, `footer`, `article`) and screenshots each one individually. If the page lacks landmarks, falls back to scroll-based captures with 30% overlap so nothing is missed. This gives Claude real visual context for *each section*, not just a single full-page blob.
2. **Score** — 5 design criteria evaluated 1–5 with anti-slop detection
3. **Fix** — Top 3 issues fixed in code, build verified
4. **Repeat** — Loop continues until all criteria hit 4/5+

design-loop prioritizes the highest-impact issues first and adapts its focus as scores improve. If it gets stuck on a criterion after 3 attempts, it documents the issue and moves on.

### Stuck detection

If the same issue persists for 2 iterations, design-loop tries an alternative approach (e.g., switching from padding fixes to layout restructuring). After 3 failed attempts on the same criterion, it documents a TODO and moves on — no wasted iterations.

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

That's it. Playwright MCP is auto-installed on first run. No other dependencies.

---

## Usage

### Quick start

```bash
# Start a design loop on your running dev server
/design-loop http://localhost:3000
```

### With options

```bash
# 20 iterations
/design-loop http://localhost:3000/dashboard 20

# No iteration limit — runs until all criteria >= 4/5
/design-loop http://localhost:5173 0
```

### What happens

1. **Context scan** — Reads your `package.json` and `tailwind.config`, discovers companion design skills
2. **Interview** — 3 questions about target, focus areas, and iterations
3. **Section screenshots** — High-resolution captures of each page section (semantic landmarks or scroll fallback)
4. **Loop** — Autonomous iteration: screenshot, score against 5 criteria, fix, repeat
5. **Completion** — Stops when all 5 criteria score 4/5+ for two consecutive iterations

### Export results

After a loop completes, generate a shareable summary:

```bash
/export-loop
```

This produces a markdown summary with score progression, key improvements, and iteration count — ready for PR descriptions or social sharing.

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

## Project Structure

```
design-loop/
  skills/design-loop/
    SKILL.md          # Core workflow (the product)
  commands/
    design-loop.md    # /design-loop slash command
    export-loop.md    # /export-loop slash command
    version.md        # /version — check for updates
  hooks/
    hooks.json        # Plugin hook manifest
    stop-hook.sh      # Stop hook for autonomous iteration
  .claude-plugin/
    plugin.json       # Plugin manifest
    marketplace.json  # Marketplace manifest
  site/               # Interactive demo (design-loop.vercel.app)
  CHANGELOG.md
  LICENSE
```

---

## License

MIT
