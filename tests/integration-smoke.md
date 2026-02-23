# Integration Smoke Tests

Manual playbook for running each fixture through the full design-loop plugin.

The full plugin loop runs inside Claude Code and cannot be scripted from bash.
These tests validate end-to-end behavior: fixture in, improved fixture out.

## Prerequisites

1. Claude Code with design-loop plugin installed
2. Node.js 18+ (for verification scripts)
3. A local HTTP server for serving fixtures

## Setup

```bash
# Terminal 1: Serve fixtures
cd tests/fixtures && python3 -m http.server 9877

# Terminal 2: Open Claude Code in the design-loop repo
cd /path/to/design-loop
claude
```

## Running Tests

For each test below:
1. Run the `/design-loop` command in Claude Code
2. After completion, run the Tier 2 verification script
3. Optionally run the Tier 3 score progression check

---

### Test 1: PP — Spacing Chaos

**Fixture:** `pp-spacing-chaos.html`
**Target mode:** Precision Polish
**Primary flaw:** Chaotic spacing (12px/17px/23px/31px padding), mixed border-radius

```
/design-loop http://localhost:9877/pp-spacing-chaos.html 3 precision-polish
```

**After completion:**
```bash
bash tests/verify-fixes.sh pp-spacing-chaos
bash tests/verify-scores.sh
```

**Expected behavior:**
- Spacing normalizes to a consistent scale (e.g., 16px/24px)
- Border-radius unifies across all cards
- Layout structure preserved

**Pass criteria:** `verify-fixes.sh` PASS + `verify-scores.sh` shows improvement

---

### Test 2: PP — Contrast Failures

