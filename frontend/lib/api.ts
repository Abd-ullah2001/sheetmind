import type { AgentResponse, QueryLog, SheetFile, SheetInfo, WebhookConfig } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, token?: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE}/api/v1${path}`, { ...options, headers, cache: "no-store" });
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const json = await response.json();
      detail = json.detail ?? detail;
    } catch {}
    throw new Error(String(detail));
  }
  return response.json() as Promise<T>;
}

export const api = {
  getMe: (token?: string) => request<Record<string, unknown>>("/auth/me", token),
  getFiles: (token?: string) => request<SheetFile[]>("/files", token),
  getFile: (fileId: string, token?: string) => request<SheetFile>(`/files/${fileId}`, token),
  uploadFileGetUrl: (filename: string, token?: string) =>
    request<{ file_id: string; upload_url: string; s3_key: string }>("/files/upload-url", token, { method: "POST", body: JSON.stringify({ filename }) }),
  confirmUpload: (fileId: string, s3Key: string, displayName: string, token?: string) =>
    request<SheetFile>("/files/confirm-upload", token, { method: "POST", body: JSON.stringify({ file_id: fileId, s3_key: s3Key, display_name: displayName }) }),
  deleteFile: (fileId: string, token?: string) => request<{ message: string }>(`/files/${fileId}`, token, { method: "DELETE" }),
  runAgentQuery: (fileId: string, query: string, sessionId?: string | null, token?: string) =>
    request<AgentResponse>("/agent/query", token, { method: "POST", body: JSON.stringify({ file_id: fileId, query, session_id: sessionId ?? undefined }) }),
  getSession: (fileId: string, token?: string) => request<Record<string, unknown>[]>(`/agent/sessions/${fileId}`, token),
  clearSession: (fileId: string, token?: string) => request<{ message: string }>(`/agent/sessions/${fileId}`, token, { method: "DELETE" }),
  getLogs: (limit = 20, offset = 0, token?: string) => request<QueryLog[]>(`/logs/?limit=${limit}&offset=${offset}`, token),
  getWebhooks: (token?: string) => request<WebhookConfig[]>("/webhooks/", token),
  createWebhook: (zapierUrl: string, events: string[], token?: string) =>
    request<WebhookConfig>("/webhooks/", token, { method: "POST", body: JSON.stringify({ zapier_url: zapierUrl, events, active: true }) }),
  updateWebhook: (webhook: WebhookConfig, token?: string) =>
    request<WebhookConfig>(`/webhooks/${webhook.id}`, token, { method: "PUT", body: JSON.stringify({ zapier_url: webhook.zapier_url, events: webhook.events, active: webhook.active }) }),
  deleteWebhook: (webhookId: string, token?: string) => request<{ message: string }>(`/webhooks/${webhookId}`, token, { method: "DELETE" }),
  getSheetInfo: (fileId: string, token?: string) => request<SheetInfo>(`/sheets/${fileId}/info`, token),
  getSheetRange: (fileId: string, sheet: string, range: string, token?: string) =>
    request<unknown[][]>(`/sheets/${fileId}/range?sheet_name=${encodeURIComponent(sheet)}&range=${encodeURIComponent(range)}`, token),
  connectGoogle: (sheetId: string, displayName: string, token?: string) =>
    request<SheetFile>("/files/connect-google", token, { method: "POST", body: JSON.stringify({ sheet_id: sheetId, display_name: displayName }) }),
  connectMicrosoft: (onedriveFileId: string, displayName: string, token?: string) =>
    request<SheetFile>("/files/connect-microsoft", token, { method: "POST", body: JSON.stringify({ onedrive_file_id: onedriveFileId, display_name: displayName }) })
};
