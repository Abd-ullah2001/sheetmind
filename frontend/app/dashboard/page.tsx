"use client";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>("google_sheets");
  const [files, setFiles] = useState<SheetFile[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatFile, setChatFile] = useState<SheetFile | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const fetchFiles = useCallback(() => {
    if (!session?.accessToken) return;
    setLoading(true);
    api.getFiles(session.accessToken)
      .then(setFiles)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load files"))
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [router, status]);

  const isGoogle = platform === "google_sheets";

  const visibleFiles = useMemo(() => files.filter((file) => isGoogle ? file.file_type === "google_sheets" : file.file_type === "excel_local" || file.file_type === "excel_online"), [files, isGoogle]);

  async function deleteFile(id: string) {
    if (!session?.accessToken) return;
    await api.deleteFile(id, session.accessToken);
    setFiles((current) => current.filter((file) => file.id !== id));
    if (chatFile?.id === id) setChatFile(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Thematic Background Elements */}
      <div className={`absolute top-0 -left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-[0.15] animate-blob transition-colors duration-700 ${isGoogle ? 'bg-green-300' : 'bg-blue-300'}`}></div>
      <div className={`absolute top-20 -right-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-[0.15] animate-blob animation-delay-2000 transition-colors duration-700 ${isGoogle ? 'bg-emerald-300' : 'bg-indigo-300'}`}></div>
      
      <Navbar />
      
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${isGoogle ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} transition-colors duration-500`}>
                <Sparkles className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Workspace</h1>
            </div>
            <p className="text-slate-500 max-w-xl">
              Connect your spreadsheets and let the AI agent analyze, update, and manage your data automatically.
            </p>
          </div>
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <PlatformSelector value={platform} onChange={setPlatform} />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                {isGoogle ? "Google Sheets" : "Excel Workbooks"}
              </h2>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className={`border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50 ${isGoogle ? 'text-green-700 hover:text-green-800' : 'text-blue-700 hover:text-blue-800'}`}
                  onClick={() => { if (isGoogle) window.open("https://sheets.new", "_blank"); }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New File
                </Button>
                <Button 
                  className={`shadow-sm transition-all text-white ${isGoogle ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}
                  onClick={() => setIsConnectModalOpen(true)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Existing
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-40 animate-pulse rounded-2xl bg-white/60 border border-slate-100 shadow-sm" />
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
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 backdrop-blur-sm p-12 text-center shadow-sm">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full mb-4 ${isGoogle ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'}`}>
                  <ExternalLink className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">No files connected yet</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Click the &quot;Connect Existing&quot; button to link your {isGoogle ? 'Google Sheets' : 'Excel workbooks'} to SheetMind.
                </p>
                <Button 
                  className={`mt-6 shadow-sm text-white ${isGoogle ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  onClick={() => setIsConnectModalOpen(true)}
                >
                  Connect Your First File
                </Button>
              </div>
            )}
          </section>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {!isGoogle && (
              <Card className="border-slate-200 shadow-md shadow-slate-200/50 overflow-hidden rounded-2xl bg-white/80 backdrop-blur">
                <div className="h-1 w-full bg-blue-500" />
                <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                  <CardTitle className="text-lg">Local Excel Upload</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FileUploadZone token={session?.accessToken} />
                </CardContent>
              </Card>
            )}

            <Card className="border-slate-200 shadow-md shadow-slate-200/50 overflow-hidden rounded-2xl bg-white/80 backdrop-blur">
              <div className={`h-1 w-full ${isGoogle ? 'bg-green-500' : 'bg-blue-500'}`} />
              <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                <CardTitle className="text-lg">Agent Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <span className="text-sm font-medium text-slate-600">Online & Ready</span>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Select a file and click &quot;Chat with Agent&quot; to begin analyzing your data.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {isConnectModalOpen && (
        <ConnectModal 
          platform={platform} 
          token={session?.accessToken} 
          onClose={() => setIsConnectModalOpen(false)} 
          onSuccess={() => {
            setIsConnectModalOpen(false);
            fetchFiles();
          }}
        />
      )}

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

