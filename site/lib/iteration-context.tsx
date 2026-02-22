"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ModeType } from "@/lib/demo-data";

interface IterationContextValue {
  iteration: number;
  setIteration: (v: number) => void;
  mode: ModeType;
  setMode: (v: ModeType) => void;
  archetype: string;
  setArchetype: (v: string) => void;
}

const IterationContext = createContext<IterationContextValue>({
  iteration: 4,
  setIteration: () => {},
  mode: "creative-unleash",
  setMode: () => {},
  archetype: "Beeper",
  setArchetype: () => {},
});

export function IterationProvider({ children }: { children: ReactNode }) {
  const [iteration, setIteration] = useState(4);
  const [mode, setMode] = useState<ModeType>("creative-unleash");
  const [archetype, setArchetype] = useState("Beeper");
  return (
    <IterationContext.Provider
      value={{ iteration, setIteration, mode, setMode, archetype, setArchetype }}
    >
      {children}
    </IterationContext.Provider>
  );
}

export function useIteration() {
  return useContext(IterationContext);
}
