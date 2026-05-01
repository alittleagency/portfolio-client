"use client";

import type { SpoonLevel } from "@/lib/spoon-logic";

interface SpoonMeterProps {
  spoons: SpoonLevel;
  onChange: (next: SpoonLevel) => void;
}

const PIPS: SpoonLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function SpoonMeter({ spoons, onChange }: SpoonMeterProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="mono-label">Spoons</div>
      <div
        className="flex items-center gap-1"
        role="slider"
        aria-label="Spoon level"
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={spoons}
      >
        {PIPS.map((n) => (
          <button
            key={n}
            type="button"
            className="spoon-tap tap"
            onClick={() => onChange(n === spoons ? ((n - 1) as SpoonLevel) : n)}
            aria-label={`Set spoons to ${n}`}
          >
            <span
              className={`spoon-pip xfade ${n <= spoons ? "filled" : ""}`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      <div className="mono-label" style={{ color: "var(--accent-dark)" }}>
        {spoons} / 10
      </div>
    </div>
  );
}
