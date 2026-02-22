"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIteration } from "@/lib/iteration-context";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ScoreChart } from "@/components/demo/score-chart";
import { ReportPreview } from "@/components/demo/report-preview";
import {
  getScenario,
  getArchetypesForMode,
  MODE_SHORT_LABELS,
  type ModeType,
  type MockState,
  type CriteriaKey,
} from "@/lib/demo-data";

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

const MODE_LIST: ModeType[] = [
  "precision-polish",
  "theme-respect-elevate",
  "creative-unleash",
];

/* ═══════════════════════════════════════════════
   MockPreview — mini browser skeleton that morphs
   between visual states telling the design-loop story
   ═══════════════════════════════════════════════ */

function MockPreview({ state }: { state: MockState }) {
  const s = state;
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
      {/* Browser chrome */}
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

      {/* Page content */}
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
  const {
    iteration: iter,
    setIteration: setIter,
    mode,
    setMode,
    archetype,
    setArchetype,
  } = useIteration();
  const [playing, setPlaying] = useState(false);
  const [rightTab, setRightTab] = useState<"scores" | "chart">("scores");

  const scenario = getScenario(mode, archetype);
  const archetypes = getArchetypesForMode(mode);
  const maxIter = scenario.iterations.length - 1;

  // Clamp iteration when switching scenarios with different counts
  useEffect(() => {
    if (iter > maxIter) setIter(maxIter);
  }, [scenario, iter, maxIter, setIter]);

  const safeIter = Math.min(iter, maxIter);
  const scores = scenario.iterations[safeIter].scores;
  const avg = CRITERIA_KEYS.reduce((sum, k) => sum + scores[k], 0) / CRITERIA_KEYS.length;
  const isFinal = safeIter === maxIter;

  const next = useCallback(() => {
    setIter((safeIter + 1) % scenario.iterations.length);
  }, [safeIter, setIter, scenario.iterations.length]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [playing, next]);

  return (
    <>
      <section id="iteration-demo" className="border-t border-[var(--border)] py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <ScrollReveal>
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
              <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">See it in action</span>
            </h2>
            <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
              Pick a mode and archetype. The entire page transforms.
            </p>
          </ScrollReveal>

          <div className="mt-10 space-y-6">
            {/* Mode pills */}
            <ScrollReveal delay={0.05}>
              <div className="flex gap-2">
                {MODE_LIST.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setIter(0);
                      setPlaying(false);
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1.5 font-mono text-[11px] transition-all",
                      mode === m
                        ? "bg-[var(--accent)] text-zinc-950 font-bold"
                        : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[color-mix(in_srgb,var(--accent),transparent_70%)]"
                    )}
                  >
                    {MODE_SHORT_LABELS[m]}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Archetype tabs */}
            <ScrollReveal delay={0.08}>
              <div className="flex gap-2">
                {archetypes.map((a) => (
                  <button
                    key={a.name}
                    onClick={() => {
                      setArchetype(a.name);
                      setIter(0);
                      setPlaying(false);
                    }}
                    className={cn(
                      "rounded-md px-2.5 py-1 font-mono text-[10px] transition-all",
                      archetype === a.name
                        ? "bg-[var(--surface)] text-[var(--text-primary)] border border-[color-mix(in_srgb,var(--accent),transparent_70%)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    )}
                  >
                    {a.short}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Iteration switcher buttons */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap items-center gap-2">
                {scenario.iterations.map((step, i) => (
                  <button
                    key={`${scenario.id}-${i}`}
                    onClick={() => {
                      setIter(i);
                      setPlaying(false);
                    }}
                    className={cn(
                      "rounded-lg px-3.5 py-2 font-mono text-xs transition-all",
                      safeIter === i
                        ? "border-2 border-[var(--accent)] bg-[var(--accent)] font-bold text-zinc-950"
                        : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[color-mix(in_srgb,var(--accent),transparent_70%)]"
                    )}
                  >
                    {step.label}
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

            {/* Main content: MockPreview left, Score cards / Chart right */}
            <ScrollReveal delay={0.15}>
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                {/* Mock preview */}
                <MockPreview state={scenario.mockStates[safeIter]} />

                {/* Right panel */}
                <div className="space-y-3">
                  {/* Tab switcher */}
                  <div className="flex gap-1 rounded-lg bg-[var(--surface)] p-1">
                    <button
                      onClick={() => setRightTab("scores")}
                      className={cn(
                        "flex-1 rounded-md py-1.5 font-mono text-[10px] transition-all",
                        rightTab === "scores"
                          ? "bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      )}
                    >
                      Scores
                    </button>
                    <button
                      onClick={() => setRightTab("chart")}
                      className={cn(
                        "flex-1 rounded-md py-1.5 font-mono text-[10px] transition-all",
                        rightTab === "chart"
                          ? "bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      )}
                    >
                      Chart
                    </button>
                  </div>

                  {/* Tab content */}
                  {rightTab === "scores" ? (
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
                  ) : (
                    <ScoreChart iterations={scenario.iterations} />
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Status bar */}
            <ScrollReveal delay={0.2}>
              <div className="flex items-center justify-between rounded-xl border border-[color-mix(in_srgb,var(--accent),transparent_90%)] bg-[color-mix(in_srgb,var(--accent),transparent_96%)] px-4 py-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${scenario.id}-${safeIter}`}
                    className="font-mono text-xs text-[var(--text-primary)]"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {scenario.iterations[safeIter].label} — {scenario.iterations[safeIter].focus}
                  </motion.span>
                </AnimatePresence>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    Avg: {avg.toFixed(1)}/5
                  </span>
                  {isFinal && (
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

            {/* Report preview */}
            <ScrollReveal delay={0.25}>
              <ReportPreview
                markdown={scenario.reportMarkdown}
                projectName={scenario.archetype}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Floating indicator when not on Final */}
      <AnimatePresence>
        {!isFinal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--page-bg)] px-4 py-2 shadow-2xl backdrop-blur-sm">
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                Viewing: {scenario.iterations[safeIter].label}
              </span>
              <button
                onClick={() => {
                  setIter(maxIter);
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
