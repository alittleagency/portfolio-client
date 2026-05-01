"use client";

import { useEffect, useMemo, useState } from "react";
import { AnchorZone } from "@/components/hub/AnchorZone";
import { GroundingPanel } from "@/components/hub/GroundingPanel";
import { WidgetGrid } from "@/components/hub/WidgetGrid";
import { JENKINS_WIDGETS } from "@/lib/jenkins-data";
import {
  type SpoonLevel,
  computeHubState,
  densityClass,
  modeClass,
} from "@/lib/spoon-logic";

const STORAGE_KEY = "spoonstack:spoons";
const DEFAULT_SPOONS: SpoonLevel = 8;

export default function DisplayPage() {
  // Spoon level: persisted in localStorage, hydrated client-side.
  const [spoons, setSpoons] = useState<SpoonLevel>(DEFAULT_SPOONS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        const n = parseInt(raw, 10);
        if (Number.isFinite(n) && n >= 0 && n <= 10) {
          setSpoons(n as SpoonLevel);
        }
      }
    } catch {
      // localStorage may be blocked in kiosk mode — fall back to default
    }
    setHydrated(true);
  }, []);

  const handleSpoonChange = (next: SpoonLevel) => {
    setSpoons(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
  };

  // Recompute hub state when spoons change. We also re-resolve mode every minute
  // so the time-of-day mode flips at noon / 5pm without a reload.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const state = useMemo(
    () => computeHubState(spoons),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spoons, tick],
  );

  // Block right-click + zoom gestures (kiosk hardening).
  useEffect(() => {
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onGesture = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      // Block Cmd/Ctrl + (=, -, 0) zoom shortcuts
      if ((e.metaKey || e.ctrlKey) && ["=", "-", "0", "+"].includes(e.key)) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("gesturestart", onGesture);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("gesturestart", onGesture);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Order widgets by priority and trim to the count this spoon level allows.
  const visibleWidgets = useMemo(() => {
    const sorted = [...JENKINS_WIDGETS].sort((a, b) => a.priority - b.priority);
    return sorted.slice(0, state.widgetCount);
  }, [state.widgetCount]);

  // Avoid SSR/CSR class mismatch — render with default mode until hydrated.
  const rootClass = `kiosk-root min-h-screen flex flex-col ${
    hydrated ? modeClass(state.mode) : "mode-morning"
  } ${densityClass(state.density)} ${state.staticMode ? "static-mode" : ""}`;

  return (
    <main className={rootClass} style={{ background: "var(--bg)" }}>
      <AnchorZone spoons={spoons} onSpoonChange={handleSpoonChange} />

      {state.mode === "freeze" ? (
        <GroundingPanel />
      ) : (
        <WidgetGrid
          widgets={visibleWidgets}
          density={state.density}
          staticMode={state.staticMode}
        />
      )}
    </main>
  );
}
