"use client";

import { useEffect, useState } from "react";
import { Bug, Lightbulb, Trash } from "@phosphor-icons/react";
import { useAuth } from "../lib/auth/AuthProvider";

interface FeedbackItem {
  id: string;
  type: "SUGGESTION" | "BUG";
  message: string;
  page: string | null;
  createdAt: string;
  user: { email: string; name: string | null };
}

/** Lista de sugestões e bugs enviados pelos usuários (só no /admin). */
export default function AdminFeedback() {
  const { authorizedFetch } = useAuth();
  const [items, setItems] = useState<FeedbackItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await authorizedFetch("/admin/feedback");
      if (cancelled) return;
      if (!res.ok) {
        setError("Não foi possível carregar as mensagens.");
        return;
      }
      setItems(await res.json());
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(item: FeedbackItem) {
    if (!window.confirm("Apagar esta mensagem? Não dá para desfazer.")) return;
    const res = await authorizedFetch(`/admin/feedback/${item.id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? prev);
    else setError("Não foi possível apagar a mensagem.");
  }

  return (
    <section>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>Sugestões e bugs</h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 12px" }}>Mensagens enviadas pelos usuários em Minha conta.</p>
      <div className="cut-box" style={{ padding: 8 }}>
        {error ? (
          <p style={{ margin: 0, padding: 16, fontSize: 13, color: "#ef4444" }}>{error}</p>
        ) : !items ? (
          <p style={{ margin: 0, padding: 16, fontSize: 13, color: "var(--text-muted)" }}>Carregando…</p>
        ) : items.length === 0 ? (
          <p style={{ margin: 0, padding: 16, fontSize: 13, color: "var(--text-muted)" }}>Nenhuma mensagem ainda.</p>
        ) : (
          items.map((item) => {
            const TypeIcon = item.type === "BUG" ? Bug : Lightbulb;
            return (
              <article key={item.id} style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid var(--border)" }}>
                <TypeIcon size={18} aria-label={item.type === "BUG" ? "Bug" : "Sugestão"} style={{ flexShrink: 0, marginTop: 2, color: item.type === "BUG" ? "#ef4444" : "var(--accent-text)" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text)", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{item.message}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
                    {item.user.name || item.user.email} · {new Date(item.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                    {item.page ? ` · ${item.page}` : ""}
                  </p>
                </div>
                <button type="button" onClick={() => remove(item)} aria-label="Apagar mensagem" title="Apagar mensagem"
                  style={{ width: 36, height: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer" }}>
                  <Trash size={16} />
                </button>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
