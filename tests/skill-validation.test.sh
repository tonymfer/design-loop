#!/bin/bash
# Structural validation tests for design-loop plugin (v2.0)
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
FRONTMATTER=$(sed -n '1,/^---$/{ /^---$/d; p; }' skills/design-loop/SKILL.md | tail -n +2)
if echo "$FRONTMATTER" | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin)" 2>/dev/null || \
   echo "$FRONTMATTER" | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{try{const lines=d.trim().split('\n');const obj={};lines.forEach(l=>{const[k,...v]=l.split(':');obj[k.trim()]=v.join(':').trim()});if(Object.keys(obj).length>0)process.exit(0);process.exit(1)}catch(e){process.exit(1)}})" 2>/dev/null; then
  ((TESTS_PASSED++))
else
  echo "FAIL: T1: SKILL.md frontmatter is valid YAML"
  ((TESTS_FAILED++))
fi

# --- Test 2: SKILL.md delegates to orchestrator ---
assert_contains "T2a: SKILL.md references orchestrator" "orchestrator" skills/design-loop/SKILL.md

# --- Test 2b: Orchestrator has all workflow steps ---
assert_contains "T2b: Orchestrator has Step 1 (Mode)" "Step 1" orchestrator/orchestrator.md
assert_contains "T2c: Orchestrator has Step 2 (Context)" "Step 2" orchestrator/orchestrator.md
assert_contains "T2d: Orchestrator has Step 3 (Routing)" "Step 3" orchestrator/orchestrator.md
assert_contains "T2e: Orchestrator has Step 4 (Execute)" "Step 4" orchestrator/orchestrator.md
assert_contains "T2f: Orchestrator has Step 5 (Safety)" "Step 5" orchestrator/orchestrator.md
assert_contains "T2g: Orchestrator has Step 6 (Complete)" "Step 6" orchestrator/orchestrator.md

# --- Test 3: stop-hook.sh is executable ---
assert_true "T3: stop-hook.sh is executable" test -x hooks/stop-hook.sh

# --- Test 4: plugin.json has required fields ---
assert_true "T4a: plugin.json exists" test -f .claude-plugin/plugin.json
if command -v jq &>/dev/null; then
  assert_true "T4b: plugin.json has name" jq -e '.name' .claude-plugin/plugin.json
  assert_true "T4c: plugin.json has description" jq -e '.description' .claude-plugin/plugin.json
  assert_true "T4d: plugin.json has author" jq -e '.author' .claude-plugin/plugin.json
  assert_true "T4e: plugin.json version is 2.0.0" bash -c '[[ $(jq -r .version .claude-plugin/plugin.json) == "2.0.0" ]]'
fi

# --- Test 5: commands/*.md have valid frontmatter ---
for cmd in commands/*.md; do
  name=$(basename "$cmd" .md)
  if head -1 "$cmd" | tr -d '\r' | grep -q '^---$'; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo "FAIL: T5: $cmd missing frontmatter delimiter"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
done

# --- Test 6: visual-reviewer.md has state field and mode support ---
assert_contains "T6a: visual-reviewer has state field" '"state"' agents/visual-reviewer.md
assert_contains "T6b: visual-reviewer has mode support" 'MODE_INSTRUCTIONS' agents/visual-reviewer.md

# --- Test 7: Orchestrator references session-scoped state files ---
assert_contains "T7: Orchestrator references session-scoped state" 'CLAUDE_SESSION_ID' orchestrator/orchestrator.md

# --- Test 8: Orchestrator has mode selection and sub-screen questions ---
assert_contains "T8a: Orchestrator has Q0 (Mode)" "Q0" orchestrator/orchestrator.md
assert_contains "T8b: Orchestrator has Q2.5" "Q2.5" orchestrator/orchestrator.md

# --- Test 9: stop-hook.sh handles session_id and mode ---
assert_contains "T9a: stop-hook uses session_id" "session_id" hooks/stop-hook.sh
assert_contains "T9b: stop-hook parses mode" "MODE" hooks/stop-hook.sh

# --- Test 10: Mode skill files exist with frontmatter ---
assert_true "T10a: precision-polish SKILL.md exists" test -f skills/modes/precision-polish/SKILL.md
assert_true "T10b: theme-respect-elevate SKILL.md exists" test -f skills/modes/theme-respect-elevate/SKILL.md
assert_true "T10c: creative-unleash SKILL.md exists" test -f skills/modes/creative-unleash/SKILL.md

# --- Test 11: Reference files exist ---
assert_true "T11a: rubric.md exists" test -f references/common/rubric.md
assert_true "T11b: screenshots.md exists" test -f references/common/screenshots.md
assert_true "T11c: constraints.md exists" test -f references/common/constraints.md
assert_true "T11d: output-format.md exists" test -f references/common/output-format.md

# --- Test 12: Orchestrator has mode-routing table ---
assert_contains "T12: Orchestrator has mode-routing" "mode-routing" orchestrator/orchestrator.md

# --- Test 13: Version consistency across manifests ---
if command -v jq &>/dev/null; then
  PLUGIN_VER=$(jq -r .version .claude-plugin/plugin.json)
  MARKET_VER=$(jq -r .metadata.version .claude-plugin/marketplace.json)
  MARKET_PLUGIN_VER=$(jq -r '.plugins[0].version' .claude-plugin/marketplace.json)
  if [[ "$PLUGIN_VER" == "$MARKET_VER" ]] && [[ "$PLUGIN_VER" == "$MARKET_PLUGIN_VER" ]]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo "FAIL: T13: Version mismatch — plugin.json=$PLUGIN_VER marketplace.meta=$MARKET_VER marketplace.plugin=$MARKET_PLUGIN_VER"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
fi

# --- Summary ---
TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo ""
echo "skill-validation: $TESTS_PASSED/$TOTAL passed"
if [[ $TESTS_FAILED -gt 0 ]]; then
  exit 1
fi
