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
      "No API key. No npm install. Playwright auto-installed on first run.",
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
    <section className="border-t border-[var(--border)] py-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl">
            <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Autonomous. Framework-aware. Zero setup.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delay={i * 0.05}>
                <div
                  className={`group relative rounded-xl border p-5 transition-all ${
                    feature.highlight
                      ? "border-[rgba(var(--accent-rgb),0.2)] bg-gradient-to-br from-[rgba(var(--accent-rgb),0.06)] to-[rgba(var(--accent-2-rgb),0.03)]"
                      : "border-[var(--border)] bg-[var(--card-bg)] hover:border-[color-mix(in_srgb,var(--accent),transparent_70%)]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        feature.highlight
                          ? "bg-[rgba(var(--accent-rgb),0.2)] ring-1 ring-[rgba(var(--accent-rgb),0.3)]"
                          : "bg-[var(--surface)] ring-1 ring-[var(--border)]"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          feature.highlight ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
