"use client";

import { useState, useEffect, useCallback } from "react";

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

const BTN_LABELS = ["Before", "Iter 1", "Iter 2", "Iter 3", "Final"];

const CRITERIA = [
  { key: "spacing", icon: "■", name: "Spacing", desc: "Consistent scale (4/8/12/16/24/32px). No cramped elements. Room to breathe." },
  { key: "hierarchy", icon: "▲", name: "Hierarchy", desc: "Clear visual weight order. Primary action obvious. Secondary muted." },
  { key: "contrast", icon: "◉", name: "Contrast", desc: "Text readable against background. Interactive elements distinguishable." },
  { key: "alignment", icon: "▦", name: "Alignment", desc: "Elements on consistent grid. No orphaned items. Edges line up." },
  { key: "density", icon: "▬", name: "Density", desc: "Right amount of content per viewport. Not too sparse, not too cluttered." },
  { key: "consistency", icon: "≡", name: "Consistency", desc: "Same patterns for same concepts. Colors meaningful, not random." },
  { key: "touch", icon: "☞", name: "Touch Targets", desc: "Buttons and links have at least 44px touch area on mobile." },
  { key: "empty", icon: "☐", name: "Empty States", desc: "Graceful when data is missing. Not broken, not blank." },
];

const STEPS = [
  { num: "1", title: "Screenshot", desc: "Playwright captures the page" },
  { num: "2", title: "Measure", desc: "JS checks layout metrics" },
  { num: "3", title: "Score", desc: "8 criteria rated 1–5" },
  { num: "4", title: "Fix", desc: "Top 3 issues fixed in code" },
  { num: "5", title: "Repeat", desc: "Loop until polished" },
];

const FEATURES = [
  { num: "01", title: "Standalone", desc: "Zero dependencies. Native iteration engine — no external scoring service or API." },
  { num: "02", title: "CSS Cascade Audit", desc: "Detects unlayered resets overriding Tailwind v4 utilities. Catches specificity conflicts." },
  { num: "03", title: "9 Frameworks", desc: "Auto-detects Next.js, Vite, Remix, Astro, SvelteKit, and more from package.json." },
  { num: "04", title: "Stuck Detection", desc: "Detects score plateaus and rotates strategies — skips what's working, focuses on what's not." },
];

