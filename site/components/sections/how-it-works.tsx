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
      className="border-t border-[var(--border)] py-16"
    >
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl">
            <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              How it works
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-base text-[var(--text-secondary)]">
            Four steps per iteration. Each one makes the page measurably better.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.title} delay={i * 0.08}>
                <div className="group relative rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all hover:border-[color-mix(in_srgb,var(--accent),transparent_80%)] hover:bg-[var(--surface)]">
                  <span className="font-mono text-[10px] font-bold text-[color-mix(in_srgb,var(--accent),transparent_60%)]">
                    {step.number}
                  </span>
                  <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(var(--accent-rgb),0.1)] to-[rgba(var(--accent-2-rgb),0.1)] ring-1 ring-[rgba(var(--accent-rgb),0.1)]">
                    <Icon className="h-4.5 w-4.5 text-[var(--accent)]" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                  {i < steps.length - 1 && (
                    <div className="pointer-events-none absolute -right-3 top-1/2 hidden text-[color-mix(in_srgb,var(--accent),transparent_70%)] sm:block">
                      &rarr;
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Phase strategy — inline */}
        <ScrollReveal delay={0.4}>
          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {phases.map((phase) => (
              <div
                key={phase.range}
                className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-5 py-4"
              >
                <span className="font-mono text-[10px] font-bold text-[color-mix(in_srgb,var(--accent),transparent_40%)]">
                  Iter {phase.range}
                </span>
                <p className="mt-1.5 text-sm font-semibold text-[var(--text-primary)]">
                  {phase.focus}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {phase.why}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
