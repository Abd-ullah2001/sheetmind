export type FileType = "excel_local" | "excel_online" | "google_sheets";

export type SheetFile = {
  id: string;
  display_name: string;
  file_type: FileType;
  last_synced_at?: string | null;
  metadata?: {
    rows?: number;
    columns?: number;
    row_count?: number;
    column_count?: number;
    sheets?: string[];
    [key: string]: unknown;
  };
};

export type AgentResponse = {
  response: string;
  tools_called: string[];
  session_id: string;
  tokens_used: number;
  cached?: boolean;
  status?: "success" | "error" | "partial";
  error?: string | null;
  latency_ms?: number;
};

export type QueryMessage = {
  id: string;
  query: string;
  response: string;
  toolsCalled: string[];
  timestamp: string;
  latencyMs?: number;
  status?: string;
};

export type SheetInfo = {
  sheet_names?: string[];
  sheets?: string[];
  active_sheet?: string;
};

export type QueryLog = {
  id: string;
  file_id?: string | null;
  file?: string | null;
  raw_query: string;
  tools_called: string[];
  llm_response?: string | null;
  tokens_used?: number;
  latency_ms?: number;
  status: "success" | "error" | "partial";
  error_message?: string | null;
  created_at: string;
};

export type WebhookConfig = {
  id: string;
  zapier_url: string;
  events: string[];
  secret?: string;
  active: boolean;
  created_at?: string;
};
