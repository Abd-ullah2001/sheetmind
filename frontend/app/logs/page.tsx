"use client";

export const dynamic = "force-dynamic";

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
  const sessionRes = useSession();
  const status = sessionRes?.status;
  const accessToken = sessionRes?.data?.accessToken;
  const [logs, setLogs] = useState<QueryLog[]>([]);
  const [offset, setOffset] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;
  useEffect(() => {
    if (!accessToken) return;
    api.getLogs(limit, offset, accessToken).then(setLogs).catch((err) => setError(err instanceof Error ? err.message : "Could not load logs"));
  }, [offset, accessToken]);
  if (status === "unauthenticated") redirect("/");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-page px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-semibold text-[var(--color-text-primary)]">Query Logs</h1>
            <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">Audit natural language operations across workbooks.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={logs.length < limit} onClick={() => setOffset(offset + limit)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {error ? (
          <div className="mb-4 rounded-[var(--radius-control)] border border-red-200 bg-red-50 p-4 text-[14px] text-red-700">{error}</div>
        ) : null}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-[14px]">
                <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] label-mono text-[var(--color-text-tertiary)]">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">File</th>
                    <th className="px-4 py-3">Query</th>
                    <th className="px-4 py-3">Tools Used</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Latency</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <Fragment key={log.id}>
                      <tr className="border-b border-[var(--color-border-light)] hover:bg-[var(--color-surface-soft)]/40">
                        <td className="px-4 py-3 text-[var(--color-text-primary)]">{formatDate(log.created_at)}</td>
                        <td className="px-4 py-3 text-[var(--color-text-secondary)]">{log.file ?? log.file_id ?? "-"}</td>
                        <td className="px-4 py-3 text-[var(--color-text-secondary)]">{truncate(log.raw_query, 64)}</td>
                        <td className="px-4 py-3 text-[var(--color-text-secondary)]">{log.tools_called?.length ?? 0}</td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariant[log.status]}>{log.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text-secondary)]">{log.latency_ms ?? 0}ms</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="icon" onClick={() => setOpenId(openId === log.id ? null : log.id)}>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      {openId === log.id ? (
                        <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-surface-soft)]/20">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <div className="label-mono text-[var(--color-text-tertiary)]">Query</div>
                                <p className="mt-1 text-[14px] text-[var(--color-text-primary)]">{log.raw_query}</p>
                              </div>
                              <div>
                                <div className="label-mono text-[var(--color-text-tertiary)]">Response</div>
                                <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">{log.llm_response ?? "-"}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}