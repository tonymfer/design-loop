# Reviewer Binary Evals

5 binary (pass/fail) evals for measuring reviewer accuracy. Each eval uses a specific test fixture with a known-correct answer.

## Eval Definitions

### E1: Accuracy — Does the reviewer identify the #1 issue?

For each fixture, the ground-truth #1 issue is pre-determined by the HTML comments. The reviewer PASSES if its `top_issues[0]` matches the expected category.

| Fixture                          | Ground-truth #1 issue                               | Expected criterion      |
| -------------------------------- | --------------------------------------------------- | ----------------------- |
| `eval-dashboard-ai-generic.html` | Uniform card grid, no visual personality            | Identity                |
| `eval-landing-decent.html`       | Inconsistent section padding (4rem vs 5rem vs 2rem) | Composition/Polish      |
| `eval-pricing-mixed-issues.html` | Contrast failure (#475569 on #1e293b ≈ 2.7:1)       | Color                   |
| `eval-blog-mobile-broken.html`   | No responsive grid — breaks on mobile               | Composition             |
| `eval-mobile-first-good.html`    | Minor — this page should score 4+ overall           | N/A (high score = pass) |

**Pass condition:** Top issue matches expected criterion. For eval-mobile-first-good, pass if weighted_average >= 3.8.

### E2: Actionability — Is the recommended fix specific enough to apply?

**Pass condition:** `recommended_fixes[0]` contains:

- A specific CSS property or Tailwind class (e.g., `gap-6`, `text-gray-300`, `grid-cols-1 md:grid-cols-3`)
- A file reference or element selector (e.g., "the pricing card .desc", "the blog-grid")
- NOT vague advice like "improve the spacing" or "make it more consistent"

**Test across all 5 fixtures.** Each must have actionable fix #1.

### E3: Consistency — Are scores stable across runs?

**Pass condition:** Run the reviewer 3 times on the same fixture (`eval-pricing-mixed-issues.html`). All 5 criterion scores must be within ±0.5 across all 3 runs. Weighted average must be within ±0.3.

This eval tests whether the reviewer has enough anchoring to produce stable scores.

### E4: Anti-inflation — Does the reviewer score AI-generic designs < 4 on Identity?

**Test fixtures (all in `tests/fixtures/`):**

- `eval-dashboard-ai-generic.html` — purple sidebar, uniform cards, Inter font → Identity MUST be < 4
- `eval-pricing-mixed-issues.html` — dark theme pricing with generic layout → Identity MUST be < 4

**Pass condition:** Identity raw score < 4 for both fixtures. If either scores 4+, the reviewer has score inflation.

### E5: Defect Detection — Does the reviewer catch rendering defects?

**Test fixture:** `eval-pricing-mixed-issues.html` — has intentional CLIPPED_TEXT (FAQ answers with `max-height: 3.2em; overflow: hidden`) and contrast failures.

**Pass condition:**

- Reviewer mentions at least one rendering defect by name (SOLID_BLOCK, CLIPPED_TEXT, etc.)
- Polish score is capped at 2/5 (per rubric rules)

## Running Evals

These evals are designed to be run manually or via the autoresearch skill:

```
1. Serve a fixture: python3 -m http.server 8888
2. Run /design-score http://localhost:8888/tests/fixtures/{fixture}.html
3. Compare output to eval criteria above
4. Record PASS/FAIL per eval
```

For autoresearch integration:

- Baseline: run all 5 evals on current reviewer.md → record pass rate
- Mutate: change one section of reviewer.md
- Re-eval: run all 5 evals again
- Keep if pass rate improved, discard if not
- Repeat until 90%+ (4.5/5 evals pass)

## Current Expected Weaknesses (pre-improvement)

Based on analysis of the current reviewer prompt:

1. **E3 likely fails** — The reviewer has no explicit anchoring examples. Scores depend on the model's interpretation of "3 vs 4" which varies run-to-run.
2. **E4 likely fails** — The reviewer doesn't have strong enough anti-inflation guidance. "AI-generic" isn't precisely defined.
3. **E2 may fail** — The reviewer says "Be specific" but doesn't show what specific looks like in enough detail.
