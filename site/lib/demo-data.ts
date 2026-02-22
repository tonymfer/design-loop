/* ═══════════════════════════════════════════════
   Static demo data for design-loop site
   9 scenarios: 3 modes × 3 archetypes
   ═══════════════════════════════════════════════ */

export type CriteriaKey =
  | "composition"
  | "typography"
  | "color"
  | "identity"
  | "polish";

export type ModeType =
  | "precision-polish"
  | "theme-respect-elevate"
  | "creative-unleash";

export type Scores = Record<CriteriaKey, number>;

export interface IterationStep {
  label: string;
  scores: Scores;
  focus: string;
  keyFix: string;
}

export interface MockState {
  bg: string;
  navBg: string;
  dotColor: string;
  logoBg: string;
  navDotBg: string;
  heroBg: string;
  headingW: string;
  headingH: string;
  headingBg: string;
  headingRadius: string;
  subtitleW: string;
  subtitleBg: string;
  btnBg: string;
  btnW: string;
  btnRadius: string;
  btnGlow: string;
  cardBg: string;
  cardBorder: string;
  cardRadius: string;
  barBg: string;
  barAccentBg: string;
  gridCols: string;
  card3Span: string;
  card3Bg: string;
  card2ExtraPadding: string;
  accentBarBg: string;
  accentBarH: string;
  accentBarRadius: string;
}

export interface DemoScenario {
  id: string;
  mode: ModeType;
  archetype: string;
  archetypeShort: string;
  description: string;
  iterations: IterationStep[];
  mockStates: MockState[];
  reportMarkdown: string;
}

// ─────────────────────────────────────────────
// Palette-based MockState builder
// ─────────────────────────────────────────────

interface PaletteStage {
  bg: string;
  navBg: string;
  dotColor: string;
  logoBg: string;
  accent: string;
  headingBg: string;
  subtitleBg: string;
  cardBg: string;
  borderAlpha: string;
  barBg: string;
  radius: string;
  headingW: string;
  btnW: string;
  glow: string;
  gridCols: string;
  card3Span: string;
  card3Special: boolean;
  accentBarH: string;
  misaligned: boolean;
}

function buildMockState(p: PaletteStage): MockState {
  return {
    bg: p.bg,
    navBg: p.navBg,
    dotColor: p.dotColor,
    logoBg: p.logoBg,
    navDotBg: p.dotColor,
    heroBg: p.bg,
    headingW: p.headingW,
    headingH: parseInt(p.radius) <= 4 ? "10px" : "12px",
    headingBg: p.headingBg,
    headingRadius: parseInt(p.radius) <= 6 ? "3px" : "4px",
    subtitleW: `${42 + Math.floor(Math.random() * 13)}%`,
    subtitleBg: p.subtitleBg,
    btnBg: p.accent,
    btnW: p.btnW,
    btnRadius: p.radius,
    btnGlow: p.glow,
    cardBg: p.cardBg,
    cardBorder: `1px solid ${p.borderAlpha}`,
    cardRadius: p.radius,
    barBg: p.barBg,
    barAccentBg: p.accent,
    gridCols: p.gridCols,
    card3Span: p.card3Span,
    card3Bg: p.card3Special
      ? `linear-gradient(135deg, ${p.accent}15, ${p.accent}08)`
      : p.cardBg,
    card2ExtraPadding: p.misaligned ? "12px" : "8px",
    accentBarBg: p.accent,
    accentBarH: p.accentBarH,
    accentBarRadius: parseInt(p.radius) <= 6 ? "2px" : p.radius,
  };
}

function buildReport(
  project: string,
  title: string,
  iterations: IterationStep[]
): string {
  const first = iterations[0].scores;
  const last = iterations[iterations.length - 1].scores;
  const keys: CriteriaKey[] = [
    "composition",
    "typography",
    "color",
    "identity",
    "polish",
  ];
  const avg = (s: Scores) => keys.reduce((a, k) => a + s[k], 0) / 5;
  const startAvg = avg(first).toFixed(1);
  const endAvg = avg(last).toFixed(1);

  const bar = (start: number, end: number) => {
    let b = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= start) b += "\u2593";
      else if (i <= end) b += "\u2588";
      else b += "\u2591";
    }
    return b;
  };

  const labels: Record<CriteriaKey, string> = {
    composition: "Composition ",
    typography: "Typography  ",
    color: "Color       ",
    identity: "Identity    ",
    polish: "Polish      ",
  };

  const progression = keys
    .map((k) => {
      const s = first[k];
      const e = last[k];
      const delta = e - s;
      const d = delta > 0 ? `+${delta}` : delta === 0 ? "\u2014" : `${delta}`;
      return `${labels[k]} ${s}/5 ${bar(s, e)} ${e}/5  ${d}`;
    })
    .join("\n");

  return `# design-loop

> ${project} \u2014 ${title}

## Score

${startAvg} \u2192 ${endAvg} across ${iterations.length - 1} iterations

## Progression

${progression}

---
Polished with design-loop`;
}

