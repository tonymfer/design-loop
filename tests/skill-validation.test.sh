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
assert_contains "T2e: Orchestrator has Step 4 (Fingerprint)" "Step 4" orchestrator/orchestrator.md
assert_contains "T2f: Orchestrator has Step 5 (Screenshot)" "Step 5" orchestrator/orchestrator.md
assert_contains "T2g: Orchestrator has Step 6 (Execute)" "Step 6" orchestrator/orchestrator.md
assert_contains "T2h: Orchestrator has Step 7 (Safety)" "Step 7" orchestrator/orchestrator.md
assert_contains "T2i: Orchestrator has Step 8 (Report)" "Step 8" orchestrator/orchestrator.md

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

# --- Test 8: Interview flow exists and has required content ---
assert_true "T8a: interview-flow.md exists" test -f orchestrator/interview-flow.md
assert_contains "T8b: Interview has Q0 (Mode)" "Q0" orchestrator/interview-flow.md
assert_contains "T8c: Interview has Q2.5 (Sub-screens)" "Q2.5" orchestrator/interview-flow.md
assert_contains "T8d: Interview has confirmation step" "confirmation" orchestrator/interview-flow.md
assert_contains "T8e: Interview has CLI bypass" "ARGUMENTS" orchestrator/interview-flow.md
assert_contains "T8f: Interview has few-shot example" "Beeper" orchestrator/interview-flow.md
assert_contains "T8g: Orchestrator delegates to interview" "interview-flow.md" orchestrator/orchestrator.md

# --- Test 8.5: scan-context.md exists and has required content ---
assert_true "T8.5a: scan-context.md exists" test -f orchestrator/scan-context.md
assert_contains "T8.5b: Scan has role" "<role>" orchestrator/scan-context.md
assert_contains "T8.5c: Scan reads package.json" "package.json" orchestrator/scan-context.md
assert_contains "T8.5d: Scan reads installed_plugins" "installed_plugins" orchestrator/scan-context.md
assert_contains "T8.5e: Scan has mode-aware logic" "precision-polish" orchestrator/scan-context.md
assert_contains "T8.5f: Scan produces PROJECT_CONTEXT" "PROJECT_CONTEXT" orchestrator/scan-context.md
assert_contains "T8.5g: Scan produces DESIGN_SKILLS" "DESIGN_SKILLS" orchestrator/scan-context.md
assert_contains "T8.5h: Scan produces SHARED_REFERENCES" "SHARED_REFERENCES" orchestrator/scan-context.md
assert_contains "T8.5i: Scan has output contract" "output-contract" orchestrator/scan-context.md
assert_contains "T8.5j: Scan has few-shot examples" "example" orchestrator/scan-context.md
assert_contains "T8.5k: Orchestrator delegates to scan-context" "scan-context.md" orchestrator/orchestrator.md

# --- Test 8.7: code-fingerprint.md exists and has required content ---
assert_true "T8.7a: code-fingerprint.md exists" test -f orchestrator/code-fingerprint.md
assert_contains "T8.7b: Code fingerprint has role" "<role>" orchestrator/code-fingerprint.md
assert_contains "T8.7c: Code fingerprint has mode-gate" "mode-gate" orchestrator/code-fingerprint.md
assert_contains "T8.7d: Code fingerprint has code-extraction" "code-extraction" orchestrator/code-fingerprint.md
assert_contains "T8.7e: Code fingerprint produces BRAND_FINGERPRINT" "BRAND_FINGERPRINT" orchestrator/code-fingerprint.md
assert_contains "T8.7f: Code fingerprint has output contract" "output-contract" orchestrator/code-fingerprint.md
assert_contains "T8.7g: Code fingerprint has few-shot examples" "example" orchestrator/code-fingerprint.md
assert_contains "T8.7h: Code fingerprint skips precision-polish" "precision-polish" orchestrator/code-fingerprint.md
assert_contains "T8.7i: Code fingerprint has brand-guideline persistence" "brand-guideline" orchestrator/code-fingerprint.md
assert_contains "T8.7j: Orchestrator delegates to code-fingerprint" "code-fingerprint.md" orchestrator/orchestrator.md

