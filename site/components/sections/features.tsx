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

        {/* Asymmetric feature layout — 2 highlighted on left, 4 stacked on right */}
        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* Left column: 2 highlighted features stacked tall */}
          <div className="space-y-4 lg:col-span-5">
            {features.filter(f => f.highlight).map((feature, i) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} delay={i * 0.05}>
                  <div className="glow-card group relative h-full rounded-xl border border-[rgba(var(--accent-rgb),0.25)] bg-gradient-to-br from-[rgba(var(--accent-rgb),0.08)] to-[rgba(var(--accent-2-rgb),0.04)] p-6 shadow-[0_0_20px_rgba(var(--accent-rgb),0.06)] transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--accent-rgb),0.2)] ring-1 ring-[rgba(var(--accent-rgb),0.3)]">
                      <Icon className="h-4.5 w-4.5 text-[var(--accent)]" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {feature.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Right column: 4 compact features in 2×2 grid */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-7">
            {features.filter(f => !f.highlight).map((feature, i) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} delay={(i + 2) * 0.05}>
                  <div className="group relative h-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all hover:border-[color-mix(in_srgb,var(--accent),transparent_70%)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] ring-1 ring-[var(--border)]">
                      <Icon className="h-4 w-4 text-[var(--text-secondary)]" />
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
      </div>
    </section>
  );
}
