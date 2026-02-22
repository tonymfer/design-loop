"use client";

import React from "react";
import { Crosshair, Palette, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useIteration } from "@/lib/iteration-context";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { ModeType } from "@/lib/demo-data";
import type { LucideIcon } from "lucide-react";

interface ModeCard {
  mode: ModeType;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  bestFor: string;
  constraint: string;
  accentFrom: string;
  accentTo: string;
  glowColor: string;
}

const MODE_CARDS: ModeCard[] = [
  {
    mode: "precision-polish",
    icon: Crosshair,
    title: "Precision Polish",
    tagline: "Surgical CSS fixes only",
    description:
      "Minimal, targeted improvements. No layout changes, no new dependencies. Just pixel-perfect corrections to spacing, alignment, and consistency.",
    bestFor: "Production apps",
    constraint: "CSS-only edits",
    accentFrom: "#06b6d4",
    accentTo: "#0891b2",
    glowColor: "rgba(6, 182, 212, 0.15)",
  },
  {
    mode: "theme-respect-elevate",
    icon: Palette,
    title: "Theme-Respect Elevate",
    tagline: "Elevate within your design system",
    description:
      "Respects your brand tokens, color palette, and typography. Improves composition and polish while preserving the identity you've built.",
    bestFor: "Branded projects",
    constraint: "Token-aware edits",
    accentFrom: "#8b5cf6",
    accentTo: "#7c3aed",
    glowColor: "rgba(139, 92, 246, 0.15)",
  },
  {
    mode: "creative-unleash",
    icon: Sparkles,
    title: "Creative Unleash",
    tagline: "Bold redesign, maximum latitude",
    description:
      "Full creative freedom. New layouts, gradient treatments, component upgrades. Guided by companion design skills for distinctive results.",
    bestFor: "New projects & MVPs",
    constraint: "All tools available",
    accentFrom: "#f43f5e",
    accentTo: "#e11d48",
    glowColor: "rgba(244, 63, 94, 0.15)",
  },
];

export function ModeShowcase() {
  const { mode: activeMode, setMode } = useIteration();

  const handleTryNow = (mode: ModeType) => {
    setMode(mode);
    const demoSection = document.getElementById("iteration-demo");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="section-divider py-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <span className="slash-motif heading-mono">Modes</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-[var(--text-primary)]">
            Three modes.{" "}
            <span className="text-[var(--text-secondary)]">One loop.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
            Different creative latitude for different contexts.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {MODE_CARDS.map((card, i) => {
            const Icon = card.icon;
            const isActive = activeMode === card.mode;

            return (
              <ScrollReveal key={card.mode} delay={i * 0.08}>
                <motion.div
                  className={cn(
                    "group relative flex h-full flex-col rounded-xl border p-6 transition-all cursor-pointer overflow-hidden",
                    isActive
                      ? "border-[color-mix(in_srgb,var(--accent),transparent_40%)] bg-[var(--surface)]"
                      : "border-[var(--border)] bg-[var(--card-bg)] hover:border-[color-mix(in_srgb,var(--accent),transparent_70%)] hover:bg-[var(--surface)]"
                  )}
                  onClick={() => handleTryNow(card.mode)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    boxShadow: isActive
                      ? `0 0 40px ${card.glowColor}, 0 0 80px ${card.glowColor}`
                      : "none",
                  }}
                >
                  {/* Mode-specific top accent band */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background: card.mode === "precision-polish"
                        ? `repeating-linear-gradient(90deg, ${card.accentFrom} 0px, ${card.accentFrom} 4px, transparent 4px, transparent 8px)`
                        : card.mode === "theme-respect-elevate"
                        ? `linear-gradient(90deg, transparent, ${card.accentFrom}, transparent)`
                        : `linear-gradient(90deg, ${card.accentFrom}, ${card.accentTo}, #f59e0b, ${card.accentFrom})`,
                    }}
                  />

                  {/* Glow overlay on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${card.glowColor}, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10 flex flex-1 flex-col">
                    {/* Icon */}
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${card.accentFrom}20, ${card.accentTo}10)`,
                        boxShadow: `inset 0 0 0 1px ${card.accentFrom}25`,
                      }}
                    >
                      <Icon className="h-[18px] w-[18px]" style={{ color: card.accentFrom }} />
                    </div>

                    {/* Title + tagline */}
                    <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs font-mono text-[var(--text-muted)]">
                      {card.tagline}
                    </p>

                    {/* Description */}
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {card.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-md bg-[var(--surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                        {card.bestFor}
                      </span>
                      <span className="rounded-md bg-[var(--surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                        {card.constraint}
                      </span>
                    </div>

                    {/* Try Now button */}
                    <button
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-mono text-xs font-medium text-white transition-all hover:-translate-y-0.5"
                      style={{
                        background: `linear-gradient(135deg, ${card.accentFrom}, ${card.accentTo})`,
                        boxShadow: isActive
                          ? `0 0 20px ${card.glowColor}`
                          : "none",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTryNow(card.mode);
                      }}
                    >
                      Try Now
                      <span className="text-white/70">&rarr;</span>
                    </button>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
