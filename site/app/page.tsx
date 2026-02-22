"use client";

import { IterationProvider, useIteration } from "@/lib/iteration-context";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ModeShowcase } from "@/components/sections/mode-showcase";
import { CriteriaGrid } from "@/components/sections/criteria-grid";
import { IterationDemo } from "@/components/sections/iteration-demo";
import { Install } from "@/components/sections/install";
import { Features } from "@/components/sections/features";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

function PageContent() {
  const { iteration } = useIteration();
  return (
    <div
      className="noise-overlay ambient-glow min-h-dvh bg-[var(--page-bg)]"
      data-iteration={iteration}
    >
      <Hero />
      <main>
        <HowItWorks />
        <ModeShowcase />
        <CriteriaGrid />
        <IterationDemo />
        <Install />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <IterationProvider>
      <PageContent />
    </IterationProvider>
  );
}
