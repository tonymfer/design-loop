---
name: version
description: Check installed design-loop version and compare with latest release
arguments: []
---

# /version

Check whether the installed design-loop plugin is up to date.

## Instructions

1. Read the installed plugin's `plugin.json` to get the current version:
   - Use Bash: `cat "${CLAUDE_PLUGIN_ROOT}/plugin.json" | grep '"version"'`
   - Extract the version string (e.g., `1.0.0`)

2. Fetch the latest version from GitHub:
   - Use Bash: `gh api repos/tonymfer/design-loop/releases/latest --jq '.tag_name' 2>/dev/null || echo "none"`
   - If no releases exist, fall back to checking the remote plugin.json:
     `gh api repos/tonymfer/design-loop/contents/.claude-plugin/plugin.json --jq '.content' | base64 -d | grep '"version"'`

3. Compare and report:

   If versions match:
   ```
   design-loop v{version} — up to date
   ```

   If versions differ:
   ```
   design-loop v{installed} — update available (v{latest})

   Run to update:
     claude plugin update design-loop
   ```

   If the remote check fails (no internet, private repo, etc.):
   ```
   design-loop v{installed} — could not check for updates

   To manually update:
     claude plugin update design-loop
   ```
