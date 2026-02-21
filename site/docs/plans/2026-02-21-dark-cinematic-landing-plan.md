# Dark Cinematic Landing Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the design-loop landing page as a cinematic dark-themed experience with Aceternity-style effects, Framer Motion animations, Lucide icons, and the existing iteration demo preserved as a secondary showcase section.

**Architecture:** Single-page Next.js 15 app. The current monolithic `page.tsx` (755 lines with inline CSS custom properties) is replaced by a modular component structure under `components/`. The 5-state `data-iteration` CSS system is dropped from the main layout and preserved only inside the `IterationDemo` component. All animations use `motion/react` (Framer Motion). Tailwind v4 with `@theme` for design tokens.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, motion/react (Framer Motion), Lucide React, clsx + tailwind-merge (existing)

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install lucide-react**

Run: `cd /Users/tomo/Projects/design-loop/site && npm install lucide-react`

**Step 2: Verify build still works**

Run: `cd /Users/tomo/Projects/design-loop/site && npx next build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add lucide-react for icon system"
```

---

## Task 2: Create Utility Components (Spotlight, AnimatedGroup, useInView)

**Files:**
- Create: `components/ui/spotlight.tsx`
- Create: `components/ui/animated-group.tsx`
- Keep: `components/ui/floating-paths.tsx` (unchanged, used in hero)
- Keep: `lib/utils.ts` (unchanged)

**Step 1: Create Spotlight component**

Create `components/ui/spotlight.tsx` — a mouse-following radial gradient overlay. This is an Aceternity-inspired effect.

```tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

export function Spotlight({
  children,
  className,
  size = 400,
}: {
  children: React.ReactNode;
  className?: string;
  size?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, rgba(234,179,8,0.06), transparent 80%)`;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </div>
  );
}
```

**Step 2: Create AnimatedGroup component**

Create `components/ui/animated-group.tsx` — wraps children with staggered entrance animations.

```tsx
"use client";

import React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const defaultContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const defaultItem: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.3, duration: 1.2 },
  },
};

export function AnimatedGroup({
  children,
  className,
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: { container?: Variants; item?: Variants };
}) {
  const containerVariants = variants?.container ?? defaultContainer;
  const itemVariants = variants?.item ?? defaultItem;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(className)}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

**Step 3: Verify build**

Run: `cd /Users/tomo/Projects/design-loop/site && npx next build 2>&1 | tail -5`

**Step 4: Commit**

```bash
git add components/ui/spotlight.tsx components/ui/animated-group.tsx
git commit -m "feat: add Spotlight and AnimatedGroup utility components"
```

---

## Task 3: Create Section Components (ScrollReveal, BentoCard, TerminalBlock, GlowButton)

**Files:**
- Create: `components/ui/scroll-reveal.tsx`
- Create: `components/ui/bento-card.tsx`
- Create: `components/ui/terminal-block.tsx`
- Create: `components/ui/glow-button.tsx`

**Step 1: Create ScrollReveal wrapper**

`components/ui/scroll-reveal.tsx` — triggers animation when element enters viewport.

```tsx
"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Create BentoCard**

`components/ui/bento-card.tsx` — dark card with inset glow on hover.

```tsx
"use client";

import { cn } from "@/lib/utils";

export function BentoCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900/60 p-6 transition-all duration-300",
        "hover:border-yellow-500/20 hover:shadow-[inset_0_1px_0_0_rgba(234,179,8,0.06)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-500/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

**Step 3: Create TerminalBlock**

`components/ui/terminal-block.tsx` — terminal-style code block with dots and copy button.

```tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function TerminalBlock({
  children,
  copyText,
}: {
  children: React.ReactNode;
  copyText?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copyText) return;
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="relative overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950">
      {/* Terminal chrome */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
      </div>

      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-zinc-300">
        {children}
      </pre>

      {copyText && (
        <button
          onClick={handleCopy}
          className="absolute right-3 top-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border border-zinc-700 bg-zinc-900 text-zinc-400 transition-colors hover:border-yellow-500/30 hover:text-yellow-500"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}
```

**Step 4: Create GlowButton**

`components/ui/glow-button.tsx` — CTA button with ambient glow.

