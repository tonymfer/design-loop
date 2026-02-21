# Design Loop — Reference

## Playwright Screenshot Commands

### Navigate to page
```
Tool: mcp__plugin_playwright_playwright__browser_navigate
Parameters: { "url": "http://localhost:3000/page" }
```

### Take screenshot
```
Tool: mcp__plugin_playwright_playwright__browser_take_screenshot
Parameters: {}
```

### Resize to mobile viewport
```
Tool: mcp__plugin_playwright_playwright__browser_resize
Parameters: { "width": 390, "height": 844 }
```

### Resize to desktop viewport
```
Tool: mcp__plugin_playwright_playwright__browser_resize
Parameters: { "width": 1280, "height": 800 }
```

### Full page snapshot (DOM tree — no screenshot needed)
```
Tool: mcp__plugin_playwright_playwright__browser_snapshot
Parameters: {}
```

### Resize to wide viewport (centering check)
```
Tool: mcp__plugin_playwright_playwright__browser_resize
Parameters: { "width": 1920, "height": 1080 }
```

### Evaluate JS on page (layout measurement)
```
Tool: mcp__plugin_playwright_playwright__browser_evaluate
Parameters: { "function": "() => { ... }" }
```

## Layout Measurement (MEASURE step)

Run this after each screenshot to catch CSS cascade bugs that are invisible visually:

```js
// Playwright: mcp__plugin_playwright_playwright__browser_evaluate
// Chrome: mcp__claude-in-chrome__javascript_tool
(() => {
  const results = {};
  const container = document.querySelector(
    '[class*="container"], [class*="max-w"], main, [style*="max-width"]'
  ) || document.body.firstElementChild;
  if (container) {
    const rect = container.getBoundingClientRect();
    const vw = window.innerWidth;
    results.centering = {
      left: Math.round(rect.left),
      right: Math.round(vw - rect.right),
      drift: Math.round(Math.abs(rect.left - (vw - rect.right))),
      centered: Math.abs(rect.left - (vw - rect.right)) < 20
    };
  }
  const el = document.querySelector('.mx-auto, .px-4, .gap-4');
  if (el) {
    const cs = getComputedStyle(el);
    results.utilityCheck = {
      marginLeft: cs.marginLeft,
      marginRight: cs.marginRight
    };
  }
  return JSON.stringify(results, null, 2);
})()
```

### Red Flags

| Measurement | Threshold | Likely Cause |
|-------------|-----------|-------------|
| `centering.drift > 20` | Container NOT centered | Unlayered CSS reset overriding `mx-auto` |
| `marginLeft: "0px"` on `.mx-auto` | Utility overridden | `* { margin: 0 }` outside `@layer` |
| Different at 1280 vs 1920 | Max-width not working | Missing `mx-auto` or cascade conflict |

## CSS Cascade Audit (Phase 1)

Before iterating, check for CSS cascade conflicts — especially in Tailwind v4 projects:

```
GREP for these patterns in globals.css / global stylesheets:
  * {           ← Universal reset
  body {        ← Body override
  html {        ← Root override

If found OUTSIDE @layer block:
  → Unlayered styles ALWAYS beat @layer utilities (CSS spec)
  → Tailwind v4 utilities live in @layer utilities
  → Result: mx-auto, px-*, py-*, gap-* silently fail

Fix: Delete redundant resets (Tailwind preflight handles them in @layer base)
     or wrap in @layer base { ... }
```

## Project Detection for Interview Skip

Phase 1 scans for signals that auto-skip strategic interview questions. Detection is keyword-based — extract the relevant context, don't just detect presence.

### Keyword Patterns

| Signal | Scan Location | Keywords (regex) | Maps To |
|--------|--------------|------------------|---------|
| Vision | CLAUDE.md, docs/DESIGN.md | `goal\|vision\|objective\|brief\|purpose` near "design" context | Q5 default |
| Audience | CLAUDE.md, docs/DESIGN.md | `audience\|users\|demographic\|persona\|target` | Q6 default |
| References | CLAUDE.md, docs/DESIGN.md | `reference\|inspiration\|like the design\|emulate` + URL pattern | Q7 default |
| Metrics | CLAUDE.md, docs/DESIGN.md | `success\|metric\|KPI\|done when\|acceptance` | Q10 default |

