---
name: brand-guideline
description: "Auto-generated brand fingerprint for design-loop-site"
generated_at: "2026-02-23T00:00:00Z"
generated_by: "design-loop v2.0 code-fingerprint"
mode: "creative-unleash"
---

# Brand & Style Fingerprint

## Color Palette
| Role | Value | Usage |
|------|-------|-------|
| page-bg | #030712 | Page background (near-black) |
| text-primary | #fafaf9 | Primary text (warm white) |
| text-secondary | #a1a1aa | Secondary text |
| text-muted | #9e9ea8 | Muted labels |
| accent | #06b6d4 | CTAs, links, active states (cyan) |
| accent-2 | #8b5cf6 | Gradients, secondary highlight (violet) |
| accent-3 | #f59e0b | Warm accents, later-phase indicators (amber) |
| border | rgba(39, 39, 42, 0.65) | Card/section borders |
| card-bg | rgba(24, 24, 27, 0.5) | Card backgrounds (translucent dark) |
| surface | rgba(24, 24, 27, 0.55) | Surface overlays |

Palette mood: vibrant (dark theme with cyan/violet/amber accent triad)

## Typography
| Role | Family | Personality |
|------|--------|-------------|
| sans | DM Sans | geometric |
| display | Space Grotesk | geometric |
| serif | Instrument Serif | expressive |
| mono | JetBrains Mono | technical |

Size scale: clamp-based responsive (3rem-5rem step numbers, 5xl-8xl hero h1)
Single-family project: no (4 font families)

## Spacing
Scale: tailwind-default
Preferred range: p-6, gap-4, gap-5, py-24 (section), gap-x-8, gap-y-12

## Shape Language
Radii: 12px default (--radius), rounded-xl on cards, rounded-lg on buttons, rounded-full on badges
Shadows: hover-only (0 4px 20px), glow effects via box-shadow with accent colors
Shape personality: soft

## Component Patterns
- Cards: `p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]` with gradient hover overlay
- Buttons: primary = gradient (accent→accent-2) rounded-lg px-6 py-3; ghost = border-bottom text
- Sections: `py-24` vertical rhythm, `max-w-[1100px]` container, section-divider + section-elevated alternating
- Decorative: slash-motif (diagonal accent), step-number-xl (gradient-faded large numbers), hero-ruler (measurement ruler left edge)

## Visual Personality
- Direction: Technical & precise meets Bold & expressive
- Motifs: measurement ruler, dot grid, gradient borders, floating score badge
- Effects: aurora-bg (multi-radial gradients), noise overlay, ambient glow, shimmer animation
- Identity: "Precision instrument for design" — combines monospace technical labels with expressive serif headings and vibrant accent gradients

## Usage Notes
- **creative-unleash**: Personality informs direction. Tokens are starting point, not constraint.
