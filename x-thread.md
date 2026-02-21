# X Thread — design-loop launch

## Tweet 1 (HOOK)
AI can code your UI. But it can't SEE it.

I built a Claude Code plugin that gives it eyes.

Before → After:

[ATTACH: side-by-side screenshot — iteration 0 vs iteration 4 of the landing page]

## Tweet 2 (PROBLEM)
LLMs write CSS blind.

Layout off by 8px? Missed it.
Touch target too small? Can't tell.
Text unreadable on that background? No idea.

They generate code from patterns, not from looking at the result.

## Tweet 3 (SOLUTION)
design-loop adds a visual feedback loop:

1. Screenshot the page (Playwright)
2. Score it against 8 design criteria (1-5 each)
3. Fix the top 3 issues
4. Repeat until polished

It's phase-aware — spacing first, then hierarchy, then polish. Not random fixes.

[ATTACH: diagram of the 4-step cycle]

## Tweet 4 (PROOF)
Visit the site. Click the iteration buttons. Watch the entire page transform.

That's design-loop polishing its own landing page.

Before: 2.8/5 avg (typical AI-generated landing page)
Final: 4.9/5 avg (distinctive dark editorial)

https://design-loop.vercel.app

[ATTACH: filmstrip of all 5 iteration states]

## Tweet 5 (THE 8 CRITERIA)
The 8 criteria it checks every iteration:

1. Spacing — consistent scale, breathing room
2. Hierarchy — clear visual weight order
3. Contrast — text readable, actions distinguishable
4. Alignment — elements on grid, edges line up
5. Density — right content per viewport
6. Consistency — same pattern = same meaning
7. Touch targets — 44px+ on mobile
8. Empty states — graceful when data's missing

Educational value whether you install or not.

## Tweet 6 (META)
The landing page was polished by design-loop.

The tool built its own marketing material.

It started as a generic AI-generated landing page (white, blue, Inter font — the default every AI tool produces) and evolved through spacing → hierarchy → a dramatic dark editorial shift → refined polish.

The demo IS the proof.

## Tweet 7 (INSTALL)
Free. Open source. MIT license.

```
claude plugin add https://github.com/tonymfer/design-loop
```

Then: `/design-loop http://localhost:3000`

One command. Dependencies auto-install on first run.

https://github.com/tonymfer/design-loop

[ATTACH: screenshot of README]

## Tweet 8 (CTA)
Try it on your own project.

Works with any framework — Next.js, Vue, Svelte, React, Astro. Auto-detects your design system (Tailwind tokens, component libraries, CLAUDE.md conventions).

Repo link above. Ship something beautiful.

---

## Asset Checklist

- [ ] Side-by-side before/after screenshot (Tweet 1)
- [ ] 4-step cycle diagram (Tweet 3)
- [ ] Filmstrip of 5 iteration states (Tweet 4)
- [ ] README screenshot (Tweet 7)
