"use client";

import { useState } from "react";
import { sortLines, SortMode } from "../../lib/text-transform";

const MODES: { key: SortMode; label: string }[] = [
  { key: "asc",         label: "A → Z" },
  { key: "desc",        label: "Z → A" },
  { key: "length-asc",  label: "Mais curtas" },
  { key: "length-desc", label: "Mais longas" },
  { key: "shuffle",     label: "Aleatório" },
  { key: "unique",      label: "Remover duplicatas" },
];

export default function LineSorter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<SortMode>("asc");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function apply() { setOutput(sortLines(input, mode)); }
  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const area: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 14, resize: "vertical" };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {MODES.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, background: mode === m.key ? "var(--accent)" : "var(--surface)", color: mode === m.key ? "#fff" : "var(--text)" }}>
            {m.label}
          </button>
        ))}
      </div>

      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>LINHAS PARA ORDENAR</label>
      <textarea rows={7} value={input} onChange={e => setInput(e.target.value)}
        placeholder={"maçã\nbanana\nabacaxi\nlaranja"} style={{ ...area, marginBottom: 12 }} />

      <button onClick={apply} disabled={!input.trim()}
        style={{ width: "100%", padding: "10px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: input.trim() ? "pointer" : "not-allowed", opacity: input.trim() ? 1 : 0.5, marginBottom: 16 }}>
        Ordenar
      </button>

      {output && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>RESULTADO</label>
            <button onClick={copy} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
          </div>
          <textarea rows={7} readOnly value={output} style={{ ...area, color: "var(--accent)" }} />
        </>
      )}
    </div>
  );
}
