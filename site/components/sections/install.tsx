"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TerminalBlock } from "@/components/ui/terminal-block";

export function Install() {
  return (
    <section id="install" className="border-t border-[var(--border)] py-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
            <span className="bg-gradient-to-r from-zinc-100 via-cyan-200 to-zinc-400 bg-clip-text text-transparent">One command away</span>
          </h2>
          <p className="mt-4 max-w-xl text-[var(--text-secondary)]">
            Requires{" "}
            <a
              href="https://docs.anthropic.com/en/docs/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              Claude Code
            </a>
            . Install the plugin and start iterating.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-8">
            <TerminalBlock>
              claude plugin add https://github.com/tonymfer/design-loop
            </TerminalBlock>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h3 className="mt-10 text-base font-semibold text-[var(--text-primary)]">Usage</h3>
          <div className="mt-3">
            <TerminalBlock>
              <code>
                <span className="text-[var(--text-muted)]"># Start polishing</span>
                {"\n"}
                <span className="text-[var(--text-primary)]">
                  /design-loop http://localhost:3000
                </span>
                {"\n\n"}
                <span className="text-[var(--text-muted)]">
                  # 20 iterations on a dashboard
                </span>
                {"\n"}
                <span className="text-[var(--text-primary)]">
                  /design-loop http://localhost:3000/dashboard 20
                </span>
                {"\n\n"}
                <span className="text-[var(--text-muted)]"># No limit — runs until all criteria hit 4/5+</span>
                {"\n"}
                <span className="text-[var(--text-primary)]">
                  /design-loop http://localhost:5173 0
                </span>
              </code>
            </TerminalBlock>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-8 rounded-xl border border-[rgba(var(--accent-rgb),0.1)] border-l-[rgba(var(--accent-rgb),0.4)] border-l-2 bg-[rgba(var(--accent-rgb),0.04)] p-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              Pro Tip
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              Use{" "}
              <code className="font-mono text-sm text-[var(--accent)]">
                frontend-design
              </code>{" "}
              &rarr;{" "}
              <code className="font-mono text-sm text-[var(--accent)]">
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
