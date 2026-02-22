#!/bin/bash

# Design Loop Stop Hook
# Prevents session exit when a design-loop is active
# Feeds the prompt back to continue the iteration loop
#
# Derived from ralph-loop by Anthropic
# https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ralph-loop
# Licensed under Apache License 2.0
# Modifications: reads design-loop.state.md, checks status field,
# hardcoded POLISHED completion signal, sets status to completed/error
# instead of deleting state file

set -euo pipefail

# Read hook input from stdin (advanced stop hook API)
HOOK_INPUT=$(cat)

# Derive session-scoped state file
SESSION_ID=$(echo "$HOOK_INPUT" | jq -r '.session_id // empty')
if [[ -n "$SESSION_ID" ]]; then
  STATE_FILE=".claude/design-loop.state-${SESSION_ID}.md"
else
  STATE_FILE=".claude/design-loop.state.md"  # fallback for older Claude Code versions
fi

if [[ ! -f "$STATE_FILE" ]]; then
  # No active loop for this session - allow exit
  exit 0
fi

# Parse markdown frontmatter (YAML between ---) and extract values
# Strip \r to handle CRLF line endings (common when files are written cross-platform)
FRONTMATTER=$(tr -d '\r' < "$STATE_FILE" | sed -n '/^---$/,/^---$/{ /^---$/d; p; }')
STATUS=$(echo "$FRONTMATTER" | awk -F': *' '/^status:/ {print $2}')
ITERATION=$(echo "$FRONTMATTER" | awk -F': *' '/^iteration:/ {print $2}')
MAX_ITERATIONS=$(echo "$FRONTMATTER" | awk -F': *' '/^max_iterations:/ {print $2}')
MODE=$(echo "$FRONTMATTER" | awk -F': *' '/^mode:/ {print $2}')
GOAL_THRESHOLD=$(echo "$FRONTMATTER" | awk -F': *' '/^goal_threshold:/ {print $2}')
if [[ -z "$GOAL_THRESHOLD" ]]; then
  GOAL_THRESHOLD="4.0"
fi

# If status is not "running", allow exit (completed, paused, etc.)
if [[ "$STATUS" != "running" ]]; then
  exit 0
fi

# Validate numeric fields before arithmetic operations
if [[ ! "$ITERATION" =~ ^[0-9]+$ ]]; then
  echo "⚠️  Design loop: State file corrupted" >&2
  echo "   File: $STATE_FILE" >&2
  echo "   Problem: 'iteration' field is not a valid number (got: '$ITERATION')" >&2
  echo "" >&2
  echo "   This usually means the state file was manually edited or corrupted." >&2
  echo "   Design loop is stopping. Run /design-loop again to start fresh." >&2
  sed "s/^status: .*/status: error/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

if [[ ! "$MAX_ITERATIONS" =~ ^[0-9]+$ ]]; then
  echo "⚠️  Design loop: State file corrupted" >&2
  echo "   File: $STATE_FILE" >&2
  echo "   Problem: 'max_iterations' field is not a valid number (got: '$MAX_ITERATIONS')" >&2
  echo "" >&2
  echo "   This usually means the state file was manually edited or corrupted." >&2
  echo "   Design loop is stopping. Run /design-loop again to start fresh." >&2
  sed "s/^status: .*/status: error/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

# Check if max iterations reached
if [[ $MAX_ITERATIONS -gt 0 ]] && [[ $ITERATION -ge $MAX_ITERATIONS ]]; then
  echo "🛑 Design loop: Max iterations ($MAX_ITERATIONS) reached."
  sed "s/^status: .*/status: completed/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

# Get transcript path from hook input
TRANSCRIPT_PATH=$(echo "$HOOK_INPUT" | jq -r '.transcript_path')

if [[ ! -f "$TRANSCRIPT_PATH" ]]; then
  echo "⚠️  Design loop: Transcript file not found" >&2
  echo "   Expected: $TRANSCRIPT_PATH" >&2
  echo "   This is unusual and may indicate a Claude Code internal issue." >&2
  echo "   Design loop is stopping." >&2
  sed "s/^status: .*/status: error/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

# Read last assistant message from transcript (JSONL format - one JSON per line)
if ! grep -q '"role":"assistant"' "$TRANSCRIPT_PATH"; then
  echo "⚠️  Design loop: No assistant messages found in transcript" >&2
  echo "   Transcript: $TRANSCRIPT_PATH" >&2
  echo "   Design loop is stopping." >&2
  sed "s/^status: .*/status: error/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

# Extract last assistant message with explicit error handling
LAST_LINE=$(grep '"role":"assistant"' "$TRANSCRIPT_PATH" | tail -1)
if [[ -z "$LAST_LINE" ]]; then
  echo "⚠️  Design loop: Failed to extract last assistant message" >&2
  echo "   Design loop is stopping." >&2
  sed "s/^status: .*/status: error/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

