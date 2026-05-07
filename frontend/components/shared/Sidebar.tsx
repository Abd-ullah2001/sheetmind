"use client";

import { FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSheetMindStore } from "@/lib/store";

export function Sidebar() {
  const { sheetNames, activeSheet, setActiveSheet, activeFileName } = useSheetMindStore();
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r bg-white">
      <div className="border-b p-4">
        <div className="text-xs font-medium uppercase text-muted-foreground">Workbook</div>
        <div className="mt-1 truncate text-sm font-semibold">{activeFileName ?? "Spreadsheet"}</div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {sheetNames.length === 0 ? <div className="px-2 py-3 text-sm text-muted-foreground">No sheets loaded</div> : sheetNames.map((name) => (
          <button key={name} onClick={() => setActiveSheet(name)} className={cn("mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors", activeSheet === name ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
            <FileSpreadsheet className="h-4 w-4 shrink-0" />
            <span className="truncate">{name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
