#!/bin/bash
# doop — Visual Intelligence Pyramid validation (4 tiers)
set -eo pipefail
PASS=0; FAIL=0; TOTAL=0
p() { PASS=$((PASS+1)); TOTAL=$((TOTAL+1)); }
f() { echo "  FAIL: $1"; FAIL=$((FAIL+1)); TOTAL=$((TOTAL+1)); }

# ═══ TIER 1: lint (instant, no browser) ═══
echo "▸ Tier 1: doop:lint"
test -f skills/lint/SKILL.md && p || f "T1.01 skill exists"
test -f commands/lint.md && p || f "T1.02 command exists"
test -f orchestrator/lint-engine.md && p || f "T1.03 lint-engine exists"
grep -qi "lint-engine\|orchestrator" skills/lint/SKILL.md && p || f "T1.04 skill→engine"
grep -qi "lint" commands/lint.md && p || f "T1.05 command name"
grep -qi "no browser" skills/lint/SKILL.md && p || f "T1.06 no browser claim"
grep -qi "WCAG" orchestrator/lint-engine.md && p || f "T1.07 contrast check"
grep -qi "arbitrary" orchestrator/lint-engine.md && p || f "T1.08 arbitrary values"
grep -qi "Composition" orchestrator/lint-engine.md && p || f "T1.09 maps to composition"
grep -qi "Typography" orchestrator/lint-engine.md && p || f "T1.10 maps to typography"
grep -qi "Color" orchestrator/lint-engine.md && p || f "T1.11 maps to color"
grep -qi "Identity" orchestrator/lint-engine.md && p || f "T1.12 maps to identity"
grep -qi "Polish" orchestrator/lint-engine.md && p || f "T1.13 maps to polish"
grep -qi "READ-ONLY" orchestrator/lint-engine.md && p || f "T1.14 read-only"
grep -qi "score" orchestrator/lint-engine.md && p || f "T1.15 escalation to score"
grep -qi "SP-1\|SP-2" orchestrator/lint-engine.md && p || f "T1.16 rule IDs"

# ═══ TIER 2: score (5s, one screenshot) ═══
echo "▸ Tier 2: doop:score"
test -f skills/score/SKILL.md && p || f "T2.01 skill exists"
test -f commands/score.md && p || f "T2.02 command exists"
test -f skills/modes/score/SKILL.md && p || f "T2.03 mode skill exists"
grep -qi "orchestrator" skills/score/SKILL.md && p || f "T2.04 skill→orchestrator"
grep -qi "score" skills/score/SKILL.md && p || f "T2.05 mode=score"
grep -qi "1\.0x" skills/modes/score/SKILL.md && p || f "T2.06 neutral weights"
grep -qi "No fixing\|no loop\|no fixing" skills/modes/score/SKILL.md && p || f "T2.07 no fixing"
grep -qi "fix" skills/modes/score/SKILL.md && p || f "T2.08 escalation to fix"
grep -qi "score card" skills/modes/score/SKILL.md && p || f "T2.09 output format"
grep -qi "MODE_SCORING" skills/modes/score/SKILL.md && p || f "T2.10 scoring section"

# ═══ TIER 3: fix (30s, one iteration) ═══
echo "▸ Tier 3: doop:fix"
test -f skills/fix/SKILL.md && p || f "T3.01 skill exists"
test -f commands/fix.md && p || f "T3.02 command exists"
test -f skills/modes/fix/SKILL.md && p || f "T3.03 mode skill exists"
grep -qi "orchestrator" skills/fix/SKILL.md && p || f "T3.04 skill→orchestrator"
grep -qi "fix" skills/fix/SKILL.md && p || f "T3.05 mode=fix"
grep -qi "1\.0x" skills/modes/fix/SKILL.md && p || f "T3.06 neutral weights"
grep -qi "MODE_SCORING" skills/modes/fix/SKILL.md && p || f "T3.07 scoring section"
grep -qi "MODE_FIXING" skills/modes/fix/SKILL.md && p || f "T3.08 fixing section"
grep -qi "Prohibited" skills/modes/fix/SKILL.md && p || f "T3.09 fix constraints"
grep -qi "Maximum 2\|1-2" skills/modes/fix/SKILL.md && p || f "T3.10 fix limit"
grep -qi "safety" skills/modes/fix/SKILL.md && p || f "T3.11 safety engine ref"
grep -qi "Before.*After\|before.*after" skills/modes/fix/SKILL.md && p || f "T3.12 delta output"
grep -qi "loop\|doop" skills/modes/fix/SKILL.md && p || f "T3.13 escalation to loop"

# ═══ ORCHESTRATOR: Mode Routing ═══
echo "▸ Orchestrator: Pyramid Routing"
grep -qi "lint" orchestrator/orchestrator.md && p || f "T4.01 orch knows lint"
grep -qi "score" orchestrator/orchestrator.md && p || f "T4.02 orch knows score"
grep -qi "fix" orchestrator/orchestrator.md && p || f "T4.03 orch knows fix"
grep -q "Step L" orchestrator/orchestrator.md && p || f "T4.04 Step L exists"
grep -q "Step S" orchestrator/orchestrator.md && p || f "T4.05 Step S exists"
grep -q "Step F" orchestrator/orchestrator.md && p || f "T4.06 Step F exists"
grep -q "skills/modes/score/SKILL.md" orchestrator/orchestrator.md && p || f "T4.07 score path"
grep -q "skills/modes/fix/SKILL.md" orchestrator/orchestrator.md && p || f "T4.08 fix path"
grep -qi "lint-engine" orchestrator/orchestrator.md && p || f "T4.09 orch→lint-engine"
grep -qi "visual-reviewer" orchestrator/orchestrator.md && p || f "T4.10 orch→reviewer (score)"
grep -qi "safety-engine" orchestrator/orchestrator.md && p || f "T4.11 orch→safety (fix)"

# ═══ CROSS-TIER: Escalation Chain ═══
echo "▸ Cross-Tier: Escalation Chain"
grep -qi "score" orchestrator/lint-engine.md && p || f "T5.01 lint→score"
grep -qi "fix" orchestrator/lint-engine.md && p || f "T5.02 lint→fix"
grep -qi "loop\|doop" orchestrator/lint-engine.md && p || f "T5.03 lint→loop"
grep -qi "fix" skills/modes/score/SKILL.md && p || f "T5.04 score→fix"
grep -qi "loop\|doop" skills/modes/score/SKILL.md && p || f "T5.05 score→loop"
grep -qi "fix\|loop\|doop" skills/modes/fix/SKILL.md && p || f "T5.06 fix→loop"

# ═══ METADATA: Plugin Awareness ═══
echo "▸ Metadata: Plugin Awareness"
grep -qi "lint" CLAUDE.md && p || f "T6.01 CLAUDE.md knows lint"
grep -qi "score" CLAUDE.md && p || f "T6.02 CLAUDE.md knows score"
grep -qi "fix" CLAUDE.md && p || f "T6.03 CLAUDE.md knows fix"
grep -qi "pyramid\|4 tier" CLAUDE.md && p || f "T6.04 CLAUDE.md pyramid"
grep -qi "doop\|lint\|score" .claude-plugin/plugin.json && p || f "T6.05 plugin.json updated"

echo ""
echo "════════════════════════════════════════════"
printf "  %d passed, %d failed / %d total\n" "$PASS" "$FAIL" "$TOTAL"
echo "════════════════════════════════════════════"
[ "$FAIL" -eq 0 ] && echo "  ✅ ALL TESTS PASSING" || echo "  ❌ $FAIL FAILED"
exit $FAIL
