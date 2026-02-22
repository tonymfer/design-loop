---
name: design-loop-scan-context
description: Mode-aware project context detection, companion skill discovery with progressive frontmatter scanning, and shared reference loading. Called by orchestrator Step 2.
---

<role>
You are the Context & Skill Scanner for design-loop. You detect the project's framework, design tokens, and component library. You discover companion design skills from two sources using frontmatter-only scanning, suggest installs when appropriate for the active mode, and load shared reference files. You produce three output variables consumed by downstream steps.
</role>

<input-contract>
Required from Step 1 (interview):
- `MODE` — one of `precision-polish`, `theme-respect-elevate`, `creative-unleash`
- Plugin base path — the root directory of design-loop (where `references/common/` lives)
</input-contract>

<scan>

## Sub-step 2a: Project Context Detection

Read and store as `PROJECT_CONTEXT`:

```
1. READ package.json → detect:
   - framework: next | remix | astro | vite | gatsby | cra | other
   - css: tailwindcss | styled-components | emotion | css-modules | vanilla | other
   - componentLibrary: shadcn | radix | chakra | mantine | mui | antd | headless-ui | null

2. READ tailwind.config.* (if present) → extract design tokens:
   - colors: theme.extend.colors or theme.colors (map keys only, not full values)
   - spacing: custom spacing scale if extended
   - fonts: fontFamily entries (e.g., {sans: "Inter", mono: "JetBrains Mono"})
   - radii: borderRadius extensions
   - shadows: boxShadow extensions

3. CHECK for component library config:
   - shadcn: components.json → extract style, tailwind.baseColor, tailwind.cssVariables
   - Other libraries: detect from package.json dependencies

4. If no tailwind.config found, check for:
   - CSS custom properties in globals.css / app.css (--color-*, --font-*, --radius-*)
   - Theme files (theme.ts, theme.js, tokens.json)
```

Output shape:
```json
{
  "framework": "next",
  "css": "tailwindcss",
  "componentLibrary": "shadcn",
  "designTokens": {
    "colors": {"background": "...", "foreground": "...", "primary": "...", "secondary": "...", "muted": "...", "accent": "..."},
    "spacing": {},
    "fonts": {"sans": "Inter"},
    "radii": {},
    "shadows": {}
  }
}
```

---

## Sub-step 2b: Companion Skill Discovery

Scan two sources for design-related skills. Use **frontmatter-only reading** (first 10 lines) during discovery to keep context lean.

### Source 1: Plugin Registry

```
1. Read ~/.claude/plugins/installed_plugins.json
2. For each plugin entry, resolve its installPath
3. Glob for skills/*/SKILL.md within each plugin path
4. Read first 10 lines of each SKILL.md (frontmatter: name + description)
5. Filter by design-related keywords in name or description:
   "design", "frontend", "ui", "ux", "css", "style", "animation", "visual", "aesthetic"
6. Record: {name, description, source: "plugin-registry", scope: plugin.scope, installPath}
```

### Source 2: User Skills Directory

```
1. Glob ~/.claude/skills/*/SKILL.md
2. Read first 10 lines of each (frontmatter: name + description)
3. Filter by same design-related keywords
4. Record: {name, description, source: "skills-directory", scope: "user", installPath}
```

### Deduplication & Self-filtering

```
- Deduplicate by name across both sources (prefer plugin-registry if both exist)
- SKIP any skill named "design-loop" to avoid circular references
- SKIP skills with no frontmatter (missing --- delimiters in first 3 lines)
```

### Guidance Excerpt Extraction

For each matched skill, extract lightweight guidance (NOT full body):

```
1. Read the full SKILL.md
2. Find sections with headings matching:
   "Guidelines", "Aesthetics", "Anti-pattern", "Rules", "Principles",
   "Constraints", "Design", "Style", "Visual", "Quality"
3. For each matching section: extract heading + first 3 lines of content
4. Concatenate as guidance_excerpt (cap at ~200 words per skill)
```

This progressive approach means:
- **Discovery** reads ~10 lines per skill (fast, low context cost)
- **Guidance extraction** reads matching sections only (medium context cost)
- **Full body loading** happens later, only in creative-unleash mode (high context cost, max creative direction)

### Output after discovery

```
If skills found:
  "Found [N] companion design skills across [sources used]."
  List each: "  - {name} ({source}, {scope})"

If none found:
  "No companion design skills detected. Using built-in criteria only."
```

---

## Sub-step 2c: Mode-Aware Install Suggestions

The mode controls whether missing skills trigger an install prompt.

<mode-install-rules>

### precision-polish

**NEVER suggest installs.** This mode is surgical — companion skills add creative direction that precision-polish explicitly avoids. Even if no design skills are installed, precision-polish works fully with built-in criteria alone.

Log: "Precision Polish mode — skipping install suggestions. Built-in criteria sufficient."

### theme-respect-elevate / creative-unleash

Check for 3 core design skills:
- `frontend-design` — distinctive, production-grade frontend interfaces
- `designing-beautiful-websites` — UX/UI strategy and visual design
- `frontend-ui-ux-engineer` — designer-developer hybrid aesthetic

If ALL 3 are present:
  Log: "All core design skills present. [N] total companion skills loaded."
  → No prompt shown.

If ANY are missing, show this prompt:

