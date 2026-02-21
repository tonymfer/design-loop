# design-loop

**AI can code your UI. But it can't *see* it.**

design-loop is a [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin that gives Claude eyes. It screenshots your page, scores it against 8 design criteria, fixes the issues, and repeats — autonomously — until your UI is polished.

**[See the interactive demo](https://design-loop.vercel.app)** — click the iteration buttons and watch the page transform.

---

## How it works

1. **Screenshot** — Playwright captures the current page
2. **Score** — 8 design criteria evaluated 1–5
3. **Fix** — Top 3 issues fixed in code, build verified
4. **Repeat** — Loop continues until all criteria hit 4/5+

### Phase-aware iteration

design-loop doesn't fix everything at once. It follows a structured progression:

| Iterations | Focus | Why first |
|-----------|-------|-----------|
| 1–3 | Spacing & Layout | Biggest visual impact |
| 4–6 | Hierarchy & Contrast | Typography and readability |
| 7–9 | Alignment & Consistency | Edge alignment, pattern unification |
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

## Install

```bash
claude plugin add https://github.com/tonymfer/design-loop
```

That's it. Playwright MCP is auto-installed on first run. No other dependencies.

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
2. **Interview** — 3–5 questions about target, focus areas, and constraints
3. **Loop** — Autonomous iteration cycle: screenshot → score → fix → repeat
4. **Completion** — Stops when all 8 criteria score 4/5+ for two consecutive iterations

If the same issue persists for 2 iterations, design-loop tries an alternative approach. If still stuck, it skips the issue, documents it as a TODO comment, and moves on.

---

## Ecosystem Detection

design-loop auto-detects your stack from `package.json` and adapts its fixes accordingly.

### Frameworks

| Framework | Detection | Default viewport |
|-----------|-----------|-----------------|
| **Next.js** | `next` in package.json | Mobile-first |
| **Nuxt** | `nuxt` in package.json | Mobile-first |
| **SvelteKit** | `@sveltejs/kit` in package.json | Mobile-first |
| **React SPA** | `react` (no next) | Desktop |
| **Vue** | `vue` in package.json | Desktop |
| **Astro** | `astro` in package.json | Desktop |
| **Plain HTML/CSS** | No framework detected | Desktop |

SSR frameworks (Next.js, Nuxt, SvelteKit) wait for hydration before taking screenshots.

### Component libraries

Detected automatically: **shadcn/ui**, **Radix UI**, **Chakra UI**, **Material UI**, **Ant Design**, **DaisyUI**. design-loop reads your theme config and uses your existing tokens — it won't introduce conflicting styles.

### Animation libraries

**Framer Motion** (`framer-motion`) — When detected, design-loop prefers `motion.*` components over CSS transitions and respects `AnimatePresence` patterns. It won't mix Framer Motion and CSS transitions on the same element.

### 3D / WebGL (off-limits)

**React Three Fiber** (`@react-three/fiber`) and **Drei** (`@react-three/drei`) — `<Canvas>` elements are marked as untouchable. design-loop will screenshot them for scoring context but never modify 3D scene code. Three.js and other WebGL libraries follow the same rule.

---

## Skill Chains

Use `frontend-design` → `design-loop` to get creative direction first, then iterate visually.

---

## License

MIT
