# doop

Claude Code plugin for autonomous visual UI/UX iteration. Platform-agnostic — works on Claude Desktop and CLI.

## Visual Intelligence Pyramid

4 tiers of visual feedback, from instant to deep:

```
            /doop            Full iteration loop (10min)
           /doop:fix         Quick fix — score + fix top issue (30s)
          /doop:score        Visual score card (5s)
         /doop:lint          CSS static analysis (instant, no browser)
```

Each tier builds on the one below. Any frontend skill can call the tier that matches its need.

## Structure

- `skills/doop/SKILL.md` — Entry point for full loop (delegates to orchestrator)
- `skills/lint/SKILL.md` — Entry point for CSS static analysis
- `skills/score/SKILL.md` — Entry point for visual score card
- `skills/fix/SKILL.md` — Entry point for quick fix
- `orchestrator/orchestrator.md` — Core workflow coordinator (routes all 4 tiers)
- `orchestrator/lint-engine.md` — CSS/Tailwind static analysis rules (no browser needed)
- `orchestrator/scan-context.md` — Project context detection, companion skill discovery
- `orchestrator/code-fingerprint.md` — Brand token extraction (colors, typography, spacing, shape)
- `orchestrator/loop-engine.md` — 4-step iteration loop: Capture → Score → Fix → Verify
- `orchestrator/report-engine.md` — Report generator (Markdown + HTML with SVG charts)
- `orchestrator/safety-engine.md` — File checkpoints, build verification, audit log
- `orchestrator/screenshot-engine/` — Visual capture, diff, and fidelity scoring
  - `provider.md` — Provider abstraction: detection, capability matrix, abstract interface
  - `provider-claude-preview.md` — Claude Preview MCP adapter
  - `provider-playwright.md` — Playwright MCP adapter
  - `provider-agent-browser.md` — agent-browser CLI adapter
  - `baseline-init.md` — Baseline capture
  - `iteration-workflow.md` — Per-iteration capture/diff
  - `fidelity-scoring.md` — Visual + theme fidelity scoring
- `skills/modes/polish/SKILL.md` — Refine within tokens, safe for production
- `skills/modes/redesign/SKILL.md` — Bold transformation, loads companion skills
- `skills/modes/score/SKILL.md` — Score-only mode (no fixing)
- `skills/modes/fix/SKILL.md` — Single-iteration fix mode
- `references/common/` — Shared references (rubric, screenshots, constraints, output-format, companion-integration)
- `agents/visual-reviewer.md` — Visual scoring agent (mode weight overrides)
- `agents/reviewers/` — Mode-specific reviewers (polish, redesign)
- `agents/preview-agent.md` — Change preview with confirmation gate
- `commands/` — Slash commands (doop, lint, score, fix, design-loop alias, export-loop, version)
- `hooks/` — Stop hook for autonomous iteration, session-start hook
- `site/` — Interactive demo (design-loop.vercel.app)

## Architecture

v5.0 uses a Lean Orchestrator + Provider Abstraction pattern:

### Tier Workflows

| Tier         | Workflow                                                             | Browser? | Modifies files?     |
| ------------ | -------------------------------------------------------------------- | -------- | ------------------- |
| `doop:lint`  | Fingerprint → lint-engine → report                                   | No       | No                  |
| `doop:score` | Fingerprint → browser → screenshot → score → report                  | Yes      | No                  |
| `doop:fix`   | Fingerprint → browser → screenshot → score → fix → re-score → report | Yes      | Yes (1-2 fixes)     |
| `doop`       | Full 7-step orchestrator with iteration loop                         | Yes      | Yes (per iteration) |

### Core Loop (4 Steps — used by doop and doop:fix)

1. **Capture** — Screenshot via provider abstraction + CSS layout audit
2. **Score** — Independent reviewer subagent (mode-specific, prevents bias)
3. **Fix** — Apply top issues within mode constraints, build-verify each
4. **Verify** — After screenshots, fidelity gate, preview gate, decision tree

### 2 Modes (for full loop)

- **Polish** — Refine within design tokens. Safe for production.
- **Redesign** — Bold transformation. Loads all companion skills.

### Provider Layer

- Auto-detects: Claude Preview MCP > Playwright MCP > agent-browser CLI
- Unified PROVIDER.\* interface
- Graceful degradation for missing capabilities

## Development

- Plugin is prompt-only — no runtime code
- Demo site: `cd site && npm run dev` → http://localhost:3000

## Conventions

- SKILL.md delegates to orchestrator — no workflow logic in SKILL.md
- Mode skills are declarative (weights + constraints), not procedural
- All visual operations use PROVIDER.\* abstraction
- Keep \*.png gitignored — screenshots are development artifacts
