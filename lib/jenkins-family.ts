/**
 * Shared graph data for the Jenkins family.
 *
 * Used by both the Wiki (structured page view) and the Brain (3D node graph).
 * Modeled as nodes (people + topics) and edges (relationships).
 *
 * Single source of truth — never duplicate this data into a UI component.
 */

export type NodeKind = "person" | "topic";

export interface Medication {
  drug: string;
  dose: string;
  schedule: string;
  prescriber: string;
  /** Last time someone hit "Still Accurate" on this card. ISO date or null. */
  lastVerified: string | null;
}

export interface Contact {
  role: string;
  name: string;
  preferred: string;
  /** e.g. "(555) 233-1109" */
  detail: string;
}

export interface NoteEntry {
  /** ISO date */
  date: string;
  body: string;
  /** Who logged it */
  by?: string;
}

export interface PersonNode {
  id: string;
  kind: "person";
  name: string;
  age: number;
  /** Hex from the design system */
  color: string;
  avatar: string;
  shortDesc: string;
  diagnoses: string[];
  whatHelps: string[];
  whatsDifficult: string[];
  hyperfixations: string[];
  /** How this person communicates / what to know first */
  communication: string[];
  medications: Medication[];
  contacts: Contact[];
  notes: NoteEntry[];
  /** Set if there's something a babysitter needs to know in 3 seconds */
  criticalFlag?: string;
}

export interface TopicItem {
  /** For Safe Foods: the person id this item belongs to. Otherwise undefined. */
  personId?: string;
  label: string;
  detail?: string;
  /** ISO date — used by Memories timeline */
  date?: string;
}

export interface TopicNode {
  id: string;
  kind: "topic";
  title: string;
  color: string;
  icon: string;
  summary: string;
  items: TopicItem[];
  lastVerified: string | null;
}

export type FamilyNode = PersonNode | TopicNode;

export interface Edge {
  from: string;
  to: string;
  /** Optional label, e.g. "parallel play" */
  label?: string;
  /** "topic" = person↔topic, "kin" = person↔person */
  kind: "topic" | "kin";
}

/* ---------- People ---------- */

