---
name: creative-unleash
description: "Bold redesign latitude. Loads all companion design skills. May restructure layout. For greenfield projects and redesigns."
---

# Creative Unleash Mode

Maximum creative latitude. Layout restructuring, font exploration, bold color moves, asymmetric compositions. Loads ALL discovered companion design skills and uses their full guidance. This is the mode for making a page look like a designer touched it.

## Philosophy

> "Give AI eyes and let it keep watching and upgrading until truly complete."

Creative Unleash is not "make it prettier." It is autonomous visual perfection through relentless screenshot-driven verification. Every CSS change is photographed, scored, and verified for rendering correctness. The loop does not stop until the design has a point of view AND every pixel renders as intended.

The hero is the moment AI proves it can see. Every page has one view — often the hero, sometimes a key interaction state — that passes or fails the portfolio test in a single screenshot. CU mode's autonomous loop targets this moment: the fix with the highest identity impact goes first, the screenshot captures the result, and the scorer confirms it rendered. If a 3D element tracks your cursor, if words stagger in one by one, if an underline draws itself on scroll — those are the moments that separate "AI-generated" from "designed." The iteration loop doesn't stop until those moments exist AND render correctly.

The hero can also demonstrate the loop itself: a before/after transformation visible within the section — the design-loop's own product shown in action. When the hero displays its own iteration history (score progression, visual states at each step), the screenshot-worthy moment becomes meta: the tool proving it works by showing its work.

## Companion Skill Loading

Unlike other modes, Creative Unleash loads the **full content** of every discovered companion skill (not just guidance excerpts). This means:

```
For each skill in DESIGN_SKILLS:
  1. Read the entire SKILL.md body
  2. Apply ALL its aesthetic principles, not just headings
  3. Weight companion skill guidance equal to built-in criteria
```

If `frontend-design` is installed: use its bold anti-slop aesthetics. Unique fonts, intentional palettes, unexpected layouts.
If `designing-beautiful-websites` is installed: apply its full UX/UI strategy.
If `ui-skills` is installed: follow its opinionated constraints.
All companion skills stack — the more installed, the richer the creative direction.

<MODE_SCORING>
## Scoring Weights

| Criterion | Weight | Sensitivity |
|-----------|--------|-------------|
| Composition | 1.5x | Actively penalize uniform/symmetric layouts. Reward asymmetry, varied spacing, visual hierarchy through size. |
| Typography | 1.3x | Actively penalize system-ui/Inter defaults. Reward display fonts for headings, intentional size jumps. |
| Color & Contrast | 1.2x | Reward bold, intentional palettes. Penalize safe grey-on-white. Still enforce WCAG AA. |
| Visual Identity | 2.0x | **Primary criterion.** Does this look designed? Would it make a portfolio? Penalize generic AI output heavily. |
| Polish | 1.0x | Important but secondary to identity — some roughness is acceptable if the design has a point of view. **Rendering Defect: ZERO TOLERANCE.** Solid blocks, missing gradients, clipped text, broken effects are always bugs, never style. Phase B re-score is MANDATORY every CU iteration to catch rendering regressions visually. |

### What "score 5" means in this mode

- **Composition 5**: Asymmetric layout with clear visual hierarchy. Varied section heights. Unexpected but functional arrangements. White space used as a design element.
- **Typography 5**: Display font for headings that sets a tone. Body font that complements it. Size jumps that create drama. Tracking and line-height tuned per context.
- **Color 5**: A palette that tells you something about the brand. Not just "blue primary." Could be a warm terracotta, electric lime, or monochrome with a single accent. Intentional and memorable.
- **Identity 5**: You could not tell this was AI-generated. It has a point of view — minimal, brutal, playful, refined, whatever — but it's consistent and intentional. The "portfolio test" passes easily.
- **Polish 5**: Consistent but not rigid. The design rules are visible and applied, but with the confidence to break them when it serves the composition.

<MODE_FIXING>
## Fix Constraints

### Allowed Changes

- Layout restructuring (flex→grid, column changes, section reordering)
- Adding or swapping font families (from Google Fonts CDN link or existing imports)
- Bold color palette changes (swap entire palette direction)
- Background treatments (gradients, subtle patterns, color blocks)
- Asymmetric spacing and varied section proportions
- Component restyling (card variants, button styles, hero layouts)
- Adding decorative elements via CSS (borders, dividers, shapes)
- Shadow and depth changes
- Adding CSS transitions/animations for micro-interactions

