---
name: theme-respect-elevate
description: "The flagship mode: dramatic UX improvements within your existing design system. Reads your tokens and elevates structurally — from safe cleaning to bold restructuring — while preserving brand identity 100%."
---

# Theme-Respect Elevate Mode — The Flagship

The sweet spot: 100% brand preservation + dramatic UX improvement.
Give AI eyes and keep improving until it's truly exceptional within the brand identity.

TRE is not "CU with guardrails." It's a fundamentally different approach:
- CU says "reimagine this" — brand may shift
- TRE says "make this exceptional within its own identity" — brand is sacred

## Theme Constraint Source

Use `BRAND_FINGERPRINT.tokens` as the HARD CONSTRAINT for all fixes:

- `BRAND_FINGERPRINT.tokens.colors` — allowed color values
- `BRAND_FINGERPRINT.tokens.typography` — allowed font families, sizes, weights
- `BRAND_FINGERPRINT.tokens.spacing` — allowed spacing values
- `BRAND_FINGERPRINT.tokens.shape` — allowed border-radius and shadow values

If BRAND_FINGERPRINT is empty (user declined fingerprinting), fall back to
extracting tokens directly from PROJECT_CONTEXT.designTokens:
1. Extract color palette — THEME_COLORS
2. Extract spacing scale — THEME_SPACING
3. Extract typography — THEME_FONTS
4. Extract border-radius — THEME_RADII
5. Extract shadows — THEME_SHADOWS

All fixes MUST use values from the fingerprint tokens or fallback extraction.
If a desired value doesn't exist in the theme, use the closest available token.

## Brand Safety Invariant (ALL LEVELS)

Regardless of boldness level, ALL changes MUST:
- Use ONLY colors from BRAND_FINGERPRINT.tokens.colors
- Use ONLY fonts from BRAND_FINGERPRINT.tokens.typography.families
- Use ONLY spacing from BRAND_FINGERPRINT.tokens.spacing scale
- Use ONLY radii/shadows from BRAND_FINGERPRINT.tokens.shape
- Preserve BRAND_FINGERPRINT.visual.personality (retro stays retro, minimal stays minimal)
- Preserve the emotional vibe — if the page feels "playful and techy," it must still feel that after changes

Boldness controls STRUCTURAL latitude, not BRAND departure. There is zero brand departure at any level.

## Boldness Level System

### Level 1 (Minimal) — Safe Cleaning

```yaml
max_iterations: 8
fixes_per_iteration: 5
```

**Allowed:**
- Token swaps (hardcoded values → semantic tokens)
- Spacing normalization within theme scale
- Dim-text unification
- Interactive state polish (hover/focus using theme colors)
- Contrast improvements within theme palette

**Prohibited:**
- Moving/reordering any elements
- Adding/removing components
- Changing layout structure
- Any change that alters the visual hierarchy

### Level 2 (Medium) — Structural Elevation *(Recommended)*

```yaml
max_iterations: 12
fixes_per_iteration: 5
```

