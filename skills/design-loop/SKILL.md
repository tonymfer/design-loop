---
name: design-loop
description: Use when user wants to visually iterate on UI/UX design using screenshots, when they say "design loop", "visual loop", "polish the UI", or want autonomous screenshot-driven frontend refinement
argument-hint: "[url] [iterations] [mode]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# design-loop v2.0

Autonomous visual iteration loop with 3 operational modes.

## Instructions

Read and follow the orchestrator at `orchestrator/orchestrator.md` (relative to this plugin's install path). It coordinates the full workflow: mode selection, context scan, screenshot strategy, mode-specific scoring/fixing, and iteration loop control.

Pass `$ARGUMENTS` through to the orchestrator for CLI shortcut support:
- `$ARGUMENTS[0]` → target URL
- `$ARGUMENTS[1]` → max iterations
- `$ARGUMENTS[2]` → mode (`precision-polish`, `theme-respect-elevate`, `creative-unleash`)
