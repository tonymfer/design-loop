---
name: design-loop
description: Start an autonomous visual polish loop — screenshots, scores, fixes, repeats
arguments:
  - name: url
    description: Target page URL (default: http://localhost:3000)
    required: false
  - name: viewport
    description: Viewport mode — mobile, desktop, or both
    required: false
  - name: iterations
    description: Max iterations (default: 10)
    required: false
---

# /design-loop

You are about to start an autonomous visual iteration loop. This command:
1. Scans the project for framework, design tokens, and conventions
2. Interviews the user (3-5 targeted questions)
3. Generates a design-loop prompt
4. Launches it via ralph-loop for autonomous iteration

## Instructions

Invoke the `design-loop` skill. It will handle the full workflow:
- Phase 1: Project context scan (auto-detect framework, tokens, icons, constraints)
- Phase 2: Interview (target page, focus areas, iterations, viewport)
- Phase 3: Generate the design-loop prompt with all project context
- Phase 4: Write to `.claude/ralph-loop.local.md` and begin iteration 1

If arguments were provided:
- `url`: Skip Q1 (target), use provided URL
- `viewport`: Skip Q4 (viewport), use provided value
- `iterations`: Skip Q3 (iterations), use provided value

## Prerequisites (auto-installed)

Before starting, check and auto-install missing dependencies:

1. **ralph-loop plugin** — check if installed. If missing, run:
   `claude plugin add ralph-loop`
2. **Playwright MCP** — try calling any `mcp__plugin_playwright_playwright__*` tool. If unavailable, run:
   `claude mcp add playwright -- npx -y @playwright/mcp@latest`
3. **Dev server** — verify it's running at the target URL. If not, tell the user to start it.

Only stop if the dev server isn't running — dependencies should be installed automatically.
