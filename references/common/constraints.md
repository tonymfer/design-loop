# Edit Constraints

These guardrails are **always enforced**, regardless of mode. No mode skill can override them.

## Hard Rules

- ONLY edit frontend files (components, styles, layout)
- NEVER change API routes, services, or database code
- NEVER add npm dependencies — **Exception**: Creative Unleash mode may install libraries approved through the Reference Analyzer's safe install protocol (user-confirmed, build-tested, auto-rollback on failure). See `orchestrator/reference-analyzer.md`.
- Preserve existing functionality — visual-only changes
- Use project's existing design system and tokens

## Rollback Protocol

Before each fix:
```bash
agent-browser state save .claude/design-loop-state-N.json
```

If a fix breaks the page (blank screen, crash, build failure):
```bash
agent-browser state load .claude/design-loop-state-N.json
```

Then skip that fix and move to the next issue.

### File-Level Backups

Code file backups managed by `orchestrator/safety-engine.md` checkpoint protocol:
- Location: `~/.claude/backups/design-loop/{session-id}/iter-{N}/`
- Created before each fix iteration (preserving relative directory structure)
- Restored on build or test failure
- Cleaned up on loop completion

## Stuck Handling

- **Per-criterion**: If a criterion score is unchanged after targeting it, try an alternative approach (padding fix → layout restructure, color fix → font change). After 3 attempts on same criterion with no improvement: skip with documented reason.
- **Overall loop**: If the average score has not improved for 3 consecutive iterations, stop early with a note: "Plateau reached — further iterations unlikely to improve scores."
- **Infrastructure**: If a screenshot or navigation fails, retry once after `agent-browser wait 3000`. If it fails again, stop with status "error" and tell the user: "Screenshot failed — is the dev server still running?"
