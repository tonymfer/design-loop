# Dark Cinematic Landing Page — Design Document

## Overview

Rebuild the design-loop landing page as a cinematic dark-themed experience. Drop the 5-state iteration theme system in favor of a single polished dark theme. Preserve the iteration demo as a secondary interactive showcase section.

## Design Direction

Linear.app meets Vercel: dark, precise, technically elegant with amber/gold accents. Animated entries, scroll-triggered reveals, Aceternity-style spotlight effects.

## Tech Stack

- Next.js 15 + React 19 (existing)
- Tailwind CSS v4 (existing)
- Framer Motion via `motion/react` (existing)
- Lucide React (new)
- Aceternity-style custom components (new, built from scratch)
- React Bits patterns (new)

## Design Tokens

| Token | Value |
|-------|-------|
| Background | `#09090b` |
| Surface | `#111113` / `#18181b` |
| Border | `#27272a` / `rgba(234,179,8,0.08)` |
| Text Primary | `#fafaf9` |
| Text Secondary | `#a1a1aa` |
| Text Muted | `#71717a` |
| Accent | `#eab308` |
| Accent Glow | `rgba(234,179,8,0.15)` |
| Font Heading | Instrument Serif |
| Font Body | DM Sans |
| Font Mono | JetBrains Mono |
| Font Display | Space Grotesk |
| Radius | `2px` |
| Max Width | `1100px` |

## Section Flow

1. Hero — Spotlight beam background, animated headline, badge, dual CTAs
2. How It Works — 5-step horizontal flow with Lucide icons and glowing connectors
3. Structured Iteration — Phase timeline with scroll-activated glow
4. 8 Design Fundamentals — Bento grid with hover effects
5. Stack Detection — Animated framework/library pills
6. See It In Action — Iteration demo (preserved)
7. Install — Terminal code block
8. Features — Numbered feature list
9. Final CTA — Animated counter, install command, GitHub link
10. Footer

## Component Inventory

1. SpotlightHero — Mouse-following spotlight beam
2. AnimatedBadge — Shimmer border badge
3. GlowButton — Ambient glow CTA
4. StepFlow — Horizontal steps with connectors
5. BentoFeatures — Asymmetric grid with hover reveal
6. PhaseTimeline — Scroll-triggered timeline
7. ScoreRadar — Animated score bars
8. StackDetection — Stagger-entrance pills
9. TerminalBlock — Terminal chrome code block
10. IterationDemo — Existing switcher, refactored
11. AnimatedCounter — Number morph on scroll
12. Footer — Minimal dark

## Baseline Overrides

- Gradients allowed: spotlight beam and ambient glow require radial gradients
- Single accent color: amber/gold only
