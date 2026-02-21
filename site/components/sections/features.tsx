"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const features = [
  {
    number: "01",
    title: "Fully Autonomous",
    description:
      "Stop Hook keeps the loop running. Claude iterates until done \u2014 no babysitting.",
  },
  {
    number: "02",
    title: "Zero Dependencies",
    description:
      "No API key. No npm install. Playwright auto-installed on first run.",
  },
  {
    number: "03",
    title: "CSS Cascade Audit",
    description:
      "Detects unlayered resets overriding Tailwind v4. Finds bugs screenshots miss.",
  },
  {
    number: "04",
    title: "9 Frameworks",
    description:
      "Auto-detects Next.js, Nuxt, SvelteKit, Remix, Astro, React, Vue, and more.",
  },
  {
    number: "05",
    title: "Phase-Aware Strategy",
    description:
      "Spacing first, hierarchy second, alignment third, polish last.",
  },
  {
    number: "06",
    title: "Stuck Detection",
    description:
      "Tries alternative approaches. After 3 fails, documents TODO, moves on.",
  },
  {
    number: "07",
    title: "Wide Viewport Check",
    description:
      "Tests at 1920px to catch centering drift invisible at standard widths.",
  },
];

export function Features() {
  return (
    <section className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-50">
            Features
          </h2>
          <p className="mt-4 text-zinc-400">
            Autonomous. Framework-aware. Zero setup.
          </p>
        </ScrollReveal>

        <div className="mt-14">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.number} delay={i * 0.04}>
              <div
                className={`flex items-baseline gap-5 py-5 ${
                  i < features.length - 1
                    ? "border-b border-zinc-800/60"
                    : ""
                }`}
              >
                <span className="font-mono text-xs font-bold text-yellow-500">
                  {feature.number}
                </span>
                <div>
                  <h3 className="font-semibold text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