# --- Test 8.8: visual-fingerprint.md exists and has interface ---
assert_true "T8.8a: visual-fingerprint.md exists" test -f orchestrator/visual-fingerprint.md
assert_contains "T8.8b: Visual fingerprint has role" "<role>" orchestrator/visual-fingerprint.md
assert_contains "T8.8c: Visual fingerprint has input contract" "input-contract" orchestrator/visual-fingerprint.md
assert_contains "T8.8d: Visual fingerprint has visual-extraction" "visual-extraction" orchestrator/visual-fingerprint.md
assert_contains "T8.8e: Visual fingerprint has output contract" "output-contract" orchestrator/visual-fingerprint.md

# --- Test 8.9: Mode skills reference BRAND_FINGERPRINT ---
assert_contains "T8.9a: theme-respect-elevate uses BRAND_FINGERPRINT" "BRAND_FINGERPRINT" skills/modes/theme-respect-elevate/SKILL.md
assert_contains "T8.9b: theme-respect-elevate has fallback" "fallback" skills/modes/theme-respect-elevate/SKILL.md
assert_contains "T8.9c: creative-unleash uses BRAND_FINGERPRINT" "BRAND_FINGERPRINT" skills/modes/creative-unleash/SKILL.md

# --- Test 8.10: screenshot-engine/ folder exists with 3 sub-modules ---
assert_true "T8.10a: baseline-init.md exists" test -f orchestrator/screenshot-engine/baseline-init.md
assert_true "T8.10b: iteration-workflow.md exists" test -f orchestrator/screenshot-engine/iteration-workflow.md
assert_true "T8.10c: fidelity-scoring.md exists" test -f orchestrator/screenshot-engine/fidelity-scoring.md
assert_contains "T8.10d: baseline-init has role" "<role>" orchestrator/screenshot-engine/baseline-init.md
assert_contains "T8.10e: baseline-init has output contract" "output-contract" orchestrator/screenshot-engine/baseline-init.md
assert_contains "T8.10f: baseline-init has viewport recovery" "set viewport 1440 900" orchestrator/screenshot-engine/baseline-init.md
assert_contains "T8.10g: iteration-workflow has role" "<role>" orchestrator/screenshot-engine/iteration-workflow.md
assert_contains "T8.10h: iteration-workflow has diff command" "diff screenshot" orchestrator/screenshot-engine/iteration-workflow.md
assert_contains "T8.10i: iteration-workflow has viewport recovery" "set viewport 1440 900" orchestrator/screenshot-engine/iteration-workflow.md
assert_contains "T8.10j: iteration-workflow has few-shot examples" "example" orchestrator/screenshot-engine/iteration-workflow.md
assert_contains "T8.10k: iteration-workflow has mode behaviors" "mode-behavior" orchestrator/screenshot-engine/iteration-workflow.md
assert_contains "T8.10l: fidelity-scoring has role" "<role>" orchestrator/screenshot-engine/fidelity-scoring.md
assert_contains "T8.10m: fidelity-scoring has BRAND_FINGERPRINT" "BRAND_FINGERPRINT" orchestrator/screenshot-engine/fidelity-scoring.md
assert_contains "T8.10n: fidelity-scoring has output contract" "output-contract" orchestrator/screenshot-engine/fidelity-scoring.md
assert_contains "T8.10o: Orchestrator delegates to screenshot-engine" "screenshot-engine" orchestrator/orchestrator.md
assert_contains "T8.10p: Visual fingerprint is wired" "WIRED" orchestrator/visual-fingerprint.md

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

