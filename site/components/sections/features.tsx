"use client";

import React from "react";
import {
  Zap,
  Package,
  Layers,
  Target,
  RotateCcw,
  Monitor,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: boolean;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Fully Autonomous",
    description:
      "Stop Hook keeps the loop running. Claude iterates until done \u2014 no babysitting.",
    highlight: true,
  },
  {
    icon: Package,
    title: "Zero Dependencies",
    description:
      "No API key. No npm install. Reads your theme config and existing tokens \u2014 won\u2019t conflict.",
  },
  {
    icon: Layers,
    title: "CSS Cascade Audit",
    description:
      "Detects unlayered resets overriding Tailwind v4. Finds bugs screenshots miss.",
  },
  {
    icon: Monitor,
    title: "Section Screenshots",
    description:
      "Semantic landmark detection with scroll fallback. Not just a full-page blob.",
  },
  {
    icon: Target,
    title: "Adaptive Strategy",
    description:
      "Prioritizes highest-impact issues. Adapts focus as scores improve.",
    highlight: true,
  },
  {
    icon: RotateCcw,
    title: "Stuck Detection",
    description:
      "Tries alternative approaches. After 3 fails, documents TODO, moves on.",
  },
];

export function Features() {
  return (
    <section className="section-divider section-elevated py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <span className="slash-motif heading-mono">Capabilities</span>
          <h2 className="mt-3 font-serif text-3xl italic sm:text-4xl lg:text-5xl text-[var(--text-primary)]">
            Built for the loop
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)]">
            Autonomous. Framework-aware. Zero setup.
          </p>
        </ScrollReveal>

        {/* Bento layout — hero feature spans full width, rest asymmetric */}
        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* Hero feature — full width banner with animated glow cycle */}
          <ScrollReveal className="lg:col-span-12">
            <div className="glow-card glow-cycle group relative overflow-hidden rounded-2xl border border-[rgba(var(--accent-rgb),0.25)] bg-gradient-to-br from-[rgba(var(--accent-rgb),0.1)] via-[rgba(var(--accent-2-rgb),0.05)] to-transparent p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.12),transparent_70%)]" />
              <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(var(--accent-rgb),0.3)] to-[rgba(var(--accent-2-rgb),0.2)] ring-1 ring-[rgba(var(--accent-rgb),0.3)]">
                  <Zap className="h-6 w-6 text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] lg:text-2xl">
                    Fully Autonomous
                  </h3>
                  <p className="mt-2 max-w-lg text-base leading-relaxed text-[var(--text-secondary)]">
                    Stop Hook keeps the loop running. Claude iterates until done &mdash; no babysitting. Screenshot, score, fix, repeat.
                  </p>
                </div>
                <div className="ml-auto hidden shrink-0 lg:block">
                  <div className="font-mono text-6xl font-bold tracking-tighter text-[rgba(var(--accent-rgb),0.1)]">&infin;</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Adaptive Strategy — wide left, violet accent */}
          <ScrollReveal delay={0.05} className="lg:col-span-5">
            <div className="glow-card group relative h-full rounded-xl border border-[rgba(var(--accent-2-rgb),0.2)] bg-gradient-to-b from-[rgba(var(--accent-2-rgb),0.06)] to-transparent p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--accent-2-rgb),0.2)] ring-1 ring-[rgba(var(--accent-2-rgb),0.25)]">
                <Target className="h-4.5 w-4.5 text-[var(--accent-2)]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
                Adaptive Strategy
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Prioritizes highest-impact issues. Adapts focus as scores improve.
              </p>
            </div>
          </ScrollReveal>

          {/* Remaining 4 features — asymmetric grid with varied accents */}
          {[
            { icon: Package, title: "Zero Dependencies", description: "No API key. No npm install. Reads your theme config and existing tokens \u2014 won\u2019t conflict.", span: "lg:col-span-4", accent: "accent" },
            { icon: Layers, title: "CSS Cascade Audit", description: "Detects unlayered resets overriding Tailwind v4. Finds bugs screenshots miss.", span: "lg:col-span-3", accent: "accent-2" },
            { icon: Monitor, title: "Section Screenshots", description: "Semantic landmark detection with scroll fallback. Not just a full-page blob.", span: "lg:col-span-3", accent: "accent-3" },
            { icon: RotateCcw, title: "Stuck Detection", description: "Tries alternative approaches. After 3 fails, documents TODO, moves on.", span: "lg:col-span-4", accent: "accent-3" },
          ].map((feature, i) => {
            const Icon = feature.icon;
            const accentVar = `var(--${feature.accent})`;
            const accentRgbVar = `var(--${feature.accent}-rgb)`;
            return (
              <ScrollReveal key={feature.title} delay={(i + 2) * 0.05} className={feature.span}>
                <div
                  className="group relative h-full rounded-xl border bg-[var(--card-bg)] p-5 transition-all hover:bg-[var(--surface)]"
                  style={{
                    borderColor: `rgba(${accentRgbVar}, 0.12)`,
                  }}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      background: `rgba(${accentRgbVar}, 0.15)`,
                      boxShadow: `inset 0 0 0 1px rgba(${accentRgbVar}, 0.2)`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: accentVar }} />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[var(--text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
