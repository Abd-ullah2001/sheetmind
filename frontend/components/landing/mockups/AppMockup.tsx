"use client";

import {
  LayoutDashboard,
  Bot,
  FileSpreadsheet,
  Settings,
  Plus,
} from "lucide-react";

export function AppMockup() {
  const sheets = [
    { name: "Q4 Revenue Report", updated: "2 min ago" },
    { name: "Marketing Budget", updated: "1 hr ago" },
    { name: "Sales Pipeline", updated: "3 hrs ago" },
  ];

  return (
    <div className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-landing-xl">
      <div className="flex h-[420px] sm:h-[480px]">
        {/* Sidebar */}
        <div className="hidden w-[180px] shrink-0 flex-col bg-[#1a1d21] sm:flex">
          <div className="border-b border-white/10 px-4 py-4">
            <span className="text-[13px] font-semibold text-white">SHEETMIND</span>
          </div>
          <nav className="flex-1 space-y-0.5 p-2">
            {[
              { icon: LayoutDashboard, label: "My Sheets", active: true },
              { icon: Bot, label: "Agents" },
              { icon: FileSpreadsheet, label: "Templates" },
              { icon: Settings, label: "Settings" },
            ].map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] ${
                  active
                    ? "bg-white/10 font-medium text-white"
                    : "text-white/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
            <h3 className="text-[14px] font-medium text-neutral-900">My Sheets</h3>
            <button className="flex items-center gap-1 rounded-md bg-black px-2.5 py-1 text-[11px] text-white">
              <Plus className="h-3 w-3" />
              Connect
            </button>
          </div>
          <div className="flex flex-1">
            <div className="flex-1 p-4">
              <div className="space-y-2">
                {sheets.map((sheet) => (
                  <div
                    key={sheet.name}
                    className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5 hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                      <span className="text-[12px] text-neutral-800">{sheet.name}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">{sheet.updated}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Agent panel */}
            <div className="hidden w-[200px] border-l border-neutral-100 bg-neutral-50/50 lg:block">
              <div className="border-b border-neutral-100 px-3 py-2.5">
                <span className="text-[11px] font-medium text-neutral-800">
                  AI Agent
                </span>
              </div>
              <div className="space-y-2 p-3">
                <div className="rounded-lg bg-white px-2.5 py-2 text-[10px] text-neutral-600 shadow-sm">
                  Add a pivot table for regional sales
                </div>
                <div className="rounded-lg bg-black px-2.5 py-2 text-[10px] text-white">
                  Done. Preview the pivot in Render Mode before applying.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
