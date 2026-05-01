"use client";

interface EmptyStateProps {
  /** What this section is for. Shown as ghost text. */
  hint: string;
}

export function EmptyState({ hint }: EmptyStateProps) {
  return (
    <p className="ghost">
      {hint}{" "}
      <span style={{ fontStyle: "normal", opacity: 0.5 }}>
        — you can add this later.
      </span>
    </p>
  );
}
