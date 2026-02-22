"use client";

import React from "react";
import { Camera, BarChart3, Wrench, Repeat } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
}

const steps: Step[] = [
  {
    icon: Camera,
    title: "Screenshot",
    description: "Section-level captures via Playwright — semantic landmarks or scroll fallback",
    number: "01",
  },
  {
    icon: BarChart3,
    title: "Score",
    description: "5 anti-slop criteria rated 1–5 with companion skill enrichment",
    number: "02",
  },
  {
    icon: Wrench,
    title: "Fix",
    description: "Top 3 issues fixed in code, build verified between each fix",
    number: "03",
  },
  {
    icon: Repeat,
    title: "Repeat",
    description: "Loops until all criteria hit 4/5+ for two consecutive iterations",
    number: "04",
  },
];

const phases = [
  { range: "1\u20133", focus: "Composition & Typography", why: "Layout rhythm and type hierarchy first" },
  { range: "4\u20136", focus: "Color & Contrast", why: "Intentional palette, WCAG compliance" },
  { range: "7\u20139", focus: "Visual Identity", why: "Distinctive, not generated-looking" },
  { range: "10+", focus: "Polish", why: "Consistency, alignment, final details" },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-divider section-elevated py-24"
    >
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <span className="slash-motif heading-mono">The Loop</span>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl leading-[1.1]">
            <span className="bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">Four steps.</span>{" "}
            <span className="font-serif italic text-[var(--text-secondary)]">Every time.</span>
          </h2>
        </ScrollReveal>

        {/* Asymmetric step layout — alternating large/small with dramatic numbers */}
        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isWide = i === 0 || i === 3;
            return (
              <ScrollReveal
                key={step.title}
                delay={i * 0.1}
                className={isWide ? "lg:col-span-7" : "lg:col-span-5"}
              >
                <div className="group relative flex gap-5">
                  {/* Large step number — gradient shifts per step */}
                  <span className={`step-number-xl shrink-0 select-none ${i >= 2 ? "step-number-warm" : ""}`}>{step.number}</span>
                  <div className="flex flex-col justify-center">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(var(--accent-rgb),0.15)] to-[rgba(var(--accent-2-rgb),0.1)] ring-1 ring-[rgba(var(--accent-rgb),0.15)]">
                      <Icon className="h-4 w-4 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {step.description}
                    </p>
                  </div>
                  {/* Flow arrow — connects to next step */}
                  {i < 3 && (
                    <svg className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 text-[var(--accent)]" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                    </svg>
                  )}
                  {/* Loop-back arrow on last step */}
                  {i === 3 && (
                    <svg className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-[var(--accent-2)]" width="20" height="24" viewBox="0 0 20 24" fill="none">
                      <path d="M10 22V6M10 6C10 3 8 2 5 2M10 6l-3-3M10 6l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
                    </svg>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Phase strategy — horizontal timeline feel */}
        <ScrollReveal delay={0.4}>
          <div className="mt-20 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 sm:p-8">
            <span className="slash-motif heading-mono">Phase Strategy</span>
            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {phases.map((phase, i) => {
                // Color temperature progression: cool → warm across phases
                const barColors = [
                  "from-[rgba(var(--accent-rgb),0.4)] to-[rgba(var(--accent-rgb),0.1)]",
                  "from-[rgba(var(--accent-rgb),0.3)] to-[rgba(var(--accent-2-rgb),0.2)]",
                  "from-[rgba(var(--accent-2-rgb),0.4)] to-[rgba(var(--accent-2-rgb),0.1)]",
                  "from-[rgba(var(--accent-3-rgb),0.3)] to-[rgba(var(--accent-3-rgb),0.1)]",
                ];
                const labelColors = [
                  "text-[var(--accent)]",
                  "text-[var(--accent)]",
                  "text-[var(--accent-2)]",
                  "text-[var(--accent-3)]",
                ];
                return (
                <div
                  key={phase.range}
                  className="relative"
                >
                  <span className={`font-mono text-[11px] font-bold ${labelColors[i]}`}>
                    {phase.range}
                  </span>
                  <div className={`mt-1 h-0.5 w-full rounded-full bg-gradient-to-r ${barColors[i]}`} />
                  <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                    {phase.focus}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {phase.why}
                  </p>
                </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