// ─────────────────────────────────────────────
// Scenario Definitions
// ─────────────────────────────────────────────

// ── PRECISION POLISH ──────────────────────────

const PP_BEEPER: DemoScenario = {
  id: "pp-beeper",
  mode: "precision-polish",
  archetype: "Beeper",
  archetypeShort: "Chat App",
  description: "Retro pixel chat \u2014 surgical CSS fixes only",
  iterations: [
    {
      label: "Before",
      scores: { composition: 3, typography: 3, color: 4, identity: 3, polish: 3 },
      focus: "Baseline",
      keyFix: "Initial state captured",
    },
    {
      label: "Iter 1",
      scores: { composition: 4, typography: 4, color: 4, identity: 3, polish: 3 },
      focus: "Composition & Typography",
      keyFix: "Fixed heading hierarchy, nav spacing",
    },
    {
      label: "Iter 2",
      scores: { composition: 4, typography: 4, color: 4, identity: 4, polish: 4 },
      focus: "Identity & Polish",
      keyFix: "Aligned message bubbles, consistent radii",
    },
    {
      label: "Final",
      scores: { composition: 5, typography: 4, color: 5, identity: 4, polish: 5 },
      focus: "Final Polish",
      keyFix: "Pixel-perfect spacing, focus states",
    },
  ],
  mockStates: [
    buildMockState({
      bg: "#1a1a2e", navBg: "#16213e", dotColor: "#374151",
      logoBg: "#FF6B00", accent: "#FF6B00", headingBg: "#e5e5e5",
      subtitleBg: "#6b7280", cardBg: "#16213e", borderAlpha: "rgba(255,107,0,0.1)",
      barBg: "#0f3460", radius: "4px", headingW: "55%", btnW: "60px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: true,
    }),
    buildMockState({
      bg: "#1a1a2e", navBg: "#16213e", dotColor: "#374151",
      logoBg: "#FF6B00", accent: "#FF6B00", headingBg: "#f1f5f9",
      subtitleBg: "#6b7280", cardBg: "#16213e", borderAlpha: "rgba(255,107,0,0.12)",
      barBg: "#0f3460", radius: "6px", headingW: "60%", btnW: "64px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: true,
    }),
    buildMockState({
      bg: "#1a1a2e", navBg: "#16213e", dotColor: "#374151",
      logoBg: "#FF6B00", accent: "#FF6B00", headingBg: "#f1f5f9",
      subtitleBg: "#94a3b8", cardBg: "#16213e", borderAlpha: "rgba(255,107,0,0.15)",
      barBg: "#0f3460", radius: "6px", headingW: "62%", btnW: "66px",
      glow: "0 0 8px rgba(255,107,0,0.2)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#1a1a2e", navBg: "#16213e", dotColor: "#374151",
      logoBg: "#FF6B00", accent: "#FF6B00", headingBg: "#f8fafc",
      subtitleBg: "#94a3b8", cardBg: "#16213e", borderAlpha: "rgba(255,107,0,0.18)",
      barBg: "#0f3460", radius: "6px", headingW: "65%", btnW: "68px",
      glow: "0 0 12px rgba(255,107,0,0.25)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "4px", misaligned: false,
    }),
  ],
  reportMarkdown: "",
};
PP_BEEPER.reportMarkdown = buildReport("Beeper", "Precision Polish", PP_BEEPER.iterations);

