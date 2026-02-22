"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function TerminalBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text =
      typeof children === "string"
        ? children
        : (document.querySelector("[data-terminal-content]")?.textContent ??
          "");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg shadow-black/20",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
      </div>
      <button
        onClick={handleCopy}
        className="absolute right-3 top-10 text-zinc-500 transition-colors hover:text-zinc-300"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-cyan-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre
        className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[var(--text-primary)]"
        data-terminal-content
      >
        {children}
      </pre>
    </div>
  );
}
