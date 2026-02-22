"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function BentoCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:border-[color-mix(in_srgb,var(--accent),transparent_70%)] hover:bg-[var(--surface)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-[rgba(var(--accent-rgb),0.06)] via-transparent to-[rgba(var(--accent-2-rgb),0.04)] opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
