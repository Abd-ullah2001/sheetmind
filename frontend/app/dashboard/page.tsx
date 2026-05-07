"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCard } from "@/components/dashboard/FileCard";
import { FileUploadZone } from "@/components/dashboard/FileUploadZone";
import { Platform, PlatformSelector } from "@/components/dashboard/PlatformSelector";
import { ChatAgent } from "@/components/dashboard/ChatAgent";
import { api } from "@/lib/api";
import type { SheetFile } from "@/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [platform, setPlatform] = useState<Platform>("google_sheets");
  const [files, setFiles] = useState<SheetFile[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatFile, setChatFile] = useState<SheetFile | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;
    api.getFiles(session.accessToken).then(setFiles).catch((err) => setError(err instanceof Error ? err.message : "Could not load files")).finally(() => setLoading(false));
  }, [session?.accessToken]);

  if (status === "unauthenticated") redirect("/");
  const visibleFiles = useMemo(() => files.filter((file) => platform === "google_sheets" ? file.file_type === "google_sheets" : file.file_type === "excel_local" || file.file_type === "excel_online"), [files, platform]);

  async function deleteFile(id: string) {
    if (!session?.accessToken) return;
    await api.deleteFile(id, session.accessToken);
    setFiles((current) => current.filter((file) => file.id !== id));
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-2xl font-semibold">Dashboard</h1><p className="mt-1 text-sm text-muted-foreground">Choose a spreadsheet and ask SheetMind to work on it.</p></div>
          <PlatformSelector value={platform} onChange={setPlatform} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_280px]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">{platform === "google_sheets" ? "Google Sheets" : "Excel files"}</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { if (platform === "google_sheets") window.open("https://sheets.new", "_blank"); }}><Plus className="h-4 w-4" />New File</Button>
                <Button variant="secondary"><ExternalLink className="h-4 w-4" />Connect Existing</Button>
              </div>
            </div>
            {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
            {isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-lg bg-muted" />)}</div> : visibleFiles.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleFiles.map((file) => <FileCard key={file.id} file={file} onDelete={(id) => void deleteFile(id)} onChat={(file) => setChatFile(file)} />)}</div> : <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">No files for this platform yet.</div>}
          </section>
          <Card><CardHeader><CardTitle>Excel Upload</CardTitle></CardHeader><CardContent><FileUploadZone token={session?.accessToken} /></CardContent></Card>
        </div>
      </main>
      {chatFile && session?.accessToken && (
        <ChatAgent 
          fileId={chatFile.id} 
          fileName={chatFile.display_name} 
          token={session?.accessToken} 
          onClose={() => setChatFile(null)} 
        />
      )}
    </div>
  );
}
