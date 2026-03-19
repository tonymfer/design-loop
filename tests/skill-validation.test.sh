#!/bin/bash
# design-loop v4.0 — Full Validation Suite (104 tests)
set -eo pipefail
PASS=0; FAIL=0; TOTAL=0
p() { PASS=$((PASS+1)); TOTAL=$((TOTAL+1)); }
f() { echo "  FAIL: $1"; FAIL=$((FAIL+1)); TOTAL=$((TOTAL+1)); }

# ═══ CAT 1: File Structure (12) ═══
echo "▸ Cat 1: File Structure"
test -f skills/design-loop/SKILL.md && p || f "1.01 SKILL.md"
test -f orchestrator/orchestrator.md && p || f "1.02 orchestrator"
test -f orchestrator/loop-engine.md && p || f "1.03 loop-engine"
test -f orchestrator/scan-context.md && p || f "1.04 scan-context"
test -f orchestrator/code-fingerprint.md && p || f "1.05 code-fingerprint"
test -f orchestrator/report-engine.md && p || f "1.06 report-engine"
test -f orchestrator/safety-engine.md && p || f "1.07 safety-engine"
test -f skills/modes/polish/SKILL.md && p || f "1.08 polish mode"
test -f skills/modes/redesign/SKILL.md && p || f "1.09 redesign mode"
test ! -f skills/modes/precision-polish/SKILL.md && p || f "1.10 old PP gone"
test ! -f skills/modes/theme-respect-elevate/SKILL.md && p || f "1.11 old TRE gone"
test ! -f skills/modes/creative-unleash/SKILL.md && p || f "1.12 old CU gone"

# ═══ CAT 2: Deleted Bloat (8) ═══
echo "▸ Cat 2: Deleted Bloat"
test ! -f orchestrator/measurement-engine.md && p || f "2.01 measurement-engine"
test ! -f orchestrator/visual-fingerprint.md && p || f "2.02 visual-fingerprint"
test ! -f orchestrator/reference-analyzer.md && p || f "2.03 reference-analyzer"
test ! -f orchestrator/interview-flow.md && p || f "2.04 interview-flow"
test ! -f agents/apply-agent.md && p || f "2.05 apply-agent"
test ! -f skills/design-loop/SKILL-SPRINT.md && p || f "2.06 SKILL-SPRINT"
test ! -f commands/design-sprint.md && p || f "2.07 design-sprint cmd"
test ! -f references/common/anti-hardcode.md && p || f "2.08 anti-hardcode"

# ═══ CAT 3: Mode Routing (15) ═══
echo "▸ Cat 3: Mode Routing & Config"
grep -q "polish" orchestrator/orchestrator.md && p || f "3.01 orch→polish"
grep -q "redesign" orchestrator/orchestrator.md && p || f "3.02 orch→redesign"
grep -q "skills/modes/polish/SKILL.md" orchestrator/orchestrator.md && p || f "3.03 polish path"
grep -q "skills/modes/redesign/SKILL.md" orchestrator/orchestrator.md && p || f "3.04 redesign path"
grep -q "polish-reviewer" orchestrator/loop-engine.md && p || f "3.05 loop→polish-rev"
grep -q "redesign-reviewer" orchestrator/loop-engine.md && p || f "3.06 loop→redesign-rev"
grep -qi "goal_threshold" skills/modes/polish/SKILL.md && p || f "3.07 polish goal"
grep -q "4\.0" skills/modes/polish/SKILL.md && p || f "3.08 polish=4.0"
grep -qi "identity" skills/modes/polish/SKILL.md && p || f "3.09 polish identity"
grep -q "0\.8" skills/modes/polish/SKILL.md && p || f "3.10 polish fidelity"
grep -qi "goal_threshold" skills/modes/redesign/SKILL.md && p || f "3.11 redesign goal"
grep -q "4\.5" skills/modes/redesign/SKILL.md && p || f "3.12 redesign=4.5"
grep -q "2\.0x" skills/modes/redesign/SKILL.md && p || f "3.13 identity 2.0x"
grep -qi "Wow Mode" skills/modes/redesign/SKILL.md && p || f "3.14 wow mode"
grep -q "4\.9" skills/modes/redesign/SKILL.md && p || f "3.15 wow=4.9"

