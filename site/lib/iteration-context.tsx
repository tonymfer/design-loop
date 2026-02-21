"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface IterationContextValue {
  iteration: number;
  setIteration: (v: number) => void;
}

const IterationContext = createContext<IterationContextValue>({
  iteration: 4,
  setIteration: () => {},
});

export function IterationProvider({ children }: { children: ReactNode }) {
  const [iteration, setIteration] = useState(4);
  return (
    <IterationContext.Provider value={{ iteration, setIteration }}>
      {children}
    </IterationContext.Provider>
  );
}

export function useIteration() {
  return useContext(IterationContext);
}
