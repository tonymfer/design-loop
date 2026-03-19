---
name: fix
description: Use when user wants a quick visual fix — score and fix the top issue in 30 seconds. Say "doop fix", "quick fix", "fix the top issue", "one quick improvement".
argument-hint: "[url]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, mcp__Claude_Preview__preview_start, mcp__Claude_Preview__preview_stop, mcp__Claude_Preview__preview_list, mcp__Claude_Preview__preview_screenshot, mcp__Claude_Preview__preview_snapshot, mcp__Claude_Preview__preview_inspect, mcp__Claude_Preview__preview_eval, mcp__Claude_Preview__preview_click, mcp__Claude_Preview__preview_fill, mcp__Claude_Preview__preview_resize, mcp__Claude_Preview__preview_logs, mcp__Claude_Preview__preview_console_logs, mcp__Claude_Preview__preview_network, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_click, mcp__plugin_playwright_playwright__browser_close, mcp__plugin_playwright_playwright__browser_console_messages, mcp__plugin_playwright_playwright__browser_network_requests, mcp__plugin_playwright_playwright__browser_wait_for, mcp__plugin_playwright_playwright__browser_install, mcp__plugin_playwright_playwright__browser_type, mcp__plugin_playwright_playwright__browser_press_key
---

# design-fix

Quick visual fix — score, fix the top issue, re-score, done in 30 seconds.

**One iteration of design-loop, extracted.** Score your page, apply the highest-impact fix, verify the improvement.

## Instructions

Read and follow the orchestrator at `orchestrator/orchestrator.md` with `MODE = fix`.

Pass `$ARGUMENTS` through:

- `$ARGUMENTS[0]` → target URL

The orchestrator will detect `fix` mode and run the single-iteration workflow: capture, score, fix top 1-2 issues, re-score, report delta.

## Part of the Visual Intelligence Pyramid

```
            /design-loop     Full iteration (10min)
    -->    /design-fix       Quick fix (30s)  <-- YOU ARE HERE
          /design-score      Visual score card (5s)
         /design-lint        Static analysis (instant)
```