```tsx
import { cn } from "@/lib/utils";

export function GlowButton({
  children,
  href,
  className,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  variant?: "primary" | "ghost";
}) {
  if (variant === "ghost") {
    return (
      <a
        href={href}
        className={cn(
          "inline-flex items-center gap-1.5 font-mono text-sm text-zinc-400 transition-colors hover:text-yellow-500",
          "border-b border-zinc-700 pb-0.5 hover:border-yellow-500/30",
          className
        )}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm bg-yellow-500 px-6 py-3 font-mono text-sm font-bold text-zinc-950 transition-all",
        "hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(234,179,8,0.25),0_0_60px_rgba(234,179,8,0.1)]",
        className
      )}
    >
      {children}
    </a>
  );
}
```

**Step 5: Verify build**

Run: `cd /Users/tomo/Projects/design-loop/site && npx next build 2>&1 | tail -5`

**Step 6: Commit**

```bash
git add components/ui/scroll-reveal.tsx components/ui/bento-card.tsx components/ui/terminal-block.tsx components/ui/glow-button.tsx
git commit -m "feat: add ScrollReveal, BentoCard, TerminalBlock, GlowButton components"
```

---

## Task 4: Build the Hero Section

**Files:**
- Create: `components/sections/hero.tsx`

**Step 1: Create Hero section**

`components/sections/hero.tsx` — Spotlight background, animated text reveal, badge, dual CTAs.

```tsx
"use client";

import { AnimatedGroup } from "@/components/ui/animated-group";
import { FloatingPathsBackground } from "@/components/ui/floating-paths";
import { Spotlight } from "@/components/ui/spotlight";
import { GlowButton } from "@/components/ui/glow-button";

export function Hero() {
  return (
    <Spotlight className="relative min-h-[90vh] flex items-center justify-center">
      <FloatingPathsBackground position={-1} className="absolute inset-0">
        <div />
      </FloatingPathsBackground>

      <div className="relative z-10 mx-auto max-w-[1100px] px-6 py-32 text-center">
        <AnimatedGroup>
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/[0.04] px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-widest text-yellow-500">
            Claude Code Plugin
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-[760px] font-serif text-5xl font-normal leading-[1.08] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            AI can code your UI.
            <br />
            But it can&apos;t{" "}
            <em className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite] italic">
              see
            </em>{" "}
            it.
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-8 max-w-[540px] text-lg leading-relaxed text-zinc-400" style={{ textWrap: "balance" } as React.CSSProperties}>
            design-loop gives Claude eyes. Screenshot. Measure. Score. Fix.
            Repeat — fully autonomous — until your UI is polished.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <GlowButton href="#install">Get Started →</GlowButton>
            <GlowButton href="#how-it-works" variant="ghost">Watch it work ↓</GlowButton>
          </div>

          {/* Framework note */}
          <p className="mt-8 font-mono text-xs tracking-wide text-zinc-500">
            Works with Next.js, Nuxt, SvelteKit, React, Vue, Astro, and more.
          </p>
        </AnimatedGroup>
      </div>
    </Spotlight>
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/tomo/Projects/design-loop/site && npx next build 2>&1 | tail -5`

**Step 3: Commit**

```bash
git add components/sections/hero.tsx
git commit -m "feat: add cinematic Hero section with spotlight and animated text"
```

---

## Task 5: Build How It Works Section

**Files:**
- Create: `components/sections/how-it-works.tsx`

**Step 1: Create HowItWorks section**

Uses Lucide icons for each step, horizontal flow with glowing connectors.

```tsx
"use client";

import { Camera, Ruler, BarChart3, Wrench, Repeat } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion } from "motion/react";

const STEPS = [
  { icon: Camera, title: "Screenshot", desc: "Playwright captures the page" },
  { icon: Ruler, title: "Measure", desc: "JS checks layout metrics" },
  { icon: BarChart3, title: "Score", desc: "8 criteria rated 1-5" },
  { icon: Wrench, title: "Fix", desc: "Top 3 issues fixed in code" },
  { icon: Repeat, title: "Repeat", desc: "Loops until polished" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-zinc-50 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 max-w-lg text-zinc-400">
            Five steps per iteration. Each one makes the page measurably better.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-0">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.08}>
              <div className="relative flex flex-col items-center text-center sm:px-4">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute right-0 top-7 hidden h-px w-full translate-x-1/2 sm:block">
                    <div className="h-px w-full bg-gradient-to-r from-yellow-500/40 to-yellow-500/10" />
                  </div>
                )}

                {/* Icon circle */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                  <step.icon className="h-5 w-5 text-yellow-500" />
                </div>

                <h3 className="mt-4 font-semibold text-zinc-100">{step.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-500">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/sections/how-it-works.tsx
git commit -m "feat: add HowItWorks section with Lucide icons and step flow"
```

