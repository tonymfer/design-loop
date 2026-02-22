---
name: inspiration-sources
description: "Dynamic inspiration source directory for Creative Unleash skip pipeline. Scored against project signals to produce ranked recommendations."
---

<taxonomy>
## Category Taxonomy

| Category | Description |
|----------|-------------|
| `award-winning` | Curated design excellence |
| `landing-pages` | Conversion-focused page patterns |
| `saas-product` | Software product UI |
| `minimal-clean` | Reductive, typography-driven |
| `dark-immersive` | Dark themes, depth, atmosphere |
| `indie-creative` | Personality-driven, unconventional |
| `component-integrable` | Directly installable output (MCP tools, embeds) |
</taxonomy>

<sources>
## Sources

```yaml
sources:
  - id: godly
    name: "Godly"
    url: "https://godly.website"
    categories: [award-winning, dark-immersive]
    tags: [curated, dark, immersive, 3d, animation, editorial]
    description: "Curated gallery of award-winning dark and immersive web design."
    creative_unleash_value: high
    actionable: false
    match_signals:
      personality_boost: [bold, elegant]
      personality_penalty: [minimal, corporate]
      focus_boost: [animation, depth, hero]
      dark_mode_boost: true
      framework_boost: []

  - id: land-book
    name: "Land-book"
    url: "https://land-book.com"
    categories: [landing-pages, saas-product]
    tags: [landing, product, conversion, curated]
    description: "Curated collection of landing page designs with product focus."
    creative_unleash_value: medium
    actionable: false
    match_signals:
      personality_boost: [warm, corporate, minimal]
      personality_penalty: [retro, playful]
      focus_boost: [conversion, layout, hero]
      dark_mode_boost: false
      framework_boost: []

  - id: awwwards
    name: "Awwwards"
    url: "https://www.awwwards.com"
    categories: [award-winning, indie-creative]
    tags: [award, creative, experimental, animation, portfolio]
    description: "Award-winning web design showcasing creative excellence and innovation."
    creative_unleash_value: high
    actionable: false
    match_signals:
      personality_boost: [bold, elegant, playful]
      personality_penalty: [corporate]
      focus_boost: [animation, identity, hero]
      dark_mode_boost: false
      framework_boost: []

  - id: 21st-dev
    name: "21st.dev"
    url: "https://21st.dev"
    categories: [component-integrable, saas-product]
    tags: [components, react, shadcn, tailwind, installable]
    description: "Component library with directly installable React/Tailwind components via MCP."
    creative_unleash_value: high
    actionable: true
    integration:
      type: mcp
      tool: mcp__magic__21st_magic_component_inspiration
      install_method: "Component code copied directly into project"
    match_signals:
      personality_boost: [minimal, warm, elegant]
      personality_penalty: []
      focus_boost: [components, layout, hero]
      dark_mode_boost: false
      framework_boost: [react, nextjs]

  - id: lapa-ninja
    name: "Lapa Ninja"
    url: "https://www.lapa.ninja"
    categories: [landing-pages]
    tags: [landing, curated, startup, marketing]
    description: "Curated landing page gallery with strong composition focus."
    creative_unleash_value: medium
    actionable: false
    match_signals:
      personality_boost: [warm, corporate]
      personality_penalty: [retro, bold]
      focus_boost: [composition, layout, hero]
      dark_mode_boost: false
      framework_boost: []

  - id: landingfolio
    name: "Landingfolio"
    url: "https://www.landingfolio.com"
    categories: [landing-pages, saas-product]
    tags: [landing, saas, templates, conversion, sections]
    description: "Landing page inspiration organized by section type and industry."
    creative_unleash_value: medium
    actionable: false
    match_signals:
      personality_boost: [corporate, warm]
      personality_penalty: [retro, playful]
      focus_boost: [conversion, layout, sections]
      dark_mode_boost: false
      framework_boost: []

  - id: saaslandingpage
    name: "SaaS Landing Page"
    url: "https://saaslandingpage.com"
    categories: [saas-product, landing-pages]
    tags: [saas, product, technical, pricing, features]
    description: "SaaS-specific landing page patterns with technical product focus."
    creative_unleash_value: medium
    actionable: false
    match_signals:
      personality_boost: [technical, corporate]
      personality_penalty: [playful, retro]
      focus_boost: [conversion, pricing, features]
      dark_mode_boost: false
      framework_boost: []

  - id: onepagelove
    name: "One Page Love"
    url: "https://onepagelove.com"
    categories: [landing-pages, minimal-clean]
    tags: [one-page, minimal, elegant, portfolio, storytelling]
    description: "Single-page website gallery emphasizing narrative flow and minimalism."
    creative_unleash_value: medium
    actionable: false
    match_signals:
      personality_boost: [minimal, warm, elegant]
      personality_penalty: [bold, technical]
      focus_boost: [composition, typography, storytelling]
      dark_mode_boost: false
      framework_boost: []

  - id: siteinspire
    name: "siteInspire"
    url: "https://www.siteinspire.com"
    categories: [minimal-clean, award-winning]
    tags: [minimal, editorial, typography, whitespace, curated]
    description: "Curated minimal web design with strong typographic focus."
    creative_unleash_value: high
    actionable: false
    match_signals:
      personality_boost: [minimal, elegant]
      personality_penalty: [playful, retro, bold]
      focus_boost: [typography, identity, composition]
      dark_mode_boost: false
      framework_boost: []

  - id: minimal-gallery
    name: "Minimal Gallery"
    url: "https://minimal.gallery"
    categories: [minimal-clean]
    tags: [minimal, whitespace, typography, reductive]
    description: "Reductive web design gallery celebrating whitespace and typography."
    creative_unleash_value: medium
    actionable: false
    match_signals:
      personality_boost: [minimal, elegant]
      personality_penalty: [bold, playful, retro]
      focus_boost: [typography, whitespace, identity]
      dark_mode_boost: false
      framework_boost: []

  - id: darkmodedesign
    name: "Dark Mode Design"
    url: "https://www.darkmodedesign.com"
    categories: [dark-immersive]
    tags: [dark, contrast, atmosphere, depth, night]
    description: "Dark-themed web design gallery focused on contrast and atmosphere."
    creative_unleash_value: medium
    actionable: false
    match_signals:
      personality_boost: [bold, technical]
      personality_penalty: [warm, minimal]
      focus_boost: [color, contrast, depth]
      dark_mode_boost: true
      framework_boost: []

  - id: httpster
    name: "Httpster"
    url: "https://httpster.net"
    categories: [indie-creative]
    tags: [indie, creative, retro-friendly, personality, unconventional]
    description: "Indie and creative web design with strong visual identity and personality."
    creative_unleash_value: high
    actionable: false
    match_signals:
      personality_boost: [playful, retro, bold]
      personality_penalty: [corporate]
      focus_boost: [identity, typography, color]
      dark_mode_boost: false
      framework_boost: []

  - id: spline-community
    name: "Spline Community"
    url: "https://spline.design/community"
    categories: [component-integrable, indie-creative]
    tags: [3d, interactive, embed, creative, immersive]
    description: "3D design community with embeddable interactive scenes."
    creative_unleash_value: high
    actionable: true
    integration:
      type: embed
      install_method: "@splinetool/react-spline"
      embed_pattern: '<Spline scene="{url}" />'
    match_signals:
      personality_boost: [bold, playful]
      personality_penalty: [minimal, corporate]
      focus_boost: [animation, depth, hero, identity]
      dark_mode_boost: false
      framework_boost: [react, nextjs]
```
</sources>

<scoring-reference>
## Scoring Reference

Each source is scored against project signals (max ~10 points):

| Signal | Points | Condition |
|--------|--------|-----------|
| Personality match | +1.5 per boost token | personality token in personality_boost |
| Personality mismatch | -1.0 per penalty token | personality token in personality_penalty |
| Focus match | +2.0 | FOCUS in focus_boost |
| Dark mode | +1.5 | dark_mode detected AND dark_mode_boost = true |
| Framework | +2.0 | framework in framework_boost |
| Component library synergy | +1.0 | shadcn detected AND "shadcn" in tags |
| Creative value | +0.5 high, +0.25 medium | Tiebreaker |
| Actionable bonus | +0.5 | actionable = true AND framework matches |

**Ranking rules:**
- Sort by score descending, select top 5
- Drop sources scoring < 1.0
- Ensure min 3 sources (backfill by creative_unleash_value if needed)
- Max 2 per primary category (diversity constraint)
- Always include actionable sources scoring >= 2.0
</scoring-reference>
