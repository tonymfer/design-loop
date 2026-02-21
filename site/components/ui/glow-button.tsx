import React from "react";
import { cn } from "@/lib/utils";

export function GlowButton({
  children,
  href,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "glow-btn inline-block font-mono text-sm transition-all",
        variant === "primary" &&
          "rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-white font-medium hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(var(--accent-rgb),0.4)]",
        variant === "ghost" &&
          "border-b border-[var(--text-muted)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        className
      )}
    >
      {children}
    </a>
  );
}
