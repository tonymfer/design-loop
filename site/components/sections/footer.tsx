import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-12 text-center">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-4 font-mono text-sm font-bold tracking-tight text-[var(--text-secondary)]">
          design<span className="text-[var(--accent)]">-</span>loop
        </p>
        <p className="font-mono text-xs text-[var(--text-muted)]">
          Built by{" "}
          <a
            href="https://github.com/tonymfer"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            tonymfer
          </a>
          {" \u00B7 "}
          <a
            href="https://github.com/tonymfer/design-loop"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            GitHub
          </a>
          {" \u00B7 "}
          MIT License
        </p>
        <div className="mx-auto mt-5 h-px w-12 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />
        <p className="mt-5 font-mono text-[10px] text-[var(--text-muted)]">
          v1.0.0
        </p>
      </div>
    </footer>
  );
}
