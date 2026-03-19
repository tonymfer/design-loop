---
name: design-score
description: Visual score card — one screenshot, one score, no fixing
arguments:
  - name: url
    description: Target page URL (default: http://localhost:3000)
    required: false
---

# /design-score

One screenshot. One score. Done. No fixing, no loop.

## What You Get

A score card with 5 criteria (1-5), top issues, and recommended fixes. Takes ~5 seconds.

| Criterion   | What it measures                 |
| ----------- | -------------------------------- |
| Composition | Layout, spacing, visual flow     |
| Typography  | Hierarchy, fonts, readability    |
| Color       | Palette, contrast, states        |
| Identity    | Does it look designed?           |
| Polish      | Consistency, details, edge cases |

## Instructions

Invoke the `design-score` skill. It takes a screenshot and scores — no files are modified.

If arguments were provided:

- `url`: Skip target question, use provided URL

## Prerequisites

A dev server must be running at the target URL (or one of: Claude Preview MCP, Playwright MCP, agent-browser).
