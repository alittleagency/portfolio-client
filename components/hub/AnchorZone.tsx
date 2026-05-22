"use client";

import { useEffect, useState } from "react";
import type { SpoonLevel } from "@/lib/spoon-logic";
import { formatDate, formatTime } from "@/lib/spoon-logic";
import { SpoonMeter } from "./SpoonMeter";

interface AnchorZoneProps {
  spoons: SpoonLevel;
  onSpoonChange: (next: SpoonLevel) => void;
}

export function AnchorZone({ spoons, onSpoonChange }: AnchorZoneProps) {
  const [now, setNow] = useState<Date | null>(null);

  // Hydrate clock client-side and tick every 15s. Avoids SSR mismatch.
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="flex items-start justify-between px-8 pt-8 pb-6"
      style={{ minHeight: "30vh" }}
    >
      <div>
        <div className="anchor-time xfade">
          {now ? formatTime(now) : "—:—"}
        </div>
        <div className="anchor-date">{now ? formatDate(now) : ""}</div>
      </div>
      <div className="freeze-hide">
        <SpoonMeter spoons={spoons} onChange={onSpoonChange} />
      </div>
    </header>
  );
}
