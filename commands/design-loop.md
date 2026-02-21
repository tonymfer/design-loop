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
---

# /design-loop

You are about to start an autonomous visual iteration loop. This command:
1. Scans the project for framework, design tokens, and conventions
2. Interviews the user (3 targeted questions)
3. Takes section-level screenshots and scores against 5 design criteria
4. Begins autonomous iteration within the current session

## Instructions

Invoke the `design-loop` skill. It will handle the full workflow:
- Phase 0: Dependency check (auto-install Playwright CLI)
- Phase 1: Context scan (package.json, tailwind config, component libraries)
- Phase 2: Interview (target page, focus area, max iterations)
- Phase 3: Section screenshots (node mode or scroll mode)
- Phase 4: Evaluate against 5 criteria & fix top issues
- Phase 5: Write `.claude/design-loop.state.md` and begin iteration 1

If arguments were provided:
- `url`: Skip Q1 (target), use provided URL
- `iterations`: Skip Q3 (iterations), use provided value (0 = no limit)

## Prerequisites (auto-installed)

Before starting, check and auto-install missing dependencies:

1. **Playwright CLI** — run `playwright-cli --help` via Bash. If unavailable, run:
   `npm install -g @playwright/cli@latest`
2. **Dev server** — verify it's running at the target URL. If not, tell the user to start it.

Only stop if the dev server isn't running — Playwright CLI is installed automatically.
