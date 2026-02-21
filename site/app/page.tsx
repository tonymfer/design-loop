"use client";

import { useState, useEffect, useCallback } from "react";
import { FloatingPathsBackground } from "@/components/ui/floating-paths";

const SCORES: Record<number, Record<string, number>> = {
  0: { spacing: 3, hierarchy: 2, contrast: 3, alignment: 3, density: 3, consistency: 3, touch: 3, empty: 2 },
  1: { spacing: 4, hierarchy: 3, contrast: 3, alignment: 3, density: 3, consistency: 3, touch: 3, empty: 3 },
  2: { spacing: 4, hierarchy: 4, contrast: 4, alignment: 4, density: 3, consistency: 3, touch: 4, empty: 3 },
  3: { spacing: 4, hierarchy: 4, contrast: 5, alignment: 4, density: 4, consistency: 4, touch: 4, empty: 4 },
  4: { spacing: 5, hierarchy: 5, contrast: 5, alignment: 5, density: 5, consistency: 5, touch: 5, empty: 4 },
};

const ITER_LABELS = [
  "Before (AI default)",
  "Iter 1 — Spacing",
  "Iter 2 — Hierarchy",
  "Iter 3 — Character",
  "Final — Polished",
];

const ITER_FOCUS = [
  "AI Default",
  "Spacing & Layout",
  "Hierarchy & Contrast",
  "Character & Polish",
  "Polished",
];

const BTN_LABELS = ["Before", "Iter 1", "Iter 2", "Iter 3", "Final"];

const CRITERIA = [
  { key: "spacing", icon: "■", name: "Spacing", desc: "Consistent scale (4/8/12/16/24/32px). No cramped elements. Room to breathe.", phase: 1 },
  { key: "hierarchy", icon: "▲", name: "Hierarchy", desc: "Clear visual weight order. Primary action obvious. Secondary muted.", phase: 2 },
  { key: "contrast", icon: "◉", name: "Contrast", desc: "Text readable against background. Interactive elements distinguishable.", phase: 2 },
  { key: "alignment", icon: "▦", name: "Alignment", desc: "Elements on consistent grid. No orphaned items. Edges line up.", phase: 3 },
  { key: "density", icon: "▬", name: "Density", desc: "Right amount of content per viewport. Not too sparse, not too cluttered.", phase: 4 },
  { key: "consistency", icon: "≡", name: "Consistency", desc: "Same patterns for same concepts. Colors meaningful, not random.", phase: 3 },
  { key: "touch", icon: "☞", name: "Touch Targets", desc: "Buttons and links have at least 44px touch area on mobile.", phase: 1 },
  { key: "empty", icon: "☐", name: "Empty States", desc: "Graceful when data is missing. Not broken, not blank.", phase: 4 },
];

const STEPS = [
  { num: "1", title: "Screenshot", desc: "Playwright captures the page" },
  { num: "2", title: "Measure", desc: "JS checks layout metrics" },
  { num: "3", title: "Score", desc: "8 criteria rated 1–5" },
  { num: "4", title: "Fix", desc: "Top 3 issues fixed in code" },
  { num: "5", title: "Repeat", desc: "Stop Hook loops until polished — no manual intervention" },
];

const PHASES = [
  { range: "1–3", focus: "Spacing & Layout", why: "Biggest visual impact first" },
  { range: "4–6", focus: "Hierarchy & Contrast", why: "Typography and readability" },
  { range: "7–9", focus: "Alignment & Consistency", why: "Edge alignment, pattern unification" },
  { range: "10+", focus: "Density & Polish", why: "Content balance, final touches" },
];

const FRAMEWORKS = ["Next.js", "Nuxt", "SvelteKit", "React", "Vue", "Astro", "HTML"];
const COMPONENT_LIBS = ["shadcn/ui", "Radix UI", "Chakra UI", "Material UI", "Ant Design", "DaisyUI"];

