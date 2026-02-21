import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 py-12 text-center">
      <p className="font-mono text-xs text-zinc-500">
        Built by{" "}
        <a
          href="https://github.com/tonymfer"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-yellow-500 hover:underline"
        >
          tonymfer
        </a>
        {" \u00B7 "}
        <a
          href="https://github.com/tonymfer/design-loop"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-yellow-500 hover:underline"
        >
          GitHub
        </a>
        {" \u00B7 "}
        MIT License
      </p>
    </footer>
  );
}