const PEOPLE: PersonNode[] = [
  {
    id: "monica",
    kind: "person",
    name: "Monica",
    age: 36,
    color: "#8B6FE8",
    avatar: "🧠",
    shortDesc: "AuDHD · freelance curriculum designer",
    diagnoses: ["Autism (dx 2022)", "ADHD-C (dx 2019)"],
    communication: [
      "Direct language, no idioms when low-spoon.",
      "Text > call. Voice notes are okay if labeled urgent.",
      "Don't ask 'how are you' as small talk — answer arrives literally.",
    ],
    whatHelps: [
      "30-min solo decompression after kid handoff",
      "Written timelines for the day, not verbal",
      "Same breakfast on weekdays (oat yogurt + berries)",
    ],
    whatsDifficult: [
      "Parallel kid demands (Priya + Eli at once)",
      "Phone calls to medical offices",
      "Unstructured weekends",
    ],
    hyperfixations: [
      "Curriculum frameworks (current: UbD)",
      "Bread baking — sourdough since Dec",
    ],
    medications: [
      {
        drug: "Vyvanse",
        dose: "40mg",
        schedule: "Morning, with food",
        prescriber: "Dr. Halvorsen",
        lastVerified: "2025-11-12",
      },
      {
        drug: "Sertraline",
        dose: "100mg",
        schedule: "Evening",
        prescriber: "Dr. Halvorsen",
        lastVerified: "2024-09-03",
      },
    ],
    contacts: [
      {
        role: "Psychiatrist",
        name: "Dr. Halvorsen",
        preferred: "Patient portal",
        detail: "halvorsen-psych.com/portal",
      },
      {
        role: "Therapist",
        name: "Rachel Ng, LCSW",
        preferred: "Text",
        detail: "(555) 442-0918",
      },
    ],
    notes: [
      {
        date: "2026-04-22",
        body: "Increased Vyvanse from 30 → 40. Noticing better afternoon focus, slight appetite drop.",
        by: "Monica",
      },
      {
        date: "2026-02-08",
        body: "Therapy: working on saying no to school volunteer asks without over-explaining.",
        by: "Monica",
      },
    ],
  },
  {
    id: "david",
    kind: "person",
    name: "David",
    age: 38,
    color: "#0B8FA6",
    avatar: "📋",
    shortDesc: "neurotypical · hospital admin",
    diagnoses: [],
    communication: [
      "Prefers calls on commute (5:15-5:45pm Mon-Thu).",
      "Reads Slack faster than text.",
    ],
    whatHelps: [
      "Knowing the week's plan by Sunday night",
      "Coffee before any kid conversation",
    ],
    whatsDifficult: [
      "Last-minute schedule changes",
      "Emotional regulation when sleep-deprived",
    ],
    hyperfixations: ["Cycling routes", "Cast iron seasoning"],
    medications: [],
    contacts: [
      {
        role: "PCP",
        name: "Dr. Iyer",
        preferred: "Portal",
        detail: "stmary-pcp.com",
      },
    ],
    notes: [
      {
        date: "2026-03-14",
        body: "Annual physical clear. BP 122/78. Next due March 2027.",
      },
    ],
  },
  {
    id: "zoe",
    kind: "person",
    name: "Zoe",
    age: 14,
    color: "#1D9E75",
    avatar: "🎧",
    shortDesc: "dyslexia + anxiety · Hartwell High 9th",
    diagnoses: ["Dyslexia (dx 2018)", "Generalized anxiety (dx 2023)"],
    communication: [
      "Don't ask 'how was school?' — ask 'best part / hardest part?'",
      "Headphones on = decompressing, not ignoring you.",
    ],
    whatHelps: [
      "Audiobooks for assigned reading (school OK'd this in IEP)",
      "30-min screen-free walk after school",
      "Knowing tomorrow's schedule the night before",
    ],
    whatsDifficult: [
      "Group projects",
      "Reading aloud in class",
      "Unannounced visitors at home",
    ],
    hyperfixations: ["Manga (currently: Witch Hat Atelier)", "Watercolor"],
    medications: [
      {
        drug: "Lexapro",
        dose: "10mg",
        schedule: "Morning, with breakfast",
        prescriber: "Dr. Patel",
        lastVerified: "2025-08-19",
      },
    ],
    contacts: [
      {
        role: "Pediatrician",
        name: "Dr. Patel",
        preferred: "Portal",
        detail: "rivergrove-peds.com",
      },
      {
        role: "IEP coordinator",
        name: "Ms. Alvarez",
        preferred: "Email",
        detail: "alvarezk@hartwellhs.edu",
      },
    ],
    notes: [
      {
        date: "2026-04-30",
        body: "Anxiety spike around finals. Therapist suggested earlier bedtime + more walks.",
        by: "Monica",
      },
    ],
    criticalFlag: "Audiobook accommodation in IEP — verify substitute teachers know.",
  },
  {
    id: "marcus",
    kind: "person",
    name: "Marcus",
    age: 10,
    color: "#DAAF2E",
    avatar: "🚂",
    shortDesc: "autistic · Clearview Elementary 5th",
    diagnoses: ["Autism (dx 2020, level 1)"],
    communication: [
      "Will info-dump about trains. Engage 5 min, then redirect with 'pause point?'",
      "Eye contact is hard — don't enforce.",
      "Literal language. 'In a minute' means 60 seconds to him.",
    ],
    whatHelps: [
      "Visual schedule on the fridge",
      "Same lunch every day (turkey + cheese, no crust, apple slices)",
      "Noise-canceling headphones in cafeteria",
      "Warning before transitions (3 min, 1 min, now)",
    ],
    whatsDifficult: [
      "Fire drills, loud assemblies",
      "Substitute teachers without warning",
      "Wet socks (immediate meltdown)",
      "New foods on the same plate as safe foods",
    ],
    hyperfixations: [
      "Trains (Amtrak routes, knows the timetable)",
      "Weather radar — checks NOAA every morning",
    ],
    medications: [],
    contacts: [
      {
        role: "Pediatrician",
        name: "Dr. Patel",
        preferred: "Portal",
        detail: "rivergrove-peds.com",
      },
      {
        role: "OT",
        name: "Katie M.",
        preferred: "Text",
        detail: "(555) 318-2244",
      },
      {
        role: "Teacher",
        name: "Mr. Brennan",
        preferred: "Email",
        detail: "brennanr@clearview.edu",
      },
    ],
    notes: [
      {
        date: "2026-04-18",
        body: "OT report: improved hand strength. Continuing 1x/week through summer.",
      },
      {
        date: "2026-03-02",
        body: "Tried adding rice next to the chicken at dinner. Worked when on a separate small plate.",
        by: "Monica",
      },
    ],
    criticalFlag: "Wet socks = emergency. Always pack a backup pair.",
  },
  {
    id: "priya",
    kind: "person",
    name: "Priya",
    age: 7,
    color: "#D85A30",
    avatar: "✨",
    shortDesc: "ADHD · Clearview Elementary 2nd",
    diagnoses: ["ADHD-C (dx April 2024)"],
    communication: [
      "Repeat instructions back to her — 'tell me what we're doing.'",
      "Affection in tackle-hugs. Set posture before opening arms.",
    ],
    whatHelps: [
      "Movement breaks every 20 min (homework included)",
      "Two-step instructions max",
      "Visible kitchen timer for transitions",
    ],
    whatsDifficult: [
      "Quiet time at school",
      "Waiting in lines",
      "Following multi-step morning routine without prompts",
    ],
    hyperfixations: ["Roller skating", "Pokemon (specifically Eeveelutions)"],
    medications: [
      {
        drug: "Focalin XR",
        dose: "10mg",
        schedule: "School mornings only — skip weekends",
        prescriber: "Dr. Patel",
        lastVerified: "2026-01-10",
      },
    ],
    contacts: [
      {
        role: "Pediatrician",
        name: "Dr. Patel",
        preferred: "Portal",
        detail: "rivergrove-peds.com",
      },
      {
        role: "Teacher",
        name: "Ms. Ko",
        preferred: "ClassDojo",
        detail: "Ms.Ko_Clearview",
      },
    ],
    notes: [
      {
        date: "2026-04-25",
        body: "Switched from morning Focalin to school-days-only. No rebound issues so far.",
      },
    ],
  },
  {
    id: "eli",
    kind: "person",
    name: "Eli",
    age: 4,
    color: "#1D9E75",
    avatar: "🦕",
    shortDesc: "speech delay · Morningside pre-K",
    diagnoses: ["Speech delay (in eval for autism — appt June 14)"],
    communication: [
      "About 30 single words + 5 two-word combos.",
      "Points + grunts when frustrated. Ask 'show me?' before offering options.",
      "Loves parallel play with Marcus — sits next to him with own toys.",
    ],
    whatHelps: [
      "Speech therapy 2x/week (Tue + Thu)",
      "PECS cards for snack/bathroom/outside",
      "Predictable nap (12:30-2:00)",
    ],
    whatsDifficult: [
      "Being asked to 'use your words' when overwhelmed",
      "New people in the house",
      "Crunchy textures",
    ],
    hyperfixations: ["Dinosaurs", "Spinning the salad spinner"],
    medications: [],
    contacts: [
      {
        role: "Pediatrician",
        name: "Dr. Patel",
        preferred: "Portal",
        detail: "rivergrove-peds.com",
      },
      {
        role: "Speech therapist",
        name: "Lina O.",
        preferred: "Text",
        detail: "(555) 887-1402",
      },
      {
        role: "Pre-K lead",
        name: "Ms. Daria",
        preferred: "App",
        detail: "Brightwheel: Eli J.",
      },
    ],
    notes: [
      {
        date: "2026-04-12",
        body: "Used 'more please' unprompted at snack. Lina says we're at +4 new words this month.",
        by: "Monica",
      },
    ],
    criticalFlag: "Autism eval scheduled June 14 with Dr. Halvorsen-Reed.",
  },
];