# ═══ CAT 4: Scoring System (10) ═══
echo "▸ Cat 4: Scoring System"
grep -qi "Composition" references/common/rubric.md && p || f "4.01 Composition"
grep -qi "Typography" references/common/rubric.md && p || f "4.02 Typography"
grep -qi "Color" references/common/rubric.md && p || f "4.03 Color"
grep -qi "Identity" references/common/rubric.md && p || f "4.04 Identity"
grep -qi "Polish" references/common/rubric.md && p || f "4.05 Polish"
grep -qi "SOLID_BLOCK" references/common/rubric.md && p || f "4.06 defects"
grep -qi "weighted_average" agents/visual-reviewer.md && p || f "4.07 weighted_avg"
grep -qi "top_issues" agents/visual-reviewer.md && p || f "4.08 top_issues"
grep -qi "recommended_fixes" agents/visual-reviewer.md && p || f "4.09 fixes"
grep -qi "Independent scorer" agents/visual-reviewer.md && p || f "4.10 independent"

# ═══ CAT 5: Loop Logic (12) ═══
echo "▸ Cat 5: Loop Logic"
grep -q "consecutive_pass_count" orchestrator/loop-engine.md && p || f "5.01 consec_pass"
grep -q "plateau_count" orchestrator/loop-engine.md && p || f "5.02 plateau"
grep -q "regression_count" orchestrator/loop-engine.md && p || f "5.03 regression"
grep -q "best_weighted_average" orchestrator/loop-engine.md && p || f "5.04 best_avg"
grep -q "POLISHED" orchestrator/loop-engine.md && p || f "5.05 POLISHED"
grep -q "MAX_REACHED" orchestrator/loop-engine.md && p || f "5.06 MAX_REACHED"
grep -q "REGRESSION" orchestrator/loop-engine.md && p || f "5.07 REGRESSION"
grep -q "PLATEAU" orchestrator/loop-engine.md && p || f "5.08 PLATEAU"
grep -q "CONTINUE" orchestrator/loop-engine.md && p || f "5.09 CONTINUE"
grep -q "structural" orchestrator/loop-engine.md && p || f "5.10 structural"
grep -q "refinement" orchestrator/loop-engine.md && p || f "5.11 refinement"
grep -q "ANY raw score < 3" orchestrator/loop-engine.md && p || f "5.12 floor"

# ═══ CAT 6: Safety (8) ═══
echo "▸ Cat 6: Safety"
grep -qi "checkpoint" orchestrator/safety-engine.md && p || f "6.01 checkpoint"
grep -qi "safety.log" orchestrator/safety-engine.md && p || f "6.02 audit log"
grep -qi "rollback" orchestrator/safety-engine.md && p || f "6.03 rollback"
grep -qi "build" orchestrator/safety-engine.md && p || f "6.04 build"
grep -qi "frontend" references/common/constraints.md && p || f "6.05 frontend"
grep -qi "API routes" references/common/constraints.md && p || f "6.06 no API"
grep -qi "Rollback" references/common/constraints.md && p || f "6.07 rollback"
grep -qi "Stuck" references/common/constraints.md && p || f "6.08 stuck"

# ═══ CAT 7: Stop Hook (10) ═══
echo "▸ Cat 7: Stop Hook"
test -f hooks/stop-hook.sh && p || f "7.01 exists"
test -f hooks/hooks.json && p || f "7.02 hooks.json"
test -f hooks/session-start-hook.sh && p || f "7.03 session-start"
grep -q "POLISHED" hooks/stop-hook.sh && p || f "7.04 POLISHED"
grep -q "PLATEAU" hooks/stop-hook.sh && p || f "7.05 PLATEAU"
grep -q "REGRESSION" hooks/stop-hook.sh && p || f "7.06 REGRESSION"
grep -q "MAX_REACHED" hooks/stop-hook.sh && p || f "7.07 MAX_REACHED"
grep -q "preview-await" hooks/stop-hook.sh && p || f "7.08 preview-await"
grep -q "block" hooks/stop-hook.sh && p || f "7.09 blocks"
grep -q "iteration" hooks/stop-hook.sh && p || f "7.10 iteration"

