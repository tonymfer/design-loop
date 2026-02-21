"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TerminalBlock } from "@/components/ui/terminal-block";

export function Install() {
  return (
    <section id="install" className="border-t border-zinc-800/60 py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-50">
            One command away
          </h2>
          <p className="mt-4 max-w-xl text-zinc-400">
            Requires{" "}
            <a
              href="https://docs.anthropic.com/en/docs/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:underline"
            >
              Claude Code
            </a>
            . Install the plugin and start iterating.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-10">
            <TerminalBlock>
              claude plugin add https://github.com/tonymfer/design-loop
            </TerminalBlock>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h3 className="mt-14 text-sm font-semibold text-zinc-200">Usage</h3>
          <div className="mt-4">
            <TerminalBlock>
              <code>
                <span className="text-zinc-500"># Start polishing</span>
                {"\n"}
                <span className="text-zinc-100">
                  /design-loop http://localhost:3000
                </span>
                {"\n\n"}
                <span className="text-zinc-500">
                  # Desktop viewport, 20 iterations
                </span>
                {"\n"}
                <span className="text-zinc-100">
                  /design-loop http://localhost:3000/dashboard --viewport
                  desktop --iterations 20
                </span>
                {"\n\n"}
                <span className="text-zinc-500"># Test both viewports</span>
                {"\n"}
                <span className="text-zinc-100">
                  /design-loop http://localhost:5173 --viewport both
                </span>
              </code>
            </TerminalBlock>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10 rounded-sm border border-yellow-500/10 bg-yellow-500/[0.03] p-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-yellow-500">
              Pro Tip
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Use{" "}
              <code className="font-mono text-sm text-yellow-500">
                frontend-design
              </code>{" "}
              &rarr;{" "}
              <code className="font-mono text-sm text-yellow-500">
                design-loop
              </code>{" "}
              to get creative direction first, then iterate visually.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