/* ---------- Topics ---------- */

const TOPICS: TopicNode[] = [
  {
    id: "safe-foods",
    kind: "topic",
    title: "Safe Foods",
    color: "#DAAF2E",
    icon: "🍽",
    summary:
      "What each kid will reliably eat. Update when something new sticks or an old safe food drops off.",
    items: [
      { personId: "marcus", label: "Turkey + cheese sandwich, no crust" },
      { personId: "marcus", label: "Apple slices (no skin)" },
      { personId: "marcus", label: "Plain pasta with butter" },
      { personId: "marcus", label: "Goldfish crackers (original only)" },
      { personId: "priya", label: "Anything with ranch" },
      { personId: "priya", label: "Pepperoni pizza" },
      { personId: "priya", label: "Strawberries" },
      { personId: "zoe", label: "Will eat almost anything — avoids mushrooms" },
      { personId: "eli", label: "Mac and cheese (the orange box)" },
      { personId: "eli", label: "Yogurt pouches" },
      { personId: "eli", label: "Soft bread, no crust" },
    ],
    lastVerified: "2026-03-15",
  },
  {
    id: "medical",
    kind: "topic",
    title: "Medical",
    color: "#D85A30",
    icon: "⚕",
    summary: "Providers, insurance basics, and ongoing referrals.",
    items: [
      { label: "Insurance: BlueShield PPO, Group #JK-44829" },
      { label: "Pharmacy: Walgreens 4th & Pine — has all kid Rx on file" },
      { label: "Pediatric clinic: River Grove Peds — Dr. Patel primary" },
      { label: "ER preference: St. Mary's (closer + better with autistic kids)" },
      { label: "Dental: Dr. Whitfield — cleanings every 6 months, all kids" },
    ],
    lastVerified: "2026-01-22",
  },
  {
    id: "school",
    kind: "topic",
    title: "School",
    color: "#0B8FA6",
    icon: "📚",
    summary: "Schools, IEPs, and key staff per kid.",
    items: [
      { personId: "zoe", label: "Hartwell High · 9th grade · IEP (dyslexia)" },
      { personId: "marcus", label: "Clearview Elementary · 5th · IEP (autism)" },
      { personId: "priya", label: "Clearview Elementary · 2nd · 504 plan (ADHD)" },
      { personId: "eli", label: "Morningside Pre-K · half-day, mornings" },
      { label: "School year ends June 11. Eli's pre-K runs through June 20." },
    ],
    lastVerified: "2026-04-01",
  },
  {
    id: "house-systems",
    kind: "topic",
    title: "House Systems",
    color: "#6B6B68",
    icon: "🏠",
    summary: "How the house actually runs. Update when something changes.",
    items: [
      { label: "Trash: Tuesday morning, bins to curb Monday night" },
      { label: "Recycling: every other Friday (next: May 8)" },
      { label: "HVAC filter: replace first of every other month" },
      { label: "Wifi router: closet under stairs, restart by holding power 10s" },
      { label: "Dishwasher: pods only, not powder. Door sticks — lift slightly." },
      { label: "Cleaning: Maria comes every other Wednesday, 10am-1pm" },
    ],
    lastVerified: "2025-12-09",
  },
  {
    id: "memories",
    kind: "topic",
    title: "Memories",
    color: "#8B6FE8",
    icon: "📷",
    summary: "Small things to remember. Reverse chronological.",
    items: [
      {
        date: "2026-04-19",
        label: "Eli used 'more please' unprompted",
        detail: "Snack time. Asked for more crackers without PECS card.",
      },
      {
        date: "2026-04-06",
        label: "Marcus rode the Coast Starlight short loop",
        detail: "Dad took him on the 2-stop demo run. He cried happy.",
      },
      {
        date: "2026-03-22",
        label: "Priya rollerskated without falling for 10 minutes",
        detail: "First time at the rink without holding the wall.",
      },
      {
        date: "2026-02-14",
        label: "Zoe finished Witch Hat Atelier vol. 11",
        detail: "Drew Coco from memory. Pinned to fridge.",
      },
    ],
    lastVerified: null,
  },
  {
    id: "emergency",
    kind: "topic",
    title: "Emergency",
    color: "#D85A30",
    icon: "🚨",
    summary: "What anyone watching the kids needs in 30 seconds.",
    items: [
      { label: "ICE 1: Monica (555) 220-8841" },
      { label: "ICE 2: David (555) 220-9012" },
      { label: "ICE 3 (local): Aunt Rina (555) 411-0073" },
      { label: "Closest hospital: St. Mary's, 2.4mi. NOT County General." },
      { label: "Marcus: wet socks = meltdown. Spare pair in his go-bag." },
      { label: "Eli: PECS cards in kitchen drawer left of fridge." },
      { label: "Priya: med bottle in upper cabinet, NOT counter." },
      { label: "Fire extinguisher: under kitchen sink. Smoke alarms wired, not battery." },
    ],
    lastVerified: "2026-02-01",
  },
];