**Fixture:** `pp-contrast-fail.html`
**Target mode:** Precision Polish
**Primary flaw:** WCAG AA failures (#999 on white = 2.85:1), no hover/focus states

```
/design-loop http://localhost:9877/pp-contrast-fail.html 3 precision-polish
```

**After completion:**
```bash
bash tests/verify-fixes.sh pp-contrast-fail
bash tests/verify-scores.sh
```

**Expected behavior:**
- Text darkened to 4.5:1+ contrast ratio
- Hover states added to buttons and links
- Focus ring added to inputs
- Form layout preserved

**Pass criteria:** `verify-fixes.sh` PASS + `verify-scores.sh` shows improvement

---

### Test 3: PP — Alignment Drift

**Fixture:** `pp-alignment-drift.html`
**Target mode:** Precision Polish
**Primary flaw:** Different image heights (140px-200px), offset CTAs

```
/design-loop http://localhost:9877/pp-alignment-drift.html 3 precision-polish
```

**After completion:**
```bash
bash tests/verify-fixes.sh pp-alignment-drift
bash tests/verify-scores.sh
```

**Expected behavior:**
- Card image heights equalized
- CTA button positioning consistent across cards
- Grid structure preserved

---

### Test 4: TRE — Token Rogue

**Fixture:** `tre-token-rogue.html`
**Target mode:** Theme-Respect Elevate
**Primary flaw:** CSS tokens defined in :root but half the elements use hardcoded values

```
/design-loop http://localhost:9877/tre-token-rogue.html 3 theme-respect-elevate
```

**After completion:**
```bash
bash tests/verify-fixes.sh tre-token-rogue
bash tests/verify-scores.sh
```

**Expected behavior:**
- Hardcoded hex/px values replaced with `var(--token)` references
- Token compliance > 90%
- Visual appearance unchanged (tokens have same values)

---

### Test 5: TRE — Flat Hierarchy

**Fixture:** `tre-flat-hierarchy.html`
**Target mode:** Theme-Respect Elevate
**Primary flaw:** All pricing tiers identical, headings same size as body, ghost CTAs

```
/design-loop http://localhost:9877/tre-flat-hierarchy.html 3 theme-respect-elevate
```

**After completion:**
```bash
bash tests/verify-fixes.sh tre-flat-hierarchy
bash tests/verify-scores.sh
```

**Expected behavior:**
- Recommended plan visually prominent (border, background, or scale)
- Heading/body font-size ratio >= 1.5
- Primary CTA gets solid fill (not ghost)
- All changes use existing design tokens

---

### Test 6: TRE — Missing States

**Fixture:** `tre-missing-states.html`
**Target mode:** Theme-Respect Elevate
**Primary flaw:** Zero hover/focus/active states on any interactive element

```
/design-loop http://localhost:9877/tre-missing-states.html 3 theme-respect-elevate
```

**After completion:**
```bash
bash tests/verify-fixes.sh tre-missing-states
bash tests/verify-scores.sh
```

**Expected behavior:**
- Nav links get hover background
- Buttons get focus ring (focus-visible)
- Active nav item visually distinct
- All states use existing design tokens

---

### Test 7: CU — Generic Hero

**Fixture:** `cu-generic-hero.html`
**Target mode:** Creative Unleash
**Primary flaw:** Maximum AI template energy — Inter, blue-purple gradient, centered everything

```
/design-loop http://localhost:9877/cu-generic-hero.html 5 creative-unleash
```

**After completion:**
```bash
bash tests/verify-fixes.sh cu-generic-hero
bash tests/verify-scores.sh
```

**Expected behavior:**
- Display/decorative font introduced
- Layout breaks from uniform 3-column
- Gradient colors changed from generic blue-purple
- Hero gets a focal element or asymmetric layout
- Would pass the "portfolio test" (designer would show this)

---

### Test 8: CU — No Personality

**Fixture:** `cu-no-personality.html`
**Target mode:** Creative Unleash
**Primary flaw:** Technically correct but forgettable — system-ui, grey/white, no shadows

```
/design-loop http://localhost:9877/cu-no-personality.html 5 creative-unleash
```

**After completion:**
```bash
bash tests/verify-fixes.sh cu-no-personality
bash tests/verify-scores.sh
```

**Expected behavior:**
- Display fonts added
- Depth via box-shadow
- Decorative elements or animations
- Color personality beyond grey/white

---

### Test 9: CU — Rendering Defects

**Fixture:** `cu-rendering-defects.html`
**Target mode:** Creative Unleash
**Primary flaw:** Broken gradient text, non-functional backdrop-filter, clipped text, missing images

```
/design-loop http://localhost:9877/cu-rendering-defects.html 5 creative-unleash
```

**After completion:**
```bash
bash tests/verify-fixes.sh cu-rendering-defects
bash tests/verify-scores.sh
```

**Expected behavior:**
- `-webkit-background-clip: text` prefix added
- backdrop-filter element gets rgba background
- Overflow container expanded or overflow removed
- Image src attributes provided

---

### Test 10: CU — Dashboard Flat

**Fixture:** `cu-dashboard-flat.html`
**Target mode:** Creative Unleash
**Primary flaw:** 6 equal metric cards, uniform 3x2 grid, no accent color, no hover

```
/design-loop http://localhost:9877/cu-dashboard-flat.html 5 creative-unleash
```

**After completion:**
```bash
bash tests/verify-fixes.sh cu-dashboard-flat
bash tests/verify-scores.sh
```

**Expected behavior:**
- Hero metric 2-4x larger than others
- Non-uniform card sizing or grid layout
- Accent color introduced
- Hover reveals on metric cards

---

## Quick Smoke (Minimum Viable)

If time is limited, run at least **one fixture per mode**:

| Mode | Recommended Fixture | Why |
|------|-------------------|-----|
| Precision Polish | `pp-contrast-fail` | Clear WCAG failures, deterministic verification |
| Theme-Respect Elevate | `tre-token-rogue` | Token compliance is quantifiable |
| Creative Unleash | `cu-rendering-defects` | Has clear right/wrong (prefix, rgba, overflow) |

```bash
# Serve fixtures
cd tests/fixtures && python3 -m http.server 9877 &

# In Claude Code, run one per mode:
# /design-loop http://localhost:9877/pp-contrast-fail.html 3 precision-polish
# /design-loop http://localhost:9877/tre-token-rogue.html 3 theme-respect-elevate
# /design-loop http://localhost:9877/cu-rendering-defects.html 5 creative-unleash

# Verify each:
bash tests/verify-fixes.sh pp-contrast-fail
bash tests/verify-fixes.sh tre-token-rogue
bash tests/verify-fixes.sh cu-rendering-defects
bash tests/verify-scores.sh
```