# ═══ CAT 8: Provider (8) ═══
echo "▸ Cat 8: Provider Abstraction"
test -f orchestrator/screenshot-engine/provider.md && p || f "8.01 provider"
test -f orchestrator/screenshot-engine/provider-claude-preview.md && p || f "8.02 claude-prev"
test -f orchestrator/screenshot-engine/provider-playwright.md && p || f "8.03 playwright"
test -f orchestrator/screenshot-engine/provider-agent-browser.md && p || f "8.04 agent-browser"
test -f orchestrator/screenshot-engine/baseline-init.md && p || f "8.05 baseline"
test -f orchestrator/screenshot-engine/iteration-workflow.md && p || f "8.06 iter-wf"
test -f orchestrator/screenshot-engine/fidelity-scoring.md && p || f "8.07 fidelity"
grep -q "PROVIDER" orchestrator/screenshot-engine/provider.md && p || f "8.08 PROVIDER"

# ═══ CAT 9: Companion Synergy (8) ═══
echo "▸ Cat 9: Synergy"
grep -q "DESIGN_SKILLS" orchestrator/scan-context.md && p || f "9.01 DESIGN_SKILLS"
grep -q "design-loop-hints" orchestrator/scan-context.md && p || f "9.02 hints"
grep -qi "Generator" orchestrator/scan-context.md && p || f "9.03 generator"
grep -q "design" orchestrator/scan-context.md && p || f "9.04 design keyword filter"
grep -q "scoring-enrichment" orchestrator/scan-context.md && p || f "9.05 enrichment"
grep -qi "trigger" orchestrator/scan-context.md && p || f "9.06 trigger"
grep -q "DESIGN_SKILLS" skills/modes/redesign/SKILL.md && p || f "9.07 redesign loads"
grep -qi "companion" skills/modes/redesign/SKILL.md && p || f "9.08 companion"

# ═══ CAT 10: Cross-File Wiring (10) ═══
echo "▸ Cat 10: Wiring"
grep -q "orchestrator.md" skills/design-loop/SKILL.md && p || f "10.01 SKILL→orch"
grep -q "scan-context" orchestrator/orchestrator.md && p || f "10.02 orch→scan"
grep -q "code-fingerprint" orchestrator/orchestrator.md && p || f "10.03 orch→fp"
grep -q "loop-engine" orchestrator/orchestrator.md && p || f "10.04 orch→loop"
grep -q "report-engine" orchestrator/orchestrator.md && p || f "10.05 orch→report"
grep -q "provider" orchestrator/orchestrator.md && p || f "10.06 orch→provider"
grep -q "baseline-init" orchestrator/orchestrator.md && p || f "10.07 orch→baseline"
grep -q "iteration-workflow" orchestrator/loop-engine.md && p || f "10.08 loop→iter"
grep -qi "safety" orchestrator/loop-engine.md && p || f "10.09 loop→safety"
grep -qi "preview" orchestrator/loop-engine.md && p || f "10.10 loop→preview"

# ═══ CAT 11: Version (6) ═══
echo "▸ Cat 11: Version"
grep -q '"4.0.0"' .claude-plugin/plugin.json && p || f "11.01 plugin 4.0.0"
grep -q '"4.0.0"' .claude-plugin/marketplace.json && p || f "11.02 market 4.0.0"
grep -q "4.0.0" README.md && p || f "11.03 README 4.0.0"
grep -qi "polish" .claude-plugin/plugin.json && p || f "11.04 plugin→polish"
grep -qi "redesign" .claude-plugin/plugin.json && p || f "11.05 plugin→redesign"
if grep -qi "precision-polish\|theme-respect-elevate\|creative-unleash" .claude-plugin/plugin.json 2>/dev/null; then f "11.06 stale names"; else p; fi

# ═══ CAT 12: Stale Refs (5) ═══
echo "▸ Cat 12: Stale Refs"
count_stale() { set +e; local c; c=$(grep -r "$1" orchestrator/ skills/ agents/ references/ commands/ .claude-plugin/ README.md CLAUDE.md --include="*.md" --include="*.json" 2>/dev/null | wc -l); set -e; echo "$c" | tr -d ' '; }
s1=$(count_stale "precision-polish")
s2=$(count_stale "theme-respect-elevate")
s3=$(count_stale "creative-unleash")
s4=$(count_stale "measurement-engine")
s5=$(count_stale "reference-analyzer")
[ "$s1" -eq 0 ] && p || f "12.01 stale PP ($s1)"
[ "$s2" -eq 0 ] && p || f "12.02 stale TRE ($s2)"
[ "$s3" -eq 0 ] && p || f "12.03 stale CU ($s3)"
[ "$s4" -eq 0 ] && p || f "12.04 stale measure ($s4)"
[ "$s5" -eq 0 ] && p || f "12.05 stale ref-anal ($s5)"