# Parse JSON with error handling
LAST_OUTPUT=$(echo "$LAST_LINE" | jq -r '
  .message.content |
  map(select(.type == "text")) |
  map(.text) |
  join("\n")
' 2>&1)

# Check if jq succeeded
if [[ $? -ne 0 ]]; then
  echo "⚠️  Design loop: Failed to parse assistant message JSON" >&2
  echo "   Error: $LAST_OUTPUT" >&2
  echo "   Design loop is stopping." >&2
  sed "s/^status: .*/status: error/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

if [[ -z "$LAST_OUTPUT" ]]; then
  echo "⚠️  Design loop: Assistant message contained no text content" >&2
  echo "   Design loop is stopping." >&2
  sed "s/^status: .*/status: error/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

# Check for completion signal: <promise>POLISHED</promise>
PROMISE_TEXT=$(echo "$LAST_OUTPUT" | perl -0777 -pe 's/.*?<promise>(.*?)<\/promise>.*/$1/s; s/^\s+|\s+$//g; s/\s+/ /g' 2>/dev/null || echo "")

if [[ -n "$PROMISE_TEXT" ]] && [[ "$PROMISE_TEXT" =~ ^(POLISHED|PLATEAU|REGRESSION|MAX_REACHED)$ ]]; then
  echo "✅ Design loop: Detected <promise>$PROMISE_TEXT</promise>"
  sed "s/^status: .*/status: completed/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

# Check for preview-await signal: <preview-await>CONFIRM</preview-await>
PREVIEW_TEXT=$(echo "$LAST_OUTPUT" | perl -0777 -pe 's/.*?<preview-await>(.*?)<\/preview-await>.*/$1/s; s/^\s+|\s+$//g; s/\s+/ /g' 2>/dev/null || echo "")

if [[ -n "$PREVIEW_TEXT" ]] && [[ "$PREVIEW_TEXT" == "CONFIRM" ]]; then
  echo "⏸️  Design loop: Preview awaiting confirmation (iteration $ITERATION)"
  # Exit 0 — allow turn to end so user can respond. Status stays "running".
  # When user responds, Claude processes PREVIEW_RESULT and loop continues.
  exit 0
fi

# Not complete - continue loop with SAME PROMPT
NEXT_ITERATION=$((ITERATION + 1))

# Extract prompt (everything after the closing ---)
# Skip first --- line, skip until second --- line, then print everything after
PROMPT_TEXT=$(tr -d '\r' < "$STATE_FILE" | awk '/^---$/{i++; next} i>=2')

if [[ -z "$PROMPT_TEXT" ]]; then
  echo "⚠️  Design loop: State file corrupted or incomplete" >&2
  echo "   File: $STATE_FILE" >&2
  echo "   Problem: No prompt text found after frontmatter" >&2
  echo "" >&2
  echo "   Design loop is stopping. Run /design-loop again to start fresh." >&2
  sed "s/^status: .*/status: error/" "$STATE_FILE" > "${STATE_FILE}.tmp.$$"
  mv "${STATE_FILE}.tmp.$$" "$STATE_FILE"
  exit 0
fi

# Update iteration in frontmatter with file locking for concurrent safety
TEMP_FILE="${STATE_FILE}.tmp.$$"
LOCK_FILE="${STATE_FILE}.lock"
if command -v flock &>/dev/null; then
  (flock -x 200
    sed "s/^iteration: .*/iteration: $NEXT_ITERATION/" "$STATE_FILE" > "$TEMP_FILE"
    mv "$TEMP_FILE" "$STATE_FILE"
  ) 200>"$LOCK_FILE"
else
  # macOS fallback: flock not available, use atomic mv
  sed "s/^iteration: .*/iteration: $NEXT_ITERATION/" "$STATE_FILE" > "$TEMP_FILE"
  mv "$TEMP_FILE" "$STATE_FILE"
fi

# Build system message with iteration count
if [[ $MAX_ITERATIONS -gt 0 ]]; then
  ITER_DISPLAY="$NEXT_ITERATION/$MAX_ITERATIONS"
else
  ITER_DISPLAY="$NEXT_ITERATION (no limit)"
fi
MODE_DISPLAY=""
if [[ -n "$MODE" ]]; then
  MODE_DISPLAY=" | mode: $MODE"
fi
SYSTEM_MSG="🔄 design-loop iteration $ITER_DISPLAY$MODE_DISPLAY | goal: weighted avg >= $GOAL_THRESHOLD + all criteria >= 4/5 for 2 consecutive iterations, then output <promise>POLISHED</promise>"

# Output JSON to block the stop and feed prompt back
jq -n \
  --arg prompt "$PROMPT_TEXT" \
  --arg msg "$SYSTEM_MSG" \
  '{
    "decision": "block",
    "reason": $prompt,
    "systemMessage": $msg
  }'

exit 0