# --- Test 14: Mode-specific reviewers exist and extend base ---
assert_true "T14a: reviewers/ directory exists" test -d agents/reviewers
assert_true "T14b: precision-reviewer.md exists" test -f agents/reviewers/precision-reviewer.md
assert_true "T14c: theme-respect-reviewer.md exists" test -f agents/reviewers/theme-respect-reviewer.md
assert_true "T14d: creative-unleash-reviewer.md exists" test -f agents/reviewers/creative-unleash-reviewer.md
assert_contains "T14e: precision-reviewer references base" "visual-reviewer.md" agents/reviewers/precision-reviewer.md
assert_contains "T14f: theme-respect-reviewer references base" "visual-reviewer.md" agents/reviewers/theme-respect-reviewer.md
assert_contains "T14g: creative-unleash-reviewer references base" "visual-reviewer.md" agents/reviewers/creative-unleash-reviewer.md
assert_contains "T14h: precision-reviewer has think block" "<think>" agents/reviewers/precision-reviewer.md
assert_contains "T14i: theme-respect-reviewer has think block" "<think>" agents/reviewers/theme-respect-reviewer.md
assert_contains "T14j: creative-unleash-reviewer has think block" "<think>" agents/reviewers/creative-unleash-reviewer.md
assert_contains "T14k: precision-reviewer has a11y" "a11y" agents/reviewers/precision-reviewer.md
assert_contains "T14l: theme-respect-reviewer has a11y" "a11y" agents/reviewers/theme-respect-reviewer.md
assert_contains "T14m: creative-unleash-reviewer has a11y" "a11y" agents/reviewers/creative-unleash-reviewer.md
assert_contains "T14n: Orchestrator has reviewer-routing" "reviewer-routing" orchestrator/orchestrator.md
assert_contains "T14o: precision-reviewer has Beeper example" "Beeper" agents/reviewers/precision-reviewer.md
assert_contains "T14p: theme-respect-reviewer has Beeper example" "Beeper" agents/reviewers/theme-respect-reviewer.md
assert_contains "T14q: creative-unleash-reviewer has Beeper example" "Beeper" agents/reviewers/creative-unleash-reviewer.md
assert_contains "T14r: creative-unleash-reviewer references loaded skills" "loaded skill" agents/reviewers/creative-unleash-reviewer.md
assert_contains "T14s: theme-respect-reviewer has token_compliance_ratio" "token_compliance_ratio" agents/reviewers/theme-respect-reviewer.md
assert_contains "T14t: precision-reviewer has regression_flags" "regression_flags" agents/reviewers/precision-reviewer.md

# --- Test 15: Reference analyzer exists and has required content ---
assert_true "T15a: reference-analyzer.md exists" test -f orchestrator/reference-analyzer.md
assert_contains "T15b: reference-analyzer has role" "<role>" orchestrator/reference-analyzer.md
assert_contains "T15c: reference-analyzer has mode-gate" "mode-gate" orchestrator/reference-analyzer.md
assert_contains "T15d: reference-analyzer has analysis-pipelines" "analysis-pipeline" orchestrator/reference-analyzer.md
assert_contains "T15e: reference-analyzer has safe-install" "safe-install" orchestrator/reference-analyzer.md
assert_contains "T15f: reference-analyzer has anti-hardcode" "anti-hardcode" orchestrator/reference-analyzer.md
assert_contains "T15g: reference-analyzer has output-contract" "output-contract" orchestrator/reference-analyzer.md
assert_contains "T15h: reference-analyzer has REFERENCE_ANALYSIS" "REFERENCE_ANALYSIS" orchestrator/reference-analyzer.md
assert_contains "T15i: reference-analyzer has few-shot examples" "Beeper" orchestrator/reference-analyzer.md
assert_contains "T15j: reference-analyzer has current-stack" "current-stack" orchestrator/reference-analyzer.md
assert_contains "T15k: reference-analyzer has package.json backup" "package.json" orchestrator/reference-analyzer.md
assert_contains "T15l: Orchestrator delegates to reference-analyzer" "reference-analyzer.md" orchestrator/orchestrator.md
assert_contains "T15m: Interview has Q2.7" "Q2.7" orchestrator/interview-flow.md
assert_contains "T15n: Interview has REFERENCE_TYPE" "REFERENCE_TYPE" orchestrator/interview-flow.md
assert_contains "T15o: creative-unleash SKILL has reference-aware fix" "REFERENCE_ANALYSIS" skills/modes/creative-unleash/SKILL.md
assert_contains "T15p: creative-unleash-reviewer has reference_alignment" "reference_alignment" agents/reviewers/creative-unleash-reviewer.md
assert_contains "T15q: constraints has CU exception" "Reference Analyzer" references/common/constraints.md

