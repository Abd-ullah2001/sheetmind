import { create } from "zustand";
import type { AgentResponse, FileType, QueryMessage, SheetFile } from "@/types";

type SheetMindState = {
  activeFileId: string | null;
  activeFileName: string | null;
  activeFileType: FileType | null;
  sheetNames: string[];
  activeSheet: string | null;
  queryHistory: QueryMessage[];
  isQuerying: boolean;
  lastQueryResult: AgentResponse | null;
  refreshNonce: number;
  sessionId: string | null;
  setActiveFile: (file: SheetFile) => void;
  setSheetNames: (names: string[]) => void;
  setActiveSheet: (name: string) => void;
  appendQueryMessage: (msg: QueryMessage) => void;
  setQuerying: (value: boolean) => void;
  setLastQueryResult: (value: AgentResponse | null) => void;
  bumpRefresh: () => void;
  clearHistory: () => void;
};

export const useSheetMindStore = create<SheetMindState>((set) => ({
  activeFileId: null,
  activeFileName: null,
  activeFileType: null,
  sheetNames: [],
  activeSheet: null,
  queryHistory: [],
  isQuerying: false,
  lastQueryResult: null,
  refreshNonce: 0,
  sessionId: null,
  setActiveFile: (file) => set({ activeFileId: file.id, activeFileName: file.display_name, activeFileType: file.file_type }),
  setSheetNames: (names) => set((state) => ({ sheetNames: names, activeSheet: state.activeSheet ?? names[0] ?? null })),
  setActiveSheet: (name) => set({ activeSheet: name }),
  appendQueryMessage: (msg) => set((state) => ({ queryHistory: [...state.queryHistory, msg] })),
  setQuerying: (value) => set({ isQuerying: value }),
  setLastQueryResult: (value) => set({ lastQueryResult: value, sessionId: value?.session_id ?? null }),
  bumpRefresh: () => set((state) => ({ refreshNonce: state.refreshNonce + 1 })),
  clearHistory: () => set({ queryHistory: [], lastQueryResult: null, sessionId: null })
}));
