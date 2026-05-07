"use client";

import { useRouter } from "next/navigation";
import { FileSpreadsheet, Trash2, MessageSquareText, MoreVertical } from "lucide-react";
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
    <Card 
      className="group relative transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 border-slate-200 overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${isGoogle ? 'bg-green-500' : 'bg-blue-500'}`} />
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div 
            className="flex min-w-0 items-start gap-3 cursor-pointer"
            onClick={() => router.push(`/workspace/${file.id}`)}
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isGoogle ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold text-slate-800 text-lg">{file.display_name}</div>
              <div className="mt-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Updated {formatDate(file.last_synced_at)}
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
              onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge 
            variant="secondary" 
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${isGoogle ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
          >
            {file.file_type.replace("_", " ")}
          </Badge>
          <span className="text-xs font-medium text-slate-500">
            {rows} rows · {columns} columns
          </span>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-50 flex gap-2">
          <Button 
            className="flex-1 h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            onClick={() => onChat(file)}
          >
            <MessageSquareText className="mr-2 h-3.5 w-3.5" />
            Chat with Agent
          </Button>
          <Button 
            variant="outline"
            className="h-9 px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={() => router.push(`/workspace/${file.id}`)}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
