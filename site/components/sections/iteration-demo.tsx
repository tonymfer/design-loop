"use client";

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIteration } from "@/lib/iteration-context";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useState } from "react";

type CriteriaKey =
  | "composition"
  | "typography"
  | "color"
  | "identity"
  | "polish";

type Scores = Record<CriteriaKey, number>;

const SCORES: Scores[] = [
  { composition: 2, typography: 2, color: 3, identity: 2, polish: 2 },
  { composition: 3, typography: 3, color: 3, identity: 2, polish: 3 },
  { composition: 4, typography: 4, color: 4, identity: 3, polish: 3 },
  { composition: 4, typography: 4, color: 5, identity: 4, polish: 4 },
  { composition: 5, typography: 5, color: 5, identity: 5, polish: 5 },
];

const BUTTON_LABELS = ["Before", "Iter 1", "Iter 2", "Iter 3", "Final"];

const ITERATION_LABELS = [
  "Before (AI default)",
  "Iter 1 — Composition & Typography",
  "Iter 2 — Color & Contrast",
  "Iter 3 — Visual Identity",
  "Final — Polished",
];

const CRITERIA_LABELS: Record<CriteriaKey, string> = {
  composition: "Composition",
  typography: "Typography",
  color: "Color & Contrast",
  identity: "Visual Identity",
  polish: "Polish",
};

const CRITERIA_KEYS: CriteriaKey[] = [
  "composition",
  "typography",
  "color",
  "identity",
  "polish",
];

/* ═══════════════════════════════════════════════
   MockPreview — mini browser skeleton that morphs
   between 5 visual states telling the design-loop story
   ═══════════════════════════════════════════════ */

interface MockState {
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
  // Deliberate misalignment for state 2
  card2ExtraPadding: string;
  // Accent bar at bottom
  accentBarBg: string;
  accentBarH: string;
  accentBarRadius: string;
}

