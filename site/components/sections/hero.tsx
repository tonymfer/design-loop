"use client";

import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { FloatingPathsBackground } from "@/components/ui/floating-paths";
import { GlowButton } from "@/components/ui/glow-button";

export function Hero() {
  return (
    <Spotlight className="min-h-[90vh] flex items-center justify-center">
      <FloatingPathsBackground position={-1} className="absolute inset-0">
        <div />
      </FloatingPathsBackground>

      <div className="relative z-10 mx-auto max-w-[760px] px-6 text-center">
        <AnimatedGroup className="flex flex-col items-center">
          {/* Badge */}
          <span className="mb-8 inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/[0.04] px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-yellow-500">
            Claude Code Plugin
          </span>

          {/* Headline */}
          <h1
            className="mx-auto mb-8 font-serif text-5xl font-[800] leading-[1.08] text-zinc-50 sm:text-6xl lg:text-7xl"
            style={
              {
                letterSpacing: "-0.035em",
                textWrap: "balance",
              } as React.CSSProperties
            }
          >
            AI can code your UI.
            <br />
            But it can&apos;t{" "}
            <em className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 bg-[length:200%_auto] bg-clip-text not-italic text-transparent animate-[shimmer_3s_ease-in-out_infinite]">
              see
            </em>{" "}
            it.
          </h1>

          {/* Subtitle */}
          <p
            className="mx-auto mb-12 max-w-[540px] text-lg leading-relaxed text-zinc-400"
            style={
              {
                textWrap: "balance",
              } as React.CSSProperties
            }
          >
            design-loop gives Claude eyes. Screenshot. Measure. Score. Fix.
            Repeat — fully autonomous — until your UI is polished.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GlowButton href="#install">Get Started &rarr;</GlowButton>
            <GlowButton href="#how-it-works" variant="ghost">
              Watch it work &darr;
            </GlowButton>
          </div>

          {/* Framework note */}
          <p className="mt-8 font-mono text-xs text-zinc-500">
            Works with Next.js, Nuxt, SvelteKit, React, Vue, Astro, and more.
          </p>
        </AnimatedGroup>
      </div>
    </Spotlight>
  );
}