---

## Task 6: Build Phase Timeline Section

**Files:**
- Create: `components/sections/phase-timeline.tsx`

**Step 1: Create PhaseTimeline section**

Scroll-triggered timeline with glowing dots and connectors.

```tsx
"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

const PHASES = [
  { range: "1-3", focus: "Spacing & Layout", why: "Biggest visual impact first" },
  { range: "4-6", focus: "Hierarchy & Contrast", why: "Typography and readability" },
  { range: "7-9", focus: "Alignment & Consistency", why: "Edge alignment, pattern unification" },
  { range: "10+", focus: "Density & Polish", why: "Content balance, final touches" },
];

export function PhaseTimeline() {
  return (
    <section className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-zinc-50 sm:text-4xl">
            Structured, not random
          </h2>
          <p className="mt-3 max-w-lg text-zinc-400">
            design-loop follows a deliberate progression — spacing first because layout problems cascade, typography second, alignment and polish last.
          </p>
        </ScrollReveal>

        <div className="mt-12">
          {PHASES.map((phase, i) => (
            <ScrollReveal key={phase.range} delay={i * 0.06}>
              <div className="flex items-start gap-5 pb-8">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-yellow-500 bg-yellow-500/10 shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                  {i < PHASES.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-yellow-500/40 to-zinc-800/40" style={{ minHeight: 32 }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-mono text-xs font-bold text-yellow-500">
                      Iter {phase.range}
                    </span>
                    <span className="font-semibold text-zinc-100">{phase.focus}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{phase.why}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/sections/phase-timeline.tsx
git commit -m "feat: add PhaseTimeline section with scroll-triggered glow"
```

---

## Task 7: Build 8 Design Fundamentals (Bento Grid) Section

**Files:**
- Create: `components/sections/criteria-grid.tsx`

**Step 1: Create CriteriaGrid section**

Bento-style grid showing the 8 design criteria with hover effects and score display.

```tsx
"use client";

import {
  LayoutGrid, Triangle, Circle, AlignLeft,
  Columns3, Equal, Pointer, Square,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BentoCard } from "@/components/ui/bento-card";

const CRITERIA = [
  { key: "spacing", icon: LayoutGrid, name: "Spacing", desc: "Consistent scale (4/8/12/16/24/32px). No cramped elements. Room to breathe.", phase: 1 },
  { key: "hierarchy", icon: Triangle, name: "Hierarchy", desc: "Clear visual weight order. Primary action obvious. Secondary muted.", phase: 2 },
  { key: "contrast", icon: Circle, name: "Contrast", desc: "Text readable against background. Interactive elements distinguishable.", phase: 2 },
  { key: "alignment", icon: AlignLeft, name: "Alignment", desc: "Elements on consistent grid. No orphaned items. Edges line up.", phase: 3 },
  { key: "density", icon: Columns3, name: "Density", desc: "Right amount of content per viewport. Not too sparse, not too cluttered.", phase: 4 },
  { key: "consistency", icon: Equal, name: "Consistency", desc: "Same patterns for same concepts. Colors meaningful, not random.", phase: 3 },
  { key: "touch", icon: Pointer, name: "Touch Targets", desc: "Buttons and links have at least 44px touch area on mobile.", phase: 1 },
  { key: "empty", icon: Square, name: "Empty States", desc: "Graceful when data is missing. Not broken, not blank.", phase: 4 },
];

export function CriteriaGrid() {
  return (
    <section className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-zinc-50 sm:text-4xl">
            8 design fundamentals
          </h2>
          <p className="mt-3 max-w-lg text-zinc-400">
            Every screenshot is scored. Every score has a reason.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {CRITERIA.map((c, i) => (
            <ScrollReveal key={c.key} delay={i * 0.04}>
              <BentoCard>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-yellow-500/[0.08]">
                    <c.icon className="h-4 w-4 text-yellow-500" />
                  </div>
                  <h3 className="flex-1 font-semibold text-zinc-100">{c.name}</h3>
                  <span className="rounded-sm border border-zinc-800 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Phase {c.phase}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">{c.desc}</p>
              </BentoCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/sections/criteria-grid.tsx
git commit -m "feat: add CriteriaGrid section with bento cards and Lucide icons"
```