### Prohibited Changes (still enforced)

- Adding npm dependencies UNLESS approved through the Reference Analyzer's safe install protocol (Step 3b). Component-level scaffolding (shadcn components, 21st.dev components) is handled by the Safe Apply Agent (Step 5.7) with backup, build-test verification, and auto-rollback. Use CDN links for fonts if no install approved.
- Changing API routes, services, or database code
- Removing existing functionality
- Breaking accessibility (WCAG AA contrast is always required)

### Fix Strategy

1. **Identity-first** — lead with the biggest visual identity improvement
2. **Bold moves** — prefer one dramatic change over three timid tweaks
3. **Composition before color** — layout changes have the highest visual impact
4. **Font before fine-tuning** — a display font change transforms the entire page
5. **Maximum 5 fixes per iteration** — each fix can be substantial
6. **Commit to a direction** — don't hedge between styles. Pick one and execute fully.

### Focus-Specific Behavioral Priorities

When FOCUS targets a specific page section, prioritize concrete visual *behaviors* that maximize identity impact. These describe what the USER SEES, not abstract CSS categories. The specific implementation emerges from BRAND_FINGERPRINT + DESIGN_SKILLS + REFERENCE_ANALYSIS.

#### Hero / Above-the-fold

Behavioral priority: **one unforgettable focal element + kinetic text + scroll reward**

- **Cursor-responsive focal element**: a 3D embed, animated illustration, or SVG that tracks mouse position via `onMouseMove` — the element rotates, shifts, or morphs as the cursor moves. The user discovers the page is alive. Implementation: `transform: rotate3d()` or Spline/Rive embed with cursor binding.
- **Per-word kinetic entry**: headline splits into individual `<span>` per word, each word staggers in from below with 60-100ms `animation-delay` between words. After entry, words float with subtle Y oscillation (2-4px, 3-5s ease-in-out infinite). The text feels alive, not stamped.
- **Scroll-triggered accent draw**: on viewport intersection (IntersectionObserver), an accent-colored underline or highlight draws left-to-right under the key phrase. `animation-play-state: paused` toggled to `running` on intersection. The scroll rewards attention.
- **Layered depth panels**: semi-transparent surfaces (`backdrop-filter: blur()` + `background: rgba()`) stacked at different z-levels creating atmospheric depth. Mouse parallax shifts layers at different rates.
- **Specular glow on focal element**: `box-shadow: 0 0 40px rgba(accent, 0.15)` on the primary element creating surface light simulation. The focal point literally glows.
- **Live iteration demonstration** (meta): the hero itself shows its own before/after transformation — score badges animating from 2.1 → 4.8, visual states morphing through iteration steps. The design-loop's product IS the hero's content.
- **Scoring emphasis**: hero identity score gates the entire page's portfolio test. If the hero isn't screenshot-worthy, the page isn't.

##### Hero Upgrade Decision Tree

When FOCUS="hero", use this priority ordering to determine fix sequence. Assess what behaviors are ALREADY PRESENT vs MISSING, then fix the highest-priority missing behavior first.

