"use client";

import { useState } from "react";
import { formatHtml } from "../../lib/dev-tools";

export default function HtmlFormatter() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = input.trim() ? formatHtml(input) : "";
  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const area: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 13, fontFamily: "monospace", resize: "vertical" };

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>HTML DE ENTRADA</label>
      <textarea rows={8} value={input} onChange={e => setInput(e.target.value)}
        placeholder={"<html><head><title>Teste</title></head><body><p>Olá</p></body></html>"}
        style={{ ...area, marginBottom: 16 }} />

      {output && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>HTML FORMATADO</label>
            <button onClick={copy} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
          </div>
          <textarea rows={12} readOnly value={output} style={{ ...area, color: "var(--accent)" }} />
        </>
      )}
    </div>
  );
}