const MOCK_STATES: MockState[] = [
  // State 0 — Before: Light, bland, uniform
  {
    bg: "#f1f5f9",
    navBg: "#e2e8f0",
    dotColor: "#94a3b8",
    logoBg: "#cbd5e1",
    navDotBg: "#cbd5e1",
    heroBg: "#f1f5f9",
    headingW: "60%",
    headingH: "10px",
    headingBg: "#94a3b8",
    headingRadius: "2px",
    subtitleW: "45%",
    subtitleBg: "#cbd5e1",
    btnBg: "#94a3b8",
    btnW: "60px",
    btnRadius: "4px",
    btnGlow: "none",
    cardBg: "#e2e8f0",
    cardBorder: "1px solid #cbd5e1",
    cardRadius: "4px",
    barBg: "#cbd5e1",
    barAccentBg: "#94a3b8",
    gridCols: "repeat(3, 1fr)",
    card3Span: "span 1",
    card3Bg: "#e2e8f0",
    card2ExtraPadding: "8px",
    accentBarBg: "#cbd5e1",
    accentBarH: "3px",
    accentBarRadius: "0px",
  },
  // State 1 — Iter 1: Dark, spacing fixed, but still gray/flat
  {
    bg: "#1f2937",
    navBg: "#111827",
    dotColor: "#4b5563",
    logoBg: "#4b5563",
    navDotBg: "#374151",
    heroBg: "#1f2937",
    headingW: "70%",
    headingH: "12px",
    headingBg: "#6b7280",
    headingRadius: "3px",
    subtitleW: "50%",
    subtitleBg: "#4b5563",
    btnBg: "#6b7280",
    btnW: "64px",
    btnRadius: "6px",
    btnGlow: "none",
    cardBg: "#111827",
    cardBorder: "1px solid #374151",
    cardRadius: "6px",
    barBg: "#374151",
    barAccentBg: "#6b7280",
    gridCols: "repeat(3, 1fr)",
    card3Span: "span 1",
    card3Bg: "#111827",
    card2ExtraPadding: "8px",
    accentBarBg: "#374151",
    accentBarH: "3px",
    accentBarRadius: "2px",
  },
  // State 2 — Iter 2: Cyan appears! But one card misaligned
  {
    bg: "#0f172a",
    navBg: "#0a0f1a",
    dotColor: "#334155",
    logoBg: "#1e293b",
    navDotBg: "#1e293b",
    heroBg: "#0f172a",
    headingW: "65%",
    headingH: "12px",
    headingBg: "#94a3b8",
    headingRadius: "3px",
    subtitleW: "48%",
    subtitleBg: "#475569",
    btnBg: "#22d3ee",
    btnW: "68px",
    btnRadius: "8px",
    btnGlow: "0 0 12px rgba(34,211,238,0.3)",
    cardBg: "#0f172a",
    cardBorder: "1px solid rgba(34,211,238,0.15)",
    cardRadius: "8px",
    barBg: "#1e293b",
    barAccentBg: "#22d3ee",
    gridCols: "repeat(3, 1fr)",
    card3Span: "span 1",
    card3Bg: "#0f172a",
    card2ExtraPadding: "12px", // deliberate misalignment!
    accentBarBg: "#22d3ee",
    accentBarH: "3px",
    accentBarRadius: "2px",
  },
  // State 3 — Iter 3: Alignment fixed, gradient accent, bolder heading
  {
    bg: "#0a0f1a",
    navBg: "#060b14",
    dotColor: "#1e293b",
    logoBg: "#0e7490",
    navDotBg: "#1e293b",
    heroBg: "#0a0f1a",
    headingW: "72%",
    headingH: "14px",
    headingBg: "#e2e8f0",
    headingRadius: "4px",
    subtitleW: "52%",
    subtitleBg: "#64748b",
    btnBg: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
    btnW: "72px",
    btnRadius: "10px",
    btnGlow: "0 0 16px rgba(6,182,212,0.3)",
    cardBg: "#0c1322",
    cardBorder: "1px solid rgba(6,182,212,0.15)",
    cardRadius: "10px",
    barBg: "#1e293b",
    barAccentBg: "linear-gradient(90deg, #06b6d4, #8b5cf6)",
    gridCols: "repeat(3, 1fr)",
    card3Span: "span 1",
    card3Bg: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))",
    card2ExtraPadding: "8px", // fixed!
    accentBarBg: "linear-gradient(90deg, #06b6d4, #8b5cf6)",
    accentBarH: "3px",
    accentBarRadius: "4px",
  },
  // State 4 — Final: Polished bento, glow, asymmetric grid
  {
    bg: "#050a12",
    navBg: "#030712",
    dotColor: "#1e293b",
    logoBg: "#06b6d4",
    navDotBg: "#1e293b",
    heroBg: "#050a12",
    headingW: "75%",
    headingH: "14px",
    headingBg: "#f1f5f9",
    headingRadius: "4px",
    subtitleW: "55%",
    subtitleBg: "#64748b",
    btnBg: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
    btnW: "76px",
    btnRadius: "12px",
    btnGlow: "0 0 24px rgba(6,182,212,0.4), 0 0 48px rgba(139,92,246,0.2)",
    cardBg: "#0a0f1a",
    cardBorder: "1px solid rgba(6,182,212,0.2)",
    cardRadius: "12px",
    barBg: "#1e293b",
    barAccentBg: "linear-gradient(90deg, #06b6d4, #8b5cf6)",
    gridCols: "1fr 1fr",
    card3Span: "span 2",
    card3Bg: "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))",
    card2ExtraPadding: "8px",
    accentBarBg: "linear-gradient(90deg, #06b6d4, #8b5cf6)",
    accentBarH: "4px",
    accentBarRadius: "6px",
  },
];

