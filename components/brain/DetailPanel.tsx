"use client";

import { useEffect } from "react";
import { PersonProfile } from "@/components/wiki/PersonProfile";
import { TopicPage } from "@/components/wiki/TopicPage";
import { getNode } from "@/lib/jenkins-family";

interface DetailPanelProps {
  selectedId: string | null;
  onClose: () => void;
}

export function DetailPanel({ selectedId, onClose }: DetailPanelProps) {
  // Esc to close
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, onClose]);

  const node = selectedId ? getNode(selectedId) : null;
  const isOpen = !!node;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-20"
      style={{
        height: "62vh",
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        transform: isOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 420ms cubic-bezier(0.25, 1, 0.4, 1)",
      }}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <span
          className="block w-10 h-1 rounded-full mx-auto"
          style={{ background: "var(--border)" }}
          aria-hidden
        />
      </div>
      <div className="flex items-center justify-between px-5 pb-2">
        <span className="mono-label">Detail</span>
        <button
          type="button"
          onClick={onClose}
          className="still-accurate-btn"
          aria-label="Close detail panel"
        >
          Close
        </button>
      </div>
      <div
        className="overflow-y-auto px-5 pb-8"
        style={{ height: "calc(62vh - 56px)" }}
      >
        {node?.kind === "person" && <PersonProfile person={node} />}
        {node?.kind === "topic" && <TopicPage topic={node} />}
      </div>
    </div>
  );
}
