"use client";

import { useMemo, useState } from "react";
import { countLines } from "../../lib/text-transform";
import { num } from "../../lib/format";

export default function LineCounter() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => countLines(input), [input]);

  const card = (label: string, value: number, accent = false) => (
    <div style={{ background: accent ? "var(--accent)14" : "var(--surface)", border: `1px solid ${accent ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)" }}>{num(value, 0)}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  );

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>TEXTO DE ENTRADA</label>
      <textarea rows={8} value={input} onChange={e => setInput(e.target.value)}
        placeholder="Cole o texto aqui para contar as linhas..."
        style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 14, resize: "vertical", marginBottom: 16 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {card("Total de linhas", stats.total, true)}
        {card("Linhas não-vazias", stats.nonEmpty)}
        {card("Linhas vazias", stats.empty)}
        {card("Linhas únicas", stats.unique)}
      </div>
    </div>
  );
}
