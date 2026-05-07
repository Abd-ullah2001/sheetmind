"use client";

import { useRouter } from "next/navigation";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { SheetFile } from "@/types";

export function FileCard({ file, onDelete }: { file: SheetFile; onDelete: (id: string) => void }) {
  const router = useRouter();
  const rows = file.metadata?.rows ?? file.metadata?.row_count ?? "-";
  const columns = file.metadata?.columns ?? file.metadata?.column_count ?? "-";
  return (
    <Card className="group cursor-pointer transition-shadow hover:shadow-md" onClick={() => router.push(`/workspace/${file.id}`)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><FileSpreadsheet className="h-5 w-5" /></div>
            <div className="min-w-0">
              <div className="truncate font-medium">{file.display_name}</div>
              <div className="mt-1 text-xs text-muted-foreground">Synced {formatDate(file.last_synced_at)}</div>
            </div>
          </div>
          <Button size="icon" variant="ghost" title="Delete file" className="opacity-0 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); onDelete(file.id); }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Badge variant="outline">{file.file_type.replace("_", " ")}</Badge>
          <div className="text-xs text-muted-foreground">{rows} rows / {columns} cols</div>
        </div>
      </CardContent>
    </Card>
  );
}