const FEATURES = [
  { num: "01", title: "Fully Autonomous", desc: "Stop Hook keeps the loop running. Claude iterates until done — no babysitting." },
  { num: "02", title: "Zero Dependencies", desc: "No API key. No npm install. Playwright auto-installed on first run." },
  { num: "03", title: "CSS Cascade Audit", desc: "Detects unlayered resets overriding Tailwind v4. Finds bugs screenshots miss." },
  { num: "04", title: "9 Frameworks", desc: "Auto-detects Next.js, Nuxt, SvelteKit, Remix, Astro, React, Vue, and more." },
  { num: "05", title: "Phase-Aware Strategy", desc: "Spacing first, hierarchy second, alignment third, polish last." },
  { num: "06", title: "Stuck Detection", desc: "Tries alternative approaches. After 3 fails, documents TODO, moves on." },
  { num: "07", title: "Wide Viewport Check", desc: "Tests at 1920px to catch centering drift invisible at standard widths." },
];

const CONTEXT_FILES = [
  "package.json",
  "tailwind.config.*",
  "CLAUDE.md",
  "globals.css / global styles",
];

const INTERVIEW_QA = [
  { q: "What is the primary purpose of this page?", a: "Marketing landing page for a developer tool" },
  { q: "Any components I should preserve?", a: "The iteration switcher in the nav" },
  { q: "Design aesthetic preference?", a: "Minimal dark editorial, technical feel" },
];

