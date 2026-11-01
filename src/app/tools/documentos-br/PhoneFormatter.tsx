"use client";

import { useState } from "react";

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  const len = d.length;

  let formatted = d;
  let type = "";

  if (len === 0) return { formatted: "", type: "" };

  if (len <= 2) { formatted = `(${d}`; }
  else if (len <= 6) { formatted = `(${d.slice(0,2)}) ${d.slice(2)}`; }
  else if (len === 10) {
    formatted = `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    type = "Telefone fixo";
  } else if (len === 11 && d[2] === "9") {
    formatted = `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
    type = "Celular";
  } else if (len === 11 && d.startsWith("0800")) {
    formatted = `0800 ${d.slice(4,7)} ${d.slice(7)}`;
    type = "0800";
  } else if (len <= 9) {
    formatted = `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  } else {
    formatted = `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  }

  return { formatted, type };
}

export default function PhoneFormatter() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { formatted, type } = formatPhone(input);
  const digits = input.replace(/\D/g, "");
  // wa.me exige o número com DDI — assume Brasil (55) para fixo (10) e celular (11 dígitos).
  const canWhatsapp = (digits.length === 10 || digits.length === 11) && !digits.startsWith("0800");
  const waLink = canWhatsapp
    ? `https://wa.me/55${digits}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`
    : "";

  function copy() { navigator.clipboard.writeText(formatted); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  function copyLink() { navigator.clipboard.writeText(waLink); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 1500); }

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>TELEFONE (SOMENTE NÚMEROS)</label>
      <input
        type="tel"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="11999998888"
        maxLength={15}
        style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", color: "var(--text)", fontSize: 18 }}
      />

      {formatted && (
        <div style={{ marginTop: 16, background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", fontFamily: "monospace" }}>{formatted}</div>
            {type && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{type}</div>}
          </div>
          <button onClick={copy} style={{ padding: "8px 16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
      )}

      {input && (
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>SEM FORMATAÇÃO</div>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: "var(--text)" }}>{input.replace(/\D/g,"")}</div>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>FORMATADO</div>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: "var(--accent)" }}>{formatted}</div>
          </div>
        </div>
      )}

      {canWhatsapp && (
        <div style={{ marginTop: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Link do WhatsApp</span>
          </div>

          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>MENSAGEM (OPCIONAL)</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Olá! Gostaria de falar sobre..."
            rows={2}
            style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 13, resize: "vertical", marginBottom: 12, boxSizing: "border-box" }}
          />

          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontFamily: "monospace", fontSize: 13, color: "var(--text)", wordBreak: "break-all", marginBottom: 12 }}>
            {waLink}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: "1 1 160px", textAlign: "center", padding: "10px 16px", background: "#22c55e", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
            >
              Abrir no WhatsApp
            </a>
            <button onClick={copyLink} style={{ flex: "1 1 160px", padding: "10px 16px", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {copiedLink ? "✓ Link copiado" : "Copiar link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
