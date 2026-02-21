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
        "inline-block font-mono text-sm transition-all",
        variant === "primary" &&
          "rounded-sm bg-yellow-500 px-6 py-3 text-zinc-950 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(234,179,8,0.3)]",
        variant === "ghost" &&
          "border-b border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500",
        className
      )}
    >
      {children}
    </a>
  );
}