const PP_DASHBOARD: DemoScenario = {
  id: "pp-dashboard",
  mode: "precision-polish",
  archetype: "Dashboard",
  archetypeShort: "Analytics",
  description: "Data dashboard \u2014 alignment and spacing fixes",
  iterations: [
    {
      label: "Before",
      scores: { composition: 3, typography: 4, color: 3, identity: 3, polish: 3 },
      focus: "Baseline",
      keyFix: "Initial state",
    },
    {
      label: "Iter 1",
      scores: { composition: 4, typography: 4, color: 4, identity: 3, polish: 4 },
      focus: "Composition & Color",
      keyFix: "Grid alignment, contrast ratios fixed",
    },
    {
      label: "Iter 2",
      scores: { composition: 4, typography: 5, color: 4, identity: 4, polish: 4 },
      focus: "Typography & Identity",
      keyFix: "Tabular nums, consistent card headers",
    },
    {
      label: "Final",
      scores: { composition: 5, typography: 5, color: 5, identity: 4, polish: 5 },
      focus: "Final Polish",
      keyFix: "Focus rings, loading states, micro-spacing",
    },
  ],
  mockStates: [
    buildMockState({
      bg: "#f8fafc", navBg: "#e2e8f0", dotColor: "#94a3b8",
      logoBg: "#3b82f6", accent: "#3b82f6", headingBg: "#1e293b",
      subtitleBg: "#64748b", cardBg: "#ffffff", borderAlpha: "rgba(226,232,240,1)",
      barBg: "#e2e8f0", radius: "4px", headingW: "50%", btnW: "56px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "2px", misaligned: true,
    }),
    buildMockState({
      bg: "#f1f5f9", navBg: "#e2e8f0", dotColor: "#94a3b8",
      logoBg: "#3b82f6", accent: "#3b82f6", headingBg: "#0f172a",
      subtitleBg: "#64748b", cardBg: "#ffffff", borderAlpha: "rgba(203,213,225,1)",
      barBg: "#e2e8f0", radius: "6px", headingW: "55%", btnW: "60px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#f1f5f9", navBg: "#e2e8f0", dotColor: "#94a3b8",
      logoBg: "#2563eb", accent: "#2563eb", headingBg: "#0f172a",
      subtitleBg: "#475569", cardBg: "#ffffff", borderAlpha: "rgba(59,130,246,0.15)",
      barBg: "#dbeafe", radius: "8px", headingW: "58%", btnW: "64px",
      glow: "0 0 8px rgba(59,130,246,0.15)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#f8fafc", navBg: "#e2e8f0", dotColor: "#94a3b8",
      logoBg: "#2563eb", accent: "#2563eb", headingBg: "#020617",
      subtitleBg: "#475569", cardBg: "#ffffff", borderAlpha: "rgba(59,130,246,0.12)",
      barBg: "#dbeafe", radius: "8px", headingW: "60%", btnW: "68px",
      glow: "0 0 12px rgba(59,130,246,0.2)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: true, accentBarH: "3px", misaligned: false,
    }),
  ],
  reportMarkdown: "",
};
PP_DASHBOARD.reportMarkdown = buildReport("Analytics Pro", "Precision Polish", PP_DASHBOARD.iterations);

const PP_BLOG: DemoScenario = {
  id: "pp-blog",
  mode: "precision-polish",
  archetype: "Blog",
  archetypeShort: "Content",
  description: "Content blog \u2014 typography and contrast fixes",
  iterations: [
    {
      label: "Before",
      scores: { composition: 4, typography: 3, color: 3, identity: 4, polish: 3 },
      focus: "Baseline",
      keyFix: "Initial state",
    },
    {
      label: "Iter 1",
      scores: { composition: 4, typography: 4, color: 4, identity: 4, polish: 4 },
      focus: "Typography & Color",
      keyFix: "Line-height, WCAG contrast",
    },
    {
      label: "Final",
      scores: { composition: 5, typography: 5, color: 5, identity: 4, polish: 5 },
      focus: "Final Polish",
      keyFix: "Prose spacing, image radii, link styles",
    },
  ],
  mockStates: [
    buildMockState({
      bg: "#fafaf9", navBg: "#f5f5f4", dotColor: "#a8a29e",
      logoBg: "#78716c", accent: "#78716c", headingBg: "#1c1917",
      subtitleBg: "#78716c", cardBg: "#ffffff", borderAlpha: "rgba(214,211,209,1)",
      barBg: "#e7e5e4", radius: "4px", headingW: "70%", btnW: "56px",
      glow: "none", gridCols: "repeat(2, 1fr)", card3Span: "span 2",
      card3Special: false, accentBarH: "2px", misaligned: false,
    }),
    buildMockState({
      bg: "#fafaf9", navBg: "#f5f5f4", dotColor: "#a8a29e",
      logoBg: "#57534e", accent: "#57534e", headingBg: "#0c0a09",
      subtitleBg: "#78716c", cardBg: "#ffffff", borderAlpha: "rgba(168,162,158,0.3)",
      barBg: "#e7e5e4", radius: "6px", headingW: "72%", btnW: "60px",
      glow: "none", gridCols: "repeat(2, 1fr)", card3Span: "span 2",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#fafaf9", navBg: "#f5f5f4", dotColor: "#a8a29e",
      logoBg: "#44403c", accent: "#44403c", headingBg: "#0c0a09",
      subtitleBg: "#57534e", cardBg: "#ffffff", borderAlpha: "rgba(120,113,108,0.2)",
      barBg: "#d6d3d1", radius: "8px", headingW: "75%", btnW: "64px",
      glow: "none", gridCols: "repeat(2, 1fr)", card3Span: "span 2",
      card3Special: true, accentBarH: "3px", misaligned: false,
    }),
  ],
  reportMarkdown: "",
};
PP_BLOG.reportMarkdown = buildReport("The Chronicle", "Precision Polish", PP_BLOG.iterations);

// ── THEME-RESPECT ELEVATE ─────────────────────