**Allowed (everything from Level 1, plus):**
- Card/list item rearrangement within existing containers
- Section reordering for improved visual flow
- Emphasis hierarchy changes (what's visually prominent vs subdued)
- Component variant upgrades (e.g., outline button → filled button, ghost → solid)
- Whitespace rhythm improvements (adding/removing breathing room)
- Interactive state enrichment (expand hover/active/focus patterns)
- Visual grouping improvements (borders, backgrounds to create clear sections)
- Info density adjustments (more/less content visible per viewport)

**Prohibited:**
- Adding NEW components not already in the project's component library
- Changing layout system (flex → grid or vice versa)
- Adding fonts not already imported
- Adding CSS animations/transitions beyond hover/focus states
- Any structural change that breaks BRAND_FINGERPRINT.visual.personality

**Safety check before each structural fix:**
1. Does this change use ONLY tokens from BRAND_FINGERPRINT?
2. Does the page still "read" as the same personality after this change?
3. Would someone familiar with this brand recognize it instantly?
If ANY answer is "no" → skip the fix, log to fixes_skipped.

### Level 3 (Bold) — Maximum Structural Impact

```yaml
max_iterations: 15
fixes_per_iteration: 7
```

**Allowed (everything from Level 2, plus):**
- Full layout restructuring within containers (flex → grid, column changes)
- New component introduction FROM the project's existing component library
  (shadcn, radix, headless-ui variants already installed)
- Grid system adjustments (2-col → 3-col, card size rebalancing)
- Decorative enhancements using ONLY theme tokens (borders, dividers,
  section backgrounds, subtle depth via theme shadows)
- Content density overhaul (collapse verbose sections, expand key content)
- Navigation flow improvements (reorder nav items, improve hierarchy)

**Prohibited (even in Bold):**
- Adding fonts not in BRAND_FINGERPRINT.tokens.typography.families
- Adding colors not in BRAND_FINGERPRINT.tokens.colors
- Adding spacing values not in BRAND_FINGERPRINT.tokens.spacing scale
- Installing new npm packages or component libraries
- Adding decorative elements with raw hex/rgba values
- Changes that require BRAND_FINGERPRINT.visual.personality to be re-evaluated
- CSS animations beyond theme-standard transitions (unless tokens define them)

**Safety check before each structural fix (stricter than Level 2):**
1. Does every CSS value trace to a BRAND_FINGERPRINT token?
2. Does the personality still read identically?
3. Would a brand designer approve this without hesitation?
4. Could this change break in other themes (light mode, alternate schemes)?
If ANY answer is "no" → skip the fix, log to fixes_skipped with reason.

## Beeper Few-Shot Examples

### Level 1 (Minimal) — Beeper /beeper page

```yaml
Before: {comp:3.5, typo:3.5, color:3.0, ident:3.5, polish:3.3} = 3.36
After:  {comp:3.6, typo:3.5, color:3.5, ident:3.5, polish:3.5} = 3.52

Fixes applied:
  - Signal icon: CSS filter → RetroIcon with text-[var(--colors-primary)]
  - bg-black/95 → bg-[var(--colors-background)]
  - 39 ad-hoc opacity modifiers → design tokens
  - text-terminal-green/55 → text-terminal-green-dim (4 instances)

Result: Code quality dramatically improved (compliance 0.65 → 0.96).
Visual appearance nearly identical in dark theme — small glow/hover
improvements visible. Light theme significantly improved.

Note: Score increase capped because visual_impact was "code_quality_only"
for 2 of 3 iterations. System correctly identified this as maintenance work.
```

### Level 2 (Medium) — Beeper /beeper page

```yaml
Before: {comp:3.5, typo:3.5, color:3.0, ident:3.5, polish:3.3} = 3.36
After:  {comp:4.5, typo:4.0, color:4.5, ident:4.5, polish:4.0} = 4.30

Fixes applied (3 iterations):
  Iter 1 — Emphasis hierarchy:
  - Settings list: reorder by frequency of use (Price + Streak at top,
    Rankings/Stats/Profile grouped as secondary). Same pixel font, same
    terminal-green, same card containers — just smarter ordering.
  - "TAP TO RECHARGE" button: elevate with border-terminal-border-bright +
    bg-[var(--colors-background-elevated)] — makes the primary CTA pop
    within the existing design language.
  - Section header "SETTINGS" → add var(--colors-primary) accent bar (2px,
    matching existing beeper frame border weight).

  Iter 2 — Interactive states + visual grouping:
  - All settings rows: add hover state bg-[var(--colors-background-elevated)]
    with 150ms transition (already exists in other components).
  - Group related settings with subtle dividers using border-terminal-border.
  - Share/Copy buttons: match hover pattern from settings rows.
  - StatusCard metrics: apply consistent dim-text for labels, bright for values.

  Iter 3 — Whitespace rhythm:
  - Add breathing room between beeper device and settings (gap-8 from scale).
  - Settings cards: consistent internal padding using theme spacing scale.
  - Bottom action buttons: full-width within settings container for visual weight.

Brand verification: Press Start 2P headings, VT323 body, 0px sharp radii,
2px pixel borders, terminal-green palette — all 100% preserved. The page
now has clear visual hierarchy and feels polished, but is unmistakably the
same retro pixel terminal.
```

### Level 3 (Bold) — Beeper /beeper page

```yaml
Before: {comp:3.5, typo:3.5, color:3.0, ident:3.5, polish:3.3} = 3.36
After:  {comp:5.0, typo:4.5, color:4.8, ident:5.0, polish:4.5} = 4.76

Fixes applied (5 iterations):
  Iter 1 — Layout restructuring:
  - Settings section: restructure from flat list to 2-column grid at desktop.
    Left column: frequent actions (Price, Streak). Right: navigation
    (Rankings, Stats, Profile). Uses existing grid tokens + gap-4 from scale.
  - Beeper device frame: add subtle depth with 2px solid-color offset shadow
    using var(--colors-accent) — pixel-aligned, matches retro aesthetic.

  Iter 2 — Component upgrades:
  - Settings rows: upgrade to card variant with border-terminal-border +
    bg-terminal-bg-card (tokens already defined in globals.css).
  - Add RetroIcon indicators for each setting (existing icons from /public/svg/).
  - Share/Copy buttons: upgrade to filled variant with bg-[var(--colors-primary)]
    for Share (primary action), keep Copy as ghost (secondary).

  Iter 3 — Visual hierarchy + emphasis:
  - Battery status (100%): elevate to hero-level prominence with large
    Press Start 2P number + terminal-green glow using var(--colors-glow-strong).
  - "TAP TO RECHARGE" → full-width button with pixel border animation
    (border-color shift using existing theme transition tokens).
  - Section labels: add leading accent marker using var(--colors-primary).

  Iter 4 — Decorative enhancements (theme tokens only):
  - Add pixel-art divider between device frame and settings using
    border-terminal-border-bright (2px dashed, matching retro aesthetic).
  - Settings grid cards: add subtle scanline overlay (existing retro-styles.ts
    pattern from other screens, uses theme rgba tokens).
  - Bottom nav: add active-state indicator using var(--colors-primary) underline.

  Iter 5 — Polish pass:
  - Consistent hover states across all interactive elements.
  - Focus-visible rings using ring-[var(--colors-primary)] (accessibility).
  - Responsive check: grid collapses to single column on mobile (375px).

Brand verification: Every single value traces to BRAND_FINGERPRINT tokens.
Press Start 2P, VT323, 0px radii, 2px borders, terminal-green palette,
pixel-art personality — all 100% preserved. The page went from "functional
settings list" to "polished retro terminal experience" without adding a
single non-theme value.
```

## Visual Impact Gate

```yaml
visual_delta_threshold: 0.02
score_cap_on_code_quality: 0.15
```

## Scoring Weights

Weights vary by boldness level to reflect the mode's focus at each tier:

| Criterion | Level 1 | Level 2 | Level 3 | Sensitivity |
|-----------|---------|---------|---------|-------------|
| Composition | 1.2x | 1.3x | 1.4x | Reward structural improvements at higher levels |
| Typography | 1.2x | 1.2x | 1.2x | Same — fonts don't change |
| Color & Contrast | 1.3x | 1.2x | 1.1x | Decreasing — color is already token-gated |
| Visual Identity | 1.0x | 1.2x | 1.3x | Increasing — structural changes need identity verification |
| Polish | 1.3x | 1.1x | 1.0x | Decreasing — some roughness acceptable during restructuring |

If BOLDNESS_LEVEL is not set (null), use Level 2 weights as default.

### What "score 5" means in this mode

Per boldness level:
- **Level 1 score-5**: Perfect token compliance + visual consistency across all properties. Every value traces to a token.
- **Level 2 score-5**: + intentional emphasis hierarchy, optimized content flow, clear interactive states. The page has visible structural improvements.
- **Level 3 score-5**: + distinctive structural composition, component excellence. The page feels "designed" — portfolio-worthy within the existing brand system.

## Fix Strategy

1. **Token audit first** — before fixing anything, verify which tokens exist and what they map to
2. **Replace raw values with tokens** — find hardcoded values and swap for semantic tokens
3. **Elevate emphasis** — use the theme's accent/primary colors more intentionally for CTAs and key elements
4. **Consistent application** — if `rounded-lg` is the standard, find and fix all `rounded-md` or `rounded` outliers
5. **Structural improvements** (Level 2+) — rearrange, regroup, and restructure using only theme tokens
6. **Maximum fixes per iteration** — Level 1: 5, Level 2: 5, Level 3: 7. Each fix must reference a specific token.

## Diff Configuration

- `diff_threshold`: 0.15 (moderate — meaningful changes expected per iteration)
- `visual_fidelity`: computed, warn if < 0.3 (possible regression)
- `theme_fidelity`: **HARD GATE** at 0.8 — fixes scoring below 0.8 are reverted and revised using only `BRAND_FINGERPRINT.tokens`. Max 1 retry per fix.

## Completion Threshold

Per boldness level:

```yaml
Level 1: goal_threshold: 4.0, max_iterations: 8
Level 2: goal_threshold: 4.2, max_iterations: 12
Level 3: goal_threshold: 4.5, max_iterations: 15
```

Per-criterion: All 5 criteria >= 4/5 raw for 2 consecutive iterations.
Exemptions: None — all criteria must pass.
`completion_exemptions`: []
