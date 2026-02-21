#\!/bin/bash

# Design Loop SessionStart Hook
# Validates that Playwright MCP dependencies are available
# Runs once at session start to fail fast if prerequisites are missing

set -euo pipefail

# Check if npx is available (required for Playwright MCP)
if \! command -v npx >/dev/null 2>&1; then
  echo '{"decision":"warn","reason":"npx not found. design-loop requires Node.js and npx for Playwright MCP. Install Node.js first."}'
  exit 0
fi

# Lightweight check: verify @playwright/mcp can be resolved
# We do not actually start the server, just check the package is accessible
if npx -y @playwright/mcp@latest --help >/dev/null 2>&1; then
  exit 0
else
  # Not a fatal error: the skill Phase 0 will attempt auto-install
  exit 0
fi
