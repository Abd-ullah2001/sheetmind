"use client";

import { ChevronDown, MessageSquareText } from "lucide-react";
import { useSheetMindStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { ToolCallTrace } from "./ToolCallTrace";

export function ResultPanel() {
  const history = useSheetMindStore((state) => state.queryHistory);
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-[var(--color-iris-edge)] bg-[var(--color-pure-white)]">
      <div className="border-b border-[var(--color-ash)] p-4">
        <h2 className="font-avant-garde text-[18px] font-bold text-[var(--color-midnight-plum)]">Agent Results</h2>
        <p className="mt-1 text-[12px] text-[var(--color-steel)]">{history.length} messages</p>
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {history.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-[14px] text-[var(--color-steel)]">
            <MessageSquareText className="mb-3 h-8 w-8 text-[var(--color-aubergine-core)]" />
            Ask a question to see responses and tool calls here.
          </div>
        ) : (
          history.map((item) => (
            <article key={item.id} className="rounded-[16px] border border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] p-3">
              <div className="rounded-[4px] bg-[var(--color-lavender-wash)] p-3 text-[14px] font-medium text-[var(--color-midnight-plum)]">
                {item.query}
              </div>
              <p className="mt-3 text-[14px] leading-[1.38] text-[var(--color-graphite)]">{item.response}</p>
              <details className="mt-3">
                <summary className="flex cursor-pointer list-none items-center gap-1 text-[12px] font-medium text-[var(--color-steel)]">
                  <ChevronDown className="h-3 w-3" />
                  Tools called
                </summary>
                <div className="mt-2">
                  <ToolCallTrace tools={item.toolsCalled} />
                </div>
              </details>
              <div className="mt-3 flex items-center justify-between text-[12px] text-[var(--color-steel)]">
                <span>{formatDate(item.timestamp)}</span>
                {typeof item.latencyMs === "number" ? <span>{item.latencyMs}ms</span> : null}
              </div>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
