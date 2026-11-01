"use client";

import { useState } from "react";
import { removeAccents } from "../../lib/text-transform";

export default function AccentRemover() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = removeAccents(input);
  const removed = input.length - output.length;

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const area: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 14, resize: "vertical" };

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>TEXTO COM ACENTOS</label>
      <textarea rows={6} value={input} onChange={e => setInput(e.target.value)}
        placeholder="Digite ou cole texto com ã, é, ç, õ, ü..." style={{ ...area, marginBottom: 16 }} />

      {input && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>RESULTADO</label>
              {removed > 0 && <span style={{ fontSize: 12, background: "var(--accent)20", color: "var(--accent)", borderRadius: 4, padding: "2px 6px" }}>{removed} acento{removed !== 1 ? "s" : ""} removido{removed !== 1 ? "s" : ""}</span>}
            </div>
            <button onClick={copy} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
          </div>
          <textarea rows={6} readOnly value={output} style={{ ...area, color: "var(--accent)" }} />
        </>
      )}
    </div>
  );
}