### DESIGN.md Section Mapping

If `docs/DESIGN.md` or `docs/design-brief.md` exists, parse these sections:

| Document Section Header | Maps To |
|------------------------|---------|
| `## Vision` / `## Goal` / `## Objective` | DETECTED_VISION |
| `## Audience` / `## Users` / `## Personas` | DETECTED_AUDIENCE |
| `## References` / `## Inspiration` | DETECTED_REFERENCES |
| `## Success` / `## Metrics` / `## KPIs` | DETECTED_METRICS |

### Previous Run Detection

If `.claude/design-loop-history.md` exists:
1. Parse the most recent run's summary block
2. Extract: focus areas, final average, skipped issues
3. Present as Q2 default: "Continue from previous run ([previous focus areas])?"

### frontend-design Detection

If the `frontend-design` skill was invoked in this session:
1. Check for `.claude/design-direction.md` or equivalent output
2. Extract: palette, typography, layout strategy, creative tone
3. Auto-skip Q7 (Inspirations) and Q9 (Creative Direction)
4. Inject creative direction into PROJECT_CONTEXT

## Reference Screenshot Comparison

When the user provides a reference URL in Q7, capture it alongside the target for visual benchmarking.

### Capture Protocol

**Iteration 1 (initial comparison):**
1. Navigate to reference URL via Playwright
2. Resize to same viewport as target
3. Take screenshot → save as `.claude/design-loop-reference.png`
4. Navigate back to target URL
5. Take target screenshot as usual
6. In ANALYZE step, note key differences between target and reference for the DESCRIBED aspects only

**Phase boundaries (iter 4, 7, 10):**
1. Re-screenshot reference URL (design may be dynamic)
2. Compare progress: how much closer is the target to the reference on the described aspects?
3. Log comparison notes in design-loop-history.md

### Comparison Scope

Only compare what the user described. Common patterns:

| User Description | Compare | Ignore |
|-----------------|---------|--------|
| "clean spacing" | Padding, margins, whitespace | Colors, fonts, content |
| "typography" | Font sizes, weights, hierarchy | Layout, colors, imagery |
| "layout" | Grid, flow, component arrangement | Colors, fonts, content |
| "overall feel" | All visual aspects | Content, functionality |
| "card design" | Card components specifically | Page-level layout |

## Audience-Aware Criterion Weighting

Based on Q5 (Vision) and Q6 (Audience), adjust which criteria get priority in scoring and fixing.

### Vision-Based Weights

| Vision | Primary Criteria | Secondary Criteria | De-prioritize |
|--------|-----------------|-------------------|---------------|
| Usability | Hierarchy, Touch Targets | Spacing, Density | Consistency |
| Aesthetics | Spacing, Consistency | Contrast, Alignment | Touch Targets |
| Conversion | Contrast, Density | Hierarchy, Touch Targets | Empty States |
| Accessibility | Contrast, Touch Targets | Hierarchy, Spacing | Density |
| General polish | All equal | — | — |

### Audience-Based Adjustments

| Audience | Adjustment |
|----------|------------|
| General web users | No adjustment (baseline weights) |
| Mobile-first young (18-35) | Touch Targets MUST be 5/5. Bold colors preferred. Higher Density tolerance. |
| Enterprise / business | Higher Density expected (more info-dense). Conservative aesthetics. Consistency critical. |
| Developers / technical | Clean/minimal aesthetic. Hierarchy paramount. Low Density (breathing room). |

### How Weighting Applies

In the ANALYZE step of each iteration:
1. Score all 8 criteria normally (1-5)
2. When selecting "top 3 issues", prefer issues in Primary Criteria
3. If all Primary Criteria are >=4, then fix Secondary Criteria
4. De-prioritized criteria are still scored but only fixed after others are >=4

This is soft weighting — all 8 criteria must still reach >=4/5 for POLISHED status.

