# Design Loop — Reference

> Lookup reference for design-loop. The core workflow and detection logic lives in [SKILL.md](SKILL.md). This file contains tool commands, templates, CSS fix snippets, and framework-specific implementation guidance.

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

**Average: ?/5 (change +/- ? from previous)**

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

### Animation Libraries (Framer Motion)

- Use `motion.div`, `motion.span` etc. instead of CSS `transition-*` classes
- Use `AnimatePresence` for mount/unmount animations
- Use `whileHover`, `whileTap` props instead of `hover:` Tailwind variants for complex interactions
- Prefer `layout` prop for layout animations over manual transforms
- Don't mix Framer Motion and CSS transitions on the same element

### 3D / WebGL (React Three Fiber — OFF-LIMITS)

- NEVER modify code inside `<Canvas>` elements
- NEVER try to fix 3D scenes with CSS
- If a 3D element looks off in screenshots, LOG it but DON'T fix it
- Only fix the 2D HTML elements surrounding the canvas

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
