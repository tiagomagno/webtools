"use client";

import { useState } from "react";
import { Bug, Lightbulb, PaperPlaneTilt } from "@phosphor-icons/react";
import { useAuth } from "../lib/auth/AuthProvider";
import { TOOLS } from "../lib/tools";
import Modal from "./Modal";

type FeedbackType = "SUGGESTION" | "BUG";

const TYPES = {
  SUGGESTION: { title: "Enviar sugestão", link: "Enviar uma sugestão", icon: Lightbulb, placeholder: "Que ferramenta ou melhoria você gostaria de ver?" },
  BUG: { title: "Relatar bug", link: "Relatar um bug", icon: Bug, placeholder: "O que aconteceu? Conte o que você fez e o que esperava ver." },
} as const;

const MAX = 2000;

const fieldStyle: React.CSSProperties = {
  width: "100%", fontSize: 14, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)",
  background: "var(--surface-2)", color: "var(--text)", outline: "none", fontFamily: "inherit",
};

const linkStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, minHeight: 44, padding: 0, fontSize: 13, fontWeight: 600,
  background: "none", border: "none", cursor: "pointer", color: "var(--accent-text)", textAlign: "left",
};

/** Em /conta: links para enviar uma sugestão ou relatar um bug; o formulário abre numa janela (vai para a lista do /admin). */
export default function FeedbackSection() {
  const { authorizedFetch } = useAuth();
  const [type, setType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState("");
  const [tool, setTool] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function open(next: FeedbackType) {
    setType(next);
    setError(null);
    setSent(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type) return;
    setError(null);
    setSending(true);
    try {
      const res = await authorizedFetch("/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, page: tool ? `/tools/${tool}` : undefined }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Não foi possível enviar agora. Tente de novo.");
      }
      setMessage("");
      setTool("");
      setType(null);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar agora. Tente de novo.");
    } finally {
      setSending(false);
    }
  }

  const current = type ? TYPES[type] : null;
  const canSend = !sending && message.trim().length >= 5;

  return (
    <section className="cut-box" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>Ajude a melhorar o Webtools</h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 8px" }}>
        Falta alguma ferramenta ou algo não funcionou? Conte para a gente.
      </p>

      {(Object.keys(TYPES) as FeedbackType[]).map((id) => {
        const { link, icon: LinkIcon } = TYPES[id];
        return (
          <button key={id} type="button" onClick={() => open(id)} style={linkStyle}>
            <LinkIcon size={18} /> {link}
          </button>
        );
      })}
      {sent && <p role="status" style={{ margin: "8px 0 0", fontSize: 13, color: "var(--accent-text)" }}>Mensagem enviada. Obrigado!</p>}

      <Modal open={type !== null} title={current?.title ?? ""} onClose={() => setType(null)}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Mensagem</span>
            <textarea required minLength={5} maxLength={MAX} rows={6} value={message} placeholder={current?.placeholder}
              onChange={(e) => setMessage(e.target.value)} style={{ ...fieldStyle, resize: "vertical" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", alignSelf: "flex-end" }}>{message.length}/{MAX}</span>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Ferramenta (opcional)</span>
            <select value={tool} onChange={(e) => setTool(e.target.value)} style={fieldStyle}>
              <option value="">Nenhuma em especial</option>
              {TOOLS.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}
            </select>
          </label>

          {error && <p role="alert" style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>{error}</p>}

          <button type="submit" disabled={!canSend}
            style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, minHeight: 40, padding: "8px 14px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", cursor: canSend ? "pointer" : "not-allowed", opacity: canSend ? 1 : 0.6, background: "var(--accent-strong)", color: "#fff" }}>
            <PaperPlaneTilt size={16} /> {sending ? "Enviando…" : "Enviar"}
          </button>
        </form>
      </Modal>
    </section>
  );
}