function avg(s: Record<string, number>) {
  const vals = Object.values(s);
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

export default function Home() {
  const [iter, setIter] = useState(4);
  const [playing, setPlaying] = useState(false);

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

  return (
    <div data-iteration={iter} className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)", fontSize: "var(--b-size)", lineHeight: "var(--b-lh)" }}>
      {/* ── Switcher Bar ── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--nav-border)", padding: "12px 24px" }}
      >
        <div className="mx-auto flex max-w-[860px] flex-wrap items-center justify-between gap-3">
          <span className="hidden text-[11px] font-medium uppercase tracking-wider whitespace-nowrap sm:block" style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)", letterSpacing: "0.12em" }}>
            design-loop
          </span>
          <div className="flex flex-1 flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="mr-1 hidden text-[10px] uppercase tracking-widest sm:block" style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)", letterSpacing: "0.1em" }}>
              Try it:
            </span>
            {BTN_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => { setIter(i); setPlaying(false); }}
                className="t iter-btn cursor-pointer whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  fontWeight: iter === i ? 700 : 500,
                  padding: "8px 18px",
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
                fontSize: "12px",
                padding: "7px 14px",
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
            <span>{score}/5</span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
              <div className="score-fill h-full rounded-full" style={{ width: "var(--bar-w)", background: "var(--accent)" }} />
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-[860px] px-6">
        {/* ── Hero ── */}
        <section className="hero-stagger t text-center" style={{ padding: `calc(var(--sp-section) * 1.2) 0 calc(var(--sp-section) * 0.6)` }}>
          <div
            className="t mb-6 inline-block rounded-full text-[11px] font-medium uppercase tracking-widest"
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
            className="t mx-auto mb-6 font-[800]"
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
            className="t mx-auto mb-10"
            style={{ fontSize: "var(--sub-size, calc(var(--b-size) * 1.15))", lineHeight: 1.7, color: "var(--text-m)", maxWidth: "var(--sub-max-w, 480px)", textWrap: "balance", textAlign: "center" } as React.CSSProperties}
          >
            design-loop gives Claude eyes. It screenshots your page,
            measures layout metrics, scores against 8 design criteria,
            fixes the issues, and repeats — autonomously — until your UI
            is polished.
          </p>
          <a
            href="https://github.com/tonymfer/design-loop"
            target="_blank"
            rel="noopener noreferrer"
            className="t cta-glow inline-block cursor-pointer no-underline hover:-translate-y-0.5"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--cta-font-size, 14px)",
              fontWeight: "var(--cta-weight)",
              padding: "var(--cta-pad)",
              background: "var(--cta-bg)",
              color: "var(--cta-text)",
              borderRadius: "var(--cta-radius)",
              border: "none",
              letterSpacing: "0.03em",
            }}
          >
            Install Plugin →
          </a>
          <p
            className="rhythm-text t mt-8"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              letterSpacing: "0.08em",
              color: "var(--text-m)",
            }}
          >
            Screenshot. Measure. Score. Fix. Repeat.
          </p>
        </section>

        {/* ── How it works ── */}
        <Section>
          <SectionHeading>How it works</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            Five steps, repeated until every criterion scores 4/5 or higher.
          </p>
          <div
            className="t mt-[var(--sp-card)] grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-[var(--sp-gap)]"
          >
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="step-card t relative flex items-start gap-3 rounded-[var(--radius)] p-4 sm:flex-col sm:items-center sm:gap-0 sm:p-5 sm:text-center"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid var(--border)`,
                  boxShadow: "var(--shadow)",
                }}
              >
                <div
                  className="t flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold sm:mb-2.5 sm:h-[var(--step-size)] sm:w-[var(--step-size)] sm:text-base"
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

        {/* ── Install ── */}
        <Section>
          <SectionHeading>Install</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            One command. Requires{" "}
            <a href="https://docs.anthropic.com/en/docs/claude-code" style={{ color: "var(--accent)" }}>
              Claude Code
            </a>
            . Dependencies are auto-installed on first run.
          </p>
          <CodeBlock copyText="claude plugin add https://github.com/tonymfer/design-loop">
            <span style={{ color: "var(--text-h)" }}>claude plugin add https://github.com/tonymfer/design-loop</span>
          </CodeBlock>
          <p className="t" style={{ marginTop: "var(--sp-gap)", color: "var(--text)" }}>
            Then in any project:
          </p>
          <CodeBlock copyText="/design-loop http://localhost:3000">
            <span style={{ color: "var(--text-m)" }}># Start polishing</span>
            {"\n"}
            <span style={{ color: "var(--text-h)" }}>/design-loop http://localhost:3000</span>
            {"\n\n"}
            <span style={{ color: "var(--text-m)" }}># With viewport and iteration limit</span>
            {"\n"}
            <span style={{ color: "var(--text-h)" }}>/design-loop http://localhost:3000 desktop 20</span>
          </CodeBlock>
        </Section>

        {/* ── The 8 Criteria ── */}
        <Section>
          <SectionHeading>The 8 Criteria</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            Every screenshot is scored against these design fundamentals.
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
        </Section>

        {/* ── Pull Quote ── */}
        <Section>
          <div className="pull-quote" style={{ padding: "var(--sp-gap) 0 var(--sp-gap) 20px" }}>
            <p
              className="t mb-0"
              style={{
                fontSize: "var(--h-size)",
                fontFamily: "var(--font-heading)",
                fontWeight: "var(--h-weight)",
                fontStyle: "italic",
                color: "var(--text-h)",
                lineHeight: 1.5,
              }}
            >
              A screenshot shows you pixels. It doesn&apos;t show you a
              CSS reset fighting your spacing system, or a centered layout
              that drifts at 1920px.
            </p>
            <p
              className="t mt-3 mb-0"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--text-m)",
                letterSpacing: "0.04em",
              }}
            >
              — That&apos;s why design-loop measures, not just looks.
            </p>
          </div>
        </Section>

        {/* ── Features ── */}
        <Section>
          <SectionHeading>Features</SectionHeading>
          <p className="t" style={{ color: "var(--text-m)", marginBottom: "var(--sp-gap)" }}>
            Standalone. Smarter. Framework-aware.
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
                  <span className="t font-semibold" style={{ color: "var(--text-h)" }}>
                    {f.title}
                  </span>
                  <span className="t" style={{ color: "var(--text-m)", marginLeft: "8px", fontSize: "calc(var(--b-size) * 0.88)" }}>
                    — {f.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Live Demo ── */}
        <Section>
          <SectionHeading>Live Demo</SectionHeading>
          <div
            className="t rounded-[var(--radius)] text-center"
            style={{
              background: "var(--accent-bg)",
              border: `1px solid var(--badge-border)`,
              padding: "clamp(20px, 4vw, 32px) clamp(16px, 3vw, 28px)",
            }}
          >
            <p className="t mb-0 text-sm font-semibold sm:text-base" style={{ color: "var(--accent)", lineHeight: 1.6 }}>
              You&apos;re looking at it. Click the iteration buttons above and
              watch this page transform. That&apos;s design-loop polishing its
              own landing page.
            </p>
          </div>

          {/* Scorecard */}
          <Card className="mt-[var(--sp-card)]">
            <h3
              className="t mb-3 text-xs font-medium uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-m)" }}
            >
              Scorecard — {ITER_LABELS[iter]}
            </h3>
            {CRITERIA.map((c) => {
              const delta = s[c.key] - SCORES[0][c.key];
              return (
                <div
                  key={c.key}
                  className="t flex items-center justify-between"
                  style={{
                    padding: "8px 0",
                    borderBottom: `1px solid var(--border)`,
                    fontSize: "calc(var(--b-size) * 0.9)",
                  }}
                >
                  <span style={{ color: "var(--text)" }}>{c.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent)" }}>
                    {s[c.key]}/5
                    {delta > 0 && <span className="score-up">+{delta}</span>}
                  </span>
                </div>
              );
            })}
            <div
              className="t mt-1 flex items-center justify-between pt-2.5 font-bold"
              style={{ borderTop: `2px solid var(--accent)`, color: "var(--text-h)" }}
            >
              <span>Average</span>
              <span className="flex items-center gap-2" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: "1.2em" }}>
                {score}/5
                {iter === 4 && <span className="polished-badge">Polished</span>}
              </span>
            </div>
          </Card>
        </Section>

      </div>

      {/* ── Footer ── */}
      <footer className="t text-center" style={{ padding: "calc(var(--sp-section) * 0.75) 0", borderTop: `1px solid var(--border)` }}>
        <p className="text-sm" style={{ color: "var(--text-m)", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.02em" }}>
          Built by{" "}
          <a href="https://github.com/tonymfer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            tonymfer
          </a>
          {" · "}
          <a href="https://github.com/tonymfer/design-loop" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
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

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="t" style={{ padding: "var(--sp-section) 0", borderTop: `1px solid var(--border)` }}>
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="t section-heading" style={{ fontSize: "var(--h-size)", fontWeight: "var(--h-weight)", color: "var(--text-h)", marginBottom: "var(--sp-gap)", fontFamily: "var(--font-heading)", letterSpacing: "-0.01em" }}>
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
            fontSize: "10px",
            padding: "4px 8px",
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
