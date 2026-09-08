"use client";

import { useState } from "react";

function parseDuration(s: string): number | null {
  const m = s.match(/^(\d+):([0-5]\d)$/);
  if (!m) return null;
  return parseInt(m[1]) * 60 + parseInt(m[2]);
}

function fmtDuration(mins: number): string {
  const sign = mins < 0 ? "-" : "";
  const abs = Math.abs(mins);
  return `${sign}${Math.floor(abs / 60)}h ${abs % 60}min`;
}

export default function HoursCalculator() {
  const [entries, setEntries] = useState(["", "", "", ""]);
  const [mode, setMode] = useState<"sum" | "diff">("sum");
  const [copied, setCopied] = useState(false);

  function update(i: number, v: string) {
    setEntries(prev => prev.map((e, idx) => idx === i ? v : e));
  }

  const parsed = entries.map(parseDuration);
  const valid = parsed.filter((v): v is number => v !== null);

  const totalMins = mode === "sum"
    ? valid.reduce((a, b) => a + b, 0)
    : valid.length >= 2 ? (parsed[0] ?? 0) - valid.slice(1).reduce((a, b) => a + b, 0) : null;

  const result = totalMins !== null ? fmtDuration(totalMins) : null;

  function copy() { if (result) { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); } }

  const inputStyle: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 16, fontFamily: "monospace", width: "100%" };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ k: "sum", l: "Somar horas" }, { k: "diff", l: "Subtrair horas" }].map(({ k, l }) => (
          <button key={k} onClick={() => setMode(k as "sum" | "diff")}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, background: mode === k ? "var(--accent)" : "var(--surface)", color: mode === k ? "#fff" : "var(--text)" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {entries.map((e, i) => (
          <div key={i}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
              {mode === "diff" && i === 0 ? "HORA INICIAL" : mode === "diff" && i > 0 ? `SUBTRAIR ${i}` : `DURAÇÃO ${i + 1}`}
            </label>
            <input
              value={e}
              onChange={ev => update(i, ev.target.value)}
              placeholder="HH:MM (ex: 1:30)"
              style={{ ...inputStyle, borderColor: e && parseDuration(e) === null ? "#ef4444" : "var(--border)" }}
            />
          </div>
        ))}
      </div>

      {result && (
        <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{mode === "sum" ? "TOTAL" : "RESULTADO"}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{result}</div>
            {totalMins !== null && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{Math.abs(totalMins)} minutos no total</div>}
          </div>
          <button onClick={copy} style={{ padding: "8px 16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>{copied ? "✓ Copiado" : "Copiar"}</button>
        </div>
      )}
    </div>
  );
}