const TRE_BEEPER: DemoScenario = {
  id: "tre-beeper",
  mode: "theme-respect-elevate",
  archetype: "Beeper",
  archetypeShort: "Chat App",
  description: "Retro pixel chat \u2014 elevate within the retro identity",
  iterations: [
    {
      label: "Before",
      scores: { composition: 2, typography: 3, color: 3, identity: 3, polish: 2 },
      focus: "Baseline",
      keyFix: "Initial state",
    },
    {
      label: "Iter 1",
      scores: { composition: 3, typography: 3, color: 3, identity: 3, polish: 3 },
      focus: "Composition",
      keyFix: "Message layout rhythm, nav spacing",
    },
    {
      label: "Iter 2",
      scores: { composition: 4, typography: 4, color: 4, identity: 3, polish: 3 },
      focus: "Typography & Color",
      keyFix: "Retro font hierarchy, orange warmth",
    },
    {
      label: "Iter 3",
      scores: { composition: 4, typography: 4, color: 4, identity: 4, polish: 4 },
      focus: "Identity & Polish",
      keyFix: "Pixel art borders, CRT glow effect",
    },
    {
      label: "Final",
      scores: { composition: 5, typography: 4, color: 5, identity: 5, polish: 4 },
      focus: "Final Polish",
      keyFix: "Scanline overlay, focus states",
    },
  ],
  mockStates: [
    buildMockState({
      bg: "#1a1a2e", navBg: "#16213e", dotColor: "#4b5563",
      logoBg: "#FF6B00", accent: "#6b7280", headingBg: "#94a3b8",
      subtitleBg: "#4b5563", cardBg: "#16213e", borderAlpha: "rgba(75,85,99,0.3)",
      barBg: "#1e293b", radius: "4px", headingW: "55%", btnW: "56px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "2px", misaligned: true,
    }),
    buildMockState({
      bg: "#1a1a2e", navBg: "#16213e", dotColor: "#4b5563",
      logoBg: "#FF6B00", accent: "#FF6B00", headingBg: "#cbd5e1",
      subtitleBg: "#6b7280", cardBg: "#16213e", borderAlpha: "rgba(255,107,0,0.1)",
      barBg: "#1e293b", radius: "4px", headingW: "60%", btnW: "60px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: true,
    }),
    buildMockState({
      bg: "#0f0f23", navBg: "#0a0a1a", dotColor: "#374151",
      logoBg: "#FF6B00", accent: "#FF6B00", headingBg: "#e5e5e5",
      subtitleBg: "#6b7280", cardBg: "#0f0f23", borderAlpha: "rgba(255,107,0,0.12)",
      barBg: "#1e293b", radius: "4px", headingW: "65%", btnW: "64px",
      glow: "0 0 8px rgba(255,107,0,0.2)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#0a0a1a", navBg: "#050510", dotColor: "#374151",
      logoBg: "#FF6B00", accent: "#FF6B00", headingBg: "#f1f5f9",
      subtitleBg: "#94a3b8", cardBg: "#0a0a1a", borderAlpha: "rgba(255,107,0,0.15)",
      barBg: "#1e293b", radius: "4px", headingW: "68%", btnW: "68px",
      glow: "0 0 12px rgba(255,107,0,0.25)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: true, accentBarH: "4px", misaligned: false,
    }),
    buildMockState({
      bg: "#0a0a1a", navBg: "#050510", dotColor: "#1e293b",
      logoBg: "#FF6B00", accent: "#FF6B00", headingBg: "#f8fafc",
      subtitleBg: "#94a3b8", cardBg: "#0a0a1a", borderAlpha: "rgba(255,107,0,0.18)",
      barBg: "#1e293b", radius: "4px", headingW: "70%", btnW: "72px",
      glow: "0 0 16px rgba(255,107,0,0.3)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: true, accentBarH: "4px", misaligned: false,
    }),
  ],
  reportMarkdown: "",
};
TRE_BEEPER.reportMarkdown = buildReport("Beeper", "Theme-Respect Elevate", TRE_BEEPER.iterations);

