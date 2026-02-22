#!/bin/bash
# design-loop test runner
# Usage: bash tests/run.sh

set -euo pipefail

cd "$(dirname "$0")/.."

PASS=0
FAIL=0
ERRORS=()

for test in tests/*.test.sh; do
  name=$(basename "$test" .test.sh)
  printf "  %-30s " "$name"
  if output=$(bash "$test" 2>&1); then
    echo "PASS"
    PASS=$((PASS + 1))
  else
    echo "FAIL"
    ERRORS+=("$name: $output")
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "Results: $PASS passed, $FAIL failed"

if [[ $FAIL -gt 0 ]]; then
  echo ""
  echo "Failures:"
  for err in "${ERRORS[@]}"; do
    echo "  - $err"
  done
  exit 1
fi
