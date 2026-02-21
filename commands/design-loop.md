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

## Prerequisites Check

Before starting, verify:
1. `ralph-loop` plugin is installed (check for `.claude/plugins/` or ask user)
2. Playwright MCP is available (try `mcp__plugin_playwright_playwright__browser_navigate`)
3. Dev server is running at the target URL

If any prerequisite is missing, tell the user how to install it and stop.
