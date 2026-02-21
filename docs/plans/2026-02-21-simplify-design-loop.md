# Simplify design-loop

Date: 2026-02-21

## Problem

Current design-loop is ~550 lines SKILL.md + ~380 lines REFERENCE.md. Too much complexity:
- 10 interview questions
- Massive JS measurement scripts (centering, connectivity gaps, spacing variance)
- Framework/library/3D/CSS-in-JS detection tables
- CSS cascade auditing, zoomed section checks
- Phase markers, phase-aware iteration strategy
- Design brief parsing from CLAUDE.md

The core screenshot problem: long pages (landing pages) get captured as tiny full-page images where details are impossible to evaluate. This kills the whole loop's value.

## Goal

Combine three ideas into one clean skill:
1. **frontend-design** aesthetic taste (anti-AI-slop scoring)
2. **ralph-loop** self-correcting completion mechanism
3. **Hybrid section-based screenshots** (the real innovation)

Cut everything that doesn't serve these three.

## Design

### What gets deleted

- **REFERENCE.md** — entirely removed
- 10 interview questions → 3
- 8 generic scoring criteria → 5 (with aesthetic taste baked in)
- CSS cascade auditing, JS measurement scripts, connectivity gap detection
- Framework/library/3D/WebGL/CSS-in-JS detection tables
- Phase markers, phase-aware iteration strategy
- Design brief parsing, zoomed section checks, state file writing
- Reference screenshot comparison workflow
- Audience-aware weighting, custom success checks

### What's new

- **Hybrid section-based screenshots** — node-level captures (like Chrome DevTools "Capture node screenshot") with viewport scroll fallback
- **frontend-design anti-slop** baked into scoring criteria
- **ralph-loop completion** — `<promise>POLISHED</promise>` + stuck handling
- **No-limit iteration option** — loop until polished or user stops

### New SKILL.md structure (~180 lines)

#### Phase 0: Setup (auto)

1. Check Playwright MCP available, auto-install if missing
2. Check dev server responds at target URL

#### Phase 1: Quick Context Scan (auto, no user input)

1. Read `package.json` → framework, component library
2. Read `tailwind.config.*` → design tokens
3. That's it. No detection tables.

#### Phase 2: Interview (2-3 questions via AskUserQuestion)

**Q1: Target URL**
- Options: http://localhost:3000 / enter URL

**Q2: Focus area**
- Options: General polish / Layout & spacing / Typography / Color & contrast / All of the above

**Q3: Max iterations**
- Options: 5 (quick polish) / 10 (thorough) / 20 (deep redesign) / No limit (loop until polished)

#### Phase 3: Hybrid Screenshot Capture

The core innovation. Inspired by Chrome DevTools' "Capture node screenshot."

```
1. Navigate to page
2. Get total page height via JS
3. Take one OVERVIEW screenshot at viewport size (composition/flow)

4. SECTION DETECTION via JS:
   → querySelectorAll('section, header, main, footer, article')
   → If >= 3 landmarks found → NODE MODE
   → If < 3 found → SCROLL MODE (fallback)

5a. NODE MODE:
   → For each landmark: element.screenshot() at natural dimensions
   → Each section captured at full resolution
   → Overview shot covers inter-section transitions

5b. SCROLL MODE (fallback for messy HTML):
   → Scroll in viewport-height steps with 30% overlap
   → Screenshot each fold
   → Always works regardless of HTML structure

6. Return: overview + array of section screenshots
```

Why hybrid:
- Node screenshots give full-resolution per-section evaluation (the main win)
- Overview shot catches inter-section flow/transitions that node shots miss
- Scroll fallback handles sites with `<div>` soup instead of semantic HTML

#### Phase 4: Evaluate & Fix (per section, per iteration)

Score each section against **5 criteria** (1-5):

| # | Criterion | Score 5 means | Anti-slop check |
|---|-----------|--------------|-----------------|
| 1 | **Composition** | Consistent spacing, breathing room, intentional layout | Rejects safe symmetry; expects visual flow |
| 2 | **Typography** | Clear 3-level hierarchy, distinctive font pairing | Flags Inter/Roboto/Arial/system font defaults |
| 3 | **Color & Contrast** | Cohesive palette, WCAG AA, dominant + accent | Flags purple-gradient-on-white, even distribution |
| 4 | **Visual Identity** | Memorable, feels handcrafted, has character | "Would a designer put this in their portfolio?" |
| 5 | **Polish** | Pixel-perfect alignment, consistent patterns, details | Micro-detail attention |

Process per iteration:
1. Screenshot all sections (or only changed ones after first iteration)
2. Score each section on 5 criteria
3. Identify top 3 issues across all sections by severity
4. Fix in code (one fix at a time, verify build passes)
5. Re-screenshot affected sections to verify
6. Report: scores, deltas from previous, trend

#### Phase 5: Loop Control (ralph-loop style)

**Completion**: All sections score >= 4/5 on all criteria for 2 consecutive iterations → output `<promise>POLISHED</promise>`

**Stuck handling**: If same criterion targeted 3 iterations in a row with no score improvement → skip with documented reason, move to next issue. Never repeat the same failed fix.

**No-limit mode**: Loop keeps going until POLISHED or user manually stops. No artificial ceiling.

**Max iterations mode**: Stop at limit, output final summary regardless of scores.

### Constraints (unchanged)

- Only edit frontend files (components, styles, layout)
- Never add npm dependencies
- Never change API routes, services, database code
- Preserve existing functionality — visual-only changes
- Use existing design tokens and utility classes
- Run build/typecheck after each change

### Commands

**`/design-loop [url] [viewport] [iterations]`** — unchanged entry point, simplified internals

**`/export-loop`** — unchanged, generates shareable summary from `.claude/design-loop-history.md`

### History tracking

Append to `.claude/design-loop-history.md` after each iteration:

```
| Iter | Comp | Typo | Color | Identity | Polish | Avg | Changes |
```

On completion, append summary block with start/finish averages.

## What stays the same

- `/design-loop` and `/export-loop` commands
- `.claude/design-loop-history.md` tracking format (updated column names)
- Playwright MCP as primary screenshot engine
- Chrome MCP as fallback
- Plugin manifest files unchanged
- Auto-install Playwright on first run

## Estimated scope

- SKILL.md: ~550 lines → ~180 lines (67% reduction)
- REFERENCE.md: ~380 lines → deleted (100% reduction)
- commands/design-loop.md: minor updates to match new phases
- commands/export-loop.md: update column names in template
- Total: net deletion of ~750 lines
