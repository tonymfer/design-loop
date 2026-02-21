# design-loop

**AI can code your UI. But it can't *see* it.**

design-loop is a [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin that gives Claude eyes. It screenshots your page, scores it against 8 design criteria, fixes the issues, and repeats — autonomously — until your UI is polished.

**[See the interactive demo](https://design-loop.vercel.app)** — click the iteration buttons and watch the page transform.

---

## How it works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Screenshot  │────▶│    Score     │────▶│     Fix      │────▶│   Repeat     │
│  (Playwright)│     │ (8 criteria) │     │ (top 3 fixes)│     │ (until 4/5+) │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

Each iteration:
1. **Screenshot** — Playwright captures the current page
2. **Score** — 8 design criteria evaluated 1-5
3. **Fix** — Top 3 issues fixed in code, build verified
4. **Repeat** — Loop continues until all criteria hit 4/5+

### Phase-aware iteration

design-loop doesn't fix everything at once. It follows a structured progression:

| Iterations | Focus | Why first |
|-----------|-------|-----------|
| 1-3 | Spacing & Layout | Biggest visual impact |
| 4-6 | Hierarchy & Contrast | Typography and readability |
| 7-9 | Alignment & Consistency | Edge alignment, pattern unification |
| 10+ | Density & Polish | Content balance, empty states, final touches |

---

## The 8 Criteria

Every screenshot is scored against these design fundamentals:

| # | Criterion | What it measures |
|---|-----------|-----------------|
| 1 | **Spacing** | Consistent scale (4/8/12/16/24/32px). No cramped elements. Breathing room. |
| 2 | **Hierarchy** | Clear visual weight order. Primary action obvious. Secondary muted. |
| 3 | **Contrast** | Text readable against background. Interactive elements distinguishable. |
| 4 | **Alignment** | Elements on consistent grid. No orphaned items. Edges line up. |
| 5 | **Density** | Right amount of content per viewport. Not too sparse, not too cluttered. |
| 6 | **Consistency** | Same patterns for same concepts. Colors meaningful, not random. |
| 7 | **Touch Targets** | Buttons/links >= 44px touch area on mobile. |
| 8 | **Empty States** | Graceful when data is missing. Not broken, not blank. |

---

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI

---

## Install

```bash
claude plugin add https://github.com/tonymfer/design-loop
```

That's it. Dependencies (ralph-loop, Playwright MCP) are auto-installed on first run.

---

## Usage

### Quick start

```bash
# Start a design loop on your running dev server
/design-loop http://localhost:3000
```

### With options

```bash
# Desktop viewport, 20 iterations
/design-loop http://localhost:3000/dashboard --viewport desktop --iterations 20

# Both mobile and desktop
/design-loop http://localhost:5173 --viewport both
```

### What happens

1. **Context scan** — Reads your `package.json`, `tailwind.config`, and `CLAUDE.md` to understand your design system
2. **Interview** — 3-5 questions about target, focus areas, and constraints
3. **Loop** — Autonomous iteration cycle: screenshot → score → fix → repeat
4. **Completion** — Stops when all 8 criteria score 4/5+ for two consecutive iterations

### Stuck handling

If the same issue persists for 2 iterations, design-loop:
1. Tries an alternative approach (different layout strategy, color approach)
2. If still stuck, skips the issue and moves on
3. Documents skipped issues as TODO comments

---

## Framework support

design-loop auto-detects your framework and adapts:

| Framework | Detection | Default viewport |
|-----------|-----------|-----------------|
| Next.js | `next` in package.json | Mobile-first |
| Nuxt | `nuxt` in package.json | Mobile-first |
| SvelteKit | `@sveltejs/kit` in package.json | Mobile-first |
| React SPA | `react` (no next) | Desktop |
| Vue | `vue` in package.json | Desktop |
| Astro | `astro` in package.json | Desktop |

It also reads your design tokens (Tailwind config, CSS variables, theme files) and component library (shadcn, Radix, etc.) to make fixes that match your existing system.

### Stack compatibility

| Stack | SSR Handling | Notes |
|-------|-------------|-------|
| **Next.js (App Router)** | Waits for hydration before screenshot | Detects `app/` dir, respects `"use client"` boundaries |
| **Next.js (Pages Router)** | Screenshots after client render | Detects `pages/` dir |
| **Vite + React** | Direct client render | Standard SPA flow |
| **Nuxt 3** | Waits for hydration | Detects `nuxt.config.ts` |
| **SvelteKit** | Waits for hydration | Detects `svelte.config.js` |
| **Astro** | Screenshots static output | Works with islands architecture |
| **Plain HTML/CSS** | Direct screenshot | No framework detection needed |

### Recommended skill chains

| Chain | Use Case |
|-------|----------|
| `frontend-design` → `design-loop` | Get creative direction first, then iterate visually |
| `super-frontend` → `design-loop` | Build complex components first, then polish |
| `ralph-prompt-builder` → `design-loop` | Generate the iteration prompt interactively |

---

## How it compares

| | design-loop | Generic UI testing |
|---|---|---|
| **Focus** | Visual polish only | Functional + visual |
| **Iterations** | Unlimited (ralph-loop) | Fixed limit |
| **Phase-aware** | Layout → hierarchy → polish | All at once |
| **Criteria** | 8 design-specific, opinionated | General categories |
| **Project-aware** | Reads your design system | Generic fixes |

> Generic UI testing checks if your UI *works*. design-loop makes it *beautiful*. They're complementary.

---

## Meta

The [interactive demo site](https://design-loop.vercel.app) was polished by design-loop itself. The tool built its own marketing material.

---

## License

MIT