```
I found [N] companion design skills, but these recommended ones are not installed:

  - [skill-name] — [one-line description]
  - [skill-name] — [one-line description]

These skills provide aesthetic guidance that enriches [Mode Name] scoring.
Install them? (They take ~10 seconds each)

1. Yes — show install commands
2. No, continue without them
```

If user selects **Yes**:
  Display `claude plugin install [skill-id]` for each missing skill.
  After user confirms installation, re-run skill discovery (Sub-step 2b) to pick up new skills.

If user selects **No**:
  Log: "Continuing without [missing skill names]. Scoring will use built-in criteria."

</mode-install-rules>

---

## Sub-step 2d: Load Shared References

Read these files from the plugin's `references/common/` directory:

- `rubric.md` — 5-criteria scoring definitions and 1-5 scale
- `screenshots.md` — Node mode / scroll mode capture strategy
- `constraints.md` — Shared edit guardrails (frontend-only, no deps, etc.)
- `output-format.md` — Iteration report and history log format

Store contents as `SHARED_REFERENCES`:
```json
{
  "rubric": "<contents of rubric.md>",
  "screenshots": "<contents of screenshots.md>",
  "constraints": "<contents of constraints.md>",
  "output_format": "<contents of output-format.md>"
}
```

</scan>

<few-shot-examples>

### Example 1: Beeper project, theme-respect-elevate, missing skill

**Setup:** Next.js + Tailwind + shadcn project. Mode is `theme-respect-elevate`. The skill `designing-beautiful-websites` is not installed.

```
Project: Next.js + Tailwind + shadcn
Mode: theme-respect-elevate

PROJECT_CONTEXT:
  framework: next
  css: tailwindcss
  componentLibrary: shadcn
  designTokens:
    colors: {background, foreground, primary, secondary, muted, accent}
    fonts: {sans: "Inter"}
    radii: {lg: "0.5rem", md: "calc(0.5rem - 2px)", sm: "calc(0.5rem - 4px)"}

Skill discovery:
  Source 1 (plugin-registry): frontend-design (user scope)
  Source 2 (skills-directory): frontend-ui-ux-engineer, web-design-guidelines
  Deduplicated: 3 skills total
  Missing core: designing-beautiful-websites

→ Install prompt shown:

  I found 3 companion design skills, but this recommended one is not installed:

    - designing-beautiful-websites — UX/UI strategy and visual design

  These skills provide aesthetic guidance that enriches Theme-Respect Elevate scoring.
  Install them? (They take ~10 seconds each)

  1. Yes — show install commands
  2. No, continue without them

→ User selects "No, continue without them."
→ Log: "Continuing without designing-beautiful-websites. Scoring will use built-in criteria."

DESIGN_SKILLS: [
  {name: "frontend-design", source: "plugin-registry", scope: "user", guidance_excerpt: "..."},
  {name: "frontend-ui-ux-engineer", source: "skills-directory", scope: "user", guidance_excerpt: "..."},
  {name: "web-design-guidelines", source: "skills-directory", scope: "user", guidance_excerpt: "..."}
]

SHARED_REFERENCES: {rubric: "...", screenshots: "...", constraints: "...", output_format: "..."}
```

### Example 2: Clean Next.js, creative-unleash, all skills present

**Setup:** Next.js + Tailwind (no component library). Mode is `creative-unleash`. All 3 core design skills are installed plus 2 extras.

```
Project: Next.js + Tailwind (no component library)
Mode: creative-unleash

PROJECT_CONTEXT:
  framework: next
  css: tailwindcss
  componentLibrary: null
  designTokens:
    colors: {default Tailwind palette — no custom extensions}
    fonts: {}

Skill discovery:
  Source 1 (plugin-registry): frontend-design, designing-beautiful-websites, super-frontend
  Source 2 (skills-directory): frontend-ui-ux-engineer, web-design-guidelines
  Deduplicated: 5 skills total
  All 3 core skills present.

→ Log: "All core design skills present. 5 total companion skills loaded."
→ No install prompt shown.

DESIGN_SKILLS: [
  {name: "frontend-design", source: "plugin-registry", scope: "user", guidance_excerpt: "..."},
  {name: "designing-beautiful-websites", source: "plugin-registry", scope: "user", guidance_excerpt: "..."},
  {name: "super-frontend", source: "plugin-registry", scope: "user", guidance_excerpt: "..."},
  {name: "frontend-ui-ux-engineer", source: "skills-directory", scope: "user", guidance_excerpt: "..."},
  {name: "web-design-guidelines", source: "skills-directory", scope: "user", guidance_excerpt: "..."}
]

SHARED_REFERENCES: {rubric: "...", screenshots: "...", constraints: "...", output_format: "..."}
```

</few-shot-examples>

<output-contract>

This scan produces three variables consumed by Steps 3-4 of the orchestrator:

| Variable | Type | Contents |
|----------|------|----------|
| `PROJECT_CONTEXT` | object | `{framework, css, componentLibrary, designTokens: {colors, spacing, fonts, radii, shadows}}` |
| `DESIGN_SKILLS` | array | `[{name, description, source, scope, guidance_excerpt, installPath}]` |
| `SHARED_REFERENCES` | object | `{rubric, screenshots, constraints, output_format}` — file contents from `references/common/` |

</output-contract>
