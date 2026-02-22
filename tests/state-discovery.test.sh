#!/bin/bash
# Tests for Phase 3.5 state discovery JS probe
# Runs the probe against HTML fixtures using Node.js with linkedom
set -euo pipefail

cd "$(dirname "$0")/.."

TESTS_PASSED=0
TESTS_FAILED=0

assert_eq() {
  local desc="$1" expected="$2" actual="$3"
  if [[ "$expected" == "$actual" ]]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo "FAIL: $desc"
    echo "  expected: $expected"
    echo "  actual:   $actual"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

assert_gte() {
  local desc="$1" min="$2" actual="$3"
  if [[ "$actual" -ge "$min" ]]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo "FAIL: $desc"
    echo "  expected >= $min"
    echo "  actual:    $actual"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# Check if linkedom is available, install if not
if ! node -e "require('linkedom')" 2>/dev/null; then
  echo "Installing linkedom for DOM testing..."
  npm install --no-save linkedom >/dev/null 2>&1
fi

run_probe() {
  node tests/probe-runner.js "$1"
}

# --- Test 1: Page with tabs → discovers all tab panels ---
result=$(run_probe "tests/fixtures/page-with-tabs.html")
tab_count=$(echo "$result" | jq '.tabs | length')
assert_eq "T1a: tabs page → 3 tabs found" "3" "$tab_count"
inactive_tabs=$(echo "$result" | jq '[.tabs[] | select(.active == false)] | length')
assert_eq "T1b: tabs page → 2 inactive tabs" "2" "$inactive_tabs"

# --- Test 2: Page with bottom nav → discovers navigation items ---
result=$(run_probe "tests/fixtures/page-with-nav.html")
nav_count=$(echo "$result" | jq '.navItems | length')
assert_eq "T2a: nav page → 3 nav items found" "3" "$nav_count"
first_label=$(echo "$result" | jq -r '.navItems[0].label')
assert_eq "T2b: first nav item is Home" "Home" "$first_label"

# --- Test 3: Page with modals → discovers trigger buttons ---
result=$(run_probe "tests/fixtures/page-with-modals.html")
modal_count=$(echo "$result" | jq '.modals | length')
assert_eq "T3: modals page → 2 modal triggers found" "2" "$modal_count"

# --- Test 4: Page with no interactive states → returns empty arrays ---
result=$(run_probe "tests/fixtures/page-empty.html")
total=$(echo "$result" | jq '.totalStates')
assert_eq "T4: empty page → 0 total states" "0" "$total"

# --- Test 5: Page with nested states (tab > modal) → discovers both levels ---
result=$(run_probe "tests/fixtures/page-nested.html")
tab_count=$(echo "$result" | jq '.tabs | length')
modal_count=$(echo "$result" | jq '.modals | length')
assert_gte "T5a: nested page → tabs found" "1" "$tab_count"
assert_gte "T5b: nested page → modals found" "1" "$modal_count"
total=$(echo "$result" | jq '.totalStates')
assert_gte "T5c: nested page → total >= 3" "3" "$total"

# --- Summary ---
TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo ""
echo "state-discovery: $TESTS_PASSED/$TOTAL passed"
if [[ $TESTS_FAILED -gt 0 ]]; then
  exit 1
fi
