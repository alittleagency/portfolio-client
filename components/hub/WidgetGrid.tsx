"use client";

import type { Widget } from "@/lib/jenkins-data";
import type { Density } from "@/lib/spoon-logic";
import { WidgetCard } from "./WidgetCard";

interface WidgetGridProps {
  widgets: Widget[];
  density: Density;
  staticMode: boolean;
}

export function WidgetGrid({ widgets, density, staticMode }: WidgetGridProps) {
  if (widgets.length === 0) return null;

  return (
    <div
      className={`stack-zone flex-1 px-8 pb-8 ${staticMode ? "static-mode" : ""}`}
      style={{ minHeight: "70vh" }}
    >
      <div className="flex flex-col gap-4">
        {widgets.map((w) => (
          <WidgetCard
            key={w.id}
            widget={w}
            density={density}
            staticMode={staticMode}
          />
        ))}
      </div>
    </div>
  );
}
