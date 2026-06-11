"use client";

import { FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSheetMindStore } from "@/lib/store";

export function Sidebar() {
  const { sheetNames, activeSheet, setActiveSheet, activeFileName } = useSheetMindStore();
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-[var(--color-iris-edge)] bg-[var(--color-pure-white)]">
      <div className="border-b border-[var(--color-ash)] p-4">
        <div className="text-[12px] font-semibold uppercase tracking-[0.057em] text-[var(--color-steel)]">Workbook</div>
        <div className="mt-1 truncate text-[15px] font-semibold text-[var(--color-midnight-plum)]">{activeFileName ?? "Spreadsheet"}</div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {sheetNames.length === 0 ? (
          <div className="px-2 py-3 text-[14px] text-[var(--color-steel)]">No sheets loaded</div>
        ) : (
          sheetNames.map((name) => (
            <button
              key={name}
              onClick={() => setActiveSheet(name)}
              className={cn(
                "mb-1 flex w-full items-center gap-2 rounded-[4px] px-3 py-2 text-left text-[14px] transition-colors",
                activeSheet === name
                  ? "bg-[var(--color-aubergine-core)] text-[var(--color-pure-white)]"
                  : "text-[var(--color-midnight-plum)] hover:bg-[var(--color-lavender-wash)]"
              )}
            >
              <FileSpreadsheet className="h-4 w-4 shrink-0" />
              <span className="truncate">{name}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