function avg(s: Record<string, number>) {
  const vals = Object.values(s);
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

export default function Home() {
  const [iter, setIter] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [navHintVisible, setNavHintVisible] = useState(true);

  const next = useCallback(() => {
    setIter((p) => (p >= 4 ? 0 : p + 1));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [playing, next]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && iter < 4) setIter(iter + 1);
      if (e.key === "ArrowLeft" && iter > 0) setIter(iter - 1);
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [iter]);

  const s = SCORES[iter];
  const score = avg(s);

  const handleIterClick = (i: number) => {
    setIter(i);
    setPlaying(false);
    setNavHintVisible(false);
  };

  return (
    <div data-iteration={iter} className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)", fontSize: "var(--b-size)", lineHeight: "var(--b-lh)" }}>
      {/* ── Sticky Nav ── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--nav-border)", padding: "10px 24px" }}
      >
        <div className="mx-auto flex max-w-[860px] items-center justify-between gap-3">
          <span className="hidden text-[11px] font-medium uppercase tracking-wider whitespace-nowrap sm:block" style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)", letterSpacing: "0.12em" }}>
            design-loop
          </span>
          <div className="flex flex-1 items-center justify-center gap-1.5">
            {navHintVisible && (
              <span className="nav-hint mr-1 hidden whitespace-nowrap text-[10px] tracking-wide lg:block" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                Try switching →
              </span>
            )}
            {!navHintVisible && (
              <span className="mr-1 hidden text-[10px] uppercase tracking-widest sm:block" style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)", letterSpacing: "0.1em" }}>
                Try it:
              </span>
            )}
            {BTN_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => handleIterClick(i)}
                className="t iter-btn cursor-pointer whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: iter === i ? 700 : 500,
                  padding: "7px 14px",
                  minHeight: "36px",
                  border: iter === i ? "2px solid var(--accent)" : "1px solid var(--border)",
                  borderRadius: "6px",
                  background: iter === i ? "var(--cta-bg)" : "transparent",
                  color: iter === i ? "var(--cta-text)" : "var(--text-m)",
                }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setPlaying(!playing)}
              className="t cursor-pointer whitespace-nowrap"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                padding: "7px 12px",
                minHeight: "36px",
                border: `1px solid ${playing ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "4px",
                background: "transparent",
                color: playing ? "var(--accent)" : "var(--text-m)",
              }}
            >
              {playing ? "⏸ Stop" : "▶ Auto"}
            </button>
          </div>
          <div className="hidden items-center gap-2.5 whitespace-nowrap sm:flex" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>
            <span className="flex items-center gap-1.5">
              <span>{score}/5</span>
              <span className="text-[10px] font-normal" style={{ color: "var(--text-m)" }}>{ITER_FOCUS[iter]}</span>
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
              <div className="score-fill h-full rounded-full" style={{ width: "var(--bar-w)", background: "var(--accent)" }} />
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-[860px] px-6">
        {/* ── Hero ── */}
        <FloatingPathsBackground position={-1} className="overflow-hidden">
          <section className="hero-stagger t relative z-10 text-center" style={{ padding: `calc(var(--sp-section) * 1.5) 0 calc(var(--sp-section) * 0.8)` }}>
            <div
              className="t mb-8 inline-block rounded-full text-[11px] font-medium uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-mono)",
                padding: "6px 16px",
                border: `1px solid var(--badge-border)`,
                color: "var(--badge-text)",
                background: "var(--badge-bg)",
                letterSpacing: "0.12em",
              }}
            >
              Claude Code Plugin
            </div>
            <h1
              className="t mx-auto mb-8 font-[800]"
              style={{
                fontSize: "var(--hero-size)",
                lineHeight: 1.08,
                color: "var(--text-h)",
                fontFamily: "var(--font-heading)",
                letterSpacing: "var(--hero-tracking, -0.02em)",
                maxWidth: "var(--hero-max-w, 640px)",
                textWrap: "balance",
              } as React.CSSProperties}
            >
              AI can code your UI.
              <br />
              But it can&apos;t <em className="accent-glow" style={{ color: "var(--accent)", fontStyle: "italic" }}>see</em> it.
            </h1>
            <p
              className="t mx-auto mb-12"
              style={{ fontSize: "var(--sub-size, calc(var(--b-size) * 1.15))", lineHeight: 1.8, color: "var(--text-m)", maxWidth: "var(--sub-max-w, 480px)", textWrap: "balance", textAlign: "center", letterSpacing: "0.01em" } as React.CSSProperties}
            >
              design-loop gives Claude eyes. Screenshot. Measure. Score. Fix.
              Repeat — fully autonomous — until your UI is polished. No
              babysitting. It loops until done.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#install"
                className="t cta-glow inline-flex items-center cursor-pointer no-underline hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--cta-font-size, 14px)",
                  fontWeight: "var(--cta-weight)",
                  padding: "var(--cta-pad)",
                  minHeight: "44px",
                  background: "var(--cta-bg)",
                  color: "var(--cta-text)",
                  borderRadius: "var(--cta-radius)",
                  border: "none",
                  letterSpacing: "0.03em",
                }}
              >
                Get Started →
              </a>
              <a
                href="#how-it-works"
                className="t inline-flex items-center cursor-pointer no-underline"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--text-m)",
                  letterSpacing: "0.02em",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "2px",
                  minHeight: "44px",
                }}
              >
                Watch it work ↓
              </a>
            </div>
            <p
              className="t mt-8"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.04em",
                color: "var(--text-m)",
              }}
            >
              Works with Next.js, Nuxt, SvelteKit, React, Vue, Astro, and more.
            </p>
          </section>
        </FloatingPathsBackground>

        {/* ── How It Works ── */}
        <Section id="how-it-works">
          <SectionHeading>How it works</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            Five steps per iteration. Each one makes the page measurably better.
          </p>
          <div
            className="t mt-[var(--sp-card)] grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-[var(--sp-gap)]"
          >
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="step-card t relative flex items-start gap-3 rounded-[var(--radius)] p-4 sm:flex-col sm:items-center sm:gap-0 sm:px-5 sm:py-7 sm:text-center"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid var(--border)`,
                  boxShadow: "var(--shadow)",
                }}
              >
                <div
                  className="t flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold sm:mb-3 sm:h-[var(--step-size)] sm:w-[var(--step-size)] sm:text-base"
                  style={{
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <h3
                    className="t mb-0.5 font-semibold sm:mb-1.5"
                    style={{ fontSize: "var(--b-size)", color: "var(--text-h)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="t mb-0 hidden sm:block" style={{ fontSize: "calc(var(--b-size) * 0.85)", color: "var(--text-m)", lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Phase-Aware Iteration ── */}
        <Section>
          <SectionHeading>Structured, not random</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            design-loop follows a deliberate progression — spacing first because layout problems cascade, typography second, alignment and polish last.
          </p>
          <div className="phase-timeline t mt-[var(--sp-card)] relative">
            {/* Continuous vertical line connecting all dots */}
            <div className="phase-line-continuous absolute" style={{ left: '5px', top: '6px', bottom: '6px', width: '2px' }} />
            {PHASES.map((phase, i) => (
              <div key={phase.range} className="phase-row t flex items-start gap-4 sm:gap-6" style={{ paddingBottom: i < PHASES.length - 1 ? "var(--sp-gap)" : 0 }}>
                <div className="phase-dot t relative z-10" />
                <div className="flex-1" style={{ paddingBottom: i < PHASES.length - 1 ? "8px" : 0 }}>
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                    <span className="t font-mono text-xs font-bold" style={{ color: "var(--accent)", minWidth: "40px" }}>
                      Iter {phase.range}
                    </span>
                    <span className="t font-semibold" style={{ color: "var(--text-h)", fontSize: "var(--b-size)" }}>
                      {phase.focus}
                    </span>
                  </div>
                  <p className="t mb-0 mt-1" style={{ fontSize: "calc(var(--b-size) * 0.88)", color: "var(--text-m)", lineHeight: 1.5 }}>
                    {phase.why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── The 8 Criteria ── */}
        <Section>
          <SectionHeading>8 design fundamentals</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            Every screenshot is scored. Every score has a reason.
          </p>
          <div
            className="t mt-[var(--sp-card)] grid"
            style={{ gridTemplateColumns: `repeat(var(--cols), 1fr)`, gap: "var(--sp-gap)" }}
          >
            {CRITERIA.map((c) => (
              <Card key={c.key} className="card-hover card-lift">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="t flex h-8 w-8 shrink-0 items-center justify-center rounded text-sm" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
                    {c.icon}
                  </span>
                  <h3 className="t mb-0 flex-1 font-semibold" style={{ fontSize: "var(--b-size)", color: "var(--text-h)" }}>
                    {c.name}
                  </h3>
                  <span className="phase-tag t">Phase {c.phase}</span>
                  <span
                    className="t font-mono text-xs font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {s[c.key]}/5
                  </span>
                </div>
                <p className="t mb-0" style={{ fontSize: "calc(var(--b-size) * 0.88)", color: "var(--text-m)", lineHeight: 1.55 }}>
                  {c.desc}
                </p>
              </Card>
            ))}
          </div>

          {/* Scorecard summary row */}
          <div
            className="scorecard-summary t mt-[var(--sp-card)] flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)]"
            style={{
              background: "var(--accent-bg)",
              border: `1px solid var(--accent)`,
              borderLeft: "4px solid var(--accent)",
              padding: "calc(var(--card-pad) * 1.1)",
              boxShadow: "0 0 20px rgba(234,179,8,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="t text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)" }}>
                {ITER_LABELS[iter]}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="t font-mono font-bold" style={{ color: "var(--accent)", fontSize: "1.3em" }}>
                {score}/5
              </span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                <div className="score-fill h-full rounded-full" style={{ width: "var(--bar-w)", background: "var(--accent)" }} />
              </div>
              {iter === 4 && <span className="polished-badge">Polished</span>}
            </div>
          </div>
        </Section>

        {/* ── Ecosystem Detection ── */}
        <Section>
          <SectionHeading>Knows your stack</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            Reads your package.json. Adapts automatically.
          </p>
          <div className="t mt-[var(--sp-card)]">
            <div className="mb-4">
              <span className="t mb-2 block text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)" }}>
                Frameworks
              </span>
              <div className="flex flex-wrap gap-2">
                {FRAMEWORKS.map((fw) => (
                  <span key={fw} className="pill t">{fw}</span>
                ))}
                <span className="pill pill-muted t">+ more</span>
              </div>
            </div>
            <div className="mb-6">
              <span className="t mb-2 block text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)" }}>
                Component Libraries
              </span>
              <div className="flex flex-wrap gap-2">
                {COMPONENT_LIBS.map((lib) => (
                  <span key={lib} className="pill t">{lib}</span>
                ))}
              </div>
            </div>
            <div className="t flex flex-col gap-3" style={{ fontSize: "calc(var(--b-size) * 0.92)" }}>
              <div className="t flex items-start gap-3 rounded-[var(--radius)]" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", padding: "var(--card-pad)" }}>
                <span style={{ color: "var(--accent)" }}>→</span>
                <span style={{ color: "var(--text)" }}>Reads your theme config, uses existing tokens — won&apos;t conflict</span>
              </div>
              <div className="t flex items-start gap-3 rounded-[var(--radius)]" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", padding: "var(--card-pad)" }}>
                <span style={{ color: "var(--accent)" }}>→</span>
                <span style={{ color: "var(--text)" }}>Framer Motion detected → uses <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.9em", color: "var(--accent)" }}>motion.*</code> components, respects <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.9em", color: "var(--accent)" }}>AnimatePresence</code></span>
              </div>
              <div className="t flex items-start gap-3 rounded-[var(--radius)]" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", padding: "var(--card-pad)" }}>
                <span style={{ color: "var(--accent)" }}>→</span>
                <span style={{ color: "var(--text)" }}>React Three Fiber detected → 3D scenes marked off-limits, only fixes 2D layer</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Context & Interview ── */}
        <Section>
          <SectionHeading>Understands before it starts</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            Scans your project. Asks smart questions. Then iterates.
          </p>
          <div className="t mt-[var(--sp-card)] grid gap-[var(--sp-gap)]" style={{ gridTemplateColumns: "repeat(var(--cols), 1fr)" }}>
            {/* Context Scan */}
            <Card>
              <h3 className="t mb-3 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)" }}>
                Context Scan
              </h3>
              <div className="context-list">
                {CONTEXT_FILES.map((file) => (
                  <div key={file} className="t flex items-center gap-2" style={{ padding: "6px 0", fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-h)" }}>
                    <span style={{ color: "var(--accent)" }}>$</span>
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Interview */}
            <Card>
              <h3 className="t mb-3 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)" }}>
                Interview
              </h3>
              <div className="interview-chat">
                {INTERVIEW_QA.map((qa, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    <div className="chat-bubble chat-q t" style={{ fontSize: "calc(var(--b-size) * 0.88)" }}>
                      {qa.q}
                    </div>
                    <div className="chat-bubble chat-a t" style={{ fontSize: "calc(var(--b-size) * 0.88)" }}>
                      {qa.a}
                    </div>
                  </div>
                ))}
              </div>
              <p className="t mt-2 mb-0" style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-m)" }}>
                CLI args skip the interview
              </p>
            </Card>
          </div>
        </Section>

        {/* ── Install + Usage ── */}
        <Section id="install">
          <SectionHeading>One command away</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            Requires{" "}
            <a href="https://docs.anthropic.com/en/docs/claude-code" style={{ color: "var(--accent)" }}>
              Claude Code
            </a>
            . Dependencies are auto-installed on first run.
          </p>
          <CodeBlock copyText="claude plugin add https://github.com/tonymfer/design-loop">
            <span style={{ color: "var(--text-h)" }}>claude plugin add https://github.com/tonymfer/design-loop</span>
          </CodeBlock>
          <p className="t" style={{ marginTop: "var(--sp-gap)", color: "var(--text)", fontWeight: 600, fontSize: "calc(var(--b-size) * 0.95)" }}>
            Usage
          </p>
          <CodeBlock copyText="/design-loop http://localhost:3000">
            <span style={{ color: "var(--text-m)" }}># Start polishing</span>
            {"\n"}
            <span style={{ color: "var(--text-h)" }}>/design-loop http://localhost:3000</span>
            {"\n\n"}
            <span style={{ color: "var(--text-m)" }}># Desktop viewport, 20 iterations</span>
            {"\n"}
            <span style={{ color: "var(--text-h)" }}>/design-loop http://localhost:3000/dashboard --viewport desktop --iterations 20</span>
            {"\n\n"}
            <span style={{ color: "var(--text-m)" }}># Test both viewports</span>
            {"\n"}
            <span style={{ color: "var(--text-h)" }}>/design-loop http://localhost:5173 --viewport both</span>
          </CodeBlock>

          {/* Skill chain tip */}
          <div
            className="skill-chain-tip t mt-[var(--sp-card)] rounded-[var(--radius)]"
            style={{
              background: "var(--accent-bg)",
              border: "1px solid var(--badge-border)",
              padding: "var(--card-pad)",
            }}
          >
            <p className="t mb-0" style={{ fontSize: "calc(var(--b-size) * 0.92)", color: "var(--text)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Pro tip</strong>
              <br />
              Use <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.9em", color: "var(--accent)" }}>frontend-design</code> → <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.9em", color: "var(--accent)" }}>design-loop</code> to get creative direction first, then iterate visually.
            </p>
          </div>
        </Section>

        {/* ── Features ── */}
        <Section>
          <SectionHeading>Features</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            Autonomous. Framework-aware. Zero setup.
          </p>
          <div className="t mt-[var(--sp-card)]">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="t flex items-baseline gap-4 sm:gap-6"
                style={{
                  padding: "var(--sp-gap) 0",
                  borderBottom: i < FEATURES.length - 1 ? `1px solid var(--border)` : "none",
                }}
              >
                <span
                  className="t shrink-0 font-mono text-xs font-bold"
                  style={{ color: "var(--accent)", minWidth: "24px" }}
                >
                  {f.num}
                </span>
                <div>
                  <span className="t font-bold" style={{ color: "var(--text-h)", fontSize: "calc(var(--b-size) * 1.05)" }}>
                    {f.title}
                  </span>
                  <span className="t" style={{ color: "var(--text-m)", marginLeft: "12px", fontSize: "calc(var(--b-size) * 0.88)", lineHeight: 1.6 }}>
                    — {f.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Final CTA ── */}
        <section
          className="final-cta t text-center"
          style={{ padding: "calc(var(--sp-section) * 1.3) 0 var(--sp-section)", borderTop: "1px solid var(--border)" }}
        >
          <h2
            className="t section-heading mb-6"
            style={{
              fontSize: "var(--h-size)",
              fontWeight: "var(--h-weight)",
              color: "var(--text-h)",
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.01em",
            }}
          >
            Stop guessing. Start measuring.
          </h2>

          <div className="t mx-auto mb-10 flex items-center justify-center gap-4" style={{ fontFamily: "var(--font-mono)", fontSize: "1.6em", fontWeight: 700 }}>
            <span style={{ color: "var(--text-m)", opacity: 0.5 }}>2.4/5</span>
            <span className="cta-progress-track" style={{ width: "160px" }}>
              <span className="cta-progress-fill t" />
            </span>
            <span style={{ color: "var(--accent)" }}>4.6/5</span>
          </div>

          <CodeBlock copyText="claude plugin add https://github.com/tonymfer/design-loop">
            <span style={{ color: "var(--text-h)" }}>claude plugin add https://github.com/tonymfer/design-loop</span>
          </CodeBlock>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/tonymfer/design-loop"
              target="_blank"
              rel="noopener noreferrer"
              className="t cta-glow inline-flex items-center cursor-pointer no-underline hover:-translate-y-0.5"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--cta-font-size, 14px)",
                fontWeight: "var(--cta-weight)",
                padding: "var(--cta-pad)",
                minHeight: "44px",
                background: "var(--cta-bg)",
                color: "var(--cta-text)",
                borderRadius: "var(--cta-radius)",
                border: "none",
                letterSpacing: "0.03em",
              }}
            >
              View on GitHub →
            </a>
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="t text-center" style={{ padding: "calc(var(--sp-section) * 1) 0", borderTop: `1px solid var(--border)` }}>
        <p className="text-sm" style={{ color: "var(--text-m)", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.02em", lineHeight: 2.2 }}>
          Built by{" "}
          <a href="https://github.com/tonymfer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600, padding: "4px 0" }}>
            tonymfer
          </a>
          {" · "}
          <a href="https://github.com/tonymfer/design-loop" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600, padding: "4px 0" }}>
            GitHub
          </a>
          {" · "}
          <span>MIT License</span>
        </p>
      </footer>
    </div>
  );
}

/* ── Shared Components ── */

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="t" style={{ padding: "var(--sp-section) 0", borderTop: `1px solid var(--border)` }}>
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="t section-heading" style={{ fontSize: "var(--h-size)", fontWeight: "var(--h-weight)", color: "var(--text-h)", marginBottom: "calc(var(--sp-gap) * 0.6)", fontFamily: "var(--font-heading)", letterSpacing: "-0.015em" }}>
      {children}
    </h2>
  );
}

function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`t ${className}`}
      style={{
        background: "var(--bg-card)",
        border: `1px solid var(--border)`,
        borderRadius: "var(--radius)",
        padding: "var(--card-pad)",
        boxShadow: "var(--shadow)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CodeBlock({ children, copyText }: { children: React.ReactNode; copyText?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!copyText) return;
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="relative">
      <pre
        className="t code-block overflow-x-auto whitespace-pre"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          lineHeight: 1.7,
          background: "var(--bg-code)",
          border: `1px solid var(--code-border)`,
          borderRadius: "var(--radius)",
          padding: "var(--card-pad)",
        }}
      >
        {children}
      </pre>
      {copyText && (
        <button
          onClick={handleCopy}
          className="copy-btn"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            padding: "10px 14px",
            minHeight: "36px",
            background: "var(--bg-card)",
            border: `1px solid var(--border)`,
            borderRadius: "3px",
            color: copied ? "var(--accent)" : "var(--text-m)",
            cursor: "pointer",
            transition: "all 200ms ease",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}
