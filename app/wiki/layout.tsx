import { TopBar } from "@/components/shared/TopBar";
import { Sidebar } from "@/components/wiki/Sidebar";

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell mode-day flex flex-col">
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main
          className="flex-1 overflow-y-auto"
          style={{ height: "calc(100vh - 52px)" }}
        >
          <div className="max-w-[820px] mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
