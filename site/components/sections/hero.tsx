"use client";

import React, { useRef, useEffect, useState } from "react";
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
          {/* Glow halo behind "see" */}
          <span className="absolute -inset-8 bg-gradient-to-r from-cyan-500/25 to-violet-500/25 blur-3xl rounded-full" aria-hidden />
          <span className="absolute -inset-4 bg-gradient-to-r from-cyan-400/12 to-violet-400/12 blur-xl rounded-full" aria-hidden />
          {/* Lens flare — horizontal light streak */}
          <motion.span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[3px] rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(139,92,246,0.4) 70%, transparent 100%)",
            }}
            animate={{ opacity: [0, 0.7, 0], scaleX: [0.3, 1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            aria-hidden
          />
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
      style={{
        letterSpacing: "-0.035em",
        textWrap: "balance",
        perspective: "800px",
        textShadow: "0 2px 40px rgba(6,182,212,0.08), 0 0 80px rgba(139,92,246,0.05)",
      } as React.CSSProperties}
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

/* ─── CSS Orbital Ring — visible, animated ──────── */
function OrbitalRing({
  size,
  duration,
  delay,
  borderColor,
  borderWidth,
  dashArray,
  reverse,
  mouseX,
  mouseY,
  depth,
  tiltX,
  tiltY,
}: {
  size: number;
  duration: number;
  delay: number;
  borderColor: string;
  borderWidth: number;
  dashArray?: string;
  reverse?: boolean;
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  depth: number;
  tiltX?: number;
  tiltY?: number;
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
        rotateX: tiltX ?? 0,
        rotateY: tiltY ?? 0,
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1, rotate: reverse ? -360 : 360 }}
      transition={{
        opacity: { duration: 1.5, delay },
        scale: { duration: 2, delay, type: "spring", damping: 20 },
        rotate: { duration, repeat: Infinity, ease: "linear" },
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - borderWidth}
          stroke={borderColor}
          strokeWidth={borderWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

/* ─── Animated Score Badge — one-time count-up ──── */
function ScoreBadge() {
  const steps = [2.1, 2.8, 3.4, 4.0, 4.5, 4.8];
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      if (idx >= steps.length) {
        clearInterval(timer);
        setDone(true);
        return;
      }
      setStepIdx(idx);
    }, 1800);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const score = steps[stepIdx];
  const isHighScore = score >= 4.0;
  const progress = stepIdx / (steps.length - 1);

  return (
    <motion.div
      className="float-badge mt-12 inline-flex items-center gap-4 rounded-2xl border px-6 py-3.5 backdrop-blur-md"
      style={{
        borderColor: isHighScore ? "rgba(var(--accent-rgb),0.3)" : "rgba(var(--accent-rgb),0.12)",
        background: isHighScore ? "rgba(var(--accent-rgb),0.08)" : "rgba(var(--accent-rgb),0.04)",
        boxShadow: done
          ? "0 0 32px rgba(6,182,212,0.18), 0 0 64px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
          : isHighScore
            ? "0 0 24px rgba(6,182,212,0.1), inset 0 1px 0 rgba(255,255,255,0.03)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: done ? [1, 1.04, 1] : 1,
      }}
      transition={{
        opacity: { delay: 1.2, duration: 0.6 },
        y: { delay: 1.2, duration: 0.6 },
        scale: done ? { delay: 0, duration: 0.5, ease: "easeOut" } : { delay: 1.2 },
      }}
    >
      <div className="flex flex-col items-end">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">before</span>
        <span className="font-mono text-lg font-bold text-[var(--text-muted)]">2.1</span>
      </div>

      {/* Mini sparkline with gradient area fill */}
      <div className="relative">
        <svg width="56" height="28" viewBox="0 0 56 28" className="text-[var(--accent)]">
          <defs>
            <linearGradient id="spark-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(6,182,212,0.7)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0.7)" />
            </linearGradient>
            <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(6,182,212,0.15)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0)" />
            </linearGradient>
          </defs>
          {/* Area fill under sparkline */}
          <motion.path
            d="M2,24 L12,20 L22,14 L32,8 L42,4 L54,2 L54,28 L2,28 Z"
            fill="url(#spark-fill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 1 : progress > 0.3 ? 0.6 : 0 }}
            transition={{ duration: 0.8 }}
          />
          {/* Background line */}
          <polyline
            points="2,24 12,20 22,14 32,8 42,4 54,2"
            fill="none"
            stroke="rgba(var(--accent-rgb),0.12)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Animated progress line */}
          <motion.polyline
            points="2,24 12,20 22,14 32,8 42,4 54,2"
            fill="none"
            stroke="url(#spark-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {/* Endpoint dot */}
          {done && (
            <motion.circle
              cx="54" cy="2" r="2.5"
              fill="rgba(139,92,246,0.8)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            />
          )}
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">after</span>
        <motion.span
          key={stepIdx}
          className={`font-mono text-xl font-bold ${done ? "bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]" : "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent"}`}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
        >
          {score.toFixed(1)}
        </motion.span>
      </div>

      {/* Completion checkmark */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={done ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
      >
        {done && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </motion.div>
    </motion.div>
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
        {/* Enhanced focal orb */}
        <motion.div
          className="absolute left-1/2 top-[15%] h-[600px] w-[700px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(ellipse at center, rgba(6,182,212,0.14) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)",
            x: useTransform(mouseX, (v) => v * 0.3),
            y: useTransform(mouseY, (v) => v * 0.3),
          }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Warm accent orb — bottom right */}
        <motion.div
          className="absolute right-[10%] bottom-[15%] h-[300px] w-[350px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(ellipse at center, rgba(245,158,11,0.05) 0%, rgba(139,92,246,0.03) 50%, transparent 70%)",
            x: useTransform(mouseX, (v) => v * -0.2),
            y: useTransform(mouseY, (v) => v * -0.2),
          }}
        />
        <div className="absolute inset-0 dot-grid" />
      </div>

      {/* ═══ Orbital Rings — the "loop" visual metaphor ═══ */}
      <div className="pointer-events-none absolute inset-0" style={{ perspective: "1200px", filter: "drop-shadow(0 0 8px rgba(6,182,212,0.15))" }}>
        {/* Primary ring — cyan, tilted, dashed, BOLD */}
        <OrbitalRing
          size={520}
          duration={35}
          delay={0.5}
          borderColor="rgba(6,182,212,0.45)"
          borderWidth={2}
          dashArray="80 40 20 40"
          mouseX={mouseX}
          mouseY={mouseY}
          depth={0.8}
          tiltX={60}
          tiltY={10}
        />
        {/* Secondary ring — violet, reverse, larger */}
        <OrbitalRing
          size={650}
          duration={50}
          delay={0.8}
          borderColor="rgba(139,92,246,0.3)"
          borderWidth={1.5}
          dashArray="120 60 30 60"
          reverse
          mouseX={mouseX}
          mouseY={mouseY}
          depth={1.2}
          tiltX={55}
          tiltY={-15}
        />
        {/* Inner ring — bright cyan, fast */}
        <OrbitalRing
          size={380}
          duration={20}
          delay={1.0}
          borderColor="rgba(6,182,212,0.35)"
          borderWidth={1.5}
          dashArray="40 60"
          mouseX={mouseX}
          mouseY={mouseY}
          depth={0.5}
          tiltX={65}
          tiltY={5}
        />
        {/* Orbiting node on primary ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            width: 520,
            height: 520,
            marginLeft: -260,
            marginTop: -260,
            rotateX: 60,
            rotateY: 10,
            x: useTransform(mouseX, (v) => v * 0.8),
            y: useTransform(mouseY, (v) => v * 0.8),
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-3 w-3 rounded-full bg-cyan-400/80 shadow-[0_0_12px_4px_rgba(6,182,212,0.5)]" />
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ Floating geometric accents — parallax layers ═══ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left: crosshair */}
        <motion.div
          className="absolute left-[12%] top-[20%]"
          style={{
            x: useTransform(mouseX, (v) => v * 1.8),
            y: useTransform(mouseY, (v) => v * 1.8),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="relative h-8 w-8">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent" />
            <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          </div>
        </motion.div>

        {/* Top-right: dot cluster */}
        <motion.div
          className="absolute right-[14%] top-[22%] flex flex-col gap-2"
          style={{
            x: useTransform(mouseX, (v) => v * 2.2),
            y: useTransform(mouseY, (v) => v * 2.2),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-violet-500/50" />
          <div className="h-1 w-1 rounded-full bg-violet-500/30 ml-1" />
          <div className="h-0.5 w-0.5 rounded-full bg-violet-500/20 ml-0.5" />
        </motion.div>

        {/* Right side: measurement ticks */}
        <motion.div
          className="absolute right-[9%] top-[45%] flex flex-col gap-2"
          style={{
            x: useTransform(mouseX, (v) => v * 1.0),
            y: useTransform(mouseY, (v) => v * 1.0),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="h-px w-10 bg-gradient-to-r from-violet-500/30 to-transparent" />
          <div className="h-px w-6 bg-gradient-to-r from-violet-500/20 to-transparent" />
          <div className="h-px w-10 bg-gradient-to-r from-violet-500/30 to-transparent" />
          <div className="h-px w-4 bg-gradient-to-r from-violet-500/15 to-transparent" />
        </motion.div>

        {/* Bottom-left: angular bracket */}
        <motion.div
          className="absolute left-[8%] bottom-[28%]"
          style={{
            x: useTransform(mouseX, (v) => v * 1.4),
            y: useTransform(mouseY, (v) => v * 1.4),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="flex items-center gap-0">
            <div className="h-12 w-px bg-gradient-to-b from-cyan-500/30 to-transparent rotate-[20deg] origin-bottom" />
            <div className="h-8 w-px bg-gradient-to-b from-cyan-500/20 to-transparent -rotate-[20deg] origin-bottom -ml-px" />
          </div>
        </motion.div>

        {/* Floating micro-text — reinforces "code analysis" identity */}
        <motion.div
          className="absolute left-[6%] top-[42%] hidden lg:block"
          style={{
            x: useTransform(mouseX, (v) => v * 0.6),
            y: useTransform(mouseY, (v) => v * 0.6),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          <span className="font-mono text-[10px] tracking-wider text-cyan-500/60">composition: 4.8</span>
        </motion.div>

        <motion.div
          className="absolute right-[7%] top-[35%] hidden lg:block"
          style={{
            x: useTransform(mouseX, (v) => v * 1.6),
            y: useTransform(mouseY, (v) => v * 1.6),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.45, 0.45, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 3.5 }}
        >
          <span className="font-mono text-[10px] tracking-wider text-violet-500/50">identity: pass</span>
        </motion.div>

        <motion.div
          className="absolute left-[15%] bottom-[18%] hidden lg:block"
          style={{
            x: useTransform(mouseX, (v) => v * 1.2),
            y: useTransform(mouseY, (v) => v * 1.2),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.4, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 5 }}
        >
          <span className="font-mono text-[10px] tracking-wider text-cyan-500/50">polish: ✓</span>
        </motion.div>

        <motion.div
          className="absolute right-[12%] bottom-[22%] hidden lg:block"
          style={{
            x: useTransform(mouseX, (v) => v * 0.9),
            y: useTransform(mouseY, (v) => v * 0.9),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.4, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, delay: 4 }}
        >
          <span className="font-mono text-[10px] tracking-wider text-violet-500/45">contrast: AA</span>
        </motion.div>
      </div>

      {/* ═══ Scan line — sweeps horizontally, "seeing" the page ═══ */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 z-20"
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 5%, rgba(6,182,212,0.6) 25%, rgba(139,92,246,0.7) 50%, rgba(6,182,212,0.6) 75%, transparent 95%)",
          boxShadow: "0 0 30px 4px rgba(6,182,212,0.25), 0 0 80px 8px rgba(6,182,212,0.08)",
        }}
        initial={{ top: "15%", opacity: 0.6 }}
        animate={{ top: ["15%", "85%", "15%"], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

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
          <div className="mb-10 flex flex-col items-center gap-3">
            <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              design<span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">-</span>loop
            </span>
            <div className="hero-accent-line" />
          </div>

          {/* Kinetic Headline */}
          <KineticHeadline />

          {/* Subtitle */}
          <p
            className="mx-auto mb-10 max-w-[540px] text-[17px] leading-[1.75] text-[var(--text-secondary)]"
            style={{ textWrap: "balance", letterSpacing: "0.015em" } as React.CSSProperties}
          >
            Section-level screenshots. Five anti-slop criteria. Autonomous
            iteration. <span className="text-[var(--text-primary)] font-medium">design-loop</span> polishes your UI until it&apos;s{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent font-medium">pixel-perfect</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GlowButton href="#install">Get Started &rarr;</GlowButton>
            <GlowButton href="#how-it-works" variant="ghost">
              See how it works &darr;
            </GlowButton>
          </div>

          {/* Floating score badge — animated */}
          <ScoreBadge />
        </AnimatedGroup>

      </div>

      {/* Scroll indicator — absolute bottom of hero, outside content flow */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 2, duration: 1 }, y: { delay: 2.5, duration: 1.5, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">scroll</span>
        <svg width="16" height="10" viewBox="0 0 16 10" className="text-[var(--text-muted)]">
          <path d="M1 1L8 8L15 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </Spotlight>
  );
}
