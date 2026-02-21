#!/bin/bash

# Design Loop SessionStart Hook
# Validates that Playwright CLI dependencies are available
# Runs once at session start to fail fast if prerequisites are missing

set -euo pipefail

# Check if npm is available (required for Playwright CLI install)
if ! command -v npm >/dev/null 2>&1; then
  echo '{"decision":"warn","reason":"npm not found. design-loop requires Node.js and npm for Playwright CLI. Install Node.js first."}'
  exit 0
fi

# Lightweight check: verify playwright-cli is installed
if command -v playwright-cli >/dev/null 2>&1; then
  exit 0
else
  # Not a fatal error: the skill Phase 0 will attempt auto-install
  exit 0
fi
