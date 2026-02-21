import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10 text-center">
      <div className="mx-auto max-w-[1100px] px-6">
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
        <p className="mt-3 font-mono text-[10px] text-[var(--text-muted)]">
          design-loop v1.0.0
        </p>
      </div>
    </footer>
  );
}
