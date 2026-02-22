# design-loop Plugin Resubmission

## README Audit

**Verdict: README is accurate and complete. No changes needed.**

Verified against SKILL.md and actual file tree:
- 5 criteria table correct (Composition, Typography, Color & Contrast, Visual Identity, Polish) with anti-slop flags
- Section-level screenshot description matches SKILL.md (semantic landmarks + 30% overlap scroll fallback)
- Adaptive skill discovery section matches Phase 1 discovery logic (7 known compatible skills listed)
- Install command correct (`claude plugin add https://github.com/tonymfer/design-loop`)
- Project structure matches (all 3 slash commands present)
- Demo site live at design-loop.vercel.app with dark cinematic theme, iteration switcher, score cards
- Version 1.0.0 consistent across plugin.json, marketplace.json, CHANGELOG.md, README badges

---

## Resubmission Recommendation

**YES, resubmit.** The form says "all changes will need to be additional submissions." These changes are fundamental:

| What changed | Original submission | Current |
|---|---|---|
| Criteria | 8 generic (spacing, hierarchy, contrast...) | 5 anti-slop with flags (Composition, Typography, Color, Identity, Polish) |
| Screenshots | Full-page | Section-level (semantic landmarks + scroll fallback) |
| Skill ecosystem | Manual chaining | Auto-discovery at runtime, zero config |
| Interview | 3-8 adaptive questions | 3 questions |
| Iteration limit | Fixed max | No-limit mode (max_iterations: 0) |
| Demo site | Basic | Dark cinematic redesign, site-wide iteration switching |

---

## Form Data (copy-paste ready)

### Plugin Name

```
design-loop
```

### Plugin Description (~92 words)

```
design-loop gives Claude Code eyes. It captures section-level screenshots of your page — detecting semantic HTML landmarks like header, main, section, footer, or scrolling with overlap — and scores each section against 5 anti-slop design criteria (Composition, Typography, Color & Contrast, Visual Identity, Polish). It fixes the top issues in code and repeats autonomously until polished. It also discovers companion design skills you've installed and absorbs their guidelines to sharpen its scoring — zero config. Supports Next.js, Nuxt, SvelteKit, Remix, Astro, and more. Detects your design system and uses your existing tokens.
```

### Is this plugin for Claude Code or Cowork?

```
Claude Code
```

### Link to GitHub

```
https://github.com/tonymfer/design-loop
```

### Company/Organization URL

```
https://design-loop.vercel.app
```

### Primary Contact Email

```
tony.base.eth@gmail.com
```

### Example 1: Section-level intelligence catches what full-page screenshots miss

```
A developer's Next.js dashboard looks fine zoomed out but has inconsistent spacing in the stats grid, cramped table rows, and a footer that doesn't match the header's visual weight. Running /design-loop http://localhost:3000/dashboard captures each <section> individually — header, stats, table, footer — so Claude evaluates each at full resolution. It catches the 12px/16px spacing inconsistency in the grid and the mismatched footer padding that a single full-page screenshot would blur together. 8 iterations, final score: 4.4/5.
```

### Example 2: Anti-slop criteria prevent generic AI aesthetics

```
A React landing page built by Claude looks "AI-generated" — Inter font, purple gradient hero, uniform card grid, stock-photo layout. design-loop's anti-slop flags catch every one: flags Inter as a default font, flags the purple gradient as decoration, flags the uniform grid as lacking compositional interest. Over 10 iterations it replaces defaults with intentional choices — a proper type scale, an asymmetric layout, a constrained palette. The page goes from "obviously AI" to "obviously designed."
```

### Example 3: Adaptive skill discovery makes the whole ecosystem smarter

```
A team has both frontend-design and design-loop installed. When design-loop runs, it discovers frontend-design's anti-slop guidelines at runtime and absorbs them — no configuration, no imports, no integration work. Now "score 5" for Visual Identity includes frontend-design's bold aesthetic principles. The team also installs web-design-guidelines later; next run, design-loop auto-discovers it too and layers WCAG compliance patterns on top. Each new skill makes the loop smarter without anyone writing glue code.
```

---

## Submission Checklist

- [ ] Open submission form (check Anthropic plugin marketplace docs for current URL)
- [ ] Fill all fields from above
- [ ] Submit
- [ ] Note confirmation/tracking number if provided