# --- Test 16: Loop engine exists and has required content ---
assert_true "T16a: loop-engine.md exists" test -f orchestrator/loop-engine.md
assert_contains "T16b: loop-engine has role" "<role>" orchestrator/loop-engine.md
assert_contains "T16c: loop-engine has input-contract" "input-contract" orchestrator/loop-engine.md
assert_contains "T16d: loop-engine has loop-state" "LOOP_STATE" orchestrator/loop-engine.md
assert_contains "T16e: loop-engine has decision-tree" "decision-tree" orchestrator/loop-engine.md
assert_contains "T16f: loop-engine has anti-hardcode" "anti-hardcode" orchestrator/loop-engine.md
assert_contains "T16g: loop-engine has output-contract" "output-contract" orchestrator/loop-engine.md
assert_contains "T16h: loop-engine has few-shot examples" "Beeper" orchestrator/loop-engine.md
assert_contains "T16i: loop-engine has plateau detection" "plateau" orchestrator/loop-engine.md
assert_contains "T16j: loop-engine has goal_threshold" "goal_threshold" orchestrator/loop-engine.md
assert_contains "T16k: loop-engine has 7 steps" "Step 7" orchestrator/loop-engine.md
assert_contains "T16l: loop-engine has POLISHED promise" "POLISHED" orchestrator/loop-engine.md
assert_contains "T16m: Orchestrator delegates to loop-engine" "loop-engine.md" orchestrator/orchestrator.md
assert_contains "T16n: Orchestrator has LOOP_RESULT" "LOOP_RESULT" orchestrator/orchestrator.md
assert_contains "T16o: visual-reviewer has LOOP_STATE" "LOOP_STATE" agents/visual-reviewer.md
assert_contains "T16p: precision-reviewer has LOOP_STATE" "LOOP_STATE" agents/reviewers/precision-reviewer.md
assert_contains "T16q: theme-respect-reviewer has LOOP_STATE" "LOOP_STATE" agents/reviewers/theme-respect-reviewer.md
assert_contains "T16r: creative-unleash-reviewer has LOOP_STATE" "LOOP_STATE" agents/reviewers/creative-unleash-reviewer.md
assert_contains "T16s: PP has goal_threshold" "goal_threshold" skills/modes/precision-polish/SKILL.md
assert_contains "T16t: TRE has goal_threshold" "goal_threshold" skills/modes/theme-respect-elevate/SKILL.md
assert_contains "T16u: CU has goal_threshold" "goal_threshold" skills/modes/creative-unleash/SKILL.md
assert_contains "T16v: stop-hook recognizes PLATEAU" "PLATEAU" hooks/stop-hook.sh
assert_contains "T16w: stop-hook has goal_threshold" "goal_threshold" hooks/stop-hook.sh
assert_contains "T16x: output-format has WAvg column" "WAvg" references/common/output-format.md
assert_contains "T16y: output-format has Decision column" "Decision" references/common/output-format.md

# --- Test 17: Safety engine exists and has required content ---
assert_true "T17a: safety-engine.md exists" test -f orchestrator/safety-engine.md
assert_contains "T17b: safety-engine has role" "<role>" orchestrator/safety-engine.md
assert_contains "T17c: safety-engine has input-contract" "input-contract" orchestrator/safety-engine.md
assert_contains "T17d: safety-engine has checkpoint-manager" "checkpoint-manager" orchestrator/safety-engine.md
assert_contains "T17e: safety-engine has test-runner" "test-runner" orchestrator/safety-engine.md
assert_contains "T17f: safety-engine has safety-audit-log" "safety-audit-log" orchestrator/safety-engine.md
assert_contains "T17g: safety-engine has safety-status" "safety-status" orchestrator/safety-engine.md
assert_contains "T17h: safety-engine has anti-hardcode" "anti-hardcode" orchestrator/safety-engine.md
assert_contains "T17i: safety-engine has output-contract" "output-contract" orchestrator/safety-engine.md
assert_contains "T17j: safety-engine has few-shot examples" "Beeper" orchestrator/safety-engine.md
assert_contains "T17k: safety-engine references constraints" "constraints" orchestrator/safety-engine.md
assert_contains "T17l: safety-engine references fidelity-scoring" "fidelity-scoring" orchestrator/safety-engine.md
assert_contains "T17m: safety-engine has SAFETY_RESULT" "SAFETY_RESULT" orchestrator/safety-engine.md
assert_contains "T17n: loop-engine has safety_events" "safety_events" orchestrator/loop-engine.md
assert_contains "T17o: loop-engine has safety_status" "safety_status" orchestrator/loop-engine.md
assert_contains "T17p: Orchestrator delegates to safety-engine" "safety-engine.md" orchestrator/orchestrator.md
assert_contains "T17q: safety-engine references backups dir" "backups" orchestrator/safety-engine.md
assert_contains "T17r: safety-engine has test command detection" "package.json" orchestrator/safety-engine.md

