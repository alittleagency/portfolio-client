"use client";

import { groundingStatement } from "@/lib/spoon-logic";

/**
 * Shown when spoons === 0 (Freeze). Replaces the entire stack zone.
 * No widgets, no tasks, no animation. Just one sentence.
 */
export function GroundingPanel() {
  return (
    <div
      className="stack-zone static-mode flex-1 px-10 pb-12 flex items-start"
      style={{ minHeight: "70vh" }}
    >
      <p
        className="density-grounding"
        style={{ color: "var(--accent-dark)", maxWidth: "32ch" }}
      >
        {groundingStatement()}
      </p>
    </div>
  );
}
