"use client";

import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { api } from "@/lib/api";
import { useSheetMindStore } from "@/lib/store";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

type Row = Record<string, unknown>;

function columnName(index: number) {
  let name = "";
  let n = index + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

export function SpreadsheetViewer({ fileId, token }: { fileId: string; token?: string }) {
  const { activeSheet, refreshNonce } = useSheetMindStore();
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSheet) return;
    setLoading(true);
    setError(null);
    api.getSheetRange(fileId, activeSheet, "A1:Z200", token).then((data) => {
      const maxColumns = Math.max(26, ...data.map((row) => row.length));
      setRows(data.map((row, rowIndex) => {
        const value: Row = { rowNumber: rowIndex + 1 };
        for (let index = 0; index < maxColumns; index += 1) value[columnName(index)] = row[index] ?? "";
        return value;
      }));
    }).catch((err) => setError(err instanceof Error ? err.message : "Could not load sheet range")).finally(() => setLoading(false));
  }, [activeSheet, fileId, refreshNonce, token]);

  const columns = useMemo<ColDef<Row>[]>(() => {
    const keys = rows[0] ? Object.keys(rows[0]).filter((key) => key !== "rowNumber") : Array.from({ length: 26 }, (_, i) => columnName(i));
    return [{ field: "rowNumber", headerName: "", pinned: "left", width: 64 }, ...keys.map((key) => ({ field: key, headerName: key, minWidth: 120, editable: false, resizable: true }))];
  }, [rows]);

  return (
    <div className="relative h-full min-h-0 flex-1 bg-white">
      {isLoading ? <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70"><LoadingSpinner className="h-6 w-6 text-primary" /></div> : null}
      {error ? <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      <div className="ag-theme-quartz h-full w-full"><AgGridReact<Row> rowData={rows} columnDefs={columns} defaultColDef={{ sortable: false, filter: false }} suppressCellFocus animateRows={false} /></div>
    </div>
  );
}
