"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FAMILY_PEOPLE, FAMILY_TOPICS } from "@/lib/jenkins-family";

const PERSON_SUBSECTIONS: Array<{ id: string; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "medical", label: "Medical" },
  { id: "contacts", label: "Contacts" },
  { id: "notes", label: "Notes" },
];

export function Sidebar() {
  const params = useParams<{ slug?: string }>();
  const activeSlug = params?.slug;
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(activeSlug ?? null);

  const q = query.trim().toLowerCase();

  const people = useMemo(
    () => (q ? FAMILY_PEOPLE.filter((p) => p.name.toLowerCase().includes(q)) : FAMILY_PEOPLE),
    [q],
  );
  const topics = useMemo(
    () => (q ? FAMILY_TOPICS.filter((t) => t.title.toLowerCase().includes(q)) : FAMILY_TOPICS),
    [q],
  );

  return (
    <aside
      className="shrink-0 border-r overflow-y-auto"
      style={{
        width: 240,
        height: "calc(100vh - 52px)",
        borderColor: "var(--border)",
        background: "var(--bg)",
      }}
    >
      <div className="p-3">
        <input
          type="text"
          className="wiki-search"
          placeholder="Search family"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="wiki-group-label">People</div>
      <ul className="px-2">
        {people.map((p) => {
          const isActive = activeSlug === p.id;
          const isOpen = expanded === p.id;
          return (
            <li key={p.id}>
              <Link
                href={`/wiki/${p.id}`}
                className={`wiki-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setExpanded(isOpen && isActive ? null : p.id)}
              >
                <span
                  aria-hidden
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: p.color }}
                />
                <span className="flex-1">{p.name}</span>
              </Link>
              {isActive && isOpen && (
                <ul className="ml-6 mb-1">
                  {PERSON_SUBSECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block py-1.5 px-2 text-[12px] text-ink-2 hover:text-ink"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
        {people.length === 0 && (
          <li className="ghost px-3 py-2">No people match.</li>
        )}
      </ul>

      <div className="wiki-group-label">Topics</div>
      <ul className="px-2 pb-6">
        {topics.map((t) => {
          const isActive = activeSlug === t.id;
          return (
            <li key={t.id}>
              <Link
                href={`/wiki/${t.id}`}
                className={`wiki-nav-item ${isActive ? "active" : ""}`}
              >
                <span aria-hidden className="text-[14px]">
                  {t.icon}
                </span>
                <span className="flex-1">{t.title}</span>
              </Link>
            </li>
          );
        })}
        {topics.length === 0 && (
          <li className="ghost px-3 py-2">No topics match.</li>
        )}
      </ul>
    </aside>
  );
}
