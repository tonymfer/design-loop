import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PhaseTimeline } from "@/components/sections/phase-timeline";
import { CriteriaGrid } from "@/components/sections/criteria-grid";
import { StackDetection } from "@/components/sections/stack-detection";
import { IterationDemo } from "@/components/sections/iteration-demo";
import { Install } from "@/components/sections/install";
import { Features } from "@/components/sections/features";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="noise-overlay ambient-glow min-h-dvh">
      <Hero />
      <main>
        <HowItWorks />
        <PhaseTimeline />
        <CriteriaGrid />
        <StackDetection />
        <IterationDemo />
        <Install />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
