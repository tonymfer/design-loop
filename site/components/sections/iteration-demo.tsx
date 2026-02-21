"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type CriteriaKey =
  | "spacing"
  | "hierarchy"
  | "contrast"
  | "alignment"
  | "density"
  | "consistency"
  | "touch"
  | "empty";

type Scores = Record<CriteriaKey, number>;

const SCORES: Scores[] = [
  { spacing: 3, hierarchy: 2, contrast: 3, alignment: 3, density: 3, consistency: 3, touch: 3, empty: 2 },
  { spacing: 4, hierarchy: 3, contrast: 3, alignment: 3, density: 3, consistency: 3, touch: 3, empty: 3 },
  { spacing: 4, hierarchy: 4, contrast: 4, alignment: 4, density: 3, consistency: 3, touch: 4, empty: 3 },
  { spacing: 4, hierarchy: 4, contrast: 5, alignment: 4, density: 4, consistency: 4, touch: 4, empty: 4 },
  { spacing: 5, hierarchy: 5, contrast: 5, alignment: 5, density: 5, consistency: 5, touch: 5, empty: 4 },
];

const BUTTON_LABELS = ["Before", "Iter 1", "Iter 2", "Iter 3", "Final"];

const ITERATION_LABELS = [
  "Before (AI default)",
  "Iter 1 \u2014 Spacing",
  "Iter 2 \u2014 Hierarchy & Contrast",
  "Iter 3 \u2014 Alignment & Consistency",
  "Final \u2014 Polished",
];

const CRITERIA_LABELS: Record<CriteriaKey, string> = {
  spacing: "Spacing",
  hierarchy: "Hierarchy",
  contrast: "Contrast",
  alignment: "Alignment",
  density: "Density",
  consistency: "Consistency",
  touch: "Touch targets",
  empty: "Empty states",
};

const CRITERIA_KEYS: CriteriaKey[] = [
  "spacing",
  "hierarchy",
  "contrast",
  "alignment",
  "density",
  "consistency",
  "touch",
  "empty",
];

export function IterationDemo() {
  const [iter, setIter] = useState(0);
  const [playing, setPlaying] = useState(false);

  const next = useCallback(() => {
    setIter((prev) => (prev + 1) % SCORES.length);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [playing, next]);

  const scores = SCORES[iter];

  return (
    <section className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-50">
            See it in action
          </h2>
          <p className="mt-4 max-w-xl text-zinc-400">
            Watch how each iteration improves specific criteria, building toward
            a polished result.
          </p>
        </ScrollReveal>

        <div className="mt-12 space-y-8">
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
                    "rounded-sm px-3.5 py-2 font-mono text-xs transition-colors",
                    iter === i
                      ? "border-2 border-yellow-500 bg-yellow-500 font-bold text-zinc-950"
                      : "border border-zinc-700 text-zinc-400 hover:border-yellow-500/30"
                  )}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setPlaying((p) => !p)}
                className="ml-2 flex items-center gap-1.5 rounded-sm border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-400 transition-colors hover:border-yellow-500/30 hover:text-zinc-200"
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

          {/* Score grid */}
          <ScrollReveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {CRITERIA_KEYS.map((key) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      {CRITERIA_LABELS[key]}
                    </span>
                    <span className="font-mono text-xs font-semibold text-zinc-200">
                      {scores[key]}/5
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                    <motion.div
                      className="h-full rounded-full bg-yellow-500"
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
            <div className="flex items-center justify-between rounded-sm border border-yellow-500/10 bg-yellow-500/[0.03] px-4 py-3">
              <AnimatePresence mode="wait">
                <motion.span
                  key={iter}
                  className="font-mono text-xs text-zinc-300"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {ITERATION_LABELS[iter]}
                </motion.span>
              </AnimatePresence>
              {iter === 4 && (
                <motion.span
                  className="rounded-sm bg-yellow-500 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-zinc-950"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Polished
                </motion.span>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
