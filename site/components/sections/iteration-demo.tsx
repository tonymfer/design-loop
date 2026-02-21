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
  "Iter 1 \u2014 Composition & Typography",
  "Iter 2 \u2014 Color & Contrast",
  "Iter 3 \u2014 Visual Identity",
  "Final \u2014 Polished",
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

            {/* Score cards — full width */}
            <ScrollReveal delay={0.15}>
              <div className="grid gap-2 sm:grid-cols-5">
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
