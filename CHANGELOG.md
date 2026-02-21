# Changelog

## [0.1.0] - 2026-02-21
### Added
- Core design-loop skill: autonomous visual iteration via Playwright screenshots
- 8-criterion scoring system (spacing, hierarchy, contrast, alignment, density, consistency, touch targets, empty states)
- Stop hook for autonomous multi-iteration loops (inspired by ralph-loop, Apache 2.0)
- Adaptive interview (3-8 questions, auto-skipped via project scan)
- Framework detection (Next.js, Nuxt, SvelteKit, Remix, Gatsby, Solid.js, Astro)
- CSS-in-JS, component library, and animation library detection
- CSS cascade audit for Tailwind v4 unlayered reset conflicts
- Iteration logging to `.claude/design-loop-history.md`
- Stuck detection with strategy rotation
- `/design-loop` and `/export-loop` slash commands
- Phase-aware iteration strategy (layout → hierarchy → alignment → polish)
- Reference URL comparison at phase boundaries
- Wide viewport check (1920px) for centering bugs
- Interactive demo site at design-loop.vercel.app
