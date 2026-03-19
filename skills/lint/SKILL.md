---
name: lint
description: Use when user wants instant visual quality feedback from code — no browser needed. Detects spacing issues, typography problems, contrast failures, token violations. Say "doop lint", "design lint", "lint the CSS", "check visual quality".
argument-hint: "[path]"
allowed-tools: Read, Glob, Grep, Bash
---

# design-lint

Instant visual quality feedback from code alone. No browser, no screenshot, no dev server needed.

**80% of visual issues are detectable from code.** design-lint finds them in seconds.

## Instructions

Read and follow the orchestrator at `orchestrator/orchestrator.md` with `MODE = lint`.

Pass `$ARGUMENTS` through:

- `$ARGUMENTS[0]` → path to scope lint to (or full project if omitted)

The orchestrator will detect `lint` mode and run Step L: context scan, brand fingerprint extraction, then lint-engine analysis. No browser setup needed.

## What It Checks

| Criterion   | Code-level checks                                              |
| ----------- | -------------------------------------------------------------- |
| Composition | Spacing inconsistency, missing responsive variants             |
| Typography  | Flat hierarchy, AI-default fonts, missing weight variety       |
| Color       | WCAG AA contrast failures, unfocused palette, missing states   |
| Identity    | Cookie-cutter patterns, centered-everything, generic gradients |
| Polish      | Arbitrary values, token violations, mixed scales               |

## Part of the Visual Intelligence Pyramid

```
            /design-loop     Full iteration (10min)
           /design-fix       Quick fix (30s)
          /design-score      Visual score card (5s)
    -->  /design-lint        Static analysis (instant)  <-- YOU ARE HERE
```
