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
        "group relative rounded-sm border border-zinc-800 bg-zinc-900/60 p-6 transition-colors hover:border-yellow-500/20",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-sm bg-gradient-to-br from-yellow-500/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
