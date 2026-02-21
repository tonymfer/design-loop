"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMotionValue, useTransform, animate, motion } from "motion/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TerminalBlock } from "@/components/ui/terminal-block";
import { GlowButton } from "@/components/ui/glow-button";

function ScoreCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const fromValue = useMotionValue(2.4);
  const toValue = useMotionValue(2.4);
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

          animate(toValue, 4.6, {
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
          });
          animate(progress, 80, {
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
      <motion.span className="font-mono text-4xl font-bold text-zinc-600">
        {fromDisplay}
      </motion.span>
      <span className="font-mono text-sm text-zinc-600">/5</span>

      <div className="h-1.5 w-36 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className="h-full rounded-full bg-yellow-500"
          style={{ width: progressWidth }}
        />
      </div>

      <motion.span className="font-mono text-4xl font-bold text-yellow-500">
        {toDisplay}
      </motion.span>
      <span className="font-mono text-sm text-yellow-500">/5</span>
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="border-t border-zinc-800/60 py-24 text-center">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-50">
            Stop guessing. Start measuring.
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
