"use client";

import { useState } from "react";
import { numberToWords } from "../../lib/text-transform";

export default function NumberToWords() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const num = input === "" ? null : Number(input.replace(",", "."));
  const result = num !== null && !isNaN(num) ? numberToWords(num) : null;

  function copy() { if (result) { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); } }

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>NÚMERO</label>
      <input
        type="text"
        inputMode="numeric"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ex: 1234567"
        style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", color: "var(--text)", fontSize: 18, marginBottom: 16 }}
      />

      {result ? (
        <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--text)", lineHeight: 1.5, textTransform: "capitalize" }}>{result}</p>
            <button onClick={copy} style={{ whiteSpace: "nowrap", fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
          </div>
        </div>
      ) : input && (
        <p style={{ fontSize: 14, color: "var(--text-subtle)", textAlign: "center" }}>Número inválido ou fora do intervalo suportado (até 999 bilhões).</p>
      )}

      {!input && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8, marginTop: 4 }}>
          {[1, 10, 100, 1000, 1000000, 1000000000].map(n => (
            <button key={n} onClick={() => setInput(String(n))}
              style={{ padding: "8px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "var(--text)", textAlign: "left" }}>
              {n.toLocaleString("pt-BR")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
