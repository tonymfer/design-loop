Upgrade design-loop Claude Code plugin to fully comply with official plugin documentation — structure cleanup, new hooks, agents directory, and settings.json.

CONTEXT:
- Stack: Claude Code plugin (declarative Markdown + JSON + Bash hooks)
- Key files to MODIFY: .claude-plugin/plugin.json, .claude-plugin/marketplace.json, hooks/hooks.json
- Key files to CREATE: agents/visual-reviewer.md, settings.json (plugin root), hooks/session-start-hook.sh
- Key files to OPTIONALLY UPDATE: skills/design-loop/SKILL.md (add agent reference if useful)
- Current state: v1.0.0, production-ready, marketplace-published at tonymfer/design-loop

REQUIREMENTS:
1. REMOVE version field from .claude-plugin/plugin.json (keep version ONLY in marketplace.json — official docs warn against duplicating version in both files for relative-path plugins)
2. The marketplace.json already has repository field set to https://github.com/tonymfer/design-loop. Verify this is present and correct. The active source should remain as the relative path ./ for marketplace distribution.
3. CREATE settings.json at plugin root with: the agent key set to visual-reviewer — this makes the visual-reviewer agent the default when the plugin is active
4. CREATE agents/visual-reviewer.md with proper YAML frontmatter (name, description) and a system prompt that specializes in:
   - Analyzing UI screenshots for visual quality
   - Applying the 5 anti-slop criteria (layout precision, color harmony, typography hierarchy, spacing consistency, visual polish)
   - Providing actionable CSS/Tailwind fix suggestions
   - The agent should reference the design-loop scoring criteria from SKILL.md
5. ADD SessionStart hook to hooks/hooks.json that runs a new hooks/session-start-hook.sh script using the CLAUDE_PLUGIN_ROOT environment variable in the path
6. CREATE hooks/session-start-hook.sh that:
   - Checks if Playwright MCP is available (which npx check or similar lightweight check)
   - Outputs a JSON result with decision and reason fields matching stop-hook.sh conventions
   - Is executable (chmod +x)
7. ENHANCE marketplace.json metadata:
   - Add strict field set to true to the plugin entry (make it explicit, even though it is default)
   - Ensure category, tags, keywords are comprehensive

CONSTRAINTS:
- Do NOT change the logic of hooks/stop-hook.sh (it controls the autonomous loop)
- Do NOT change the content of commands/design-loop.md, commands/export-loop.md, commands/version.md
- Do NOT change the marketplace name design-loop (breaks existing installs)
- Do NOT modify site/ directory
- Keep all JSON valid — use jq to verify after each change
- Keep backward compatibility — existing users must not break
- Use the CLAUDE_PLUGIN_ROOT environment variable in all hook script paths in hooks.json
- Follow the EXACT plugin structure from official docs: agents/ and settings.json at plugin ROOT, not inside .claude-plugin/

PROCESS:
1. Modify .claude-plugin/plugin.json — remove version field
2. Modify .claude-plugin/marketplace.json — add strict, enhance metadata
3. Create agents/visual-reviewer.md with proper frontmatter
4. Create settings.json at plugin root
5. Create hooks/session-start-hook.sh with Playwright check
6. Modify hooks/hooks.json to add SessionStart hook entry
7. Optionally update skills/design-loop/SKILL.md to mention the visual-reviewer agent
8. Run all verification commands

VERIFICATION:
After EACH file change, run these commands:
  jq . .claude-plugin/plugin.json
  jq . .claude-plugin/marketplace.json
  jq . hooks/hooks.json
  ls -la agents/visual-reviewer.md
  ls -la settings.json
  ls -la hooks/session-start-hook.sh
  bash -n hooks/session-start-hook.sh
  bash -n hooks/stop-hook.sh
ALL must succeed before moving to next requirement.

SUCCESS CRITERIA:
- .claude-plugin/plugin.json has NO version field
- .claude-plugin/marketplace.json has strict set to true in plugin entry
- agents/visual-reviewer.md exists with valid YAML frontmatter (name + description)
- settings.json exists at plugin root with agent set to visual-reviewer
- hooks/session-start-hook.sh exists, is executable, and passes bash -n syntax check
- hooks/hooks.json has both Stop and SessionStart hook entries
- ALL jq validation commands pass with zero exit code
- hooks/stop-hook.sh is UNCHANGED (diff against git HEAD shows no changes)

STUCK HANDLING:
After 3 consecutive failures on the same issue:
- Document what is blocking in a BLOCKERS.md file
- Commit all successfully completed work so far
- Output the blocker details and stop

When ALL success criteria are met, output:
  POLISHED
