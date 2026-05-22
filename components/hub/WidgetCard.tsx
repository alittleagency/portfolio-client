"use client";

import type { Widget } from "@/lib/jenkins-data";
import type { Density } from "@/lib/spoon-logic";

interface WidgetCardProps {
  widget: Widget;
  density: Density;
  staticMode: boolean;
}

const FLAG_DOT: Record<NonNullable<Widget["subItems"][number]["flag"]>, string> = {
  missing: "var(--coral)",
  warning: "var(--amber)",
  ok: "var(--accent)",
};

export function WidgetCard({ widget, density, staticMode }: WidgetCardProps) {
  return (
    <article
      className={`card card-stripe ${staticMode ? "" : "xfade"}`}
      aria-labelledby={`widget-${widget.id}-title`}
    >
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <h2
          id={`widget-${widget.id}-title`}
          className="font-semibold text-[20px] leading-tight tracking-tight"
        >
          {widget.title}
        </h2>
        <span className="mono-label whitespace-nowrap">{widget.outputLabel}</span>
      </div>

      {density === "full" && (
        <p className="text-[13px] text-ink-2 mb-3">{widget.descriptor}</p>
      )}

      <div className={`mt-1 ${densityBodyClass(density)}`}>
        <p>{widget.headline}</p>

        {density === "full" && widget.subItems.length > 0 && (
          <ul className="sub-items mt-4 space-y-2">
            {widget.subItems.map((item, i) => (
              <li key={i} className="flex items-baseline gap-3">
                <span
                  className="mono-label inline-block w-[88px] shrink-0"
                  style={{ color: "var(--ink-2)" }}
                >
                  {item.label}
                </span>
                <span className="flex-1 text-[15px] leading-snug">
                  {item.detail}
                </span>
                {item.flag && (
                  <span
                    className="inline-block w-[8px] h-[8px] rounded-full shrink-0"
                    style={{ background: FLAG_DOT[item.flag] }}
                    aria-label={item.flag}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function densityBodyClass(density: Density): string {
  return `density-${density}`;
}
