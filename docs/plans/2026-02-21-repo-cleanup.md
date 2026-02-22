# Repo Cleanup — Approach A Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove development artifacts, deduplicate SKILL/REFERENCE overlap, add CLAUDE.md — making the repo presentable as a product.

**Architecture:** No structural changes. Same file layout, same plugin conventions. Just remove noise and add missing project docs.

**Tech Stack:** Git, Markdown

---

### Task 1: Remove marketing draft

**Files:**
- Delete: `x-thread.md`

**Step 1: Remove from git**

```bash
git rm x-thread.md
```

**Step 2: Commit**

```bash
git commit -m "chore: remove x-thread marketing draft from repo"
```

---

### Task 2: Remove implementation planning artifacts

The `docs/plans/` files are session-specific implementation artifacts from building the enhanced interview feature. They're not product docs.

**Files:**
- Delete: `docs/plans/2026-02-21-enhanced-interview-design.md`
- Delete: `docs/plans/2026-02-21-enhanced-interview-plan.md`

Note: Do NOT delete `docs/plans/2026-02-21-repo-cleanup.md` (this plan file).

**Step 1: Remove from git**

```bash
git rm docs/plans/2026-02-21-enhanced-interview-design.md docs/plans/2026-02-21-enhanced-interview-plan.md
```

**Step 2: Commit**

```bash
git commit -m "chore: remove session-specific planning artifacts"
```

---

### Task 3: Delete test page leftover

**Files:**
- Delete: `site/app/test/page.tsx` (untracked)
- Delete: `site/app/test/` (directory)

**Step 1: Remove the directory**

```bash
rm -rf site/app/test
```

**Step 2: No commit needed — it was untracked**

---

### Task 4: Deduplicate REFERENCE.md

REFERENCE.md should be a **lookup supplement**, not a copy of SKILL.md. Remove sections that duplicate SKILL.md content. Keep only content that adds new detail beyond what SKILL.md already covers.

**Files:**
- Modify: `skills/design-loop/REFERENCE.md`

**Sections to REMOVE (already in SKILL.md):**

1. **"Layout Measurement (MEASURE step)"** (lines 47-79) — exact same JS code as SKILL.md lines 293-325
2. **"Red Flags" table** (lines 81-88) — same as SKILL.md lines 326-330
3. **"CSS Cascade Audit (Phase 1)"** (lines 89-106) — same as SKILL.md lines 97-107
4. **"Project Detection for Interview Skip"** (lines 108-145) — exact repeat of SKILL.md Phase 2 logic
5. **"Audience-Aware Criterion Weighting"** (lines 178-209) — same as SKILL.md lines 262-270 but expanded
6. **"Phase-Aware Iteration Strategy"** (lines 333-340) — same as SKILL.md lines 377-381
7. **"Stuck Detection"** (lines 342-371) — same as SKILL.md lines 396-410

**Sections to KEEP (unique value):**

1. **Playwright Screenshot Commands** (lines 1-45) — quick reference for tool calls
2. **Reference Screenshot Comparison** (lines 149-176) — detailed capture protocol not in SKILL.md
3. **Fallback: Chrome MCP** (lines 211-219) — tool reference
4. **Analysis Template** (lines 221-245) — copy-paste template
5. **Common Fixes by Criterion** (lines 247-331) — CSS snippet cookbook
6. **Viewport Reference table** (lines 372-380) — lookup table
7. **Framework-Specific Patterns** (lines 382-398) — implementation guidance per framework
8. **Animation Libraries (Framer Motion)** (lines 399-405) — implementation detail
9. **3D / WebGL** (lines 407-412) — implementation rules
10. **Integration with Other Plugins** (lines 414-420)
11. **Recommended Skills** (lines 422-427)
12. **Anti-Pattern Awareness** (lines 429-437) — unique content
13. **SSR-Aware Prompts** (lines 439-456) — unique content

**Step 1: Read current REFERENCE.md, remove duplicated sections, add a header note**

The new REFERENCE.md should start with:

```markdown
# Design Loop — Reference

> Lookup reference for design-loop. The core workflow and detection logic lives in [SKILL.md](SKILL.md). This file contains tool commands, templates, CSS fix snippets, and framework-specific implementation guidance.
```

Then include only the KEEP sections listed above.

**Step 2: Verify REFERENCE.md is coherent after edits**

Read the file end-to-end. Ensure no broken cross-references.

**Step 3: Commit**

```bash
git add skills/design-loop/REFERENCE.md
git commit -m "refactor: deduplicate REFERENCE.md — remove content already in SKILL.md"
```

---

### Task 5: Add CLAUDE.md

The repo is a Claude Code plugin that reads CLAUDE.md from user projects — it should have its own.

**Files:**
- Create: `CLAUDE.md`

**Content:**

```markdown
# design-loop

Claude Code plugin for autonomous visual UI/UX iteration.

## Structure

- `skills/design-loop/SKILL.md` — Core workflow (the product)
- `skills/design-loop/REFERENCE.md` — Lookup tables, templates, CSS snippets
- `commands/design-loop.md` — `/design-loop` slash command entry point
- `commands/export-loop.md` — `/export-loop` slash command
- `site/` — Interactive demo site (Next.js, deployed to design-loop.vercel.app)
- `.claude-plugin/` — Plugin manifest for Claude Code marketplace

## Development

- The plugin has no runtime code — SKILL.md IS the product
- Demo site: `cd site && npm run dev` → http://localhost:3000
- Site uses `data-iteration` CSS custom property switching to demo 5 visual states

## Conventions

- SKILL.md is the single source of truth for workflow logic
- REFERENCE.md is supplementary — lookup tables and snippets only, no workflow duplication
- Keep `*.png` gitignored — screenshots are development artifacts
- Plugin version lives in `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
```

**Step 1: Write the file**

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md with project structure and conventions"
```

---

### Task 6: Clean up orphaned PNGs from disk

The PNGs are already gitignored and not tracked, but there are ~30 of them cluttering the repo root and `site/`. Remove them from disk.

**Step 1: List and confirm**

```bash
ls *.png site/*.png 2>/dev/null | wc -l
```

Expected: ~30 files

**Step 2: Remove from disk**

```bash
rm -f *.png site/*.png
```

**Step 3: No commit needed — they're gitignored**

---

### Task 7: Final verification

**Step 1: Verify git status is clean**

```bash
git status
```

Expected: clean working tree (PNGs are gitignored, test dir deleted)

**Step 2: Verify no tracked files reference removed content**

```bash
grep -r "x-thread" . --include="*.md" --exclude-dir=node_modules --exclude-dir=.git
```

Expected: no results

**Step 3: Run site build to confirm nothing broke**

```bash
cd site && npm run build
```

Expected: successful build

**Step 4: Final commit count**

```bash
git log --oneline -6
```

Expected: 4 new commits (tasks 1, 2, 4, 5)
