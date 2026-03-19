---
name: doop
description: Use when user wants to visually iterate on UI/UX design using screenshots, when they say "doop", "design loop", "visual loop", "polish the UI", or want autonomous screenshot-driven frontend refinement
argument-hint: "[url] [iterations] [mode]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, mcp__Claude_Preview__preview_start, mcp__Claude_Preview__preview_stop, mcp__Claude_Preview__preview_list, mcp__Claude_Preview__preview_screenshot, mcp__Claude_Preview__preview_snapshot, mcp__Claude_Preview__preview_inspect, mcp__Claude_Preview__preview_eval, mcp__Claude_Preview__preview_click, mcp__Claude_Preview__preview_fill, mcp__Claude_Preview__preview_resize, mcp__Claude_Preview__preview_logs, mcp__Claude_Preview__preview_console_logs, mcp__Claude_Preview__preview_network, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_click, mcp__plugin_playwright_playwright__browser_close, mcp__plugin_playwright_playwright__browser_console_messages, mcp__plugin_playwright_playwright__browser_network_requests, mcp__plugin_playwright_playwright__browser_wait_for, mcp__plugin_playwright_playwright__browser_install, mcp__plugin_playwright_playwright__browser_type, mcp__plugin_playwright_playwright__browser_press_key, mcp__magic__21st_magic_component_builder, mcp__magic__21st_magic_component_inspiration
---

# doop

Autonomous visual iteration loop for frontend UI/UX. Platform-agnostic — works on Claude Desktop (Claude Preview MCP), Playwright MCP, or CLI (agent-browser).

**AI can code your UI. But it can't _see_ it.** doop gives Claude eyes.

## Instructions

Read and follow the orchestrator at `orchestrator/orchestrator.md`.

Pass `$ARGUMENTS` through:

- `$ARGUMENTS[0]` → target URL
- `$ARGUMENTS[1]` → max iterations
- `$ARGUMENTS[2]` → mode (`polish`, `redesign`)
