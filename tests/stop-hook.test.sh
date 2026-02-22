#!/bin/bash
# Tests for hooks/stop-hook.sh
set -euo pipefail

HOOK="hooks/stop-hook.sh"
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Helper: create a state file with given frontmatter
make_state() {
  local file="$1"
  local status="$2"
  local iteration="$3"
  local max="$4"
  mkdir -p "$(dirname "$file")"
  cat > "$file" <<EOF
---
status: $status
iteration: $iteration
max_iterations: $max
started_at: "2026-01-01T00:00:00Z"
---

Continue the design-loop iteration process.
EOF
}

# Helper: create a mock transcript with assistant message
make_transcript() {
  local file="$1"
  local text="$2"
  echo "{\"role\":\"assistant\",\"message\":{\"content\":[{\"type\":\"text\",\"text\":\"$text\"}]}}" > "$file"
}

# Helper: run hook with given state dir and session id
run_hook() {
  local workdir="$1"
  local session_id="${2:-}"
  local transcript="${3:-$workdir/transcript.jsonl}"
  local hook_input
  if [[ -n "$session_id" ]]; then
    hook_input=$(jq -n --arg sid "$session_id" --arg tp "$transcript" '{session_id: $sid, transcript_path: $tp}')
  else
    hook_input=$(jq -n --arg tp "$transcript" '{transcript_path: $tp}')
  fi
  (cd "$workdir" && echo "$hook_input" | bash "$OLDPWD/$HOOK" 2>&1) || true
}

OLDPWD=$(pwd)
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

