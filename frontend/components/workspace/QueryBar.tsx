"use client";

import { FormEvent, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { api } from "@/lib/api";
import { useSheetMindStore } from "@/lib/store";

export function QueryBar({ fileId, token }: { fileId: string; token?: string }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { isQuerying, sessionId, setQuerying, appendQueryMessage, setLastQueryResult, bumpRefresh } = useSheetMindStore();

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!token) {
      setError("Not authenticated. Please sign in again.");
      return;
    }
    const trimmed = query.trim();
    if (!trimmed || isQuerying) return;
    const started = performance.now();
    setQuerying(true);
    setError(null);
    try {
      const result = await api.runAgentQuery(fileId, trimmed, sessionId, token);
      const latencyMs = Math.round(performance.now() - started);
      setLastQueryResult({ ...result, latency_ms: latencyMs });
      appendQueryMessage({ id: crypto.randomUUID(), query: trimmed, response: result.response, toolsCalled: result.tools_called, timestamp: new Date().toISOString(), latencyMs, status: result.status });
      setQuery("");
      bumpRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setQuerying(false);
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="border-t border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] p-3">
      <div className="mx-auto flex max-w-5xl items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={isQuerying}
            placeholder='Ask anything... e.g. "Sum column B and highlight values above 500 in red"'
            className="h-12 pr-10"
          />
          {isQuerying ? <LoadingSpinner className="absolute right-3 top-4" /> : null}
        </div>
        <Button type="submit" className="h-12" disabled={isQuerying || !query.trim()}>
          <SendHorizonal className="h-4 w-4" />
          Submit
        </Button>
      </div>
      {error ? <div className="mx-auto mt-2 max-w-5xl text-[14px] text-red-600">{error}</div> : null}
    </form>
  );
}