---

## Task 8: Build Stack Detection Section

**Files:**
- Create: `components/sections/stack-detection.tsx`

**Step 1: Create StackDetection section**

Animated pill tags with stagger entrance.

```tsx
"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion } from "motion/react";

const FRAMEWORKS = ["Next.js", "Nuxt", "SvelteKit", "React", "Vue", "Astro", "HTML"];
const COMPONENT_LIBS = ["shadcn/ui", "Radix UI", "Chakra UI", "Material UI", "Ant Design", "DaisyUI"];

const DETECTIONS = [
  { arrow: "→", text: "Reads your theme config, uses existing tokens — won't conflict" },
  { arrow: "→", text: "Framer Motion detected → uses motion.* components, respects AnimatePresence" },
  { arrow: "→", text: "React Three Fiber detected → 3D scenes marked off-limits, only fixes 2D layer" },
];

function Pill({ children, delay }: { children: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="inline-flex items-center rounded-sm border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 font-mono text-xs text-zinc-200 transition-colors hover:border-yellow-500/20 hover:text-yellow-500"
    >
      {children}
    </motion.span>
  );
}

export function StackDetection() {
  return (
    <section className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-zinc-50 sm:text-4xl">
            Knows your stack
          </h2>
          <p className="mt-3 max-w-lg text-zinc-400">
            Reads your package.json. Adapts automatically.
          </p>
        </ScrollReveal>

        <div className="mt-12 space-y-6">
          {/* Frameworks */}
          <div>
            <span className="mb-2.5 block font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Frameworks
            </span>
            <div className="flex flex-wrap gap-2">
              {FRAMEWORKS.map((fw, i) => (
                <Pill key={fw} delay={i * 0.04}>{fw}</Pill>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center px-3.5 py-2 font-mono text-xs italic text-zinc-600"
              >
                + more
              </motion.span>
            </div>
          </div>

          {/* Component Libraries */}
          <div>
            <span className="mb-2.5 block font-mono text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Component Libraries
            </span>
            <div className="flex flex-wrap gap-2">
              {COMPONENT_LIBS.map((lib, i) => (
                <Pill key={lib} delay={i * 0.04}>{lib}</Pill>
              ))}
            </div>
          </div>

          {/* Detection details */}
          <div className="mt-8 space-y-3">
            {DETECTIONS.map((d, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="flex items-start gap-3 rounded-sm border border-zinc-800 bg-zinc-900/40 p-4">
                  <span className="text-yellow-500">{d.arrow}</span>
                  <span className="text-sm text-zinc-300">{d.text}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/sections/stack-detection.tsx
git commit -m "feat: add StackDetection section with animated pills"
```

---

## Task 9: Build Iteration Demo Section (Preserve Existing)

**Files:**
- Create: `components/sections/iteration-demo.tsx`

**Step 1: Create IterationDemo section**

Extract the existing iteration switcher logic into a self-contained component. The `data-iteration` CSS custom property system stays INSIDE this component only. Copy the relevant CSS variables and styles into a scoped wrapper.

This is the most complex extraction — preserve the SCORES, BTN_LABELS, CRITERIA, and the interactive switcher. Frame it with a "See it in action" heading.

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const SCORES: Record<number, Record<string, number>> = {
  0: { spacing: 3, hierarchy: 2, contrast: 3, alignment: 3, density: 3, consistency: 3, touch: 3, empty: 2 },
  1: { spacing: 4, hierarchy: 3, contrast: 3, alignment: 3, density: 3, consistency: 3, touch: 3, empty: 3 },
  2: { spacing: 4, hierarchy: 4, contrast: 4, alignment: 4, density: 3, consistency: 3, touch: 4, empty: 3 },
  3: { spacing: 4, hierarchy: 4, contrast: 5, alignment: 4, density: 4, consistency: 4, touch: 4, empty: 4 },
  4: { spacing: 5, hierarchy: 5, contrast: 5, alignment: 5, density: 5, consistency: 5, touch: 5, empty: 4 },
};

