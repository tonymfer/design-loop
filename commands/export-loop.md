---
name: export-loop
description: Export a shareable summary of the most recent design-loop run
arguments: []
---

# /export-loop

Generate a shareable summary of the most recent design-loop run.

## Instructions

1. Read `.claude/design-loop-history.md`
2. If the file doesn't exist, tell the user: "No design-loop history found. Run /design-loop first."
3. Extract the most recent run (everything after the last `## Run` header, or the entire file if only one run)
4. Format as a shareable markdown summary:

```markdown
## design-loop results

**Project**: [repo name from git or package.json]
**Date**: [run date]
**Iterations**: [count]

### Score Progression

| Iter | S | H | C | A | D | Co | T | E | Avg |
|------|---|---|---|---|---|----|----|---|-----|
[rows from history]

### Key Improvements
- [top 3 criterion improvements, e.g., "Spacing: 2 → 5 (+3)"]

### Summary
[started avg] → [final avg] across [N] iterations

---
*Polished with [design-loop](https://github.com/tonymfer/design-loop) — autonomous visual iteration for Claude Code*
```

5. Output the formatted summary so the user can copy it
6. Suggest: "Copy this into a PR description, README, or share on social media."
