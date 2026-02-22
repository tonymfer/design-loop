---
name: doop
description: Shorthand for /design-loop — start an autonomous visual polish loop
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

# /doop

Shorthand alias for `/design-loop`. Just doop it.

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
