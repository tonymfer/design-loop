"use client";

import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { GlowButton } from "@/components/ui/glow-button";
import { Threads } from "@/components/ui/threads";
import { useIteration } from "@/lib/iteration-context";

export function Hero() {
  const { iteration } = useIteration();
  const showPaths = iteration >= 3;

  const heroContent = (
    <>
      {/* Measurement ruler — left edge */}
      <div className="hero-ruler pointer-events-none hidden lg:block" />

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

          {/* Wordmark + accent line */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              design<span className="text-[var(--accent)]">-</span>loop
            </span>
            <div className="hero-accent-line" />
          </div>

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

          {/* Floating score badge — gives hero personality */}
          <div className="float-badge mt-12 inline-flex items-center gap-3 rounded-2xl border border-[rgba(var(--accent-rgb),0.15)] bg-[rgba(var(--accent-rgb),0.04)] px-5 py-3 backdrop-blur-sm">
            <div className="flex flex-col items-end">
              <span className="font-mono text-[10px] text-[var(--text-muted)]">before</span>
              <span className="font-mono text-lg font-bold text-[var(--text-muted)]">2.1</span>
            </div>
            <div className="h-6 w-px bg-[var(--border)]" />
            <svg width="48" height="24" viewBox="0 0 48 24" className="text-[var(--accent)]">
              <polyline points="2,20 12,16 22,12 32,6 46,3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="h-6 w-px bg-[var(--border)]" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[var(--accent)]">after</span>
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text font-mono text-lg font-bold text-transparent">4.8</span>
            </div>
          </div>

        </AnimatedGroup>
      </div>
    </>
  );

  return (
    <Spotlight className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pb-8">
      {showPaths && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: "var(--effects-opacity)" }}
        >
          <Threads
            color={[0.024, 0.714, 0.831]}
            amplitude={2.9}
            distance={0.5}
            enableMouseInteraction
          />
        </div>
      )}
      {heroContent}
    </Spotlight>
  );
}
