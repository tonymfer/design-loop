#!/bin/bash

# Design Loop SessionStart Hook
# Validates that agent-browser dependencies are available
# Runs once at session start to fail fast if prerequisites are missing

set -euo pipefail

# Check if npm is available (required for agent-browser install)
if ! command -v npm >/dev/null 2>&1; then
  echo '{"decision":"warn","reason":"npm not found. design-loop requires Node.js and npm for agent-browser. Install Node.js first."}'
  exit 0
fi

# Lightweight check: verify agent-browser is installed
if command -v agent-browser >/dev/null 2>&1; then
  exit 0
else
  # Not a fatal error: the skill Phase 0 will attempt auto-install
  exit 0
fi