const BTN_LABELS = ["Before", "Iter 1", "Iter 2", "Iter 3", "Final"];
const ITER_LABELS = [
  "Before (AI default)",
  "Iter 1 — Spacing",
  "Iter 2 — Hierarchy",
  "Iter 3 — Character",
  "Final — Polished",
];

function avg(s: Record<string, number>) {
  const vals = Object.values(s);
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

export function IterationDemo() {
  const [iter, setIter] = useState(0);
  const [playing, setPlaying] = useState(false);

  const next = useCallback(() => {
    setIter((p) => (p >= 4 ? 0 : p + 1));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [playing, next]);

  const s = SCORES[iter];
  const score = avg(s);

  return (
    <section className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-zinc-50 sm:text-4xl">
            See it in action
          </h2>
          <p className="mt-3 max-w-lg text-zinc-400">
            Watch scores improve across iterations. Click through or hit auto-play.
          </p>
        </ScrollReveal>

        <div className="mt-10 rounded-sm border border-zinc-800 bg-zinc-900/40 p-6">
          {/* Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {BTN_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => { setIter(i); setPlaying(false); }}
                className={`cursor-pointer rounded-sm px-3.5 py-2 font-mono text-xs transition-all ${
                  iter === i
                    ? "border-2 border-yellow-500 bg-yellow-500 font-bold text-zinc-950"
                    : "border border-zinc-700 text-zinc-400 hover:border-yellow-500/30 hover:text-yellow-500"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setPlaying(!playing)}
              className={`cursor-pointer rounded-sm border px-3 py-2 font-mono text-xs transition-all ${
                playing
                  ? "border-yellow-500/30 text-yellow-500"
                  : "border-zinc-700 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {playing ? "⏸ Stop" : "▶ Auto"}
            </button>
            <span className="ml-auto font-mono text-sm font-bold text-yellow-500">
              {score}/5
            </span>
          </div>

          {/* Score bars */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(s).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] capitalize text-zinc-500">{key}</span>
                  <span className="font-mono text-[11px] font-bold text-yellow-500">{val}/5</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${(val / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Label */}
          <div className="mt-4 flex items-center gap-3 rounded-sm border border-yellow-500/10 bg-yellow-500/[0.03] px-4 py-2.5">
            <span className="font-mono text-xs text-zinc-400">{ITER_LABELS[iter]}</span>
            {iter === 4 && (
              <span className="rounded-sm bg-yellow-500 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-zinc-950">
                Polished
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/sections/iteration-demo.tsx
git commit -m "feat: add IterationDemo section preserving interactive switcher"
```

---

## Task 10: Build Install, Features, CTA, and Footer Sections

**Files:**
- Create: `components/sections/install.tsx`
- Create: `components/sections/features.tsx`
- Create: `components/sections/final-cta.tsx`
- Create: `components/sections/footer.tsx`

**Step 1: Create Install section**

```tsx
"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TerminalBlock } from "@/components/ui/terminal-block";

export function Install() {
  return (
    <section id="install" className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-zinc-50 sm:text-4xl">
            One command away
          </h2>
          <p className="mt-3 max-w-lg text-zinc-400">
            Requires{" "}
            <a href="https://docs.anthropic.com/en/docs/claude-code" className="text-yellow-500 hover:underline">
              Claude Code
            </a>
            . Dependencies are auto-installed on first run.
          </p>
        </ScrollReveal>

        <div className="mt-8 space-y-4">
          <TerminalBlock copyText="claude plugin add https://github.com/tonymfer/design-loop">
            <span className="text-zinc-100">claude plugin add https://github.com/tonymfer/design-loop</span>
          </TerminalBlock>

          <ScrollReveal delay={0.1}>
            <p className="mt-6 text-sm font-semibold text-zinc-200">Usage</p>
          </ScrollReveal>

          <TerminalBlock copyText="/design-loop http://localhost:3000">
            <span className="text-zinc-500"># Start polishing</span>{"\n"}
            <span className="text-zinc-100">/design-loop http://localhost:3000</span>{"\n\n"}
            <span className="text-zinc-500"># Desktop viewport, 20 iterations</span>{"\n"}
            <span className="text-zinc-100">/design-loop http://localhost:3000/dashboard --viewport desktop --iterations 20</span>{"\n\n"}
            <span className="text-zinc-500"># Test both viewports</span>{"\n"}
            <span className="text-zinc-100">/design-loop http://localhost:5173 --viewport both</span>
          </TerminalBlock>

          <ScrollReveal delay={0.15}>
            <div className="mt-6 rounded-sm border border-yellow-500/10 bg-yellow-500/[0.03] p-5">
              <p className="text-sm text-zinc-300">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-yellow-500">Pro tip</span>
                <br />
                Use <code className="font-mono text-sm text-yellow-500">frontend-design</code> → <code className="font-mono text-sm text-yellow-500">design-loop</code> to get creative direction first, then iterate visually.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Create Features section**

```tsx
"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

const FEATURES = [
  { num: "01", title: "Fully Autonomous", desc: "Stop Hook keeps the loop running. Claude iterates until done — no babysitting." },
  { num: "02", title: "Zero Dependencies", desc: "No API key. No npm install. Playwright auto-installed on first run." },
  { num: "03", title: "CSS Cascade Audit", desc: "Detects unlayered resets overriding Tailwind v4. Finds bugs screenshots miss." },
  { num: "04", title: "9 Frameworks", desc: "Auto-detects Next.js, Nuxt, SvelteKit, Remix, Astro, React, Vue, and more." },
  { num: "05", title: "Phase-Aware Strategy", desc: "Spacing first, hierarchy second, alignment third, polish last." },
  { num: "06", title: "Stuck Detection", desc: "Tries alternative approaches. After 3 fails, documents TODO, moves on." },
  { num: "07", title: "Wide Viewport Check", desc: "Tests at 1920px to catch centering drift invisible at standard widths." },
];

export function Features() {
  return (
    <section className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-zinc-50 sm:text-4xl">
            Features
          </h2>
          <p className="mt-3 max-w-lg text-zinc-400">
            Autonomous. Framework-aware. Zero setup.
          </p>
        </ScrollReveal>

        <div className="mt-12">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.num} delay={i * 0.04}>
              <div className={`flex items-baseline gap-5 py-5 ${i < FEATURES.length - 1 ? "border-b border-zinc-800/60" : ""}`}>
                <span className="shrink-0 font-mono text-xs font-bold text-yellow-500">
                  {f.num}
                </span>
                <div>
                  <span className="font-semibold text-zinc-100">{f.title}</span>
                  <span className="ml-3 text-sm text-zinc-500">— {f.desc}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Create FinalCTA section**

```tsx
"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TerminalBlock } from "@/components/ui/terminal-block";
import { GlowButton } from "@/components/ui/glow-button";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => v.toFixed(1));

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [inView, value, motionValue]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function FinalCTA() {
  return (
    <section className="border-t border-zinc-800/60 py-24 text-center">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-zinc-50 sm:text-4xl">
            Stop guessing. Start measuring.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-8 flex items-center justify-center gap-4 font-mono text-2xl font-bold">
            <span className="text-zinc-600"><AnimatedNumber value={2.4} />/5</span>
            <div className="h-1.5 w-36 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className="h-full rounded-full bg-yellow-500"
                initial={{ width: "0%" }}
                whileInView={{ width: "80%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              />
            </div>
            <span className="text-yellow-500"><AnimatedNumber value={4.6} />/5</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10">
            <TerminalBlock copyText="claude plugin add https://github.com/tonymfer/design-loop">
              <span className="text-zinc-100">claude plugin add https://github.com/tonymfer/design-loop</span>
            </TerminalBlock>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="mt-8">
            <GlowButton href="https://github.com/tonymfer/design-loop">
              View on GitHub →
            </GlowButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

**Step 4: Create Footer**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 py-12 text-center">
      <p className="font-mono text-xs leading-loose text-zinc-500">
        Built by{" "}
        <a href="https://github.com/tonymfer" className="font-semibold text-yellow-500 hover:underline">
          tonymfer
        </a>
        {" · "}
        <a href="https://github.com/tonymfer/design-loop" className="font-semibold text-yellow-500 hover:underline">
          GitHub
        </a>
        {" · "}
        <span>MIT License</span>
      </p>
    </footer>
  );
}
```

**Step 5: Commit**

```bash
git add components/sections/install.tsx components/sections/features.tsx components/sections/final-cta.tsx components/sections/footer.tsx
git commit -m "feat: add Install, Features, FinalCTA, and Footer sections"
```

---

## Task 11: Rewrite page.tsx and globals.css

**Files:**
- Modify: `app/page.tsx` (full rewrite)
- Modify: `app/globals.css` (full rewrite — drop all data-iteration CSS, single dark theme)

**Step 1: Rewrite globals.css**

Replace the entire file. Remove all `[data-iteration="N"]` rules. Single dark theme with minimal CSS.

```css
@import "tailwindcss";

@theme {
  --font-sans: "DM Sans", system-ui, sans-serif;
  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-serif: "Instrument Serif", Georgia, serif;
  --font-mono: "JetBrains Mono", monospace;
}

@layer base {
  body {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    background: #09090b;
    color: #fafaf9;
  }
}

/* Shimmer animation for hero "see" text */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Noise texture overlay */
.noise-overlay::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* Ambient glow at top */
.ambient-glow::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -5%, rgba(234,179,8,0.1) 0%, transparent 55%),
    radial-gradient(ellipse 50% 30% at 50% 100%, rgba(234,179,8,0.04) 0%, transparent 50%);
}

/* Ensure content above overlays */
.ambient-glow > * {
  position: relative;
  z-index: 1;
}

/* Floating paths opacity */
.floating-paths-svg {
  opacity: 0.6;
}
```

**Step 2: Rewrite page.tsx**

Replace the entire file. Clean, modular composition.

```tsx
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
      <main className="mx-auto max-w-[1100px] px-6">
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
```

**Step 3: Remove "use client" from page.tsx if not needed**

The page itself is a server component — all client-side interactivity is in the section components.

**Step 4: Verify build**

Run: `cd /Users/tomo/Projects/design-loop/site && npx next build 2>&1 | tail -10`

**Step 5: Fix any build errors**

Address TypeScript or import issues.

**Step 6: Commit**

```bash
git add app/page.tsx app/globals.css
git commit -m "feat: rewrite page.tsx and globals.css for dark cinematic landing"
```

---

## Task 12: Visual QA and Polish

**Files:**
- Potentially modify any component or CSS file based on QA findings.

**Step 1: Run dev server**

Run: `cd /Users/tomo/Projects/design-loop/site && npm run dev`

**Step 2: Visual inspection in browser**

Open http://localhost:3000 and check:
- Hero renders with spotlight effect and animated text
- All sections load with scroll-triggered animations
- Iteration demo works (switcher, auto-play, scores)
- Terminal blocks have copy functionality
- Mobile responsive (resize browser)
- Ambient glow and noise texture visible
- No CLS from animations

**Step 3: Fix any visual issues found**

**Step 4: Final commit**

```bash
git add -A
git commit -m "polish: visual QA fixes for dark cinematic landing"
```

---

## Summary

| Task | Description | Est. Files |
|------|-------------|-----------|
| 1 | Install lucide-react | 2 |
| 2 | Spotlight + AnimatedGroup utilities | 2 |
| 3 | ScrollReveal + BentoCard + TerminalBlock + GlowButton | 4 |
| 4 | Hero section | 1 |
| 5 | How It Works section | 1 |
| 6 | Phase Timeline section | 1 |
| 7 | Criteria Grid section | 1 |
| 8 | Stack Detection section | 1 |
| 9 | Iteration Demo section | 1 |
| 10 | Install + Features + CTA + Footer sections | 4 |
| 11 | Rewrite page.tsx + globals.css | 2 |
| 12 | Visual QA and polish | varies |

**Total:** ~20 new/modified files, 12 tasks
