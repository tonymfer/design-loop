#!/bin/bash
# Tier 3: AI score progression check.
# Parses the plugin's generated report/state for score data and asserts
# that scores improved from first to last iteration.
#
# Usage:
#   bash tests/verify-scores.sh [state-file-path]
#   bash tests/verify-scores.sh                           # auto-find latest state file
#   bash tests/verify-scores.sh design-loop.state-abc.md  # explicit path
set -euo pipefail

cd "$(dirname "$0")/.."

# Find the state file
if [[ $# -ge 1 ]]; then
  STATE_FILE="$1"
else
  # Auto-discover: find the most recent design-loop state file
  STATE_FILE=$(ls -t design-loop.state*.md 2>/dev/null | head -1 || true)
  if [[ -z "$STATE_FILE" ]]; then
    echo "No design-loop state file found in current directory."
    echo "Usage: bash tests/verify-scores.sh [state-file-path]"
    echo ""
    echo "Run /design-loop against a fixture first, then run this script."
    exit 2
  fi
fi

if [[ ! -f "$STATE_FILE" ]]; then
  echo "State file not found: $STATE_FILE"
  exit 2
fi

echo "Checking score progression in: $STATE_FILE"
echo ""

# Extract weighted averages from the state file.
# The design-loop writes score tables with format:
#   | Criterion | Score | Weight | Weighted |
# And a summary line like:
#   **Weighted Average: X.XX/5**
# We look for all weighted average values across iterations.

SCORES=()
while IFS= read -r line; do
  # Match patterns like "Weighted Average: 3.45/5" or "**Weighted Average: 3.45**"
  if [[ "$line" =~ [Ww]eighted[[:space:]]*[Aa]verage[^0-9]*([0-9]+\.?[0-9]*) ]]; then
    SCORES+=("${BASH_REMATCH[1]}")
  fi
done < "$STATE_FILE"

if [[ ${#SCORES[@]} -lt 2 ]]; then
  echo "Found ${#SCORES[@]} score(s) — need at least 2 to check progression."
  echo "Scores found: ${SCORES[*]:-none}"
  echo ""
  echo "This check requires at least 2 iterations of the design-loop."
  exit 2
fi

FIRST="${SCORES[0]}"
LAST="${SCORES[${#SCORES[@]}-1]}"

echo "Scores across iterations: ${SCORES[*]}"
echo "First: $FIRST"
echo "Last:  $LAST"
echo ""

# Compare: last should be greater than first
# Use bc for float comparison
IMPROVED=$(echo "$LAST > $FIRST" | bc -l 2>/dev/null || echo "0")

if [[ "$IMPROVED" == "1" ]]; then
  DELTA=$(echo "$LAST - $FIRST" | bc -l 2>/dev/null || echo "?")
  echo "PASS: Scores improved by $DELTA (from $FIRST to $LAST)"
  exit 0
else
  echo "FAIL: Scores did not improve (from $FIRST to $LAST)"
  echo ""
  echo "This may indicate:"
  echo "  - The plugin didn't fix the intended flaws"
  echo "  - The scorer didn't detect the improvements"
  echo "  - The fixture was already at maximum score"
  exit 1
fi
