#!/bin/bash
# Tier 1: Verify test fixtures have their intended visual flaws.
# Guards against accidental fixes — if a fixture's flaw disappears, this test fails.
set -euo pipefail

cd "$(dirname "$0")/.."

TESTS_PASSED=0
TESTS_FAILED=0
CHECKER="node tests/fixture-flaw-checker.js"
FIXTURES="tests/fixtures"

assert_check() {
  local desc="$1"
  shift
  local fixture="$FIXTURES/$1"
  shift
  if $CHECKER "$fixture" "$@" >/dev/null 2>&1; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    local result
    result=$($CHECKER "$fixture" "$@" 2>/dev/null || true)
    echo "FAIL: $desc"
    echo "  result: $result"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# --- PP Fixtures: Precision Polish ---

# PP1: spacing chaos — varied padding and border-radius across same-type cards
assert_check "PP1a: spacing chaos has varied padding"      pp-spacing-chaos.html   spacing-varies .card padding
assert_check "PP1b: spacing chaos has varied radius"        pp-spacing-chaos.html   spacing-varies .card border-radius

# PP2: contrast fail — WCAG AA violations + missing interactive states
assert_check "PP2a: contrast fail has AA violations"        pp-contrast-fail.html   contrast-fails .form-label
assert_check "PP2b: contrast fail has pale link color"      pp-contrast-fail.html   contrast-fails .link
assert_check "PP2c: contrast fail missing button hover"     pp-contrast-fail.html   property-missing .btn :hover
assert_check "PP2d: contrast fail missing input focus"      pp-contrast-fail.html   property-missing .form-input :focus

# PP3: alignment drift — ragged card image heights
assert_check "PP3a: alignment drift has varied img heights" pp-alignment-drift.html spacing-varies .card-img height

# --- TRE Fixtures: Theme-Respect Elevate ---

# TRE4: token rogue — tokens defined but hardcoded values used
assert_check "TRE4a: token rogue ignores color tokens"     tre-token-rogue.html    tokens-ignored --color

# TRE5: flat hierarchy — heading same size as body text
assert_check "TRE5a: flat hierarchy has no size jumps"      tre-flat-hierarchy.html hierarchy-flat ".pricing-section h2" .subtitle
assert_check "TRE5b: flat hierarchy card title same as desc" tre-flat-hierarchy.html hierarchy-flat ".pricing-card h3" .pricing-desc
assert_check "TRE5c: flat hierarchy all CTAs are ghost"     tre-flat-hierarchy.html property-absent .pricing-cta background-color
assert_check "TRE5d: recommended plan has no distinction"   tre-flat-hierarchy.html property-absent "[data-recommended]" border-color

# TRE6: missing states — no hover/focus/active states
assert_check "TRE6a: missing states has no link hover"     tre-missing-states.html property-missing ".sidebar-nav a" :hover
assert_check "TRE6b: missing states has no button focus"    tre-missing-states.html property-missing .btn :focus
assert_check "TRE6c: missing states no active nav styling"  tre-missing-states.html property-missing "[aria-current]" :hover

# --- CU Fixtures: Creative Unleash ---

# CU7: generic hero — system fonts, blue-purple gradient, uniform 3-col
assert_check "CU7a: generic hero uses Inter/system-ui"     cu-generic-hero.html    property-value body font-family "Inter|system-ui"
assert_check "CU7b: generic hero has blue-purple gradient"  cu-generic-hero.html    property-value .hero background "667eea.*764ba2"
assert_check "CU7c: generic hero has uniform 3-col grid"    cu-generic-hero.html    property-value .features-grid grid-template-columns "repeat\\(3"

# CU8: no personality — system-ui, no shadows, no animations
assert_check "CU8a: no personality uses system-ui font"     cu-no-personality.html  property-value body font-family "system-ui"
assert_check "CU8b: no personality lacks card shadows"      cu-no-personality.html  property-absent .work-card box-shadow
assert_check "CU8c: no personality lacks service shadows"   cu-no-personality.html  property-absent .service-item box-shadow

# CU9: rendering defects — broken CSS effects
assert_check "CU9a: rendering has missing webkit clip"      cu-rendering-defects.html rendering-broken missing-webkit-clip
assert_check "CU9b: rendering has solid bg on backdrop"     cu-rendering-defects.html rendering-broken solid-bg-backdrop
assert_check "CU9c: rendering has overflow clip"            cu-rendering-defects.html rendering-broken overflow-clip
assert_check "CU9d: rendering has broken images"            cu-rendering-defects.html rendering-broken broken-img

# CU10: dashboard flat — uniform metrics, no hierarchy
assert_check "CU10a: dashboard has uniform metric sizes"    cu-dashboard-flat.html  spacing-uniform .metric-value font-size
assert_check "CU10b: dashboard metric cards lack shadows"   cu-dashboard-flat.html  property-absent .metric-card box-shadow
assert_check "CU10c: dashboard uses uniform 3-col grid"     cu-dashboard-flat.html  property-value .metric-grid grid-template-columns "repeat\\(3"

# --- Summary ---
TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo ""
echo "fixture-flaws: $TESTS_PASSED/$TOTAL passed"
if [[ $TESTS_FAILED -gt 0 ]]; then
  exit 1
fi
