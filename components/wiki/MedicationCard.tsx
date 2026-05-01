"use client";

import { useState } from "react";
import type { Medication } from "@/lib/jenkins-family";
import { monthsSinceVerified } from "@/lib/jenkins-family";

interface MedicationCardProps {
  med: Medication;
}

export function MedicationCard({ med }: MedicationCardProps) {
  const [verifiedAt, setVerifiedAt] = useState<string | null>(med.lastVerified);
  const stale = (() => {
    const m = monthsSinceVerified(verifiedAt);
    return m === null ? false : m >= 6;
  })();

  return (
    <article className="card">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <h3 className="font-semibold text-[22px] tracking-tight">{med.drug}</h3>
        {stale && <span className="freshness-badge">⚠ verify</span>}
      </div>
      <p className="text-[15px] mb-1">
        {med.dose} · {med.schedule}
      </p>
      <p className="text-[12px] text-ink-2 mb-4">Prescriber: {med.prescriber}</p>
      <div className="flex items-center justify-between">
        <span className="mono-label">
          {verifiedAt ? `Last verified · ${verifiedAt}` : "Not yet verified"}
        </span>
        <button
          type="button"
          className="still-accurate-btn"
          onClick={() => setVerifiedAt(new Date().toISOString().slice(0, 10))}
        >
          Still accurate
        </button>
      </div>
    </article>
  );
}
