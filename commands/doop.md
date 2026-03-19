---
name: doop
description: Start an autonomous visual iteration loop — screenshots, scores, fixes, repeats
arguments:
  - name: url
    description: Target page URL (default: http://localhost:3000)
    required: false
  - name: iterations
    description: Max iterations (default: 8 for polish, 12 for redesign, 0 for no limit)
    required: false
  - name: mode
    description: "Mode: polish or redesign"
    required: false
---

# /doop

Start an autonomous visual iteration loop. Just doop it.

## Modes

| Mode         | Best For                                 | Risk Level                              |
| ------------ | ---------------------------------------- | --------------------------------------- |
| **Polish**   | Production sites, design-system projects | Low — refines within your tokens        |
| **Redesign** | Greenfield, redesigns                    | High — bold moves, layout restructuring |

## Instructions

Invoke the `doop` skill. It loads the orchestrator which handles:

- Mode selection (Polish or Redesign)
- Provider detection (Claude Preview MCP > Playwright MCP > agent-browser)
- Context scan (package.json, tailwind config, component libraries)
- Section screenshots and scoring
- Autonomous iteration with rollback safety

If arguments were provided:

- `url`: Skip target question, use provided URL
- `iterations`: Skip iterations question, use provided value (0 = no limit)
- `mode`: Skip mode question, use provided mode name

## Also available

| Command       | What it does        | Time  |
| ------------- | ------------------- | ----- |
| `/doop:lint`  | CSS static analysis | 0s    |
| `/doop:score` | Visual score card   | 5s    |
| `/doop:fix`   | Quick fix top issue | 30s   |
| `/doop`       | Full iteration loop | 10min |
