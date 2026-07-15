"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus, Sparkles } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCard } from "@/components/dashboard/FileCard";
import { FileUploadZone } from "@/components/dashboard/FileUploadZone";
import { Platform, PlatformSelector } from "@/components/dashboard/PlatformSelector";
import { ChatAgent } from "@/components/dashboard/ChatAgent";
import { ConnectModal } from "@/components/dashboard/ConnectModal";
import { api } from "@/lib/api";
import type { SheetFile } from "@/types";

export default function DashboardPage() {
  const sessionRes = useSession();
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>("google_sheets");
  const [files, setFiles] = useState<SheetFile[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatFile, setChatFile] = useState<SheetFile | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const data = sessionRes?.data;
  const status = sessionRes?.status;
  const accessToken = data?.accessToken;

  const fetchFiles = useCallback(() => {
    if (!accessToken) return;
    setLoading(true);
    api.getFiles(accessToken)
      .then(setFiles)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load files"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [router, status]);

  const isGoogle = platform === "google_sheets";

  const visibleFiles = useMemo(() => files.filter((file) => isGoogle ? file.file_type === "google_sheets" : file.file_type === "excel_local" || file.file_type === "excel_online"), [files, isGoogle]);

  async function deleteFile(id: string) {
    if (!accessToken) return;
    await api.deleteFile(id, accessToken);
    setFiles((current) => current.filter((file) => file.id !== id));
    if (chatFile?.id === id) setChatFile(null);
  }

  const q = String.fromCharCode(34); // "

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="relative z-10 mx-auto max-w-page px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--color-border)] pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <h1 className="text-[32px] font-semibold text-[var(--color-text-primary)]">Your Workspace</h1>
            </div>
            <p className="max-w-xl text-[16px] text-[var(--color-text-secondary)] leading-[1.6]">
              Connect your spreadsheets and let the AI agent analyze, update, and manage your data automatically.
            </p>
          </div>
          <div className="rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white p-1 shadow-sm">
            <PlatformSelector value={platform} onChange={setPlatform} />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[24px] font-semibold text-[var(--color-text-primary)]">
                {isGoogle ? "Google Sheets" : "Excel Workbooks"}
              </h2>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { if (isGoogle) window.open("https://sheets.new", "_blank"); }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New File
                </Button>
                <Button size="sm" onClick={() => setIsConnectModalOpen(true)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Existing
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-[var(--radius-control)] border border-red-200 bg-red-50 p-4 text-[14px] text-red-700">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-40 animate-pulse rounded-[var(--radius-card)] bg-[var(--color-surface-soft)] border border-[var(--color-border)]" />
                ))}
              </div>
            ) : visibleFiles.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {visibleFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onDelete={deleteFile}
                    onChat={setChatFile}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)]/50 p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <ExternalLink className="h-8 w-8" />
                </div>
                <h3 className="text-[24px] font-semibold text-[var(--color-text-primary)]">No files connected yet</h3>
                <p className="mt-2 max-w-sm text-[14px] text-[var(--color-text-secondary)]">
                  Click the {q}Connect Existing{q} button to link your {isGoogle ? "Google Sheets" : "Excel workbooks"} to Auralis.
                </p>
                <Button className="mt-6" onClick={() => setIsConnectModalOpen(true)}>
                  Connect Your First File
                </Button>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            {!isGoogle && (
              <Card>
                <CardHeader>
                  <CardTitle>Local Excel Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadZone token={accessToken} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Agent Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[14px] font-medium text-[var(--color-text-primary)]">Online & Ready</span>
                </div>
                <p className="mt-3 text-[12px] text-[var(--color-text-secondary)]">
                  Select a file and click {q}Chat with Agent{q} to begin analyzing your data.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {isConnectModalOpen && (
        <ConnectModal
          platform={platform}
          token={accessToken}
          onClose={() => setIsConnectModalOpen(false)}
          onSuccess={() => {
            setIsConnectModalOpen(false);
            fetchFiles();
          }}
        />
      )}

      {chatFile && accessToken && (
        <ChatAgent
          fileId={chatFile.id}
          fileName={chatFile.display_name}
          token={accessToken}
          onClose={() => setChatFile(null)}
        />
      )}
    </div>
  );
}