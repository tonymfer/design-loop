"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMotionValue, useTransform, animate, motion } from "motion/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TerminalBlock } from "@/components/ui/terminal-block";
import { GlowButton } from "@/components/ui/glow-button";

function ScoreCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const fromValue = useMotionValue(2.2);
  const toValue = useMotionValue(2.2);
  const progress = useMotionValue(0);

  const fromDisplay = useTransform(fromValue, (v) => v.toFixed(1));
  const toDisplay = useTransform(toValue, (v) => v.toFixed(1));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          animate(toValue, 4.8, {
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
          });
          animate(progress, 96, {
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, toValue, progress]);

  const progressWidth = useTransform(progress, (v) => `${v}%`);

  return (
    <div
      ref={ref}
      className="mt-10 flex items-center justify-center gap-8"
    >
      {/* Before score with label */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">before</span>
        <motion.span className="font-mono text-4xl font-bold text-[var(--text-muted)]">
          {fromDisplay}
        </motion.span>
        <span className="font-mono text-xs text-[var(--text-muted)]">/5</span>
      </div>

      {/* Progress bar with ruler ticks */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="h-2 w-44 overflow-hidden rounded-full bg-[var(--surface)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
            style={{ width: progressWidth }}
          />
        </div>
        {/* Ruler ticks under the progress bar */}
        <div className="flex w-44 justify-between px-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="font-mono text-[8px] text-[var(--text-muted)] opacity-40">{n}</span>
          ))}
        </div>
      </div>

      {/* After score with label */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">after</span>
        <motion.span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text font-mono text-4xl font-bold text-transparent">
          {toDisplay}
        </motion.span>
        <span className="font-mono text-xs text-[var(--accent)]">/5</span>
      </div>
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="relative section-divider py-28 text-center overflow-hidden">
      {/* Layered depth — 3 translucent panels at different z-levels */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(var(--accent-rgb),0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_30%_50%,rgba(var(--accent-2-rgb),0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_60%,rgba(var(--accent-3-rgb),0.05),transparent_50%)]" />
      </div>
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 dot-grid" />

      <div className="relative mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <div className="mx-auto mb-8 accent-bar accent-bar-warm" />
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-[var(--text-primary)]" style={{ letterSpacing: "-0.03em" }}>
            <span className="font-bold">Stop guessing.</span>
            <br />
            <span className="italic bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_ease-in-out_infinite]">
              Start measuring.
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ScoreCounter />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mx-auto mt-12 max-w-lg">
            <TerminalBlock>
              claude plugin add https://github.com/tonymfer/design-loop
            </TerminalBlock>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <GlowButton href="#install">
              Get Started &rarr;
            </GlowButton>
            <a
              href="https://github.com/tonymfer/design-loop"
              className="font-mono text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
            >
              View on GitHub &rarr;
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
