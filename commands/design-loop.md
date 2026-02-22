---
name: design-loop
description: Start an autonomous visual polish loop — screenshots, scores, fixes, repeats
arguments:
  - name: url
    description: Target page URL (default: http://localhost:3000)
    required: false
  - name: iterations
    description: Max iterations (default: 10, 0 for no limit)
    required: false
  - name: mode
    description: "Mode: precision-polish, theme-respect-elevate, or creative-unleash"
    required: false
---

# /design-loop

You are about to start an autonomous visual iteration loop. This command:
1. Asks you to choose a mode (Precision Polish, Theme-Respect Elevate, or Creative Unleash)
2. Scans the project for framework, design tokens, and conventions
3. Interviews the user (target page, focus area, iterations)
4. Takes section-level screenshots and scores against 5 design criteria
5. Begins autonomous iteration within the current session

## Modes

| Mode | Best For | Risk Level |
|------|----------|------------|
| **Precision Polish** | Production sites, quick fixes | Low — CSS-only, no layout changes |
| **Theme-Respect Elevate** | Design-system projects | Medium — uses your tokens to elevate |
| **Creative Unleash** | Greenfield, redesigns | High — bold moves, layout restructuring |

## Instructions

Invoke the `design-loop` skill. It will load the orchestrator which handles:
- Mode selection interview (Q0)
- Dependency check (auto-install agent-browser)
- Context scan (package.json, tailwind config, component libraries)
- Interview (target page, focus area, max iterations)
- Section screenshots (node mode or scroll mode)
- Mode-specific scoring and fixing
- Iteration loop with rollback safety

If arguments were provided:
- `url`: Skip target question, use provided URL
- `iterations`: Skip iterations question, use provided value (0 = no limit)
- `mode`: Skip mode question, use provided mode name

## Prerequisites (auto-installed)

Before starting, check and auto-install missing dependencies:

1. **agent-browser** — run `agent-browser --version` via Bash. If unavailable, run:
   `npm install -g agent-browser && agent-browser install`
2. **Dev server** — verify it's running at the target URL. If not, tell the user to start it.

Only stop if the dev server isn't running — agent-browser is installed automatically.
