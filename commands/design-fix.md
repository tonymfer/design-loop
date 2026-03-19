---
name: design-fix
description: Quick visual fix — score, fix top issue, re-score, done in 30 seconds
arguments:
  - name: url
    description: Target page URL (default: http://localhost:3000)
    required: false
---

# /design-fix

Score it. Fix the top issue. Re-score. 30 seconds.

## What It Does

1. Takes a screenshot and scores your page (like /design-score)
2. Applies the #1 most impactful fix (safe, within your tokens)
3. Re-scores to show before/after improvement
4. Shows delta and suggests next steps

## Instructions

Invoke the `design-fix` skill. It runs one iteration of the design-loop engine.

If arguments were provided:

- `url`: Skip target question, use provided URL

## Prerequisites

A dev server must be running at the target URL (or one of: Claude Preview MCP, Playwright MCP, agent-browser).