const TRE_DASHBOARD: DemoScenario = {
  id: "tre-dashboard",
  mode: "theme-respect-elevate",
  archetype: "Dashboard",
  archetypeShort: "Analytics",
  description: "Analytics dashboard \u2014 respect material design tokens",
  iterations: [
    {
      label: "Before",
      scores: { composition: 2, typography: 3, color: 3, identity: 2, polish: 2 },
      focus: "Baseline",
      keyFix: "Initial state",
    },
    {
      label: "Iter 1",
      scores: { composition: 3, typography: 3, color: 3, identity: 3, polish: 3 },
      focus: "Composition & Identity",
      keyFix: "Card grid alignment, brand colors preserved",
    },
    {
      label: "Iter 2",
      scores: { composition: 4, typography: 4, color: 4, identity: 4, polish: 3 },
      focus: "Typography & Color",
      keyFix: "Data typography hierarchy, chart colors",
    },
    {
      label: "Final",
      scores: { composition: 4, typography: 4, color: 4, identity: 4, polish: 4 },
      focus: "Polish",
      keyFix: "Hover states, loading skeletons",
    },
  ],
  mockStates: [
    buildMockState({
      bg: "#f8fafc", navBg: "#e2e8f0", dotColor: "#94a3b8",
      logoBg: "#6366f1", accent: "#94a3b8", headingBg: "#1e293b",
      subtitleBg: "#94a3b8", cardBg: "#ffffff", borderAlpha: "rgba(226,232,240,1)",
      barBg: "#e2e8f0", radius: "4px", headingW: "50%", btnW: "56px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "2px", misaligned: true,
    }),
    buildMockState({
      bg: "#f1f5f9", navBg: "#e2e8f0", dotColor: "#94a3b8",
      logoBg: "#6366f1", accent: "#6366f1", headingBg: "#0f172a",
      subtitleBg: "#64748b", cardBg: "#ffffff", borderAlpha: "rgba(99,102,241,0.1)",
      barBg: "#e0e7ff", radius: "6px", headingW: "55%", btnW: "60px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#f1f5f9", navBg: "#e2e8f0", dotColor: "#94a3b8",
      logoBg: "#4f46e5", accent: "#4f46e5", headingBg: "#020617",
      subtitleBg: "#475569", cardBg: "#ffffff", borderAlpha: "rgba(79,70,229,0.12)",
      barBg: "#e0e7ff", radius: "8px", headingW: "60%", btnW: "64px",
      glow: "0 0 8px rgba(99,102,241,0.15)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#f8fafc", navBg: "#e2e8f0", dotColor: "#94a3b8",
      logoBg: "#4f46e5", accent: "#4f46e5", headingBg: "#020617",
      subtitleBg: "#475569", cardBg: "#ffffff", borderAlpha: "rgba(79,70,229,0.15)",
      barBg: "#e0e7ff", radius: "8px", headingW: "62%", btnW: "66px",
      glow: "0 0 12px rgba(99,102,241,0.2)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: true, accentBarH: "3px", misaligned: false,
    }),
  ],
  reportMarkdown: "",
};
TRE_DASHBOARD.reportMarkdown = buildReport("DataViz Pro", "Theme-Respect Elevate", TRE_DASHBOARD.iterations);

const TRE_ECOMMERCE: DemoScenario = {
  id: "tre-ecommerce",
  mode: "theme-respect-elevate",
  archetype: "E-commerce",
  archetypeShort: "Shop",
  description: "E-commerce storefront \u2014 brand-safe polish",
  iterations: [
    {
      label: "Before",
      scores: { composition: 3, typography: 3, color: 3, identity: 3, polish: 2 },
      focus: "Baseline",
      keyFix: "Initial state",
    },
    {
      label: "Iter 1",
      scores: { composition: 4, typography: 3, color: 4, identity: 3, polish: 3 },
      focus: "Composition & Color",
      keyFix: "Product grid spacing, brand palette warmth",
    },
    {
      label: "Iter 2",
      scores: { composition: 4, typography: 4, color: 4, identity: 4, polish: 4 },
      focus: "Typography & Identity",
      keyFix: "Price typography, brand badge placement",
    },
    {
      label: "Final",
      scores: { composition: 5, typography: 5, color: 5, identity: 4, polish: 5 },
      focus: "Final Polish",
      keyFix: "Cart badge, hover transitions, CTA glow",
    },
  ],
  mockStates: [
    buildMockState({
      bg: "#fefce8", navBg: "#fef9c3", dotColor: "#a16207",
      logoBg: "#ca8a04", accent: "#a3a3a3", headingBg: "#422006",
      subtitleBg: "#a16207", cardBg: "#fffbeb", borderAlpha: "rgba(253,224,71,0.5)",
      barBg: "#fef08a", radius: "4px", headingW: "55%", btnW: "56px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "2px", misaligned: true,
    }),
    buildMockState({
      bg: "#fffbeb", navBg: "#fef3c7", dotColor: "#a16207",
      logoBg: "#ca8a04", accent: "#ca8a04", headingBg: "#1c1917",
      subtitleBg: "#78716c", cardBg: "#ffffff", borderAlpha: "rgba(202,138,4,0.15)",
      barBg: "#fef9c3", radius: "6px", headingW: "58%", btnW: "60px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#fffbeb", navBg: "#fef3c7", dotColor: "#92400e",
      logoBg: "#b45309", accent: "#b45309", headingBg: "#0c0a09",
      subtitleBg: "#57534e", cardBg: "#ffffff", borderAlpha: "rgba(180,83,9,0.12)",
      barBg: "#fed7aa", radius: "8px", headingW: "62%", btnW: "64px",
      glow: "0 0 8px rgba(202,138,4,0.15)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#fffbeb", navBg: "#fef3c7", dotColor: "#92400e",
      logoBg: "#b45309", accent: "#b45309", headingBg: "#0c0a09",
      subtitleBg: "#57534e", cardBg: "#ffffff", borderAlpha: "rgba(180,83,9,0.15)",
      barBg: "#fed7aa", radius: "10px", headingW: "65%", btnW: "68px",
      glow: "0 0 14px rgba(202,138,4,0.2)", gridCols: "1fr 1fr", card3Span: "span 2",
      card3Special: true, accentBarH: "4px", misaligned: false,
    }),
  ],
  reportMarkdown: "",
};
TRE_ECOMMERCE.reportMarkdown = buildReport("Artisan Market", "Theme-Respect Elevate", TRE_ECOMMERCE.iterations);

