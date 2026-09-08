"use client";

import { useState } from "react";
import { num } from "../../lib/format";

type Mode = "of" | "isWhat" | "change";

const MODES: { id: Mode; label: string }[] = [
  { id: "of", label: "X% de Y" },
  { id: "isWhat", label: "X é quanto % de Y" },
  { id: "change", label: "Variação de X para Y" },
];

const inputStyle: React.CSSProperties = { width: 120, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", color: "var(--text)", fontSize: 15, fontFamily: "monospace" };

function parse(v: string) { const n = parseFloat(v.replace(",", ".")); return Number.isFinite(n) ? n : null; }

export default function PercentCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const na = parse(a);
  const nb = parse(b);
  let result: string | null = null;
  let explanation = "";

  if (na !== null && nb !== null) {
    if (mode === "of") {
      result = num((na / 100) * nb);
      explanation = `${num(na)}% de ${num(nb)} é igual a`;
    } else if (mode === "isWhat") {
      if (nb !== 0) { result = num((na / nb) * 100) + "%"; explanation = `${num(na)} é, de ${num(nb)},`; }
    } else {
      if (na !== 0) {
        const change = ((nb - na) / Math.abs(na)) * 100;
        result = (change >= 0 ? "+" : "") + num(change) + "%";
        explanation = `De ${num(na)} para ${num(nb)}, a variação é de`;
      }
    }
  }

  const labels: Record<Mode, [string, string]> = {
    of: ["Porcentagem (X)", "Valor (Y)"],
    isWhat: ["Valor (X)", "Total (Y)"],
    change: ["Valor inicial (X)", "Valor final (Y)"],
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {MODES.map((m) => (
          <button key={m.id} onClick={() => { setMode(m.id); }} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: mode === m.id ? "var(--accent)" : "var(--border)", background: mode === m.id ? "var(--accent)" : "var(--surface-2)", color: mode === m.id ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>{labels[mode][0]}</label>
          <input inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>{labels[mode][1]}</label>
          <input inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} style={inputStyle} />
        </div>
      </div>

      {result !== null ? (
        <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 22, textAlign: "center", marginTop: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>{explanation}</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{result}</div>
        </div>
      ) : (
        <p style={{ fontSize: 14, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Preencha os dois valores para calcular.</p>
      )}
    </div>
  );
}
