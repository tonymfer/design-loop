"use client";

import { motion } from "motion/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const frameworks = [
  "Next.js",
  "Nuxt",
  "SvelteKit",
  "React",
  "Vue",
  "Astro",
  "HTML",
];

const componentLibraries = [
  "shadcn/ui",
  "Radix UI",
  "Chakra UI",
  "Material UI",
  "Ant Design",
  "DaisyUI",
];

const detectionDetails = [
  { text: "Reads your theme config, uses existing tokens \u2014 won\u2019t conflict", accent: false },
  { text: "Framer Motion detected \u2192 uses motion.* components, respects AnimatePresence", accent: true },
  { text: "React Three Fiber detected \u2192 3D scenes marked off-limits, only fixes 2D layer", accent: false },
];

export function StackDetection() {
  return (
    <section className="border-t border-[var(--border)] py-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
            <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">Knows your stack</span>
          </h2>
          <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
            Auto-detects your framework, component library, and animation
            system. Adapts its fixes to match.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {/* Frameworks */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[color-mix(in_srgb,var(--accent),transparent_40%)]">
              Frameworks
            </p>
            <div className="flex flex-wrap gap-2">
              {frameworks.map((name, i) => (
                <motion.span
                  key={name}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-mono text-xs text-[var(--text-secondary)] transition-all hover:border-[color-mix(in_srgb,var(--accent),transparent_70%)] hover:text-[var(--accent)]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {name}
                </motion.span>
              ))}
              <motion.span
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-mono text-xs text-[var(--text-muted)]"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: frameworks.length * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                + more
              </motion.span>
            </div>
          </div>

          {/* Component Libraries */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[color-mix(in_srgb,var(--accent-2),transparent_40%)]">
              Component Libraries
            </p>
            <div className="flex flex-wrap gap-2">
              {componentLibraries.map((name, i) => (
                <motion.span
                  key={name}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-mono text-xs text-[var(--text-secondary)] transition-all hover:border-[color-mix(in_srgb,var(--accent-2),transparent_70%)] hover:text-[var(--accent-2)]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {name}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Detection details — compact inline */}
        <ScrollReveal delay={0.1}>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {detectionDetails.map((detail, i) => (
              <p key={i} className="text-xs text-[var(--text-muted)]">
                <span className="text-[color-mix(in_srgb,var(--accent),transparent_40%)]">&rarr;</span>{" "}
                {detail.text}
              </p>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
