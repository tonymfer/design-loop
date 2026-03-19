---
name: design-lint
description: Instant visual quality lint — detects CSS/Tailwind issues from code alone, no browser needed
arguments:
  - name: path
    description: Path to scan (default: full project)
    required: false
---

# /design-lint

Instant visual quality feedback from code. No browser, no screenshot, no dev server.

## What It Finds

| Category   | Examples                                                     |
| ---------- | ------------------------------------------------------------ |
| Spacing    | Mixed gap scales, inconsistent padding, no responsive layout |
| Typography | Flat hierarchy, AI-default fonts, missing weight variety     |
| Color      | WCAG AA failures, unfocused palette, missing hover/focus     |
| Identity   | Cookie-cutter cards, centered-everything, generic gradients  |
| Polish     | Arbitrary Tailwind values, mixed radii, hardcoded colors     |

## Instructions

Invoke the `design-lint` skill. It reads code files directly — no browser setup needed.

If arguments were provided:

- `path`: Scope lint to the specified path instead of full project scan
