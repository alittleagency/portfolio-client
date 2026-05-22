"use client";

import { useMemo, useState } from "react";
import type { TopicNode } from "@/lib/jenkins-family";
import { FAMILY_PEOPLE, monthsSinceVerified } from "@/lib/jenkins-family";
import { EmptyState } from "./EmptyState";

interface TopicPageProps {
  topic: TopicNode;
}

export function TopicPage({ topic }: TopicPageProps) {
  const [verifiedAt, setVerifiedAt] = useState<string | null>(topic.lastVerified);
  const stale = (() => {
    const m = monthsSinceVerified(verifiedAt);
    return m === null || m >= 6;
  })();

  return (
    <div>
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[24px]" aria-hidden>
            {topic.icon}
          </span>
          <h1 className="text-[28px] font-semibold tracking-tight">{topic.title}</h1>
        </div>
        <p className="text-[15px] text-ink-2 max-w-prose">{topic.summary}</p>

        <div className="flex items-center gap-3 mt-4">
          {stale && (
            <span className="freshness-badge">
              ⚠ {verifiedAt ? "6+ months since check" : "Never verified"}
            </span>
          )}
          <button
            type="button"
            className="still-accurate-btn"
            onClick={() => setVerifiedAt(new Date().toISOString().slice(0, 10))}
          >
            Still accurate
          </button>
        </div>
      </header>

      {topic.id === "safe-foods" ? (
        <SafeFoodsView topic={topic} />
      ) : topic.id === "memories" ? (
        <MemoriesView topic={topic} />
      ) : (
        <DefaultItemsView topic={topic} />
      )}
    </div>
  );
}

function DefaultItemsView({ topic }: { topic: TopicNode }) {
  if (topic.items.length === 0) {
    return <EmptyState hint="Items in this topic — anything someone would need to know to step in for you." />;
  }
  return (
    <ul className="space-y-2">
      {topic.items.map((it, i) => (
        <li key={i} className="card flex items-baseline gap-3">
          <span className="text-[15px] flex-1">
            {it.label}
            {it.detail && (
              <span className="block text-[13px] text-ink-2 mt-1">{it.detail}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SafeFoodsView({ topic }: { topic: TopicNode }) {
  const grouped = useMemo(() => {
    const byPerson = new Map<string, typeof topic.items>();
    const orphaned: typeof topic.items = [];
    for (const item of topic.items) {
      if (item.personId) {
        const arr = byPerson.get(item.personId) ?? [];
        arr.push(item);
        byPerson.set(item.personId, arr);
      } else {
        orphaned.push(item);
      }
    }
    return { byPerson, orphaned };
  }, [topic.items]);

  if (topic.items.length === 0) {
    return <EmptyState hint="What each person reliably eats — group items by person." />;
  }

  return (
    <div className="space-y-5">
      {FAMILY_PEOPLE.map((p) => {
        const items = grouped.byPerson.get(p.id);
        if (!items || items.length === 0) return null;
        return (
          <section key={p.id}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: p.color }}
                aria-hidden
              />
              <h3 className="font-semibold text-[16px]">{p.name}</h3>
            </div>
            <ul className="space-y-1.5 pl-5">
              {items.map((it, i) => (
                <li key={i} className="text-[15px]">
                  · {it.label}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function MemoriesView({ topic }: { topic: TopicNode }) {
  if (topic.items.length === 0) {
    return <EmptyState hint="Small things to remember — date them as you go." />;
  }
  const sorted = [...topic.items].sort((a, b) =>
    (b.date ?? "") < (a.date ?? "") ? -1 : 1,
  );
  return (
    <ol className="relative pl-5 space-y-4 border-l" style={{ borderColor: "var(--border)" }}>
      {sorted.map((it, i) => (
        <li key={i} className="relative">
          <span
            className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full"
            style={{ background: "var(--accent, #8B6FE8)" }}
            aria-hidden
          />
          <div className="mono-label mb-1">{it.date ?? "—"}</div>
          <p className="text-[16px] font-medium leading-snug">{it.label}</p>
          {it.detail && (
            <p className="text-[14px] text-ink-2 mt-1">{it.detail}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