## Fallback: Chrome MCP (if Playwright unavailable)

```
Tool: mcp__claude-in-chrome__navigate
Parameters: { "url": "http://localhost:3000/page" }

Tool: mcp__claude-in-chrome__read_page
Parameters: {}
```

## Analysis Template

Use this template after each screenshot:

```
## Visual Analysis — Iteration [N]

| Criterion     | Prev | Score | Delta | Notes                          |
|---------------|------|-------|-------|--------------------------------|
| Spacing       |  ?   | ?/5   |  ±?   |                                |
| Hierarchy     |  ?   | ?/5   |  ±?   |                                |
| Contrast      |  ?   | ?/5   |  ±?   |                                |
| Alignment     |  ?   | ?/5   |  ±?   |                                |
| Density       |  ?   | ?/5   |  ±?   |                                |
| Consistency   |  ?   | ?/5   |  ±?   |                                |
| Touch Targets |  ?   | ?/5   |  ±?   |                                |
| Empty States  |  ?   | ?/5   |  ±?   |                                |

**Average: ?/5 (Δ ±? from previous)**

### Top 3 Issues (by severity):
1. [issue] — [which criterion] — [fix approach]
2. [issue] — [which criterion] — [fix approach]
3. [issue] — [which criterion] — [fix approach]
```

## Common Fixes by Criterion

### Spacing
```css
/* Too cramped → add padding */
p-2 → p-3 or p-4
gap-1 → gap-2 or gap-3
space-y-1 → space-y-2

/* Too sparse → reduce */
p-6 → p-4
py-8 → py-4

/* Snap to 4px grid */
Use multiples of 4: 4/8/12/16/20/24/32/40/48/56/64px
```

### Hierarchy
```css
/* Make primary action stand out */
text-sm → text-base font-bold
border-muted → border-primary bg-primary/10

/* Demote secondary */
opacity-100 → opacity-60
font-medium → font-normal text-muted-foreground
```

### Contrast
```css
/* Low contrast text */
text-muted/30 → text-muted/60
text-xs → text-sm (size helps readability too)

/* Interactive vs static */
Add hover:bg-accent/10 hover:border-accent
cursor-pointer on clickable elements
```

### Alignment
```css
/* Flex alignment */
items-start → items-center (vertical centering)
Add consistent px-3 or px-4 across sections

/* Grid snap */
gap-3 → gap-4 (4px grid)
Use consistent max-w-* containers
```

### Density
```css
/* Too sparse */
Add more visible content, reduce empty space
Increase grid columns: grid-cols-1 → grid-cols-2

/* Too cluttered */
Reduce items visible per fold
Add whitespace between sections
```

### Consistency
```css
/* Unify patterns */
Same border-radius for all cards
Same padding for all sections
Same heading size for same level headings
Same color token for same meaning (primary, muted, accent)
```

### Touch Targets
```css
/* Too small */
min-h-[44px] min-w-[44px] on all interactive elements
p-3 minimum on buttons
Add padding, not just relying on text size
```

### Empty States
```css
/* Show helpful message + action */
"No items yet" + CTA button
Illustration or icon for visual warmth
Match the page's design language
```

## Phase-Aware Iteration Strategy

| Phase | Iterations | Focus | Why first? |
|-------|-----------|-------|------------|
| Layout | 1-3 | Spacing, alignment, grid | Biggest visual impact, foundation for everything |
| Hierarchy | 4-6 | Contrast, typography, visual weight | Readable content requires solid layout first |
| Polish | 7-9 | Consistency, density, edge cases | Fine-tuning after structure is solid |
| Final | 10+ | Touch targets, empty states, micro-adjustments | Last mile polish |

## Stuck Detection

**Objective trigger**: criterion score unchanged AND same criterion targeted → rotate strategy.

### Strategy Rotation Table