```
PRIORITY 1 — Focal Element (gates everything else)
  CHECK: Does the hero have ONE element that responds to cursor movement?
    - Mouse-tracking 3D object, rotating SVG, parallax illustration, or reactive canvas
    - The element must visually change in response to onMouseMove (rotation, shift, morph, scale)
  IF MISSING → Fix FIRST. A hero without a focal element is a hero without a hero.
    Technique: transform: rotate3d() bound to mousemove,
    or embed with cursor binding,
    or SVG with data-driven transform attributes.
  IF PRESENT but broken (ANIMATION_FREEZE, BROKEN_ELEMENT) → Fix FIRST as rendering defect.
  IF PRESENT and rendering → proceed to Priority 2.

PRIORITY 2 — Kinetic Text Entry
  CHECK: Does the headline TEXT animate in per-word or per-character?
    - Individual <span> per word with stagger animation-delay (60-100ms between words)
    - Entry direction: translateY(16-24px) or translateX(-12px) with opacity 0→1
    - Post-entry: subtle Y oscillation (2-4px, 3-5s ease-in-out infinite) is optional but elevating
  IF MISSING → Fix SECOND. Static text on a dynamic background creates dissonance.
    Technique: split headline into <span> per word, apply CSS or JS stagger.
  IF ALL-AT-ONCE (AnimatedGroup wrapping full headline, not per-word) → counts as MISSING.
  IF PRESENT → proceed to Priority 3.

PRIORITY 3 — Depth Layers (see Depth-Layer Behavioral Taxonomy below)
  CHECK: Does the hero have 2+ translucent surfaces at different z-levels?
    - backdrop-filter: blur() + background: rgba() on at least 2 surfaces
    - Surfaces should shift at different parallax rates on mouse move
    - Variable alpha: each surface has distinct opacity level (not all identical)
  IF MISSING → Fix THIRD. Flat layouts fail the depth test.
  IF PRESENT → proceed to Priority 4.

PRIORITY 4 — Scroll Reward
  CHECK: Does scrolling INTO the hero trigger a visible animation?
    - IntersectionObserver toggling animation-play-state from paused to running
    - Accent underline draw, counter animation, element fade-in from off-viewport
  IF MISSING → Fix FOURTH. The scroll should reward attention.
  IF PRESENT → proceed to Priority 5.

PRIORITY 5 — Self-Demonstrating Meta (bonus)
  CHECK: Does the hero SHOW its own before/after transformation?
    - Score badge animating from low to high
    - Visual states morphing through iteration steps as live content
    - Text content CHANGING between states (problem → solution narrative)
    - Structural changes across data-iteration states (not just color)
  IF MISSING → Fix as bonus. This elevates from "designed" to "self-demonstrating."
  IF PRESENT → hero is complete. Target remaining issues elsewhere.
```

When assessing completion, check each priority in order. The decision tree replaces generic "fix lowest score" with hero-specific behavioral sequencing. The tree is read by the loop-engine Step 4 fix selection when FOCUS="hero".

##### Depth-Layer Behavioral Taxonomy

Expands "Layered depth panels" into a complete behavioral vocabulary. These describe what the USER SEES, not CSS property names. The specific implementation values emerge from BRAND_FINGERPRINT + DESIGN_SKILLS.

| Layer Behavior | What the User Sees | Implementation Signal |
|---|---|---|
| **Variable-alpha panel stacking** | 2-3 translucent rectangular surfaces overlapping, each with different see-through levels. The back-most is most transparent, the front-most most opaque. | `background: rgba(bg, 0.3/0.5/0.7)` on 2-3 positioned elements at different z-index levels. Each alpha value is distinct. |
| **Surface blur** | Content behind a panel appears frosted — shapes visible but details smeared. Blur intensity varies per layer (deeper = more blur). | `backdrop-filter: blur(8-16px)` on translucent panels. Blur radius differs between layers (e.g., 8px foreground, 12px mid, 16px back). |
| **Cursor-following specular highlight** | A bright soft spot on the primary panel that follows the mouse, as if light reflects off a glossy surface. Accent-tinted, fading at edges. | `radial-gradient()` positioned at cursor coordinates via onMouseMove. Size 100-200px, accent-tinted rgba at 0.1-0.2 alpha. Updates on requestAnimationFrame. |
| **Depth-aware parallax rates** | Layers shift at different speeds when mouse moves — foreground shifts most, background least. Creates convincing 3D illusion without actual 3D. | `transform: translate()` bound to mousemove delta. Foreground: 1.0x delta, mid-ground: 0.5x delta, background: 0.2x delta. |
| **Luminous edge treatment** | Panel edges have a subtle inner glow — thin bright line along edges suggesting the surface catches light. Uses accent color at very low opacity. | `box-shadow: inset 0 1px 0 rgba(accent, 0.1)` or `border-image` with gradient. 1-2px, accent-colored. |
| **Depth-responsive opacity** | Panels become slightly more opaque on hover — confirmation that the layer is interactive. Non-hovered panels dim slightly to reinforce z-ordering. | `transition: background 0.3s` with hover state increasing alpha by 0.1-0.15. |

