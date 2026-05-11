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
        // e.g. https://docs.google.com/spreadsheets/d/1BxiMVs0X_5u.../edit
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : url;
      } else {
        // Basic extract for OneDrive/SharePoint or just return as is for now
        // Excel IDs can be quite complex, so for simplicity we just return the input or attempt extraction
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className={`h-2 w-full ${isGoogle ? "bg-green-500" : "bg-blue-600"}`} />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-4 text-slate-400 hover:text-slate-600"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isGoogle ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Connect Existing</h2>
              <p className="text-sm text-slate-500">
                Link a {isGoogle ? "Google Sheet" : "Microsoft Excel"} file.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <Input 
                placeholder="e.g. Q3 Financial Report" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isGoogle ? "Google Sheet Link (or ID)" : "OneDrive Link (or ID)"}
              </label>
              <Input 
                placeholder={isGoogle ? "https://docs.google.com/spreadsheets/d/..." : "https://onedrive.live.com/..."}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
              />
              <p className="text-xs text-slate-400 mt-2">
                Make sure the file permissions allow access if applicable.
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <Button 
              className={`w-full h-11 text-base font-semibold shadow-md mt-4 ${isGoogle ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
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
