"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { TopBar } from "@/components/shared/TopBar";
import { DetailPanel } from "@/components/brain/DetailPanel";
import "@/components/brain/node-label.css";

// Three.js is client-only and heavy — load it without SSR.
const BrainGraph = dynamic(
  () => import("@/components/brain/BrainGraph").then((m) => m.BrainGraph),
  { ssr: false },
);

export default function BrainPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="app-shell flex flex-col" style={{ background: "#111111" }}>
      <TopBar />
      <main
        className="relative flex-1 overflow-hidden"
        style={{ height: "calc(100vh - 52px)", background: "#111111" }}
      >
        <BrainGraph selectedId={selectedId} onSelect={setSelectedId} />
        <DetailPanel
          selectedId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      </main>
    </div>
  );
}