assert_contains() {
  local desc="$1" needle="$2" haystack="$3"
  if echo "$haystack" | grep -q "$needle"; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo "FAIL: $desc"
    echo "  expected to contain: $needle"
    echo "  actual: $haystack"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# --- Test 1: No state file → exits 0 (allows exit) ---
TEST_DIR="$TMPDIR/test1"
mkdir -p "$TEST_DIR/.claude"
make_transcript "$TEST_DIR/transcript.jsonl" "some output"
output=$(run_hook "$TEST_DIR" "sess1")
assert_eq "T1: no state file → empty output" "" "$output"

# --- Test 2: State file with status: completed → exits 0 ---
TEST_DIR="$TMPDIR/test2"
mkdir -p "$TEST_DIR/.claude"
make_state "$TEST_DIR/.claude/design-loop.state-sess2.md" "completed" "5" "10"
make_transcript "$TEST_DIR/transcript.jsonl" "final output"
output=$(run_hook "$TEST_DIR" "sess2")
assert_eq "T2: completed status → empty output" "" "$output"

# --- Test 3: Running, iteration < max → blocks with JSON ---
TEST_DIR="$TMPDIR/test3"
mkdir -p "$TEST_DIR/.claude"
make_state "$TEST_DIR/.claude/design-loop.state-sess3.md" "running" "2" "10"
make_transcript "$TEST_DIR/transcript.jsonl" "iteration 2 done"
output=$(run_hook "$TEST_DIR" "sess3")
assert_contains "T3: running + under max → decision:block" '"decision"' "$output"
# Verify iteration was incremented
new_iter=$(sed -n 's/^iteration: //p' "$TEST_DIR/.claude/design-loop.state-sess3.md")
assert_eq "T3: iteration incremented to 3" "3" "$new_iter"

# --- Test 4: Running, iteration >= max → marks completed ---
TEST_DIR="$TMPDIR/test4"
mkdir -p "$TEST_DIR/.claude"
make_state "$TEST_DIR/.claude/design-loop.state-sess4.md" "running" "10" "10"
make_transcript "$TEST_DIR/transcript.jsonl" "last iteration"
output=$(run_hook "$TEST_DIR" "sess4")
assert_contains "T4: max reached → stop message" "Max iterations" "$output"
new_status=$(sed -n 's/^status: //p' "$TEST_DIR/.claude/design-loop.state-sess4.md")
assert_eq "T4: status set to completed" "completed" "$new_status"

# --- Test 5: Corrupted iteration field → marks error ---
TEST_DIR="$TMPDIR/test5"
mkdir -p "$TEST_DIR/.claude"
make_state "$TEST_DIR/.claude/design-loop.state-sess5.md" "running" "abc" "10"
make_transcript "$TEST_DIR/transcript.jsonl" "some output"
output=$(run_hook "$TEST_DIR" "sess5")
assert_contains "T5: corrupted iteration → error" "corrupted" "$output"
new_status=$(sed -n 's/^status: //p' "$TEST_DIR/.claude/design-loop.state-sess5.md")
assert_eq "T5: status set to error" "error" "$new_status"

# --- Test 6: Corrupted max_iterations field → marks error ---
TEST_DIR="$TMPDIR/test6"
mkdir -p "$TEST_DIR/.claude"
make_state "$TEST_DIR/.claude/design-loop.state-sess6.md" "running" "3" "xyz"
make_transcript "$TEST_DIR/transcript.jsonl" "some output"
output=$(run_hook "$TEST_DIR" "sess6")
assert_contains "T6: corrupted max_iterations → error" "corrupted" "$output"
new_status=$(sed -n 's/^status: //p' "$TEST_DIR/.claude/design-loop.state-sess6.md")
assert_eq "T6: status set to error" "error" "$new_status"

# --- Test 7: POLISHED signal in transcript → marks completed ---
TEST_DIR="$TMPDIR/test7"
mkdir -p "$TEST_DIR/.claude"
make_state "$TEST_DIR/.claude/design-loop.state-sess7.md" "running" "5" "10"
make_transcript "$TEST_DIR/transcript.jsonl" "All done! <promise>POLISHED</promise>"
output=$(run_hook "$TEST_DIR" "sess7")
assert_contains "T7: POLISHED signal → completed" "POLISHED" "$output"
new_status=$(sed -n 's/^status: //p' "$TEST_DIR/.claude/design-loop.state-sess7.md")
assert_eq "T7: status set to completed" "completed" "$new_status"

# --- Test 8: Missing transcript file → marks error ---
TEST_DIR="$TMPDIR/test8"
mkdir -p "$TEST_DIR/.claude"
make_state "$TEST_DIR/.claude/design-loop.state-sess8.md" "running" "3" "10"
output=$(run_hook "$TEST_DIR" "sess8" "/nonexistent/transcript.jsonl")
assert_contains "T8: missing transcript → error" "Transcript file not found" "$output"
new_status=$(sed -n 's/^status: //p' "$TEST_DIR/.claude/design-loop.state-sess8.md")
assert_eq "T8: status set to error" "error" "$new_status"

# --- Test 9: Session-scoped state files — correct file per session ---
TEST_DIR="$TMPDIR/test9"
mkdir -p "$TEST_DIR/.claude"
make_state "$TEST_DIR/.claude/design-loop.state-sessA.md" "running" "1" "10"
make_state "$TEST_DIR/.claude/design-loop.state-sessB.md" "completed" "5" "5"
make_transcript "$TEST_DIR/transcript.jsonl" "iteration done"

# Session A should be blocked (running)
outputA=$(run_hook "$TEST_DIR" "sessA")
assert_contains "T9a: session A → blocked" '"decision"' "$outputA"

# Session B should pass through (completed)
outputB=$(run_hook "$TEST_DIR" "sessB")
assert_eq "T9b: session B → empty (completed)" "" "$outputB"

# --- Test 10: Fallback to unsessioned state file ---
TEST_DIR="$TMPDIR/test10"
mkdir -p "$TEST_DIR/.claude"
make_state "$TEST_DIR/.claude/design-loop.state.md" "running" "2" "10"
make_transcript "$TEST_DIR/transcript.jsonl" "iteration done"
# No session_id → should use fallback file
output=$(run_hook "$TEST_DIR" "")
assert_contains "T10: no session → fallback state file → blocked" '"decision"' "$output"

# --- Summary ---
TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo ""
echo "stop-hook: $TESTS_PASSED/$TOTAL passed"
if [[ $TESTS_FAILED -gt 0 ]]; then
  exit 1
fi
