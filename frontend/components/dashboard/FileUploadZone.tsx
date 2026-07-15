"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function FileUploadZone({ token }: { token?: string }) {
  const router = useRouter();
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    if (!file.name.endsWith(".xlsx")) return setError("Only .xlsx files are supported.");
    setUploading(true);
    setError(null);
    try {
      const uploadInfo = await api.uploadFileGetUrl(file.name, token);
      await fetch(uploadInfo.upload_url, { method: "PUT", body: file, headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" } });
      const confirmed = await api.confirmUpload(uploadInfo.file_id, uploadInfo.s3_key, file.name, token);
      router.push(`/workspace/${confirmed.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label
      className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-white p-6 text-center transition-colors hover:bg-[var(--color-primary-light)]/50"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files.item(0); if (file) void upload(file); }}
    >
      {isUploading ? <LoadingSpinner className="h-6 w-6" /> : <UploadCloud className="h-8 w-8 text-[var(--color-primary)]" />}
      <div className="mt-3 text-[14px] font-semibold text-[var(--color-text-primary)]">Drop an Excel workbook here</div>
      <div className="mt-1 text-[14px] text-[var(--color-text-secondary)]">or click to choose a .xlsx file</div>
      {error ? <div className="mt-3 text-[14px] text-red-600">{error}</div> : null}
      <input type="file" accept=".xlsx" className="hidden" disabled={isUploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
    </label>
  );
}