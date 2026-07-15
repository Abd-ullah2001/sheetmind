"use client";

import { useState } from "react";
import { X, Link as LinkIcon, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { Platform } from "@/components/dashboard/PlatformSelector";

interface ConnectModalProps {
  platform: Platform;
  token: string | undefined;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConnectModal({ platform, token, onClose, onSuccess }: ConnectModalProps) {
  const [url, setUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGoogle = platform === "google_sheets";

  const extractIdFromUrl = (url: string) => {
    try {
      if (isGoogle) {
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : url;
      } else {
        return url;
      }
    } catch {
      return url;
    }
  };

  const handleConnect = async () => {
    if (!url.trim() || !displayName.trim() || !token) {
      setError("Please provide both a valid link and a name.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileId = extractIdFromUrl(url);

      if (isGoogle) {
        await api.connectGoogle(fileId, displayName, token);
      } else {
        await api.connectMicrosoft(fileId, displayName, token);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect spreadsheet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[var(--radius-card)] bg-white shadow-xl">
        <div className="h-1 w-full bg-[var(--color-primary)]" />

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-4 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="p-[var(--spacing-card)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-[24px] font-semibold text-[var(--color-text-primary)]">Connect Existing</h2>
              <p className="text-[14px] text-[var(--color-text-secondary)]">
                Link a {isGoogle ? "Google Sheet" : "Microsoft Excel"} file.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label-mono mb-1 block text-[var(--color-text-secondary)]">Display Name</label>
              <Input
                placeholder="e.g. Q3 Financial Report"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label className="label-mono mb-1 block text-[var(--color-text-secondary)]">
                {isGoogle ? "Google Sheet Link (or ID)" : "OneDrive Link (or ID)"}
              </label>
              <Input
                placeholder={isGoogle ? "https://docs.google.com/spreadsheets/d/..." : "https://onedrive.live.com/..."}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="mt-2 text-[12px] text-[var(--color-text-tertiary)]">
                Make sure the file permissions allow access if applicable.
              </p>
            </div>

            {error && (
              <div className="rounded-[var(--radius-control)] border border-red-200 bg-red-50 p-3 text-[14px] text-red-700">
                {error}
              </div>
            )}

            <Button
              className="mt-4 w-full h-11 text-[14px] font-semibold"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : (
                <>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect {isGoogle ? "Google Sheet" : "Excel File"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}