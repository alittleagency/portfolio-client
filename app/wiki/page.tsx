import Link from "next/link";
import { FAMILY_PEOPLE, FAMILY_TOPICS } from "@/lib/jenkins-family";

export default function WikiIndex() {
  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-tight mb-2">
        The Jenkins family
      </h1>
      <p className="text-[15px] text-ink-2 mb-8 max-w-prose">
        One place for everything any caregiver, sub, or future-you would need to step
        in for a day. Pick a person or a topic to start.
      </p>

      <h2 className="mono-label mb-3">People</h2>
      <ul className="grid grid-cols-2 gap-3 mb-8">
        {FAMILY_PEOPLE.map((p) => (
          <li key={p.id}>
            <Link
              href={`/wiki/${p.id}`}
              className="card flex items-center gap-3 hover:border-[var(--teal)] transition-colors"
            >
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-[20px] shrink-0"
                style={{ background: `${p.color}22`, color: p.color }}
                aria-hidden
              >
                {p.avatar}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-[16px] truncate">{p.name}</div>
                <div className="text-[12px] text-ink-2 truncate">
                  {p.shortDesc}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mono-label mb-3">Topics</h2>
      <ul className="grid grid-cols-2 gap-3">
        {FAMILY_TOPICS.map((t) => (
          <li key={t.id}>
            <Link
              href={`/wiki/${t.id}`}
              className="card flex items-center gap-3 hover:border-[var(--teal)] transition-colors"
            >
              <span className="text-[22px]" aria-hidden>
                {t.icon}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-[16px] truncate">{t.title}</div>
                <div className="text-[12px] text-ink-2 truncate">
                  {t.summary}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
