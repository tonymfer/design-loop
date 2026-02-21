"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface Phase {
  range: string;
  focus: string;
  why: string;
}

const phases: Phase[] = [
  {
    range: "1\u20133",
    focus: "Spacing & Layout",
    why: "Biggest visual impact first",
  },
  {
    range: "4\u20136",
    focus: "Hierarchy & Contrast",
    why: "Typography and readability",
  },
  {
    range: "7\u20139",
    focus: "Alignment & Consistency",
    why: "Edge alignment, pattern unification",
  },
  {
    range: "10+",
    focus: "Density & Polish",
    why: "Content balance, final touches",
  },
];

export function PhaseTimeline() {
  return (
    <section className="border-t border-zinc-800/40 py-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="mb-3 font-serif text-3xl text-zinc-50 sm:text-4xl">
          <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">Structured, not random</span>
        </h2>
        <p className="mb-10 text-zinc-400">
          design-loop follows a deliberate progression — spacing first because
          layout problems cascade, typography second, alignment and polish last.
        </p>

        {/* Timeline */}
        <div className="relative ml-1.5">
          {phases.map((phase, i) => (
            <ScrollReveal key={phase.range} delay={i * 0.08}>
              <div className="flex items-start gap-5 sm:gap-7">
                {/* Dot + line column */}
                <div className="flex flex-col items-center">
                  {/* Dot */}
                  <div className="h-3 w-3 rounded-full border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_8px_rgba(6,182,212,0.3)]" />

                  {/* Line between dots (not on last) */}
                  {i < phases.length - 1 && (
                    <div className="min-h-[32px] w-px flex-1 bg-gradient-to-b from-cyan-500/40 to-zinc-800/40" />
                  )}
                </div>

                {/* Content */}
                <div className={i < phases.length - 1 ? "pb-6" : ""}>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    Iter {phase.range}
                  </span>
                  <h3 className="mt-0.5 text-base font-semibold text-zinc-100">
                    {phase.focus}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">{phase.why}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
