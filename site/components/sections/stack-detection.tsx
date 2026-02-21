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
  "Reads your theme config, uses existing tokens \u2014 won\u2019t conflict",
  "Framer Motion detected \u2192 uses motion.* components, respects AnimatePresence",
  "React Three Fiber detected \u2192 3D scenes marked off-limits, only fixes 2D layer",
];

export function StackDetection() {
  return (
    <section className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-50">
            Knows your stack
          </h2>
          <p className="mt-4 max-w-xl text-zinc-400">
            Auto-detects your framework, component library, and animation
            system. Adapts its fixes to match.
          </p>
        </ScrollReveal>

        {/* Frameworks */}
        <div className="mt-12 space-y-8">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
              Frameworks
            </p>
            <div className="flex flex-wrap gap-2">
              {frameworks.map((name, i) => (
                <motion.span
                  key={name}
                  className="rounded-sm border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 font-mono text-xs text-zinc-200 transition-colors hover:border-yellow-500/20 hover:text-yellow-500"
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
                className="rounded-sm border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 font-mono text-xs text-zinc-500"
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
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
              Component Libraries
            </p>
            <div className="flex flex-wrap gap-2">
              {componentLibraries.map((name, i) => (
                <motion.span
                  key={name}
                  className="rounded-sm border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 font-mono text-xs text-zinc-200 transition-colors hover:border-yellow-500/20 hover:text-yellow-500"
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

        {/* Detection details */}
        <div className="mt-10 space-y-3">
          {detectionDetails.map((detail, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <div className="rounded-sm border border-zinc-800 bg-zinc-900/40 p-4">
                <p className="text-sm text-zinc-300">
                  <span className="text-yellow-500">&rarr;</span>{" "}
                  {detail}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
