"use client";

import {
  LayoutGrid,
  Type,
  Palette,
  Fingerprint,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BentoCard } from "@/components/ui/bento-card";

interface Criterion {
  key: string;
  name: string;
  icon: LucideIcon;
  description: string;
  antiSlop: string;
  accent: string;
}

const criteria: Criterion[] = [
  {
    key: "composition",
    name: "Composition",
    icon: LayoutGrid,
    description:
      "Layout, spacing, visual flow. Elements breathe. Sections have rhythm.",
    antiSlop: "Rejects uniform grids \u2014 asymmetry creates interest",
    accent: "accent",
  },
  {
    key: "typography",
    name: "Typography",
    icon: Type,
    description:
      "Hierarchy through size/weight/tracking. Font pairing works.",
    antiSlop: "Flags Inter/Roboto defaults \u2014 consider display fonts",
    accent: "accent-2",
  },
  {
    key: "color",
    name: "Color & Contrast",
    icon: Palette,
    description:
      "Intentional palette, WCAG AA text contrast, interactive states visible.",
    antiSlop: "Flags purple gradients, gratuitous gradients, rainbow decorations",
    accent: "accent-3",
  },
  {
    key: "identity",
    name: "Visual Identity",
    icon: Fingerprint,
    description:
      'Looks designed, not generated. Has a point of view. Passes the "portfolio test."',
    antiSlop: "Flags generic card layouts, stock-photo hero patterns",
    accent: "accent-2",
  },
  {
    key: "polish",
    name: "Polish",
    icon: Sparkles,
    description:
      "Alignment, consistency, details. Same pattern = same treatment.",
    antiSlop: "Flags mixed spacing scales, orphaned elements",
    accent: "accent",
  },
];

export function CriteriaGrid() {
  return (
    <section className="section-divider section-elevated py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <div className="flex items-end gap-6">
            <span className="step-number-xl select-none">5</span>
            <div>
              <span className="slash-motif heading-mono">Scoring</span>
              <h2 className="mt-1 font-serif text-3xl italic sm:text-4xl text-[var(--text-primary)]" style={{ letterSpacing: "-0.02em" }}>
                Anti-slop criteria
              </h2>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-[var(--text-secondary)]">
            Every screenshot set is scored. Every score detects AI-default
            patterns and pushes toward intentional design.
          </p>
        </ScrollReveal>

        {/* Visual Identity hero criterion — spans full width as the primary */}
        <ScrollReveal delay={0.05} className="mt-12">
          <div className="glow-card group relative overflow-hidden rounded-2xl border border-[rgba(var(--accent-2-rgb),0.2)] bg-gradient-to-br from-[rgba(var(--accent-2-rgb),0.08)] via-[rgba(var(--accent-rgb),0.04)] to-transparent p-8 ring-1 ring-[rgba(var(--accent-2-rgb),0.1)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-2-rgb),0.1),transparent_70%)]" />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(var(--accent-2-rgb),0.3)] to-[rgba(var(--accent-rgb),0.2)] ring-1 ring-[rgba(var(--accent-2-rgb),0.3)]">
                <Fingerprint className="h-5 w-5 text-[var(--accent-2)]" />
              </div>
              <div className="flex-1">
                <span className="text-xl font-bold text-[var(--text-primary)]">Visual Identity</span>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
                  Looks designed, not generated. Has a point of view. Passes the &ldquo;portfolio test.&rdquo;
                </p>
                <p className="mt-2 text-xs text-[color-mix(in_srgb,var(--accent-2),transparent_30%)]">
                  Flags generic card layouts, stock-photo hero patterns
                </p>
              </div>
              <div className="hidden shrink-0 lg:block">
                <span className="font-mono text-5xl font-bold tracking-tighter text-[rgba(var(--accent-2-rgb),0.12)]">2.0&times;</span>
                <p className="mt-1 text-right font-mono text-[10px] text-[var(--text-muted)]">scoring weight</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Remaining 4 criteria — asymmetric grid */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {criteria.filter(c => c.key !== "identity").map((c, i) => {
            const spans = ["lg:col-span-4", "lg:col-span-3", "lg:col-span-3", "lg:col-span-2"];
            const accentRgb = `var(--${c.accent}-rgb)`;
            const accentColor = `var(--${c.accent})`;
            return (
              <ScrollReveal key={c.key} delay={(i + 1) * 0.05} className={spans[i]}>
                <BentoCard className="h-full">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, rgba(${accentRgb}, 0.2), rgba(${accentRgb}, 0.08))`,
                          boxShadow: `inset 0 0 0 1px rgba(${accentRgb}, 0.2)`,
                        }}
                      >
                        <c.icon className="h-4 w-4" style={{ color: accentColor }} />
                      </div>
                      <span className="text-base font-semibold text-[var(--text-primary)]">
                        {c.name}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {c.description}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: `color-mix(in srgb, ${accentColor}, transparent 40%)` }}>
                      {c.antiSlop}
                    </p>
                  </div>
                </BentoCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
