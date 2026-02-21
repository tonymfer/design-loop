"use client";

import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { GlowButton } from "@/components/ui/glow-button";

export function Hero() {
  return (
    <Spotlight className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Aurora gradient background + animated orb */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 aurora-bg" />
        {/* Floating gradient orb */}
        <div className="hero-orb absolute left-1/2 top-[15%] h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent blur-3xl" />
        <div className="absolute inset-0 dot-grid" />
      </div>

      {/* Radial vignette — transitions with theme */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--page-bg)_75%)]" />

      <div className="relative z-10 mx-auto max-w-[800px] px-6 text-center">
        <AnimatedGroup className="flex flex-col items-center">
          {/* Badge */}
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(var(--accent-rgb),0.2)] bg-[rgba(var(--accent-rgb),0.06)] px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--accent)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Claude Code Plugin
          </span>

          {/* Wordmark */}
          <span className="mb-6 font-mono text-sm font-bold tracking-tight text-[var(--text-primary)]">
            design<span className="text-[var(--accent)]">-</span>loop
          </span>

          {/* Headline */}
          <h1
            className="mx-auto mb-6 font-serif text-5xl font-[800] leading-[1.05] sm:text-6xl lg:text-7xl xl:text-8xl"
            style={
              {
                letterSpacing: "-0.035em",
                textWrap: "balance",
              } as React.CSSProperties
            }
          >
            <span className="text-[var(--text-primary)]">AI can code your UI.</span>
            <br />
            <span className="text-[var(--text-primary)]">But it can&apos;t </span>
            <em className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] bg-[length:200%_auto] bg-clip-text not-italic text-transparent animate-[shimmer_4s_ease-in-out_infinite]">
              see
            </em>
            <span className="text-[var(--text-primary)]"> it.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="mx-auto mb-10 max-w-[560px] text-lg leading-relaxed text-[var(--text-secondary)]"
            style={
              {
                textWrap: "balance",
              } as React.CSSProperties
            }
          >
            Section-level screenshots. Five anti-slop criteria. Autonomous
            iteration. design-loop polishes your UI until it&apos;s
            pixel-perfect.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GlowButton href="#install">Get Started &rarr;</GlowButton>
            <GlowButton href="#how-it-works" variant="ghost">
              See how it works &darr;
            </GlowButton>
          </div>

          {/* Framework note */}
          <p className="mt-10 font-mono text-xs text-[var(--text-muted)]">
            Works with Next.js &middot; Nuxt &middot; SvelteKit &middot; React
            &middot; Vue &middot; Astro &middot; and more
          </p>
        </AnimatedGroup>
      </div>
    </Spotlight>
  );
}
