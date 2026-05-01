"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopBar() {
  const pathname = usePathname();
  const isWiki = pathname.startsWith("/wiki");
  const isBrain = pathname.startsWith("/brain");

  return (
    <header
      className="flex items-center justify-between px-5 border-b"
      style={{
        height: 52,
        background: "var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      <Link
        href="/wiki"
        className="flex items-center gap-2 font-semibold tracking-tight text-[15px]"
        style={{ color: "var(--ink)" }}
      >
        <span aria-hidden>🥄</span>
        <span>SpoonStack</span>
      </Link>

      <nav
        className="flex items-center gap-1 rounded-pill p-1"
        style={{ background: "var(--mono-bg)" }}
        aria-label="View toggle"
      >
        <ToggleLink href="/wiki" active={isWiki} kind="wiki">
          Wiki
        </ToggleLink>
        <ToggleLink href="/brain" active={isBrain} kind="brain">
          Brain
        </ToggleLink>
      </nav>

      <div className="w-[120px]" />
    </header>
  );
}

function ToggleLink({
  href,
  active,
  kind,
  children,
}: {
  href: string;
  active: boolean;
  kind: "wiki" | "brain";
  children: React.ReactNode;
}) {
  const fill =
    kind === "wiki" ? "var(--teal)" : "#1A1916";
  return (
    <Link
      href={href}
      className="rounded-pill px-4 h-9 flex items-center text-[13px] font-medium transition-colors"
      style={{
        background: active ? fill : "transparent",
        color: active ? "#ffffff" : "var(--ink-2)",
      }}
    >
      {children}
    </Link>
  );
}
