"use client";

import { useRouter } from "next/navigation";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { SheetFile } from "@/types";

interface FileCardProps {
  file: SheetFile;
  onDelete: (id: string) => void;
  onChat: (file: SheetFile) => void;
}

export function FileCard({ file, onDelete, onChat }: FileCardProps) {
  const router = useRouter();
  const rows = file.metadata?.rows ?? file.metadata?.row_count ?? "-";
  const columns = file.metadata?.columns ?? file.metadata?.column_count ?? "-";

  const isGoogle = file.file_type === "google_sheets";

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <CardContent className="p-[var(--spacing-card)]">
        <div className="flex items-start justify-between">
          <div
            className="flex min-w-0 cursor-pointer items-start gap-3"
            onClick={() => router.push(`/workspace/${file.id}`)}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[18px] font-semibold text-[var(--color-text-primary)]">{file.display_name}</div>
              <div className="label-mono mt-1 text-[var(--color-text-tertiary)]">
                Updated {formatDate(file.last_synced_at)}
              </div>
            </div>
          </div>

          <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-[var(--color-text-tertiary)] hover:bg-red-50 hover:text-red-500"
              onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="default">
            {file.file_type.replace("_", " ")}
          </Badge>
          <span className="text-[12px] text-[var(--color-text-secondary)]">
            {rows} rows &middot; {columns} columns
          </span>
        </div>

        <div className="mt-5 flex gap-2 border-t border-[var(--color-border-light)] pt-4">
          <Button
            className="flex-1 h-9 text-[12px] font-semibold"
            onClick={() => onChat(file)}
          >
            Chat with Agent
          </Button>
          <Button
            variant="ghost-cta"
            className="h-9 px-3 text-[12px] font-semibold"
            onClick={() => router.push(`/workspace/${file.id}`)}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}