// ── CREATIVE UNLEASH ──────────────────────────

const CU_BEEPER: DemoScenario = {
  id: "cu-beeper",
  mode: "creative-unleash",
  archetype: "Beeper",
  archetypeShort: "Chat App",
  description: "Retro pixel chat \u2014 full creative redesign",
  iterations: [
    {
      label: "Before",
      scores: { composition: 2, typography: 2, color: 2, identity: 2, polish: 2 },
      focus: "Baseline",
      keyFix: "Initial state",
    },
    {
      label: "Iter 1",
      scores: { composition: 3, typography: 3, color: 2, identity: 2, polish: 2 },
      focus: "Composition",
      keyFix: "Layout restructured, asymmetric grid",
    },
    {
      label: "Iter 2",
      scores: { composition: 3, typography: 3, color: 4, identity: 3, polish: 3 },
      focus: "Color & Identity",
      keyFix: "Neon orange palette, retro scanlines",
    },
    {
      label: "Iter 3",
      scores: { composition: 4, typography: 4, color: 4, identity: 4, polish: 3 },
      focus: "Typography & Polish",
      keyFix: "Pixel font headings, gradient accents",
    },
    {
      label: "Final",
      scores: { composition: 5, typography: 5, color: 5, identity: 5, polish: 5 },
      focus: "Final Polish",
      keyFix: "CRT glow, micro-animations, pixel-perfect",
    },
  ],
  mockStates: [
    buildMockState({
      bg: "#f1f5f9", navBg: "#e2e8f0", dotColor: "#94a3b8",
      logoBg: "#cbd5e1", accent: "#94a3b8", headingBg: "#94a3b8",
      subtitleBg: "#cbd5e1", cardBg: "#e2e8f0", borderAlpha: "rgba(203,213,225,1)",
      barBg: "#cbd5e1", radius: "4px", headingW: "55%", btnW: "56px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "2px", misaligned: true,
    }),
    buildMockState({
      bg: "#1a1a2e", navBg: "#16213e", dotColor: "#4b5563",
      logoBg: "#4b5563", accent: "#6b7280", headingBg: "#94a3b8",
      subtitleBg: "#4b5563", cardBg: "#16213e", borderAlpha: "rgba(75,85,99,0.3)",
      barBg: "#1e293b", radius: "6px", headingW: "62%", btnW: "60px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: true,
    }),
    buildMockState({
      bg: "#0f0f23", navBg: "#0a0a1a", dotColor: "#374151",
      logoBg: "#FF6B00", accent: "#FF6B00", headingBg: "#e5e5e5",
      subtitleBg: "#6b7280", cardBg: "#0f0f23", borderAlpha: "rgba(255,107,0,0.12)",
      barBg: "#1e293b", radius: "6px", headingW: "68%", btnW: "64px",
      glow: "0 0 10px rgba(255,107,0,0.2)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#0a0a1a", navBg: "#050510", dotColor: "#1e293b",
      logoBg: "#FF6B00", accent: "linear-gradient(135deg, #FF6B00, #FF9500)",
      headingBg: "#f1f5f9", subtitleBg: "#94a3b8", cardBg: "#0a0a1a",
      borderAlpha: "rgba(255,107,0,0.15)", barBg: "#1e293b",
      radius: "8px", headingW: "72%", btnW: "68px",
      glow: "0 0 16px rgba(255,107,0,0.3)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: true, accentBarH: "4px", misaligned: false,
    }),
    buildMockState({
      bg: "#050510", navBg: "#020208", dotColor: "#1e293b",
      logoBg: "#FF6B00", accent: "linear-gradient(135deg, #FF6B00, #FF9500)",
      headingBg: "#f8fafc", subtitleBg: "#94a3b8", cardBg: "#0a0a1a",
      borderAlpha: "rgba(255,107,0,0.2)", barBg: "#1e293b",
      radius: "10px", headingW: "75%", btnW: "76px",
      glow: "0 0 24px rgba(255,107,0,0.4), 0 0 48px rgba(255,149,0,0.15)",
      gridCols: "1fr 1fr", card3Span: "span 2",
      card3Special: true, accentBarH: "4px", misaligned: false,
    }),
  ],
  reportMarkdown: "",
};
CU_BEEPER.reportMarkdown = buildReport("Beeper", "Creative Unleash", CU_BEEPER.iterations);

