"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type SpoonBudget = "HIGH" | "OKAY" | "LOW" | "CRISIS";

interface SpoonBudgetCtx {
  budget: SpoonBudget;
  setBudget: (b: SpoonBudget) => void;
}

const SpoonBudgetContext = createContext<SpoonBudgetCtx>({
  budget: "OKAY",
  setBudget: () => undefined,
});

export function SpoonBudgetProvider({ children }: { children: ReactNode }) {
  const [budget, setBudget] = useState<SpoonBudget>("OKAY");
  return React.createElement(
    SpoonBudgetContext.Provider,
    { value: { budget, setBudget } },
    children,
  );
}

export function useSpoonBudget(): SpoonBudgetCtx {
  return useContext(SpoonBudgetContext);
}
