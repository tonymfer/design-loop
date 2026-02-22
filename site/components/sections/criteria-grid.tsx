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
}

const criteria: Criterion[] = [
  {
    key: "composition",
    name: "Composition",
    icon: LayoutGrid,
    description:
      "Layout, spacing, visual flow. Elements breathe. Sections have rhythm.",
    antiSlop: "Rejects uniform grids \u2014 asymmetry creates interest",
  },
  {
    key: "typography",
    name: "Typography",
    icon: Type,
    description:
      "Hierarchy through size/weight/tracking. Font pairing works.",
    antiSlop: "Flags Inter/Roboto defaults \u2014 consider display fonts",
  },
  {
    key: "color",
    name: "Color & Contrast",
    icon: Palette,
    description:
      "Intentional palette, WCAG AA text contrast, interactive states visible.",
    antiSlop: "Flags purple gradients, gratuitous gradients, rainbow decorations",
  },
  {
    key: "identity",
    name: "Visual Identity",
    icon: Fingerprint,
    description:
      'Looks designed, not generated. Has a point of view. Passes the "portfolio test."',
    antiSlop: "Flags generic card layouts, stock-photo hero patterns",
  },
  {
    key: "polish",
    name: "Polish",
    icon: Sparkles,
    description:
      "Alignment, consistency, details. Same pattern = same treatment.",
    antiSlop: "Flags mixed spacing scales, orphaned elements",
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

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {criteria.map((c, i) => {
            const isIdentity = c.key === "identity";
            return (
              <ScrollReveal key={c.key} delay={i * 0.05} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
                <BentoCard className={`h-full ${isIdentity ? "glow-card ring-1 ring-[rgba(var(--accent-2-rgb),0.15)]" : ""}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${
                        isIdentity
                          ? "bg-gradient-to-br from-[rgba(var(--accent-2-rgb),0.25)] to-[rgba(var(--accent-rgb),0.15)] ring-[rgba(var(--accent-2-rgb),0.25)]"
                          : "bg-gradient-to-br from-[rgba(var(--accent-rgb),0.2)] to-[rgba(var(--accent-2-rgb),0.2)] ring-[rgba(var(--accent-rgb),0.2)]"
                      }`}>
                        <c.icon className={`h-4 w-4 ${isIdentity ? "text-[var(--accent-2)]" : "text-[var(--accent)]"}`} />
                      </div>
                      <span className="text-base font-semibold text-[var(--text-primary)]">
                        {c.name}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {c.description}
                    </p>
                    <p className={`text-xs leading-relaxed ${
                      isIdentity
                        ? "text-[color-mix(in_srgb,var(--accent-2),transparent_30%)]"
                        : "text-[color-mix(in_srgb,var(--accent),transparent_40%)]"
                    }`}>
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