/* ---------- Edges ---------- */

const EDGES: Edge[] = [
  // Marcus
  { from: "marcus", to: "safe-foods", kind: "topic" },
  { from: "marcus", to: "medical", kind: "topic" },
  { from: "marcus", to: "school", kind: "topic" },
  // Priya
  { from: "priya", to: "safe-foods", kind: "topic" },
  { from: "priya", to: "medical", kind: "topic" },
  { from: "priya", to: "school", kind: "topic" },
  // Zoe
  { from: "zoe", to: "school", kind: "topic" },
  { from: "zoe", to: "medical", kind: "topic" },
  { from: "zoe", to: "safe-foods", kind: "topic" },
  // Eli
  { from: "eli", to: "school", kind: "topic" },
  { from: "eli", to: "medical", kind: "topic" },
  { from: "eli", to: "safe-foods", kind: "topic" },
  // Monica + David
  { from: "monica", to: "medical", kind: "topic" },
  { from: "monica", to: "house-systems", kind: "topic" },
  { from: "monica", to: "memories", kind: "topic" },
  { from: "monica", to: "emergency", kind: "topic" },
  { from: "david", to: "medical", kind: "topic" },
  { from: "david", to: "house-systems", kind: "topic" },
  { from: "david", to: "emergency", kind: "topic" },
  // Kin edges (person ↔ person) — for the Brain to draw richer relationships
  { from: "monica", to: "david", kind: "kin", label: "co-parent" },
  { from: "monica", to: "zoe", kind: "kin", label: "parent" },
  { from: "monica", to: "marcus", kind: "kin", label: "parent" },
  { from: "monica", to: "priya", kind: "kin", label: "parent" },
  { from: "monica", to: "eli", kind: "kin", label: "parent" },
  { from: "david", to: "zoe", kind: "kin", label: "parent" },
  { from: "david", to: "marcus", kind: "kin", label: "parent" },
  { from: "david", to: "priya", kind: "kin", label: "parent" },
  { from: "david", to: "eli", kind: "kin", label: "parent" },
  { from: "eli", to: "marcus", kind: "kin", label: "parallel play" },
];

/* ---------- Public API ---------- */

export const FAMILY_PEOPLE: PersonNode[] = PEOPLE;
export const FAMILY_TOPICS: TopicNode[] = TOPICS;
export const FAMILY_EDGES: Edge[] = EDGES;
export const FAMILY_NODES: FamilyNode[] = [...PEOPLE, ...TOPICS];

export function getNode(id: string): FamilyNode | undefined {
  return FAMILY_NODES.find((n) => n.id === id);
}

export function getPerson(id: string): PersonNode | undefined {
  const n = getNode(id);
  return n && n.kind === "person" ? n : undefined;
}

export function getTopic(id: string): TopicNode | undefined {
  const n = getNode(id);
  return n && n.kind === "topic" ? n : undefined;
}

/** Connection count for a node — used to size Brain spheres. */
export function connectionCount(id: string): number {
  return FAMILY_EDGES.reduce(
    (n, e) => n + (e.from === id || e.to === id ? 1 : 0),
    0,
  );
}

/** Months since last verified. Null if never. */
export function monthsSinceVerified(iso: string | null, now = new Date()): number | null {
  if (!iso) return null;
  const then = new Date(iso);
  const ms = now.getTime() - then.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 30));
}
