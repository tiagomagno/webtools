"use client";

import { useState } from "react";
import { reverseChars, reverseWords, reverseLines } from "../../lib/text-transform";

const MODES = [
  { key: "chars", label: "Inverter caracteres" },
  { key: "words", label: "Inverter palavras" },
  { key: "lines", label: "Inverter linhas" },
] as const;

type Mode = typeof MODES[number]["key"];

export default function TextInverter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("chars");
  const [copied, setCopied] = useState(false);

  const output = mode === "chars" ? reverseChars(input) : mode === "words" ? reverseWords(input) : reverseLines(input);

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const area: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 14, width: "100%", resize: "vertical" };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {MODES.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, background: mode === m.key ? "var(--accent)" : "var(--surface)", color: mode === m.key ? "#fff" : "var(--text)" }}>
            {m.label}
          </button>
        ))}
      </div>

      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>TEXTO DE ENTRADA</label>
      <textarea rows={5} value={input} onChange={e => setInput(e.target.value)} placeholder="Digite ou cole o texto aqui..." style={{ ...area, marginBottom: 16 }} />

      {input && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>RESULTADO</label>
            <button onClick={copy} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
          </div>
          <textarea rows={5} readOnly value={output} style={{ ...area, color: "var(--accent)" }} />
        </>
      )}
    </div>
  );
}
