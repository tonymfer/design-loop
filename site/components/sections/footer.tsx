import React from "react";

export function Footer() {
  return (
    <footer className="section-divider py-16 text-center">
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Brand wordmark */}
        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-lg font-bold tracking-tight text-[var(--text-secondary)]">
            design<span className="text-[var(--accent)]">-</span>loop
          </p>
          <div className="hero-accent-line" />
        </div>

        {/* Tagline */}
        <p className="mt-4 font-serif text-sm italic text-[var(--text-muted)]">
          AI can code your UI. Now it can see it.
        </p>

        {/* Links */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <a
            href="https://github.com/tonymfer"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            @tonymfer
          </a>
          <span className="text-[var(--border)]">/</span>
          <a
            href="https://github.com/tonymfer/design-loop"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            GitHub
          </a>
          <span className="text-[var(--border)]">/</span>
          <span className="font-mono text-xs text-[var(--text-muted)]">MIT</span>
        </div>

        <p className="mt-6 font-mono text-[10px] text-[var(--text-muted)] opacity-60">
          v1.0.0
        </p>
      </div>
    </footer>
  );
}
