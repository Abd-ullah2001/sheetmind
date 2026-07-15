"use client";

import { FileSpreadsheet, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type Platform = "google_sheets" | "excel";

export function PlatformSelector({ value, onChange }: { value: Platform; onChange: (value: Platform) => void }) {
  const items = [
    { value: "google_sheets" as const, label: "Google Sheets", icon: Table2 },
    { value: "excel" as const, label: "Excel", icon: FileSpreadsheet }
  ];
  return (
    <div className="inline-grid grid-cols-2 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white p-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "flex h-9 items-center justify-center gap-2 rounded-md px-4 text-[14px] font-semibold transition-colors",
              value === item.value
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}