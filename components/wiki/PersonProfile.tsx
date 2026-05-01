"use client";

import { useState } from "react";
import type { PersonNode } from "@/lib/jenkins-family";
import { EmptyState } from "./EmptyState";
import { MedicationCard } from "./MedicationCard";
import { NoteLog } from "./NoteLog";

type Tab = "overview" | "medical" | "contacts" | "notes";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "medical", label: "Medical" },
  { id: "contacts", label: "Contacts" },
  { id: "notes", label: "Notes" },
];

interface PersonProfileProps {
  person: PersonNode;
}

export function PersonProfile({ person }: PersonProfileProps) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div>
      <header
        className="sticky top-0 z-10 pb-4 mb-4"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-[28px] shrink-0"
            style={{ background: `${person.color}22`, color: person.color }}
            aria-hidden
          >
            {person.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] font-semibold tracking-tight leading-none">
              {person.name}
            </h1>
            <p className="text-[13px] text-ink-2 mt-1">
              {person.age} · {person.shortDesc}
            </p>
          </div>
        </div>

        {person.criticalFlag && (
          <div className="critical-flag mt-4">
            <span aria-hidden>⚠</span>
            <span>{person.criticalFlag}</span>
          </div>
        )}

        <div className="tab-bar mt-5" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
              role="tab"
              aria-selected={tab === t.id}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {tab === "overview" && <OverviewTab person={person} />}
      {tab === "medical" && <MedicalTab person={person} />}
      {tab === "contacts" && <ContactsTab person={person} />}
      {tab === "notes" && <NoteLog notes={person.notes} />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mono-label mb-2">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items, emptyHint }: { items: string[]; emptyHint: string }) {
  if (items.length === 0) return <EmptyState hint={emptyHint} />;
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="text-[15px] leading-relaxed flex gap-2">
          <span className="text-ink-2 shrink-0">·</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function OverviewTab({ person }: { person: PersonNode }) {
  return (
    <div>
      <Section title="How they communicate">
        <BulletList
          items={person.communication}
          emptyHint="A line or two on tone, channel, and what to avoid asking."
        />
      </Section>
      <Section title="What helps">
        <BulletList
          items={person.whatHelps}
          emptyHint="The small things that consistently make a day go better."
        />
      </Section>
      <Section title="What's hard">
        <BulletList
          items={person.whatsDifficult}
          emptyHint="Triggers, tough transitions, or anything that reliably tips into overwhelm."
        />
      </Section>
      <Section title="Diagnoses">
        <BulletList
          items={person.diagnoses}
          emptyHint="Diagnosis name, year, who diagnosed."
        />
      </Section>
      <Section title="Hyperfixations">
        <BulletList
          items={person.hyperfixations}
          emptyHint="Current obsessions. Useful for connecting and for gift-giving."
        />
      </Section>
    </div>
  );
}

function MedicalTab({ person }: { person: PersonNode }) {
  if (person.medications.length === 0) {
    return (
      <EmptyState hint="Active prescriptions — drug, dose, schedule, prescriber. Tap 'Still accurate' after every refill." />
    );
  }
  return (
    <div className="grid gap-3">
      {person.medications.map((m, i) => (
        <MedicationCard key={i} med={m} />
      ))}
    </div>
  );
}

function ContactsTab({ person }: { person: PersonNode }) {
  if (person.contacts.length === 0) {
    return (
      <EmptyState hint="Doctors, therapists, teachers — role, name, and the channel they actually respond on." />
    );
  }
  return (
    <div className="grid gap-3">
      {person.contacts.map((c, i) => (
        <article key={i} className="card">
          <div className="flex items-baseline justify-between mb-1">
            <span className="mono-label">{c.role}</span>
            <span className="mono-label">{c.preferred}</span>
          </div>
          <h3 className="font-semibold text-[18px] tracking-tight mb-1">{c.name}</h3>
          <p className="text-[14px] text-ink-2">{c.detail}</p>
        </article>
      ))}
    </div>
  );
}