# --- Test 18: Full loop integration — cross-file contract wiring ---

# Gap 1: REFERENCE_ANALYSIS wiring (loop-engine → CU reviewer)
assert_contains "T18a: loop-engine reviewer list has REFERENCE_ANALYSIS" "REFERENCE_ANALYSIS" orchestrator/loop-engine.md
assert_contains "T18b: CU reviewer input-contract has REFERENCE_ANALYSIS" "REFERENCE_ANALYSIS" agents/reviewers/creative-unleash-reviewer.md
assert_contains "T18c: CU reviewer output has reference_alignment" "reference_alignment" agents/reviewers/creative-unleash-reviewer.md

# Gap 2: LOOP_RESULT safety fields
assert_contains "T18d: LOOP_RESULT has safety_summary" "safety_summary" orchestrator/loop-engine.md
assert_contains "T18e: LOOP_RESULT has total_rollbacks" "total_rollbacks" orchestrator/loop-engine.md

# Gap 3: output-format safety line
assert_contains "T18f: output-format iteration report has Safety" "Safety:" references/common/output-format.md

# Gap 4: Full-loop Beeper examples
assert_contains "T18g: loop-engine has full-loop Beeper example" "Full-Loop" orchestrator/loop-engine.md
assert_contains "T18h: full-loop example shows checkpoint rollback" "Rollback" orchestrator/loop-engine.md
assert_contains "T18i: full-loop example has safety status line" "Safety: checkpoint" orchestrator/loop-engine.md
assert_contains "T18j: loop-engine has TRE fidelity gate example" "Fidelity Gate" orchestrator/loop-engine.md
assert_contains "T18k: TRE gate example shows theme_fidelity block" "BLOCKED" orchestrator/loop-engine.md

# Cross-file fidelity gate thresholds
assert_contains "T18l: fidelity-scoring has TRE 0.8 hard gate" "0.8" orchestrator/screenshot-engine/fidelity-scoring.md
assert_contains "T18m: fidelity-scoring has CU 0.5 warn" "0.5" orchestrator/screenshot-engine/fidelity-scoring.md
assert_contains "T18n: fidelity-scoring has PP null theme" "null" orchestrator/screenshot-engine/fidelity-scoring.md

# Cross-file decision tree consistency
assert_contains "T18o: loop-engine decision tree has POLISHED" "POLISHED" orchestrator/loop-engine.md
assert_contains "T18p: loop-engine decision tree has PLATEAU" "PLATEAU" orchestrator/loop-engine.md
assert_contains "T18q: loop-engine decision tree has REGRESSION" "REGRESSION" orchestrator/loop-engine.md
assert_contains "T18r: loop-engine decision tree has MAX_REACHED" "MAX_REACHED" orchestrator/loop-engine.md

# Safety-engine ↔ loop-engine wiring
assert_contains "T18s: loop-engine Step 4 wires checkpoint-manager" "checkpoint-manager" orchestrator/loop-engine.md
assert_contains "T18t: loop-engine Step 4 wires test-runner" "test-runner" orchestrator/loop-engine.md

# --- Summary ---
TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo ""
echo "skill-validation: $TESTS_PASSED/$TOTAL passed"
if [[ $TESTS_FAILED -gt 0 ]]; then
  exit 1
fi