| Failed Approach | Rotate To | Example |
|----------------|-----------|---------|
| Padding/margin adjustment | Layout restructure | `gap-4` didn't help → switch from flex to grid |
| Color change | Font size/weight change | Contrast still low → increase font-size or weight instead |
| Border styling | Background/shadow change | Border not helping → add subtle bg tint or shadow |
| Single-element fix | Parent container restructure | Button padding didn't help → restructure the card layout |
| Spacing scale tweak | Section reorder/removal | Spacing still off → remove or reorder elements |
| Typography change | Hierarchy restructure | Font change didn't clarify → reorganize visual weight order |
| Utility class not applied | CSS cascade audit | `mx-auto` not centering → check for unlayered `* { margin: 0 }` |
| Centering broken | Wide viewport + MEASURE | Looks fine at 1280px → test at 1920px, run JS measurement |

### Escalation Path

1. **Iteration N**: Fix attempted, score unchanged → flag criterion
2. **Iteration N+1**: Rotate strategy per table above
3. **Iteration N+2**: Broaden scope — fix criterion in context of the whole page, not one component
4. **Iteration N+3 (terminal)**: SKIP criterion with documented reason. Add TODO comment. Log in history.

### Additional Tactics

- **Skip and return**: Move to a different criterion. Sometimes fixing hierarchy reveals the spacing fix.
- **Context shift**: Look at the criterion from a different viewport (mobile vs desktop).
- **Simplify**: Remove decorative elements that may be causing the issue.

## Viewport Reference

| Viewport | Width | Height | Use for |
|----------|-------|--------|---------|
| Mobile (small) | 375px | 667px | iPhone SE |
| Mobile (standard) | 390px | 844px | iPhone 14/15 |
| Tablet | 768px | 1024px | iPad |
| Desktop (standard) | 1280px | 800px | Laptop |
| Desktop (wide) | 1440px | 900px | External monitor |

## Framework-Specific Patterns

### Next.js / React
- Edit component `.tsx` files, not page files
- Use existing component library (shadcn, radix, etc.)
- Check `tailwind.config` for design tokens

### Vue / Nuxt
- Edit `.vue` SFC `<style>` or `<template>` sections
- Use scoped styles when available
- Check for Vuetify, Quasar, or PrimeVue tokens

### Svelte / SvelteKit
- Edit `.svelte` files directly
- Use Svelte scoped styles
- Check for Skeleton UI or DaisyUI tokens

## Integration with Other Plugins

Design Loop works well chained with:

- **playwright**: Required — provides screenshot capability
- **frontend-design**: Invoke BEFORE design-loop to get creative direction
- **figma**: Use INSTEAD of design-loop when a Figma mockup exists

## Recommended Skills

| Skill | When to Use | Chain Order |
|-------|-------------|-------------|
| **frontend-design** | Get creative direction (palette, typography, layout strategy) before iterating | frontend-design → design-loop |

## Anti-Pattern Awareness

When scoring and fixing, watch for these common AI-generated design anti-patterns:

- **Purple gradient everything** — AI defaults to violet/purple gradients. Prefer intentional palette choices.
- **Inter font on everything** — Generic sans-serif. Consider display fonts for headings.
- **Excessive border-radius** — Not everything needs `rounded-2xl`. Sharp corners signal editorial sophistication.
- **Symmetrical layouts only** — AI avoids asymmetry. Intentional asymmetry creates visual interest.
- **Safe whitespace** — AI tends to under-space rather than risk too much breathing room.
- **Decorative gradients with no purpose** — Gradients should guide the eye or create depth, not just "look modern."

## SSR-Aware Prompts

### Next.js App Router
- Components in `app/` are Server Components by default — add `"use client"` for interactive elements
- Don't use `document` or `window` in Server Components
- CSS Modules or Tailwind preferred over runtime CSS-in-JS
- Screenshot after hydration completes (wait for client-side state)

### Next.js Pages Router
- All components are client-side by default
- `getServerSideProps` / `getStaticProps` for data — design-loop only touches the component render
- `_app.tsx` for global styles, `_document.tsx` for `<html>` / `<body>` — usually don't edit these

### Nuxt 3
- Auto-imports for components and composables
- `<script setup>` syntax — edit `<template>` and `<style>` sections for visual changes
- `useHead()` for meta — don't touch for visual iteration
