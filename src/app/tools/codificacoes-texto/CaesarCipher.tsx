"use client";

import { useState } from "react";
import { caesarCipher } from "../../lib/text-transform";

export default function CaesarCipher() {
  const [input, setInput] = useState("");
  const [shift, setShift] = useState(13);
  const [copied, setCopied] = useState(false);

  const encoded = caesarCipher(input, shift);
  const decoded = caesarCipher(input, -shift);

  function copy(text: string) { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const area: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 14, resize: "vertical" };

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }}>DESLOCAMENTO (SHIFT)</label>
        <input type="range" min={1} max={25} value={shift} onChange={e => setShift(Number(e.target.value))}
          style={{ flex: 1, minWidth: 120 }} />
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", minWidth: 32, textAlign: "center" }}>{shift}</span>
        <button onClick={() => setShift(13)} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>ROT13</button>
      </div>

      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>TEXTO</label>
      <textarea rows={4} value={input} onChange={e => setInput(e.target.value)}
        placeholder="Digite o texto a codificar ou decodificar..." style={{ ...area, marginBottom: 16 }} />

      {input && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>CODIFICADO (+{shift})</label>
              <button onClick={() => copy(encoded)} style={{ fontSize: 12, padding: "2px 8px", borderRadius: 5, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>{copied ? "✓" : "Copiar"}</button>
            </div>
            <textarea rows={4} readOnly value={encoded} style={{ ...area, color: "var(--accent)", fontSize: 13 }} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>DECODIFICADO (-{shift})</label>
              <button onClick={() => copy(decoded)} style={{ fontSize: 12, padding: "2px 8px", borderRadius: 5, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>Copiar</button>
            </div>
            <textarea rows={4} readOnly value={decoded} style={{ ...area, color: "#22c55e", fontSize: 13 }} />
          </div>
        </div>
      )}
    </div>
  );
}
