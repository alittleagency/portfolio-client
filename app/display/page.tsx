"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  SpoonBudgetProvider,
  useSpoonBudget,
  type SpoonBudget,
} from "@/lib/spoon-budget";
import { getRecentBrainEntries } from "@/lib/brain/db";
import { STACKS } from "@/lib/display-stacks";

// ─── design tokens ───────────────────────────────────────────────────────────

const C = {
  bg: "#FAF7F0",
  card: "#FFFDF7",
  ink: "#2C2820",
  inkSoft: "#6B6254",
  inkFaint: "#B5AA97",
  gold: "#DAAF2E",
  green: "#1D9E75",
} as const;

const CARD_SHADOW = "0 2px 12px rgba(44,40,32,.07)";

// ─── icon components ─────────────────────────────────────────────────────────

function IconHome({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 8.5 10 2l8 6.5V18a1 1 0 01-1 1H3a1 1 0 01-1-1V8.5z" />
      <path d="M7 19v-6h6v6" />
    </svg>
  );
}

function IconGrid({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="2" y="2" width="6" height="6" rx="1.5" />
      <rect x="12" y="2" width="6" height="6" rx="1.5" />
      <rect x="2" y="12" width="6" height="6" rx="1.5" />
      <rect x="12" y="12" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function IconBrain({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="10" cy="7" r="3" />
      <path d="M4 13a3.5 3.5 0 017 0" />
      <circle cx="4" cy="15" r="2" />
      <circle cx="16" cy="15" r="2" />
      <path d="M11 13a3.5 3.5 0 017 0" />
    </svg>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatTime(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(d: Date): string {
  const day = d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const month = d.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  return `${day} · ${month} ${d.getDate()}`;
}

function greetingText(budget: SpoonBudget, hour: number): string {
  if (budget === "CRISIS") return "one thing at a time.";
  if (budget === "LOW") return "take it easy today.";
  if (hour >= 5 && hour < 12) return "good morning.";
  if (hour >= 12 && hour < 17) return "good afternoon.";
  if (hour >= 17 && hour < 21) return "good evening.";
  return "it's late.";
}

// ─── zone 2 button list ──────────────────────────────────────────────────────

const ALL_BUTTONS = [
  "QUICK CAPTURE",
  "MY IDEAS",
  "THINGS THAT WORK",
  "ASK BRAIN",
  "OUT OF SIGHT",
  "WHAT WAS I DOING",
  "SAFE FOODS",
] as const;

type ButtonName = (typeof ALL_BUTTONS)[number];
const CRISIS_BUTTONS: ButtonName[] = ["QUICK CAPTURE", "ASK BRAIN"];

// ─── inner page (consumes context) ───────────────────────────────────────────

function DisplayInner() {
  const router = useRouter();
  const { budget, setBudget } = useSpoonBudget();

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(id);
  }, []);

  const [activeStack, setActiveStack] = useState(0);

  const [ambient, setAmbient] = useState(
    "your brain is empty · add something with ✦",
  );
  useEffect(() => {
    getRecentBrainEntries("")
      .then((entries) => {
        if (entries.length === 0) return;
        const preferred =
          entries.find((e) =>
            ["kids", "health", "tasks"].includes(e.category ?? ""),
          ) ?? entries[0];
        setAmbient(preferred.content.toLowerCase());
      })
      .catch(() => {
        /* keep default */
      });
  }, []);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const zone2Buttons: readonly ButtonName[] =
    budget === "CRISIS" ? CRISIS_BUTTONS : ALL_BUTTONS;

  const hour = now.getHours();
  const stack = STACKS[activeStack];

  const visibleWidgets = (() => {
    if (!stack) return [];
    if (budget === "CRISIS") return stack.widgets.slice(0, 2);
    if (budget === "LOW") return stack.widgets.slice(0, 3);
    return stack.widgets;
  })();

  const hiddenCount =
    budget === "LOW" && stack
      ? stack.widgets.length - visibleWidgets.length
      : 0;

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100dvh",
        fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 430,
          margin: "0 auto",
          paddingBottom: 88,
        }}
      >
        {/* ── Zone 1: sticky header ────────────────────────────── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: C.bg,
            padding: "20px 16px 0",
          }}
        >
          {/* Time */}
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.ink,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatTime(now)}
          </div>

          {/* Date + spoon budget pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                fontSize: 8,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: C.inkFaint,
              }}
            >
              {formatDate(now)}
            </span>

            <div style={{ display: "flex", gap: 4 }}>
              {(["HIGH", "OKAY", "LOW", "CRISIS"] as SpoonBudget[]).map(
                (b) => (
                  <button
                    key={b}
                    onClick={() => setBudget(b)}
                    style={{
                      fontFamily: "var(--font-plex-mono), monospace",
                      fontSize: 8,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderRadius: 100,
                      padding: "3px 8px",
                      border:
                        budget === b
                          ? "none"
                          : ".5px solid rgba(44,40,32,.12)",
                      background: budget === b ? C.gold : "transparent",
                      color: budget === b ? C.ink : C.inkFaint,
                      cursor: "pointer",
                    }}
                  >
                    {b}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Greeting card */}
          <div
            style={{
              background: C.card,
              borderRadius: 18,
              boxShadow: CARD_SHADOW,
              overflow: "hidden",
              marginTop: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ height: 5, background: C.gold }} />
            <div style={{ padding: "12px 16px" }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: C.ink,
                }}
              >
                {greetingText(budget, hour)}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-plex-mono), monospace",
                  fontSize: 10,
                  color: C.inkSoft,
                  marginTop: 4,
                }}
              >
                {ambient}
              </div>
            </div>
          </div>
        </header>

        {/* ── Zone 2: big buttons ──────────────────────────────── */}
        <div
          className="scroll-x-hide"
          style={{
            overflowX: "auto",
            display: "flex",
            gap: 6,
            padding: "0 16px 12px",
          }}
        >
          {zone2Buttons.map((name) => (
            <button
              key={name}
              onClick={() =>
                showToast(`${name.toLowerCase()} — coming in phase 3`)
              }
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                height: 44,
                padding: "0 16px",
                borderRadius: 100,
                border: ".5px solid rgba(44,40,32,.12)",
                background: name === "QUICK CAPTURE" ? C.gold : C.card,
                color: name === "QUICK CAPTURE" ? C.ink : C.inkSoft,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* ── Zone 3: stack tabs + widget cards ───────────────── */}
        <div style={{ padding: "0 16px" }}>
          {/* Stack tab row */}
          <div
            className="scroll-x-hide"
            style={{
              overflowX: "auto",
              display: "flex",
              gap: 4,
              marginBottom: 12,
            }}
          >
            {STACKS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveStack(i)}
                style={{
                  fontFamily: "var(--font-plex-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "6px 12px",
                  borderRadius: 100,
                  border: "none",
                  background: i === activeStack ? C.ink : "transparent",
                  color: i === activeStack ? "#fff" : C.inkSoft,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Widget placeholder cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visibleWidgets.map((w, i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  borderRadius: 18,
                  boxShadow: CARD_SHADOW,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{ height: 5, background: stack?.color ?? C.gold }}
                />
                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: C.ink,
                        marginBottom: budget === "CRISIS" ? 0 : 4,
                      }}
                    >
                      {w.title}
                    </div>
                    {budget !== "CRISIS" && (
                      <div
                        style={{
                          fontSize: 12,
                          color: C.inkSoft,
                          lineHeight: 1.4,
                        }}
                      >
                        {w.tagline}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-plex-mono), monospace",
                      fontSize: 8,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: C.inkFaint,
                      whiteSpace: "nowrap",
                      paddingTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    soon
                  </span>
                </div>
              </div>
            ))}

            {/* LOW state: show hidden widget count */}
            {budget === "LOW" && hiddenCount > 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "12px 0",
                  fontFamily: "var(--font-plex-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  color: C.inkFaint,
                }}
              >
                + {hiddenCount} more when you&apos;re ready
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom tab bar ─────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          background: C.card,
          borderTop: ".5px solid rgba(44,40,32,.08)",
          display: "flex",
          zIndex: 40,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {(
          [
            { id: "home", label: "SpoonStack", Icon: IconHome },
            { id: "shelf", label: "Shelf", Icon: IconGrid },
            { id: "brain", label: "Brain", Icon: IconBrain },
          ] as const
        ).map(({ id, label, Icon }) => {
          const active = id === "home";
          return (
            <button
              key={id}
              onClick={() => {
                if (id === "brain") router.push("/brain");
                else if (id === "shelf") showToast("shelf — coming soon");
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: "10px 0 12px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: active ? C.gold : C.inkFaint,
              }}
            >
              <Icon size={20} />
              <span
                style={{
                  fontFamily: "var(--font-plex-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Floating ✦ quick capture ───────────────────────────── */}
      <button
        onClick={() => showToast("quick capture — coming in phase 3")}
        aria-label="quick capture"
        style={{
          position: "fixed",
          bottom: 80,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: C.green,
          color: "#fff",
          fontSize: 16,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(29,158,117,.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 40,
        }}
      >
        ✦
      </button>

      {/* ── Toast ──────────────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.ink,
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 100,
            fontFamily: "var(--font-plex-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.04em",
            zIndex: 50,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── page export (provides context) ──────────────────────────────────────────

export default function DisplayPage() {
  return (
    <SpoonBudgetProvider>
      <DisplayInner />
    </SpoonBudgetProvider>
  );
}