# ═══ CAT 13: Reviewers (7) ═══
echo "▸ Cat 13: Reviewers"
test -f agents/reviewers/polish-reviewer.md && p || f "13.01 polish-rev"
test -f agents/reviewers/redesign-reviewer.md && p || f "13.02 redesign-rev"
test -f agents/visual-reviewer.md && p || f "13.03 base-reviewer"
test ! -f agents/reviewers/precision-reviewer.md && p || f "13.04 old prec gone"
test ! -f agents/reviewers/theme-respect-reviewer.md && p || f "13.05 old theme gone"
test ! -f agents/reviewers/creative-unleash-reviewer.md && p || f "13.06 old cu gone"
grep -qi "rendering" agents/reviewers/redesign-reviewer.md && p || f "13.07 rendering"

# ═══ CAT 14: Preview Agent (4) ═══
echo "▸ Cat 14: Preview"
test -f agents/preview-agent.md && p || f "14.01 exists"
grep -qi "apply" agents/preview-agent.md && p || f "14.02 apply"
grep -qi "skip" agents/preview-agent.md && p || f "14.03 skip"
grep -qi "modify" agents/preview-agent.md && p || f "14.04 modify"

# ═══ CAT 15: Stop Hook Simulation (5) ═══
echo "▸ Cat 15: Hook Edge Cases"
bash -n hooks/stop-hook.sh && p || f "15.01 syntax"
bash -n hooks/session-start-hook.sh && p || f "15.02 syntax"
python3 -c "import json; json.load(open('hooks/hooks.json'))" 2>/dev/null && p || f "15.03 hooks.json valid"

# Simulate: no state file → exit 0
mkdir -p .claude
rm -f .claude/design-loop.state-test-x.md
(echo '{"session_id":"test-x","transcript_path":"/dev/null"}' | bash hooks/stop-hook.sh >/dev/null 2>&1) && p || f "15.04 no-state exit"

# Simulate: completed state → exit 0
cat > .claude/design-loop.state-test-y.md << 'SIMEOF'
---
status: completed
iteration: 5
max_iterations: 10
mode: polish
goal_threshold: 4.0
---
prompt
SIMEOF
(echo '{"session_id":"test-y","transcript_path":"/dev/null"}' | bash hooks/stop-hook.sh >/dev/null 2>&1) && p || f "15.05 completed exit"
rm -f .claude/design-loop.state-test-y.md

# ═══ CAT 16: Context Budget (3) ═══
echo "▸ Cat 16: Context Budget"
ol=$(wc -l < orchestrator/orchestrator.md)
[ "$ol" -lt 400 ] && p || f "16.01 orch<400 ($ol)"
ll=$(wc -l < orchestrator/loop-engine.md)
[ "$ll" -lt 300 ] && p || f "16.02 loop<300 ($ll)"
run_total=0
for rf in orchestrator/orchestrator.md orchestrator/scan-context.md orchestrator/code-fingerprint.md orchestrator/loop-engine.md skills/modes/redesign/SKILL.md agents/visual-reviewer.md agents/reviewers/redesign-reviewer.md agents/preview-agent.md orchestrator/safety-engine.md orchestrator/report-engine.md orchestrator/screenshot-engine/provider.md orchestrator/screenshot-engine/provider-playwright.md orchestrator/screenshot-engine/baseline-init.md orchestrator/screenshot-engine/iteration-workflow.md orchestrator/screenshot-engine/fidelity-scoring.md references/common/rubric.md references/common/screenshots.md references/common/constraints.md references/common/output-format.md skills/design-loop/SKILL.md; do
  test -f "$rf" && run_total=$((run_total + $(wc -l < "$rf")))
done
[ "$run_total" -lt 3500 ] && p || f "16.03 run<3500 ($run_total)"

echo ""
echo "════════════════════════════════════════════"
printf "  %d passed, %d failed / %d total\n" "$PASS" "$FAIL" "$TOTAL"
echo "════════════════════════════════════════════"
[ "$FAIL" -eq 0 ] && echo "  ✅ ALL TESTS PASSING" || echo "  ❌ $FAIL FAILED"
exit $FAIL
