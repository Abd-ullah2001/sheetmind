"use client";

import { FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSheetMindStore } from "@/lib/store";

export function Sidebar() {
  const { sheetNames, activeSheet, setActiveSheet, activeFileName } = useSheetMindStore();
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-[var(--color-border)] bg-white">
      <div className="border-b border-[var(--color-border-light)] p-4">
        <div className="label-mono text-[var(--color-text-tertiary)]">Workbook</div>
        <div className="mt-1 truncate text-[15px] font-semibold text-[var(--color-text-primary)]">{activeFileName ?? "Spreadsheet"}</div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {sheetNames.length === 0 ? (
          <div className="px-2 py-3 text-[14px] text-[var(--color-text-secondary)]">No sheets loaded</div>
        ) : (
          sheetNames.map((name) => (
            <button
              key={name}
              onClick={() => setActiveSheet(name)}
              className={cn(
                "mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[14px] transition-colors",
                activeSheet === name
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)]"
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