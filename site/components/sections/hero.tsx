"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { GlowButton } from "@/components/ui/glow-button";
import { Threads } from "@/components/ui/threads";
import { useIteration } from "@/lib/iteration-context";

/* ─── Per-Word Kinetic Headline ─────────────────── */
function KineticWord({
  children,
  delay,
  isAccent,
}: {
  children: React.ReactNode;
  delay: number;
  isAccent?: boolean;
}) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 32, rotateX: -45, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      transition={{ type: "spring", damping: 20, stiffness: 90, delay }}
    >
      {isAccent ? (
        <motion.em
          className="relative not-italic"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_ease-in-out_infinite]">
            {children}
          </span>
          {/* Accent word glow halo */}
          <span className="absolute -inset-4 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 blur-2xl rounded-full" aria-hidden />
        </motion.em>
      ) : (
        children
      )}
    </motion.span>
  );
}

function KineticHeadline() {
  const line1Words = ["AI", "can", "code", "your", "UI."];
  const line2Words = ["But", "it", "can\u2019t"];

  return (
    <h1
      className="mx-auto mb-6 font-serif text-5xl font-[800] leading-[1.05] sm:text-6xl lg:text-7xl xl:text-8xl"
      style={{ letterSpacing: "-0.035em", textWrap: "balance", perspective: "800px" } as React.CSSProperties}
    >
      <span className="text-[var(--text-primary)]">
        {line1Words.map((word, i) => (
          <React.Fragment key={word + i}>
            <KineticWord delay={0.3 + i * 0.07}>{word}</KineticWord>
            {i < line1Words.length - 1 && " "}
          </React.Fragment>
        ))}
      </span>
      <br />
      <span className="text-[var(--text-primary)]">
        {line2Words.map((word, i) => (
          <React.Fragment key={word + i}>
            <KineticWord delay={0.7 + i * 0.07}>{word}</KineticWord>{" "}
          </React.Fragment>
        ))}
        <KineticWord delay={0.95} isAccent>see</KineticWord>{" "}
        <KineticWord delay={1.05}>it.</KineticWord>
      </span>
    </h1>
  );
}

/* ─── Orbital Ring — the "loop" visual metaphor ──── */
function OrbitalRing({
  size,
  duration,
  delay,
  strokeColor,
  strokeWidth,
  opacity,
  reverse,
  mouseX,
  mouseY,
  depth,
}: {
  size: number;
  duration: number;
  delay: number;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  reverse?: boolean;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  depth: number;
}) {
  const mx = useTransform(mouseX, (v) => v * depth);
  const my = useTransform(mouseY, (v) => v * depth);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        x: mx,
        y: my,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity, scale: 1, rotate: reverse ? -360 : 360 }}
      transition={{
        opacity: { duration: 1.5, delay },
        scale: { duration: 2, delay, type: "spring", damping: 20 },
        rotate: { duration, repeat: Infinity, ease: "linear" },
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        <defs>
          <linearGradient id={`ring-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="1" />
            <stop offset="50%" stopColor={strokeColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <ellipse
          cx={size / 2}
          cy={size / 2}
          rx={size / 2 - strokeWidth}
          ry={size / 2 - strokeWidth}
          fill="none"
          stroke={`url(#ring-grad-${size})`}
          strokeWidth={strokeWidth}
          strokeDasharray={`${size * 0.4} ${size * 0.15} ${size * 0.1} ${size * 0.35}`}
        />
      </svg>
    </motion.div>
  );
}

/* ─── Floating Geometric Accent ──────────────────── */
function FloatingAccent({
  className,
  mouseX,
  mouseY,
  depth,
  delay,
}: {
  className: string;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  depth: number;
  delay: number;
}) {
  const mx = useTransform(mouseX, (v) => v * depth);
  const my = useTransform(mouseY, (v) => v * depth);

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{ x: mx, y: my }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay, type: "spring", damping: 15 }}
    />
  );
}

