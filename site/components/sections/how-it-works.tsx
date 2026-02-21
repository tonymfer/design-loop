"use client";

import React from "react";
import { Camera, Ruler, BarChart3, Wrench, Repeat } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Camera,
    title: "Screenshot",
    description: "Playwright captures the page",
  },
  {
    icon: Ruler,
    title: "Measure",
    description: "JS checks layout metrics",
  },
  {
    icon: BarChart3,
    title: "Score",
    description: "8 criteria rated 1\u20135",
  },
  {
    icon: Wrench,
    title: "Fix",
    description: "Top 3 issues fixed in code",
  },
  {
    icon: Repeat,
    title: "Repeat",
    description: "Loops until polished \u2014 no manual intervention",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-zinc-800/60 py-24"
    >
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="mb-3 font-serif text-3xl text-zinc-50 sm:text-4xl">
          How it works
        </h2>
        <p className="mb-10 text-zinc-400">
          Five steps per iteration. Each one makes the page measurably better.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.title} delay={i * 0.08}>
                <div className="relative flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                  {/* Connector line (desktop only, not on last) */}
                  {i < steps.length - 1 && (
                    <div className="pointer-events-none absolute right-0 top-7 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-yellow-500/40 to-yellow-500/10 sm:block" />
                  )}

                  {/* Icon circle */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                    <Icon className="h-5 w-5 text-yellow-500" />
                  </div>

                  <div className="sm:mt-3">
                    <h3 className="mb-1 text-sm font-semibold text-zinc-100">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {step.description}
                    </p>
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
