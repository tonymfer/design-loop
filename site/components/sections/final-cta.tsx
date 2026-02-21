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
      className="mt-10 flex items-center justify-center gap-6"
    >
      <div className="text-center">
        <motion.span className="font-mono text-4xl font-bold text-[var(--text-muted)]">
          {fromDisplay}
        </motion.span>
        <span className="ml-1 font-mono text-sm text-[var(--text-muted)]">/5</span>
      </div>

      <div className="h-2 w-40 overflow-hidden rounded-full bg-[var(--surface)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
          style={{ width: progressWidth }}
        />
      </div>

      <div className="text-center">
        <motion.span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text font-mono text-4xl font-bold text-transparent">
          {toDisplay}
        </motion.span>
        <span className="ml-1 font-mono text-sm text-[var(--accent)]">/5</span>
      </div>
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="relative border-t border-[var(--border)] py-20 text-center overflow-hidden">
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 dot-grid" />

      <div className="relative mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Stop guessing. Start measuring.
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
          <div className="mt-8">
            <GlowButton href="https://github.com/tonymfer/design-loop">
              View on GitHub &rarr;
            </GlowButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
