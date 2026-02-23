#!/bin/bash
# Tier 2: Post-run CSS property verification.
# After running /design-loop against a fixture, this script checks if the
# MODIFIED files actually fixed the intended flaws. Deterministic — no AI involved.
#
# Usage:
#   bash tests/verify-fixes.sh <fixture-name> [path-to-modified-file]
#   bash tests/verify-fixes.sh pp-contrast-fail
#   bash tests/verify-fixes.sh pp-contrast-fail ./modified-copy.html
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ $# -lt 1 ]]; then
  echo "Usage: bash tests/verify-fixes.sh <fixture-name> [path-to-modified-file]"
  echo ""
  echo "Fixtures: pp-spacing-chaos, pp-contrast-fail, pp-alignment-drift,"
  echo "          tre-token-rogue, tre-flat-hierarchy, tre-missing-states,"
  echo "          cu-generic-hero, cu-no-personality, cu-rendering-defects, cu-dashboard-flat"
  exit 2
fi

FIXTURE="$1"
FILE="${2:-tests/fixtures/$FIXTURE.html}"
CHECKER="node tests/fixture-flaw-checker.js"
TESTS_PASSED=0
TESTS_FAILED=0

assert_fix() {
  local desc="$1"
  shift
  if $CHECKER "$FILE" "$@" >/dev/null 2>&1; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo "  PASS: $desc"
  else
    local result
    result=$($CHECKER "$FILE" "$@" 2>/dev/null || true)
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo "  FAIL: $desc"
    echo "    $result"
  fi
}

echo "Verifying fixes for: $FIXTURE"
echo "File: $FILE"
echo ""

case "$FIXTURE" in
  pp-spacing-chaos)
    echo "Expected: padding + border-radius normalized across .card elements"
    assert_fix "Card padding is now uniform"       spacing-uniform .card padding
    assert_fix "Card border-radius is now uniform"  spacing-uniform .card border-radius
    ;;

  pp-contrast-fail)
    echo "Expected: text colors meet WCAG AA (4.5:1), hover/focus states added"
    assert_fix "Form labels pass contrast"          contrast-passes .form-label
    assert_fix "Links pass contrast"                contrast-passes .link
    assert_fix "Buttons have hover state"           property-exists .btn :hover
    assert_fix "Inputs have focus state"            property-exists .form-input :focus
    ;;

  pp-alignment-drift)
    echo "Expected: card image heights uniform, CTA placement consistent"
    assert_fix "Card image heights are uniform"     spacing-uniform .card-img height
    ;;

  tre-token-rogue)
    echo "Expected: hardcoded values replaced with var(--token) references"
    assert_fix "Token compliance > 90%"             tokens-used --color --min-ratio 0.90
    ;;

  tre-flat-hierarchy)
    echo "Expected: heading/body size hierarchy, recommended plan distinction"
    assert_fix "Heading/body ratio >= 1.5"          hierarchy-clear ".pricing-section h2" .subtitle
    assert_fix "Recommended plan has distinction"    recommended-distinct
    ;;

  tre-missing-states)
    echo "Expected: hover, focus, and active nav states added"
    assert_fix "Links have hover state"             property-exists ".sidebar-nav a" :hover
    assert_fix "Buttons have focus state"           property-exists .btn :focus-visible
    ;;

  cu-generic-hero)
    echo "Expected: non-system font, varied layout, changed gradient"
    # Check font is no longer just Inter/system-ui
    # This is hard to check deterministically — we check for ANY change
    assert_fix "Layout no longer uniform 3-col"     property-absent .features-grid grid-template-columns
    ;;

  cu-no-personality)
    echo "Expected: display fonts, shadows, animations added"
    assert_fix "Cards have box-shadow"              property-present .work-card box-shadow
    ;;

  cu-rendering-defects)
    echo "Expected: webkit prefix added, rgba bg for backdrop, overflow fixed, img src fixed"
    assert_fix "Webkit clip prefix fixed"           rendering-fixed missing-webkit-clip
    assert_fix "Backdrop has rgba background"       rendering-fixed solid-bg-backdrop
    assert_fix "Overflow clip resolved"             rendering-fixed overflow-clip
    assert_fix "Broken images fixed"                rendering-fixed broken-img
    ;;

  cu-dashboard-flat)
    echo "Expected: hero metric prominent, varied sizing, accent colors"
    assert_fix "Metric font sizes now vary"         spacing-varies .metric-value font-size
    ;;

  *)
    echo "Unknown fixture: $FIXTURE"
    echo "Available: pp-spacing-chaos, pp-contrast-fail, pp-alignment-drift,"
    echo "           tre-token-rogue, tre-flat-hierarchy, tre-missing-states,"
    echo "           cu-generic-hero, cu-no-personality, cu-rendering-defects, cu-dashboard-flat"
    exit 2
    ;;
esac

echo ""
TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo "verify-fixes ($FIXTURE): $TESTS_PASSED/$TOTAL passed"
if [[ $TESTS_FAILED -gt 0 ]]; then
  exit 1
fi
