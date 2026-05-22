"use client";

import type { NoteEntry } from "@/lib/jenkins-family";
import { EmptyState } from "./EmptyState";

interface NoteLogProps {
  notes: NoteEntry[];
}

export function NoteLog({ notes }: NoteLogProps) {
  if (notes.length === 0) {
    return (
      <EmptyState hint="Quick log entries — anything worth remembering across visits, appointments, or conversations." />
    );
  }
  const sorted = [...notes].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <ul className="space-y-3">
      {sorted.map((n, i) => (
        <li key={i} className="card">
          <div className="flex items-baseline justify-between mb-2">
            <span className="mono-label">{n.date}</span>
            {n.by && <span className="mono-label">by {n.by}</span>}
          </div>
          <p className="text-[15px] leading-relaxed">{n.body}</p>
        </li>
      ))}
    </ul>
  );
}
