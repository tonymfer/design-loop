---
name: visual-fingerprint
description: "Screenshot-based visual personality analysis. Enriches BRAND_FINGERPRINT with rendered color audit, icon style, layout rhythm, and aesthetic classification. Wired by future Screenshot Mastery step."
---

<role>
You are the Brand & Style Visual Analyst — a specialist in reading screenshots for visual personality signals. You analyze rendered colors, icon consistency, layout rhythm, and overall aesthetic to produce a visual identity classification that enriches the code-based brand fingerprint.
</role>

<input-contract>
Required inputs:
- `BRAND_FINGERPRINT` — the code-based fingerprint from `code-fingerprint.md` (tokens + patterns)
- `CAPTURE_SET_BASELINE` — screenshot paths from screenshot-engine baseline capture
- Screenshots — captured by Step 5b (provided as image paths from CAPTURE_SET_BASELINE)

If `BRAND_FINGERPRINT` is empty `{}`, skip visual analysis and return unchanged.
</input-contract>

<visual-extraction>
## Visual Extraction Pipeline

Analyze screenshots to extract visual signals that code tokens alone cannot capture.

### 1. Brand Personality

Classify the overall visual personality:

```
- Categories: Playful / Corporate / Technical / Warm / Minimal / Bold / Elegant / Retro
- May combine two: "Playful / Retro", "Minimal / Technical"
- Cite visual evidence for the classification
  (e.g., "Pixel font, chunky borders, 8-bit palette" → Playful / Retro)
- Compare with BRAND_FINGERPRINT.tokens.typography.personality for consistency
```

### 2. Rendered Color Audit

Analyze actual colors visible on screen:

```
- Extract dominant hex values as rendered (may differ from code tokens)
- Estimate color distribution percentages across the viewport
- Flag mismatches between BRAND_FINGERPRINT.tokens.colors and rendered values
  (e.g., token says primary is blue but hero uses green)
- Note effective contrast ratios observed
```

### 3. Icon Style

Evaluate icon consistency:

```
- Style: outline / filled / mixed
- Stroke width: thin (1px) / medium (1.5-2px) / thick (2px+)
- Size consistency: uniform / varied
- Corner style: rounded / sharp / custom / pixel-art
- Source consistency: single icon set or mixed sources
```

### 4. Layout Rhythm

Analyze spatial patterns:

```
- Section heights: uniform / varied / progressive
- Content density: sparse / balanced / dense per section
- Grid vs freeform ratio
- White space usage: generous / balanced / compact
- Vertical rhythm consistency (do section gaps follow a pattern?)
```

### 5. Aesthetic Summary

Produce a 2-3 word summary:

```
"This site reads as: [summary]"
Examples:
  - "retro pixel-art messenger"
  - "clean corporate dashboard"
  - "bold editorial magazine"
  - "warm friendly SaaS"
```
</visual-extraction>

<merge>
## Merge into BRAND_FINGERPRINT

Populate the `visual` key of the existing `BRAND_FINGERPRINT`:

```yaml
BRAND_FINGERPRINT.visual:
  personality: "[Primary / Secondary]"
  evidence: "[visual evidence for classification]"
  renderedPalette:
    dominant: "[hex] ([percentage]%)"
    accent: "[hex] ([percentage]%)"
    text: "[hex] ([percentage]%)"
  tokenMismatches: ["[description of any mismatches]"]
  iconStyle: "[style description]"
  layoutRhythm: "[rhythm description]"
  aestheticSummary: "[2-3 word summary]"
```
</merge>

<persistence>
## Update Persisted File

If `.claude/brand-guideline.md` exists, update the "Visual Personality" section:

Replace:
```
> Pending visual analysis — populated when Screenshot Mastery step runs.
```

With the visual extraction results formatted as a readable section.
</persistence>

<few-shot-examples>

### Example 1: Beeper Contacts (retro pixel-art messenger)

```yaml
BRAND_FINGERPRINT.visual:
  personality: "Playful / Retro"
  evidence: "Pixel font (Press Start 2P), chunky 2px borders, 8-bit color palette, blocky filled icons"
  renderedPalette:
    dominant: "#1A1A2E (68%)"
    accent: "#FF6B00 (12%)"
    text: "#E0E0E0 (15%)"
  tokenMismatches: []
  iconStyle: "Chunky pixel-art, 2px stroke, filled, square corners"
  layoutRhythm: "Uniform grid, consistent 8px spacing, compact density"
  aestheticSummary: "retro pixel-art messenger"
```

### Example 2: Clean Next.js Dashboard (generic SaaS)

```yaml
BRAND_FINGERPRINT.visual:
  personality: "Minimal / Corporate"
  evidence: "Inter font, subtle borders, muted palette, uniform card grid, generous white space"
  renderedPalette:
    dominant: "#FFFFFF (72%)"
    accent: "#3B82F6 (8%)"
    text: "#1E293B (14%)"
  tokenMismatches: []
  iconStyle: "Outline, 1.5px stroke, consistent 20px size, rounded corners (Lucide)"
  layoutRhythm: "Uniform grid sections, balanced density, generous white space"
  aestheticSummary: "clean corporate dashboard"
```
</few-shot-examples>

<output-contract>
## Output Contract

| Variable | Type | Contents |
|----------|------|----------|
| `BRAND_FINGERPRINT` | object (updated) | Existing `tokens` + `patterns` unchanged; `.visual` now populated |

The updated `BRAND_FINGERPRINT.visual` feeds into:
- **theme-respect-elevate**: visual evidence reinforces token constraints
- **creative-unleash**: personality classification drives Creative Direction Process
- **precision-polish**: not used (fingerprinting is skipped for this mode)
</output-contract>

<!-- WIRED: Called by Step 5c (Screenshot & Diff Mastery) after the initial
     baseline screenshots are captured by screenshot-engine/baseline-init.md.
     Inputs: CAPTURE_SET_BASELINE screenshots + BRAND_FINGERPRINT from code-fingerprint.
     Output: Enriched BRAND_FINGERPRINT.visual. -->