const CU_PORTFOLIO: DemoScenario = {
  id: "cu-portfolio",
  mode: "creative-unleash",
  archetype: "Portfolio",
  archetypeShort: "Creative",
  description: "Creative portfolio \u2014 bold visual overhaul",
  iterations: [
    {
      label: "Before",
      scores: { composition: 2, typography: 2, color: 2, identity: 1, polish: 2 },
      focus: "Baseline",
      keyFix: "Initial state",
    },
    {
      label: "Iter 1",
      scores: { composition: 3, typography: 3, color: 2, identity: 2, polish: 2 },
      focus: "Composition",
      keyFix: "Full-bleed hero, asymmetric grid",
    },
    {
      label: "Iter 2",
      scores: { composition: 4, typography: 3, color: 3, identity: 3, polish: 3 },
      focus: "Color & Identity",
      keyFix: "Gradient accents, distinctive palette",
    },
    {
      label: "Iter 3",
      scores: { composition: 4, typography: 4, color: 4, identity: 4, polish: 3 },
      focus: "Typography",
      keyFix: "Display font pairing, size contrast",
    },
    {
      label: "Final",
      scores: { composition: 5, typography: 5, color: 5, identity: 5, polish: 4 },
      focus: "Final Polish",
      keyFix: "Scroll effects, image treatments, micro-interactions",
    },
  ],
  mockStates: [
    buildMockState({
      bg: "#ffffff", navBg: "#f3f4f6", dotColor: "#d1d5db",
      logoBg: "#9ca3af", accent: "#9ca3af", headingBg: "#6b7280",
      subtitleBg: "#d1d5db", cardBg: "#f3f4f6", borderAlpha: "rgba(229,231,235,1)",
      barBg: "#e5e7eb", radius: "4px", headingW: "50%", btnW: "52px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "2px", misaligned: true,
    }),
    buildMockState({
      bg: "#0a0a0a", navBg: "#171717", dotColor: "#404040",
      logoBg: "#525252", accent: "#a3a3a3", headingBg: "#a3a3a3",
      subtitleBg: "#525252", cardBg: "#171717", borderAlpha: "rgba(82,82,82,0.3)",
      barBg: "#262626", radius: "6px", headingW: "60%", btnW: "58px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#0a0a0a", navBg: "#171717", dotColor: "#404040",
      logoBg: "#e879f9", accent: "linear-gradient(135deg, #e879f9, #c084fc)",
      headingBg: "#e5e5e5", subtitleBg: "#737373", cardBg: "#171717",
      borderAlpha: "rgba(232,121,249,0.12)", barBg: "#262626",
      radius: "8px", headingW: "65%", btnW: "64px",
      glow: "0 0 10px rgba(232,121,249,0.15)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#0a0a0a", navBg: "#0f0f0f", dotColor: "#262626",
      logoBg: "#e879f9", accent: "linear-gradient(135deg, #e879f9, #c084fc)",
      headingBg: "#f5f5f5", subtitleBg: "#a3a3a3", cardBg: "#141414",
      borderAlpha: "rgba(232,121,249,0.15)", barBg: "#262626",
      radius: "10px", headingW: "70%", btnW: "70px",
      glow: "0 0 16px rgba(232,121,249,0.2)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: true, accentBarH: "4px", misaligned: false,
    }),
    buildMockState({
      bg: "#050505", navBg: "#0a0a0a", dotColor: "#262626",
      logoBg: "#e879f9", accent: "linear-gradient(135deg, #e879f9, #c084fc)",
      headingBg: "#fafafa", subtitleBg: "#a3a3a3", cardBg: "#111111",
      borderAlpha: "rgba(232,121,249,0.18)", barBg: "#262626",
      radius: "12px", headingW: "75%", btnW: "76px",
      glow: "0 0 24px rgba(232,121,249,0.3), 0 0 48px rgba(192,132,252,0.12)",
      gridCols: "1fr 1fr", card3Span: "span 2",
      card3Special: true, accentBarH: "4px", misaligned: false,
    }),
  ],
  reportMarkdown: "",
};
CU_PORTFOLIO.reportMarkdown = buildReport("Studio Aria", "Creative Unleash", CU_PORTFOLIO.iterations);

