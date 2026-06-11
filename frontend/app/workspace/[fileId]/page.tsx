"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";
import { SpreadsheetViewer } from "@/components/workspace/SpreadsheetViewer";
import { QueryBar } from "@/components/workspace/QueryBar";
import { ResultPanel } from "@/components/workspace/ResultPanel";
import { api } from "@/lib/api";
import { useSheetMindStore } from "@/lib/store";

export default function WorkspacePage() {
  const params = useParams<{ fileId: string }>();
  const sessionRes = useSession();
  const status = sessionRes?.status;
  const accessToken = sessionRes?.data?.accessToken;
  const router = useRouter();
  const [showResults, setShowResults] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setActiveFile, setSheetNames } = useSheetMindStore();

  useEffect(() => {
    if (!params.fileId || !accessToken) return;
    Promise.all([api.getFile(params.fileId, accessToken), api.getSheetInfo(params.fileId, accessToken)]).then(([file, info]) => {
      setActiveFile(file);
      setSheetNames(info.sheet_names ?? info.sheets ?? file.metadata?.sheets ?? ["Sheet1"]);
    }).catch((err) => setError(err instanceof Error ? err.message : "Could not load workspace"));
  }, [params.fileId, accessToken, setActiveFile, setSheetNames]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [router, status]);

  return (
    <div className="flex h-screen flex-col bg-[var(--color-cream-canvas)]">
      <Navbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-11 items-center justify-between border-b border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] px-3">
            <div className="text-[14px] font-medium text-[var(--color-midnight-plum)]">A1:Z200</div>
            <Button variant="ghost" size="icon" title="Toggle results" onClick={() => setShowResults((value) => !value)}>
              {showResults ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </Button>
          </div>
          {error ? (
            <div className="m-4 rounded-[8px] border border-red-200 bg-red-50 p-4 text-[14px] text-red-700">{error}</div>
          ) : null}
          <div className="flex min-h-0 flex-1">
            <SpreadsheetViewer fileId={params.fileId} token={accessToken} />
            {showResults ? <ResultPanel /> : null}
          </div>
          <QueryBar fileId={params.fileId} token={accessToken} />
        </main>
      </div>
    </div>
  );
}
