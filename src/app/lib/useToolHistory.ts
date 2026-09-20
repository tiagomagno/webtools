"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./auth/AuthProvider";

export interface ToolHistoryEntry<T = unknown> {
  id: string;
  tool: string;
  payload: T;
  createdAt: string;
}

// Hook genérico de sincronismo: cada ferramenta que quiser guardar histórico
// entre dispositivos chama useToolHistory("slug-da-ferramenta") e usa save()
// nos momentos relevantes (ex: depois de gerar um QR code, comprimir um PDF).
export function useToolHistory<T = unknown>(tool: string) {
  const { authorizedFetch, status } = useAuth();
  const [entries, setEntries] = useState<ToolHistoryEntry<T>[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const res = await authorizedFetch(`/history?tool=${encodeURIComponent(tool)}`);
      if (res.ok) {
        const data = (await res.json()) as { entries: ToolHistoryEntry<T>[] };
        setEntries(data.entries);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, status]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(
    async (payload: T) => {
      const res = await authorizedFetch("/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, payload }),
      });
      if (res.ok) {
        const entry = (await res.json()) as ToolHistoryEntry<T>;
        setEntries((prev) => [entry, ...prev]);
      }
      return res.ok;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tool],
  );

  const remove = useCallback(
    async (id: string) => {
      const res = await authorizedFetch(`/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
      }
      return res.ok;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { entries, loading, save, remove, reload };
}