const CU_SAAS: DemoScenario = {
  id: "cu-saas",
  mode: "creative-unleash",
  archetype: "SaaS Landing",
  archetypeShort: "SaaS",
  description: "SaaS landing page \u2014 total visual transformation",
  iterations: [
    {
      label: "Before",
      scores: { composition: 2, typography: 2, color: 3, identity: 2, polish: 2 },
      focus: "Baseline",
      keyFix: "Initial state",
    },
    {
      label: "Iter 1",
      scores: { composition: 3, typography: 3, color: 3, identity: 2, polish: 2 },
      focus: "Composition",
      keyFix: "Hero restructure, whitespace rhythm",
    },
    {
      label: "Iter 2",
      scores: { composition: 4, typography: 3, color: 4, identity: 3, polish: 3 },
      focus: "Color & Identity",
      keyFix: "Brand gradient, feature card hierarchy",
    },
    {
      label: "Iter 3",
      scores: { composition: 4, typography: 4, color: 4, identity: 4, polish: 4 },
      focus: "Typography & Polish",
      keyFix: "Display font, testimonial cards, social proof",
    },
    {
      label: "Final",
      scores: { composition: 5, typography: 5, color: 5, identity: 5, polish: 5 },
      focus: "Final Polish",
      keyFix: "Animated gradients, hover states, CTA glow",
    },
  ],
  mockStates: [
    buildMockState({
      bg: "#f9fafb", navBg: "#f3f4f6", dotColor: "#d1d5db",
      logoBg: "#9ca3af", accent: "#6b7280", headingBg: "#374151",
      subtitleBg: "#9ca3af", cardBg: "#ffffff", borderAlpha: "rgba(229,231,235,1)",
      barBg: "#e5e7eb", radius: "4px", headingW: "55%", btnW: "56px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "2px", misaligned: true,
    }),
    buildMockState({
      bg: "#020617", navBg: "#0f172a", dotColor: "#334155",
      logoBg: "#475569", accent: "#64748b", headingBg: "#94a3b8",
      subtitleBg: "#475569", cardBg: "#0f172a", borderAlpha: "rgba(51,65,85,0.4)",
      barBg: "#1e293b", radius: "6px", headingW: "62%", btnW: "60px",
      glow: "none", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#020617", navBg: "#0f172a", dotColor: "#334155",
      logoBg: "#06b6d4", accent: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
      headingBg: "#e2e8f0", subtitleBg: "#94a3b8", cardBg: "#0f172a",
      borderAlpha: "rgba(6,182,212,0.12)", barBg: "#1e293b",
      radius: "8px", headingW: "68%", btnW: "66px",
      glow: "0 0 12px rgba(6,182,212,0.2)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: false, accentBarH: "3px", misaligned: false,
    }),
    buildMockState({
      bg: "#030712", navBg: "#0a0f1a", dotColor: "#1e293b",
      logoBg: "#06b6d4", accent: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
      headingBg: "#f1f5f9", subtitleBg: "#94a3b8", cardBg: "#0a0f1a",
      borderAlpha: "rgba(6,182,212,0.15)", barBg: "#1e293b",
      radius: "10px", headingW: "72%", btnW: "72px",
      glow: "0 0 16px rgba(6,182,212,0.3)", gridCols: "repeat(3, 1fr)", card3Span: "span 1",
      card3Special: true, accentBarH: "4px", misaligned: false,
    }),
    buildMockState({
      bg: "#030712", navBg: "#050a12", dotColor: "#1e293b",
      logoBg: "#06b6d4", accent: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
      headingBg: "#f8fafc", subtitleBg: "#a1a1aa", cardBg: "#0a0f1a",
      borderAlpha: "rgba(6,182,212,0.2)", barBg: "#1e293b",
      radius: "12px", headingW: "75%", btnW: "76px",
      glow: "0 0 24px rgba(6,182,212,0.4), 0 0 48px rgba(139,92,246,0.15)",
      gridCols: "1fr 1fr", card3Span: "span 2",
      card3Special: true, accentBarH: "4px", misaligned: false,
    }),
  ],
  reportMarkdown: "",
};
CU_SAAS.reportMarkdown = buildReport("LaunchPad", "Creative Unleash", CU_SAAS.iterations);

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────

export const SCENARIOS: DemoScenario[] = [
  PP_BEEPER,
  PP_DASHBOARD,
  PP_BLOG,
  TRE_BEEPER,
  TRE_DASHBOARD,
  TRE_ECOMMERCE,
  CU_BEEPER,
  CU_PORTFOLIO,
  CU_SAAS,
];

export function getScenario(mode: ModeType, archetype: string): DemoScenario {
  return (
    SCENARIOS.find((s) => s.mode === mode && s.archetype === archetype) ??
    SCENARIOS.find((s) => s.mode === mode)!
  );
}

export function getArchetypesForMode(mode: ModeType): { name: string; short: string }[] {
  return SCENARIOS.filter((s) => s.mode === mode).map((s) => ({
    name: s.archetype,
    short: s.archetypeShort,
  }));
}

export const MODE_LABELS: Record<ModeType, string> = {
  "precision-polish": "Precision Polish",
  "theme-respect-elevate": "Theme-Respect Elevate",
  "creative-unleash": "Creative Unleash",
};

export const MODE_SHORT_LABELS: Record<ModeType, string> = {
  "precision-polish": "PP",
  "theme-respect-elevate": "TRE",
  "creative-unleash": "CU",
};
