"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useAuth } from "../lib/auth/AuthProvider";
import { HISTORY_TOOLS, historyHref, isHistoryTool, parseHistoryPayload, summarizeHistory } from "../lib/historico";
import type { ToolHistoryEntry } from "../lib/useToolHistory";

const PAGE_SIZE = 20;

const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
  border: "1px solid", borderColor: active ? "var(--accent)" : "var(--border)",
  background: active ? "var(--accent)" : "var(--surface-2)", color: active ? "#fff" : "var(--text-muted)",
});

/** Lista do histórico do usuário em /conta, com filtro por ferramenta, carregar mais e apagar. */
export default function HistorySection() {
  const { authorizedFetch } = useAuth();
  const [tool, setTool] = useState<string | null>(null);
  const [entries, setEntries] = useState<ToolHistoryEntry[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (cursor?: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
        if (tool) params.set("tool", tool);
        if (cursor) params.set("cursor", cursor);
        const res = await authorizedFetch(`/history?${params}`);
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { entries: ToolHistoryEntry[] };
        setEntries((prev) => (cursor ? [...prev, ...data.entries] : data.entries));
        setHasMore(data.entries.length === PAGE_SIZE);
      } catch {
        setError("Não foi possível carregar o histórico.");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tool],
  );

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    const res = await authorizedFetch(`/history/${id}`, { method: "DELETE" });
    if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id));
    else setError("Não foi possível apagar a entrada.");
  }

  const visible = entries.filter((e) => isHistoryTool(e.tool) && parseHistoryPayload(e.tool, e.payload));

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>Meu histórico</h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>
        O que você salvou nas ferramentas. Clique em uma entrada para reabri-la.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        <button type="button" onClick={() => setTool(null)} style={chipStyle(tool === null)}>Todas</button>
        {Object.entries(HISTORY_TOOLS).map(([slug, cfg]) => (
          <button key={slug} type="button" onClick={() => setTool(slug)} style={chipStyle(tool === slug)}>{cfg.label}</button>
        ))}
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}

      {!loading && !error && visible.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          Nada salvo ainda. Use &quot;Salvar no histórico&quot; no Gerador de QR Code, no Conversor de Cores ou na Paleta de Cores.
        </p>
      )}

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {visible.map((entry) => (
          <li key={entry.id} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", background: "var(--surface-2)" }}>
            <Link href={historyHref(entry.tool, parseHistoryPayload(entry.tool, entry.payload))} style={{ flex: 1, minWidth: 0, textDecoration: "none" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>
                {HISTORY_TOOLS[entry.tool as keyof typeof HISTORY_TOOLS].label} · {new Date(entry.createdAt).toLocaleString("pt-BR")}
              </div>
              <div style={{ fontSize: 14, color: "var(--text)", overflowWrap: "anywhere", fontFamily: "monospace" }}>
                {summarizeHistory(entry.tool, entry.payload)}
              </div>
            </Link>
            <button type="button" onClick={() => void remove(entry.id)} aria-label="Apagar entrada" title="Apagar" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>

      {loading && <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "12px 0 0" }}>Carregando…</p>}
      {hasMore && !loading && (
        <button type="button" onClick={() => void load(entries[entries.length - 1]?.id)} style={{ ...chipStyle(false), marginTop: 12, padding: "8px 14px" }}>
          Carregar mais
        </button>
      )}
    </div>
  );
}
