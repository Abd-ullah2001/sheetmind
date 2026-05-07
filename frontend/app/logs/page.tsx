"use client";

import { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { formatDate, truncate } from "@/lib/utils";
import type { QueryLog } from "@/types";

const statusVariant = { success: "success", error: "error", partial: "warning" } as const;

export default function LogsPage() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<QueryLog[]>([]);
  const [offset, setOffset] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;
  useEffect(() => {
    if (!session?.accessToken) return;
    api.getLogs(limit, offset, session.accessToken).then(setLogs).catch((err) => setError(err instanceof Error ? err.message : "Could not load logs"));
  }, [offset, session?.accessToken]);
  if (status === "unauthenticated") redirect("/");
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div><h1 className="text-2xl font-semibold">Query Logs</h1><p className="mt-1 text-sm text-muted-foreground">Audit natural language operations across workbooks.</p></div>
          <div className="flex items-center gap-2"><Button variant="outline" size="icon" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" disabled={logs.length < limit} onClick={() => setOffset(offset + limit)}><ChevronRight className="h-4 w-4" /></Button></div>
        </div>
        {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
        <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-muted/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">File</th><th className="px-4 py-3">Query</th><th className="px-4 py-3">Tools Used</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Latency</th><th className="px-4 py-3" /></tr></thead>
          <tbody>{logs.map((log) => <Fragment key={log.id}><tr className="border-b hover:bg-muted/40"><td className="px-4 py-3">{formatDate(log.created_at)}</td><td className="px-4 py-3">{log.file ?? log.file_id ?? "-"}</td><td className="px-4 py-3">{truncate(log.raw_query, 64)}</td><td className="px-4 py-3">{log.tools_called?.length ?? 0}</td><td className="px-4 py-3"><Badge variant={statusVariant[log.status]}>{log.status}</Badge></td><td className="px-4 py-3">{log.latency_ms ?? 0}ms</td><td className="px-4 py-3"><Button variant="ghost" size="icon" onClick={() => setOpenId(openId === log.id ? null : log.id)}><ChevronDown className="h-4 w-4" /></Button></td></tr>{openId === log.id ? <tr className="border-b bg-muted/20"><td colSpan={7} className="px-4 py-4"><div className="grid gap-3 md:grid-cols-2"><div><div className="text-xs font-medium uppercase text-muted-foreground">Query</div><p className="mt-1">{log.raw_query}</p></div><div><div className="text-xs font-medium uppercase text-muted-foreground">Response</div><p className="mt-1">{log.llm_response ?? "-"}</p></div></div></td></tr> : null}</Fragment>)}</tbody>
        </table></div></CardContent></Card>
      </main>
    </div>
  );
}