function MockPreview({ iteration }: { iteration: number }) {
  const s = MOCK_STATES[iteration];
  const t = "transition-all duration-500 ease-out";

  return (
    <div
      className={cn("mock-preview-frame overflow-hidden border", t)}
      style={{
        background: s.bg,
        borderColor: s.navBg,
        borderRadius: s.cardRadius,
      }}
    >
      {/* ── Browser chrome ── */}
      <div
        className={cn("flex items-center gap-1.5 px-3 py-2", t)}
        style={{ background: s.navBg }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn("h-[6px] w-[6px] rounded-full", t)}
            style={{ background: s.dotColor }}
          />
        ))}
        <div
          className={cn("ml-auto h-[6px] rounded-sm", t)}
          style={{ width: "40px", background: s.logoBg }}
        />
      </div>

      {/* ── Page content ── */}
      <div className="px-4 pb-4 pt-3 space-y-3">
        {/* Nav mock */}
        <div className={cn("flex items-center justify-between", t)}>
          <div
            className={cn("h-[8px] w-[50px] rounded-sm", t)}
            style={{ background: s.logoBg }}
          />
          <div className="flex gap-2">
            {[28, 24, 32].map((w, i) => (
              <div
                key={i}
                className={cn("h-[5px] rounded-sm", t)}
                style={{ width: `${w}px`, background: s.navDotBg }}
              />
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="space-y-2 py-2">
          <div
            className={cn("rounded-sm", t)}
            style={{
              width: s.headingW,
              height: s.headingH,
              background: s.headingBg,
              borderRadius: s.headingRadius,
            }}
          />
          <div
            className={cn("h-[6px] rounded-sm", t)}
            style={{ width: s.subtitleW, background: s.subtitleBg }}
          />
          <div
            className={cn("mt-2", t)}
            style={{
              width: s.btnW,
              height: "18px",
              background: s.btnBg,
              borderRadius: s.btnRadius,
              boxShadow: s.btnGlow,
            }}
          />
        </div>

        {/* Card grid */}
        <div
          className={cn("gap-2", t)}
          style={{ display: "grid", gridTemplateColumns: s.gridCols }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn("space-y-1.5", t)}
              style={{
                background: i === 2 ? s.card3Bg : s.cardBg,
                border: s.cardBorder,
                borderRadius: s.cardRadius,
                padding: i === 1 ? s.card2ExtraPadding : "8px",
                gridColumn: i === 2 ? s.card3Span : "span 1",
              }}
            >
              <div
                className={cn("h-[5px] rounded-sm", t)}
                style={{ width: "60%", background: s.barAccentBg }}
              />
              <div
                className={cn("h-[4px] rounded-sm", t)}
                style={{ width: "85%", background: s.barBg }}
              />
              <div
                className={cn("h-[4px] rounded-sm", t)}
                style={{ width: "70%", background: s.barBg }}
              />
            </div>
          ))}
        </div>

        {/* Bottom accent bar */}
        <div
          className={t}
          style={{
            height: s.accentBarH,
            background: s.accentBarBg,
            borderRadius: s.accentBarRadius,
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   IterationDemo — main section
   ═══════════════════════════════════════════════ */

export function IterationDemo() {
  const { iteration: iter, setIteration: setIter } = useIteration();
  const [playing, setPlaying] = useState(false);

  const next = useCallback(() => {
    setIter(((iter + 1) % SCORES.length));
  }, [iter, setIter]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [playing, next]);

  const scores = SCORES[iter];
  const avg = CRITERIA_KEYS.reduce((sum, k) => sum + scores[k], 0) / CRITERIA_KEYS.length;

  return (
    <>
      <section className="border-t border-[var(--border)] py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <ScrollReveal>
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
              <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">See it in action</span>
            </h2>
            <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
              Click any state. The entire page transforms.
            </p>
          </ScrollReveal>

          <div className="mt-10 space-y-6">
            {/* Switcher buttons */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap items-center gap-2">
                {BUTTON_LABELS.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => {
                      setIter(i);
                      setPlaying(false);
                    }}
                    className={cn(
                      "rounded-lg px-3.5 py-2 font-mono text-xs transition-all",
                      iter === i
                        ? "border-2 border-[var(--accent)] bg-[var(--accent)] font-bold text-zinc-950"
                        : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[color-mix(in_srgb,var(--accent),transparent_70%)]"
                    )}
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="ml-2 flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--text-secondary)] transition-colors hover:border-[color-mix(in_srgb,var(--accent),transparent_70%)] hover:text-[var(--text-primary)]"
                >
                  {playing ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  {playing ? "Pause" : "Auto-play"}
                </button>
              </div>
            </ScrollReveal>

            {/* Main content: MockPreview left, Score cards right */}
            <ScrollReveal delay={0.15}>
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                {/* Mock preview */}
                <MockPreview iteration={iter} />

                {/* Score cards stacked */}
                <div className="grid gap-2 content-start">
                  {CRITERIA_KEYS.map((key) => (
                    <div key={key} className="space-y-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-secondary)]">
                          {CRITERIA_LABELS[key]}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                          {scores[key]}/5
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
                          initial={false}
                          animate={{ width: `${(scores[key] / 5) * 100}%` }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Status bar */}
            <ScrollReveal delay={0.2}>
              <div className="flex items-center justify-between rounded-xl border border-[color-mix(in_srgb,var(--accent),transparent_90%)] bg-[color-mix(in_srgb,var(--accent),transparent_96%)] px-4 py-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={iter}
                    className="font-mono text-xs text-[var(--text-primary)]"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {ITERATION_LABELS[iter]}
                  </motion.span>
                </AnimatePresence>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    Avg: {avg.toFixed(1)}/5
                  </span>
                  {iter === 4 && (
                    <motion.span
                      className="rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      Polished
                    </motion.span>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Floating indicator when not on Final */}
      <AnimatePresence>
        {iter !== 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--page-bg)] px-4 py-2 shadow-2xl backdrop-blur-sm">
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                Viewing: {BUTTON_LABELS[iter]}
              </span>
              <button
                onClick={() => {
                  setIter(4);
                  setPlaying(false);
                }}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-3 py-1 font-mono text-[10px] font-bold text-white transition-transform hover:scale-105"
              >
                <RotateCcw className="h-3 w-3" />
                Reset to Final
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
