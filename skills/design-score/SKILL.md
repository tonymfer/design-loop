---
name: design-score
description: Use when user wants a quick visual score of their UI — one screenshot, one score card, no fixing. Say "score my design", "design score", "how does it look", "rate the UI", or "design-score".
argument-hint: "[url]"
allowed-tools: Read, Glob, Grep, Bash, mcp__Claude_Preview__preview_start, mcp__Claude_Preview__preview_stop, mcp__Claude_Preview__preview_list, mcp__Claude_Preview__preview_screenshot, mcp__Claude_Preview__preview_snapshot, mcp__Claude_Preview__preview_inspect, mcp__Claude_Preview__preview_eval, mcp__Claude_Preview__preview_click, mcp__Claude_Preview__preview_resize, mcp__Claude_Preview__preview_logs, mcp__Claude_Preview__preview_console_logs, mcp__Claude_Preview__preview_network, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_click, mcp__plugin_playwright_playwright__browser_close, mcp__plugin_playwright_playwright__browser_console_messages, mcp__plugin_playwright_playwright__browser_network_requests, mcp__plugin_playwright_playwright__browser_wait_for, mcp__plugin_playwright_playwright__browser_install
---

# design-score

Visual score card — one screenshot, one score, done. No files modified.

**Get visual feedback in 5 seconds.** design-score screenshots your page, scores it against the 5 anti-slop criteria, and tells you exactly what to fix.

## Instructions

Read and follow the orchestrator at `orchestrator/orchestrator.md` with `MODE = score`.

Pass `$ARGUMENTS` through:

- `$ARGUMENTS[0]` → target URL

The orchestrator will detect `score` mode and run the shortened workflow: capture, score, report. No loop, no fixing.