**Fidelity checks for depth layers:**
- SOLID_BLOCK: If any layer renders as fully opaque (no content visible through it), the depth effect has failed. Verify rgba alpha < 0.8 in computed styles.
- MISSING_EFFECT: If backdrop-filter: blur() shows no visual difference, the browser may not support it or the element lacks a background. Verify visual softening in screenshot.
- STACKING_ERROR: If text or interactive elements are hidden behind a depth layer, z-index ordering is wrong. Verify all interactive content is above decorative layers.

#### Dashboard / Data-heavy

Behavioral priority: **one hero metric + scanable rhythm + hover revelation**

- **Hero metric prominence**: the most important number is 3-4x larger than supporting metrics, with accent color treatment. One glance tells the story.
- **Varied card sizing**: feature metric spans full width or 2 columns, secondary cards compact. No uniform grid.
- **Hover data reveal**: cards show additional context on hover (sparkline, trend arrow, delta) — information density increases on demand.
- **Tabular scan rhythm**: consistent label-value alignment so the eye can scan vertically without hunting.

#### Settings / Form-heavy

Behavioral priority: **grouped sections + rich interactive states + breathing room**

- **Visual section grouping**: related controls grouped with subtle background shifts or thin dividers. Each group has a section label.
- **State richness on every control**: hover (background shift), focus (accent ring), active (pressed depth). Every interactive element responds visually.
- **Generous inter-group spacing**: gap-8 between groups, gap-2 within groups. The rhythm says "these belong together, those are separate."

### Creative Direction Process

Before the first fix in each iteration:

```
1. Review all screenshots and scores
2. Identify the page's current design personality (or lack thereof)
2b. If BRAND_FINGERPRINT.visual.personality exists, use it as the starting
       classification. If empty, infer personality from BRAND_FINGERPRINT.tokens
       (e.g., retro-pixel font → Playful/Retro direction).
2c. If REFERENCE_ANALYSIS exists and is not skipped:
      - Use REFERENCE_ANALYSIS.aesthetic_direction as PRIMARY direction input
      - Cross-reference with BRAND_FINGERPRINT for coherence
      - If REFERENCE_ANALYSIS.installed[] is non-empty, prefer using those libraries in fixes
      - Note in report: "Direction informed by reference: [aesthetic_direction]"
2d. Articulate the visual transformation narrative for this iteration:
      BEFORE: [describe specific behaviors visible NOW — "static h1, no focal element, flat layout"]
      AFTER:  [describe specific behaviors targeted — "3D eye tracks cursor, words stagger in, underline draws on scroll"]
      META:   [if hero: can the section itself demonstrate the before/after? e.g., score badge animation, iteration state morphing]
      This narrative guides fix prioritization — the fix that creates the biggest behavioral gap between BEFORE and AFTER goes first.
3. Choose ONE design direction to push toward:
   - Minimal & sophisticated (lots of white space, refined type, muted palette)
   - Bold & expressive (strong colors, display fonts, asymmetric layout)
   - Warm & approachable (rounded shapes, warm colors, friendly type)
   - Technical & precise (monospace accents, sharp edges, high contrast)
   - Or derive direction from companion skill guidance
4. All fixes in this iteration serve that chosen direction
5. Document the chosen direction in the iteration report
   If BRAND_FINGERPRINT informed the direction, note: "Direction informed by brand fingerprint: [personality]"
```

</MODE_FIXING>

## Diff Configuration

- `diff_threshold`: 0.25 (wide — large visual changes expected and encouraged)
- `visual_fidelity`: computed, warn if < 0.3 (possible regression)
- `theme_fidelity`: computed, informational only. Warn if < 0.5 ("significant brand departure — verify intentional").
- `phase_b_rescore`: mandatory (every iteration, not gated by VISUAL_SPOT_CHECK)
  CU mode always re-scores after fixes because layout restructuring can break rendering
  even when no gradient/mask/clip-path CSS was directly modified.

## Completion Threshold

- `goal_threshold`: 4.7
- Per-criterion: All 5 criteria >= 4/5 raw for 2 consecutive iterations.
- Identity MUST >= 4 — does NOT pass without a design point of view.
- `completion_exemptions`: []
- `required_minimum`: { "identity": 4 }
</MODE_SCORING>
