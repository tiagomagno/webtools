"use client";

import { useState } from "react";
import { minifyCss } from "../../lib/dev-tools";

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = input.trim() ? minifyCss(input) : "";
  const saved = input.length && output.length ? Math.round((1 - output.length / input.length) * 100) : 0;

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const area: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 13, fontFamily: "monospace", resize: "vertical" };

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>CSS DE ENTRADA</label>
      <textarea rows={10} value={input} onChange={e => setInput(e.target.value)}
        placeholder={"body {\n  margin: 0;\n  padding: 0;\n  /* comentário */\n}\n\n.container {\n  display: flex;\n}"}
        style={{ ...area, marginBottom: 16 }} />

      {output && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>CSS MINIFICADO</label>
              {saved > 0 && <span style={{ fontSize: 12, background: "#22c55e20", color: "#22c55e", borderRadius: 4, padding: "2px 6px" }}>−{saved}%</span>}
            </div>
            <button onClick={copy} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
          </div>
          <textarea rows={4} readOnly value={output} style={{ ...area, color: "var(--accent)" }} />
          <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "var(--text-muted)" }}>
            <span>Original: {input.length} bytes</span>
            <span>Minificado: {output.length} bytes</span>
            <span>Economia: {input.length - output.length} bytes</span>
          </div>
        </>
      )}
    </div>
  );
}
