#!/bin/bash
# Structural validation tests for design-loop plugin
set -euo pipefail

cd "$(dirname "$0")/.."

TESTS_PASSED=0
TESTS_FAILED=0

assert_true() {
  local desc="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo "FAIL: $desc"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

assert_contains() {
  local desc="$1" needle="$2" file="$3"
  if grep -q "$needle" "$file" 2>/dev/null; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo "FAIL: $desc — '$needle' not found in $file"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# --- Test 1: SKILL.md frontmatter is valid YAML ---
# Extract frontmatter and check it parses
FRONTMATTER=$(sed -n '1,/^---$/{ /^---$/d; p; }' skills/design-loop/SKILL.md | tail -n +2)
if echo "$FRONTMATTER" | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin)" 2>/dev/null || \
   echo "$FRONTMATTER" | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{try{const lines=d.trim().split('\n');const obj={};lines.forEach(l=>{const[k,...v]=l.split(':');obj[k.trim()]=v.join(':').trim()});if(Object.keys(obj).length>0)process.exit(0);process.exit(1)}catch(e){process.exit(1)}})" 2>/dev/null; then
  ((TESTS_PASSED++))
else
  echo "FAIL: T1: SKILL.md frontmatter is valid YAML"
  ((TESTS_FAILED++))
fi

# --- Test 2: All phases referenced in SKILL.md ---
assert_contains "T2a: Phase 0 exists" "## Phase 0" skills/design-loop/SKILL.md
assert_contains "T2b: Phase 1 exists" "## Phase 1" skills/design-loop/SKILL.md
assert_contains "T2c: Phase 2 exists" "## Phase 2" skills/design-loop/SKILL.md
assert_contains "T2d: Phase 3 exists" "## Phase 3" skills/design-loop/SKILL.md
assert_contains "T2e: Phase 3.5 exists" "## Phase 3.5" skills/design-loop/SKILL.md
assert_contains "T2f: Phase 4 exists" "## Phase 4" skills/design-loop/SKILL.md
assert_contains "T2g: Phase 5 exists" "## Phase 5" skills/design-loop/SKILL.md

# --- Test 3: stop-hook.sh is executable ---
assert_true "T3: stop-hook.sh is executable" test -x hooks/stop-hook.sh

# --- Test 4: plugin.json has required fields ---
assert_true "T4a: plugin.json exists" test -f .claude-plugin/plugin.json
if command -v jq &>/dev/null; then
  assert_true "T4b: plugin.json has name" jq -e '.name' .claude-plugin/plugin.json
  assert_true "T4c: plugin.json has description" jq -e '.description' .claude-plugin/plugin.json
  assert_true "T4d: plugin.json has author" jq -e '.author' .claude-plugin/plugin.json
fi

# --- Test 5: commands/*.md have valid frontmatter ---
for cmd in commands/*.md; do
  name=$(basename "$cmd" .md)
  # Check each command file has --- delimited frontmatter (handle CRLF)
  if head -1 "$cmd" | tr -d '\r' | grep -q '^---$'; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo "FAIL: T5: $cmd missing frontmatter delimiter"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
done

# --- Test 6: visual-reviewer.md has state field ---
assert_contains "T6: visual-reviewer has state field" '"state"' agents/visual-reviewer.md

# --- Test 7: SKILL.md references session-scoped state files ---
assert_contains "T7: SKILL.md references session-scoped state" 'CLAUDE_SESSION_ID' skills/design-loop/SKILL.md

# --- Test 8: SKILL.md has state discovery interview question ---
assert_contains "T8: SKILL.md has Q2.5" "Q2.5" skills/design-loop/SKILL.md

# --- Test 9: stop-hook.sh handles session_id ---
assert_contains "T9: stop-hook uses session_id" "session_id" hooks/stop-hook.sh

# --- Summary ---
TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo ""
echo "skill-validation: $TESTS_PASSED/$TOTAL passed"
if [[ $TESTS_FAILED -gt 0 ]]; then
  exit 1
fi