/* ─── Main Hero ─────────────────────────────────── */
export function Hero() {
  const { iteration } = useIteration();
  const showPaths = iteration >= 3;
  const containerRef = useRef<HTMLDivElement>(null);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { damping: 25, stiffness: 150 });
  const mouseY = useSpring(rawMouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      rawMouseX.set((e.clientX - centerX) / 15);
      rawMouseY.set((e.clientY - centerY) / 15);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  return (
    <Spotlight className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pb-8" ref={containerRef}>
      {/* Threads WebGL Background */}
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

      {/* Measurement ruler — left edge */}
      <div className="hero-ruler pointer-events-none hidden lg:block" />

      {/* Aurora gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 aurora-bg" />
        {/* Primary focal orb — enlarged, more vivid */}
        <motion.div
          className="absolute left-1/2 top-[18%] h-[600px] w-[700px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(ellipse at center, rgba(var(--accent-rgb),0.14) 0%, rgba(var(--accent-2-rgb),0.08) 40%, transparent 70%)",
            x: useTransform(mouseX, (v) => v * 0.3),
            y: useTransform(mouseY, (v) => v * 0.3),
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Secondary warm orb */}
        <motion.div
          className="absolute right-[10%] bottom-[15%] h-[350px] w-[400px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(ellipse at center, rgba(var(--accent-3-rgb),0.06) 0%, rgba(var(--accent-2-rgb),0.04) 50%, transparent 70%)",
            x: useTransform(mouseX, (v) => v * -0.2),
            y: useTransform(mouseY, (v) => v * -0.2),
          }}
        />
        <div className="absolute inset-0 dot-grid" />
      </div>

      {/* ═══ Orbital Rings — the "loop" focal element ═══ */}
      <div className="pointer-events-none absolute inset-0">
        <OrbitalRing
          size={520}
          duration={30}
          delay={0.5}
          strokeColor="rgba(var(--accent-rgb), 0.25)"
          strokeWidth={1.5}
          opacity={0.8}
          mouseX={mouseX}
          mouseY={mouseY}
          depth={0.8}
        />
        <OrbitalRing
          size={680}
          duration={45}
          delay={0.8}
          strokeColor="rgba(var(--accent-2-rgb), 0.15)"
          strokeWidth={1}
          opacity={0.5}
          reverse
          mouseX={mouseX}
          mouseY={mouseY}
          depth={1.2}
        />
        <OrbitalRing
          size={400}
          duration={20}
          delay={1.0}
          strokeColor="rgba(var(--accent-rgb), 0.2)"
          strokeWidth={1}
          opacity={0.4}
          mouseX={mouseX}
          mouseY={mouseY}
          depth={0.5}
        />
      </div>

      {/* ═══ Floating geometric accents ═══ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left: small cross */}
        <FloatingAccent
          className="left-[12%] top-[18%] h-6 w-px bg-gradient-to-b from-transparent via-[var(--accent)]/40 to-transparent"
          mouseX={mouseX} mouseY={mouseY} depth={1.8} delay={0.6}
        />
        <FloatingAccent
          className="left-[calc(12%-11px)] top-[calc(18%+11px)] h-px w-6 bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent"
          mouseX={mouseX} mouseY={mouseY} depth={1.8} delay={0.6}
        />
        {/* Top-right: dotted accent */}
        <FloatingAccent
          className="right-[14%] top-[22%] h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]/50"
          mouseX={mouseX} mouseY={mouseY} depth={2.2} delay={0.9}
        />
        <FloatingAccent
          className="right-[14%] top-[calc(22%+12px)] h-1 w-1 rounded-full bg-[var(--accent-2)]/30"
          mouseX={mouseX} mouseY={mouseY} depth={2.2} delay={1.0}
        />
        {/* Bottom-left: angular bracket */}
        <FloatingAccent
          className="left-[8%] bottom-[25%] h-10 w-px bg-gradient-to-b from-[var(--accent)]/30 to-transparent rotate-[25deg]"
          mouseX={mouseX} mouseY={mouseY} depth={1.4} delay={1.2}
        />
        <FloatingAccent
          className="left-[calc(8%+6px)] bottom-[calc(25%-4px)] h-6 w-px bg-gradient-to-b from-[var(--accent)]/20 to-transparent rotate-[-25deg]"
          mouseX={mouseX} mouseY={mouseY} depth={1.4} delay={1.3}
        />
        {/* Right side: measurement ticks */}
        <FloatingAccent
          className="right-[10%] top-[45%] h-px w-8 bg-gradient-to-r from-[var(--accent-2)]/25 to-transparent"
          mouseX={mouseX} mouseY={mouseY} depth={1.0} delay={0.7}
        />
        <FloatingAccent
          className="right-[10%] top-[calc(45%+8px)] h-px w-5 bg-gradient-to-r from-[var(--accent-2)]/15 to-transparent"
          mouseX={mouseX} mouseY={mouseY} depth={1.0} delay={0.8}
        />
        <FloatingAccent
          className="right-[10%] top-[calc(45%+16px)] h-px w-8 bg-gradient-to-r from-[var(--accent-2)]/25 to-transparent"
          mouseX={mouseX} mouseY={mouseY} depth={1.0} delay={0.9}
        />
      </div>

      {/* Radial vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--page-bg)_75%)]" />

      {/* ═══ Content ═══ */}
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

          {/* Kinetic Headline */}
          <KineticHeadline />

          {/* Subtitle */}
          <p
            className="mx-auto mb-10 max-w-[560px] text-lg leading-relaxed text-[var(--text-secondary)]"
            style={{ textWrap: "balance" } as React.CSSProperties}
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

          {/* Floating score badge */}
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
    </Spotlight>
  );
}
