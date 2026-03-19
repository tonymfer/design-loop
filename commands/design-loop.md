---
name: design-loop
description: Alias for /doop — start an autonomous visual iteration loop
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

# /design-loop

Backward-compatible alias for `/doop`. Same behavior.

## Instructions

Invoke the `doop` skill. Same behavior as `/doop`.

If arguments were provided:

- `url`: Skip target question, use provided URL
- `iterations`: Skip iterations question, use provided value (0 = no limit)
- `mode`: Skip mode question, use provided mode name
