/**
 * Spoon-adaptive density + time-of-day mode logic.
 *
 * Spoon level (0-10) determines how much content the Hub shows.
 * Time of day determines the accent + background tint.
 * Spoon level overrides time when low (≤4 → coral, 0/Freeze → ice blue).
 */

export type SpoonLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Mode = "freeze" | "low" | "morning" | "day" | "evening";

export type Density = "grounding" | "single" | "minimal" | "headline" | "full";

export interface HubState {
  mode: Mode;
  density: Density;
  /** Max widgets to render in the stack zone. */
  widgetCount: number;
  /** Whether all transitions/animations are disabled. */
  staticMode: boolean;
  /** Whether sub-item detail (lists under each widget) is visible. */
  showSubItems: boolean;
}

/** Map spoon level → max widget count per the spec. */
export function widgetCountForSpoons(spoons: SpoonLevel): number {
  if (spoons === 0) return 1; // grounding only
  if (spoons <= 2) return 1;
  if (spoons <= 4) return 3;
  if (spoons <= 7) return 4;
  return 6; // 8-10
}

/** Map spoon level → density tier per the spec. */
export function densityForSpoons(spoons: SpoonLevel): Density {
  if (spoons === 0) return "grounding";
  if (spoons <= 2) return "single";
  if (spoons <= 4) return "minimal";
  if (spoons <= 7) return "headline";
  return "full"; // 8-10
}

/**
 * Resolve the active mode. Spoon level overrides time when low.
 * Freeze (0) > Low (≤4) > time-of-day.
 */
export function resolveMode(spoons: SpoonLevel, hour: number): Mode {
  if (spoons === 0) return "freeze";
  if (spoons <= 4) return "low";
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 17 && hour < 21) return "evening";
  return "day";
}

/** Single entry point: compute the full hub state from spoons + current time. */
export function computeHubState(spoons: SpoonLevel, now: Date = new Date()): HubState {
  const hour = now.getHours();
  const mode = resolveMode(spoons, hour);
  const density = densityForSpoons(spoons);
  const widgetCount = widgetCountForSpoons(spoons);

  // Static mode: low + freeze disable transitions entirely.
  const staticMode = mode === "freeze" || mode === "low";
  const showSubItems = density === "full";

  return { mode, density, widgetCount, staticMode, showSubItems };
}

/** Body class for the resolved mode. */
export function modeClass(mode: Mode): string {
  return `mode-${mode}`;
}

/** Density class for the stack zone. */
export function densityClass(density: Density): string {
  return `density-${density}`;
}

/** Format a time as "7:42" (no leading zero, no AM/PM, kiosk-style). */
export function formatTime(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/** "Thursday · May 1" */
export function formatDate(d: Date): string {
  const day = d.toLocaleDateString("en-US", { weekday: "long" });
  const md = d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  return `${day} · ${md}`;
}

/** A short grounding line for freeze (0 spoons). */
export function groundingStatement(): string {
  return "You are here. The day will keep without you for a minute.";
}
