"use client";

import { ChevronDown, MessageSquareText } from "lucide-react";
import { useSheetMindStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { ToolCallTrace } from "./ToolCallTrace";

export function ResultPanel() {
  const history = useSheetMindStore((state) => state.queryHistory);
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l bg-white">
      <div className="border-b p-4"><h2 className="font-semibold">Agent Results</h2><p className="mt-1 text-xs text-muted-foreground">{history.length} messages</p></div>
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {history.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground"><MessageSquareText className="mb-3 h-8 w-8 text-primary" />Ask a question to see responses and tool calls here.</div> : history.map((item) => (
          <article key={item.id} className="rounded-lg border p-3">
            <div className="rounded-md bg-muted p-3 text-sm font-medium">{item.query}</div>
            <p className="mt-3 text-sm leading-6">{item.response}</p>
            <details className="mt-3"><summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-muted-foreground"><ChevronDown className="h-3 w-3" />Tools called</summary><div className="mt-2"><ToolCallTrace tools={item.toolsCalled} /></div></details>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>{formatDate(item.timestamp)}</span>{typeof item.latencyMs === "number" ? <span>{item.latencyMs}ms</span> : null}</div>
          </article>
        ))}
      </div>
    </aside>
  );
}
