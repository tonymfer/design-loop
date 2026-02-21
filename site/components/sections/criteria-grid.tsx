"use client";

import {
  LayoutGrid,
  Triangle,
  Circle,
  AlignLeft,
  Columns3,
  Equal,
  Pointer,
  Square,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BentoCard } from "@/components/ui/bento-card";

interface Criterion {
  key: string;
  name: string;
  icon: LucideIcon;
  phase: number;
  description: string;
}

const criteria: Criterion[] = [
  {
    key: "spacing",
    name: "Spacing",
    icon: LayoutGrid,
    phase: 1,
    description:
      "Consistent scale (4/8/12/16/24/32px). No cramped elements.",
  },
  {
    key: "hierarchy",
    name: "Hierarchy",
    icon: Triangle,
    phase: 2,
    description:
      "Clear visual weight order. Primary action obvious.",
  },
  {
    key: "contrast",
    name: "Contrast",
    icon: Circle,
    phase: 2,
    description:
      "Text readable against background. Interactive elements distinguishable.",
  },
  {
    key: "alignment",
    name: "Alignment",
    icon: AlignLeft,
    phase: 3,
    description:
      "Elements on consistent grid. No orphaned items. Edges line up.",
  },
  {
    key: "density",
    name: "Density",
    icon: Columns3,
    phase: 4,
    description:
      "Right amount of content per viewport. Not too sparse, not too cluttered.",
  },
  {
    key: "consistency",
    name: "Consistency",
    icon: Equal,
    phase: 3,
    description:
      "Same patterns for same concepts. Colors meaningful, not random.",
  },
  {
    key: "touch",
    name: "Touch targets",
    icon: Pointer,
    phase: 1,
    description:
      "Buttons and links have at least 44px touch area on mobile.",
  },
  {
    key: "empty",
    name: "Empty states",
    icon: Square,
    phase: 4,
    description:
      "Graceful when data is missing. Not broken, not blank.",
  },
];

export function CriteriaGrid() {
  return (
    <section className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-50">
            8 design fundamentals
          </h2>
          <p className="mt-4 max-w-xl text-zinc-400">
            Every screenshot is scored. Every score has a reason.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {criteria.map((c, i) => (
            <ScrollReveal key={c.key} delay={i * 0.04}>
              <BentoCard>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-yellow-500">
                    <c.icon className="h-4 w-4 text-zinc-950" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100">
                        {c.name}
                      </span>
                      <span className="rounded-sm border border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-500">
                        phase {c.phase}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">
                      {c.description}
                    </p>
                  </div>
                </div>
              </BentoCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
