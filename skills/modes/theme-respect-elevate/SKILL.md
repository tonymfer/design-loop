---
name: theme-respect-elevate
description: "Reads your design tokens and elevates within your existing design system. Respects your theme. Medium creative latitude."
---

# Theme-Respect Elevate Mode

Design-system-aware iteration. Reads your tokens (colors, spacing, typography) and elevates the UI using only what your theme provides. Never introduces foreign design elements.

## Theme Fingerprinting

Before scoring, build a theme fingerprint from `PROJECT_CONTEXT`:

```
1. Extract color palette from tailwind.config or CSS custom properties
   → Store as THEME_COLORS: { primary, secondary, accent, background, foreground, muted, ... }
2. Extract spacing scale
   → Store as THEME_SPACING: [values from theme]
3. Extract typography
   → Store as THEME_FONTS: { sans, serif, mono, display, heading }
   → Note: if only 1 font family exists, do NOT add a second one
4. Extract border-radius scale
   → Store as THEME_RADII: [values from theme]
5. Extract shadow definitions
   → Store as THEME_SHADOWS: [values from theme]
```

All fixes MUST use values from these extracted tokens. If a desired value doesn't exist in the theme, use the closest available token.

## Scoring Weights

| Criterion | Weight | Sensitivity |
|-----------|--------|-------------|
| Composition | 1.2x | Flag spacing that doesn't use theme scale values |
| Typography | 1.2x | Flag font sizes outside the type scale, wrong font family usage |
| Color & Contrast | 1.3x | Flag colors not from theme palette, contrast failures within palette |
| Visual Identity | 1.0x | Score how well the page uses the theme's visual language |
| Polish | 1.3x | Flag inconsistent token usage — same concept, different values |

### What "score 5" means in this mode

- **Composition 5**: Layout uses the theme's spacing scale consistently. Every gap, padding, margin maps to a token.
- **Typography 5**: Every text element uses the correct font from the type scale. Clear hierarchy using only theme-defined sizes and weights.
- **Color 5**: Every color on the page traces back to a theme token. Palette is used cohesively — accent colors reserved for emphasis.
- **Identity 5**: The page feels like it belongs to the design system. Visual language is consistent with the theme's personality.
- **Polish 5**: No rogue values. Every border-radius, shadow, spacing value is a theme token. Patterns are applied consistently.

## Fix Constraints

### Allowed Changes

- Swap any color value for a theme token (e.g., `#334155` → `text-muted-foreground`)
- Adjust spacing using theme scale values (e.g., `p-3` → `p-4` if 4 is the standard)
- Use theme typography tokens (font-family, font-size from scale, font-weight)
- Apply theme shadows and border-radius tokens
- Reorder visual emphasis using existing theme accent/primary/secondary
- Add hover/focus states using theme-appropriate color shifts (e.g., primary → primary/80)
- Adjust component variants (e.g., outline → ghost) within the component library

### Prohibited Changes

- Adding colors not in the theme palette
- Adding fonts not already imported
- Custom shadows or border-radius values outside the theme scale
- Changing the component library's design tokens themselves
- Layout restructuring beyond reflow within existing containers
- Any raw hex/rgb values — must map to a token

### Fix Strategy

1. **Token audit first** — before fixing anything, verify which tokens exist and what they map to
2. **Replace raw values with tokens** — find hardcoded values and swap for semantic tokens
3. **Elevate emphasis** — use the theme's accent/primary colors more intentionally for CTAs and key elements
4. **Consistent application** — if `rounded-lg` is the standard, find and fix all `rounded-md` or `rounded` outliers
5. **Maximum 5 fixes per iteration** — moderate pace, each fix must reference a specific token

## Completion Threshold

All 5 criteria >= 4/5 for 2 consecutive iterations. All criteria are equally weighted for completion — no exemptions.
