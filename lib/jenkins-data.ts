/**
 * Hardcoded demo data for the Jenkins family — Phase 1 morning stack.
 * Mom: AuDHD, variable capacity. Four neurodivergent kids:
 *   - Maya (12, ADHD) — middle school, picky eater
 *   - Theo (10, autistic) — sensory, prefers same lunch every day
 *   - Iris (7, ADHD + anxiety) — needs scripts for transitions
 *   - Beau (4) — preschool, no diagnosis yet
 * Partner: Sam (works from home Tuesdays).
 */

export interface WidgetSubItem {
  label: string;
  detail?: string;
  flag?: "missing" | "warning" | "ok";
}

export interface Widget {
  id: string;
  title: string;
  descriptor: string;
  /** Mono-cased label that prefixes the output area. */
  outputLabel: string;
  /** The single-sentence headline used at low/medium density. */
  headline: string;
  /** Sub-items shown at full density only. */
  subItems: WidgetSubItem[];
  /** Priority: lower number = drop later when widget count shrinks. */
  priority: number;
}

export const JENKINS_WIDGETS: Widget[] = [
  {
    id: "day-plan",
    title: "Day Plan",
    descriptor: "Today's timeline, flagged items first.",
    outputLabel: "Today · Thu",
    headline: "Bus 7:48 · Theo OT 3:30 · Sam home for dinner",
    subItems: [
      { label: "7:48", detail: "Bus — Maya, Iris", flag: "ok" },
      { label: "8:25", detail: "Beau preschool dropoff", flag: "ok" },
      { label: "11:15", detail: "Theo early pickup — dentist", flag: "warning" },
      { label: "3:30", detail: "Theo OT (Sam covering)", flag: "ok" },
      { label: "5:30", detail: "Iris swim — bag by door?", flag: "missing" },
      { label: "6:30", detail: "Dinner — Sam home", flag: "ok" },
    ],
    priority: 1,
  },
  {
    id: "school-scramble",
    title: "School Scramble",
    descriptor: "What's missing before the bus.",
    outputLabel: "Backpack check",
    headline: "Theo's reading log not signed. Iris swim bag missing.",
    subItems: [
      { label: "Maya", detail: "Lunch packed · folder ✓", flag: "ok" },
      { label: "Theo", detail: "Reading log — needs your signature", flag: "missing" },
      { label: "Iris", detail: "Swim bag not packed", flag: "missing" },
      { label: "Beau", detail: "Show-and-tell: bring small soft thing", flag: "warning" },
    ],
    priority: 2,
  },
  {
    id: "dinner-decider",
    title: "Dinner Decider",
    descriptor: "Tonight's plan, per-person notes.",
    outputLabel: "Tonight · 6:30",
    headline: "Sheet-pan chicken + rice. Theo: plain. Iris: no sauce.",
    subItems: [
      { label: "Plan", detail: "Sheet-pan chicken thighs, rice, broccoli", flag: "ok" },
      { label: "Theo", detail: "Plain chicken, rice only — no broccoli", flag: "ok" },
      { label: "Iris", detail: "No sauce, broccoli on side", flag: "ok" },
      { label: "Maya", detail: "Will eat all of it", flag: "ok" },
      { label: "Beau", detail: "Cut chicken small", flag: "ok" },
      { label: "Freezer backup", detail: "Frozen pizza if today goes sideways", flag: "ok" },
    ],
    priority: 3,
  },
  {
    id: "loop-in",
    title: "Loop In",
    descriptor: "Drafted message for Sam.",
    outputLabel: "To Sam · draft",
    headline: '"Theo dentist 11:15 — can you grab him? I\'ll do OT at 3:30."',
    subItems: [
      { label: "Context", detail: "You have Theo OT covered at 3:30." },
      { label: "Ask", detail: "Sam picks up Theo from dentist at 11:15." },
      { label: "Tone", detail: "Direct, no apology, no hedging." },
      { label: "Send?", detail: "Tap to send via Messages." },
    ],
    priority: 4,
  },
  {
    id: "one-hard-thing",
    title: "One Hard Thing",
    descriptor: "Just one. Scripted opener included.",
    outputLabel: "Today's hard thing",
    headline: 'Call pediatrician about Iris\'s med refill. Script: "Hi, refill for Iris Jenkins, DOB 2/14."',
    subItems: [
      { label: "Why now", detail: "Refill runs out Saturday. Office closes Friday 4pm." },
      { label: "Opener", detail: '"Hi, this is calling for a refill. Patient: Iris Jenkins, DOB 2/14."' },
      { label: "If voicemail", detail: "Leave name, patient, DOB, callback number. Done." },
      { label: "After", detail: "You can stop. That was the thing." },
    ],
    priority: 5,
  },
  {
    id: "brain-inbox",
    title: "Brain Inbox",
    descriptor: "Captured items, sorted.",
    outputLabel: "12 items · sorted",
    headline: "3 to do today · 4 to check · 5 for later.",
    subItems: [
      { label: "Do today", detail: "Pediatrician call · Sign reading log · Pack swim bag", flag: "warning" },
      { label: "Check", detail: "Maya field trip form · Beau's shoes (too small?) · Sam's schedule Tue · Vet recall email", flag: "ok" },
      { label: "Later", detail: "Plan Maya birthday · Replace shower curtain · Theo new headphones · Iris reading tutor · Garage", flag: "ok" },
    ],
    priority: 6,
  },
];

/** Family meta — referenced by widgets and could power Phase 2 personalization. */
export const JENKINS_FAMILY = {
  parent: "Mom",
  partner: "Sam",
  kids: [
    { name: "Maya", age: 12, notes: "ADHD, picky eater" },
    { name: "Theo", age: 10, notes: "autistic, prefers routine" },
    { name: "Iris", age: 7, notes: "ADHD + anxiety, needs scripts" },
    { name: "Beau", age: 4, notes: "preschool" },
  ],
} as const;
