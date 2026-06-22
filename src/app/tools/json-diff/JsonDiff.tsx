"use client";

import { useState } from "react";
import { parseJson, diffJson, type JsonDiffEntry } from "../../lib/json-tools";

const COLORS: Record<JsonDiffEntry["kind"], string> = {
  added: "#22c55e",
  removed: "#ef4444",
  changed: "#eab308",
};
const LABELS: Record<JsonDiffEntry["kind"], string> = {
  added: "adicionado",
  removed: "removido",
  changed: "alterado",
};

export default function JsonDiff() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [entries, setEntries] = useState<JsonDiffEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compare = () => {
    const ra = parseJson(a);
    const rb = parseJson(b);
    if (!ra.ok) return setError("JSON da esquerda inválido: " + ra.error?.message);
    if (!rb.ok) return setError("JSON da direita inválido: " + rb.error?.message);
    setError(null);
    setEntries(diffJson(ra.value, rb.value));
  };

  const box: React.CSSProperties = { width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", color: "var(--text)", fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "monospace" };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 12 }}>
        <textarea value={a} onChange={(e) => setA(e.target.value)} rows={12} spellCheck={false} placeholder="JSON original (A)" aria-label="JSON A" style={box} />
        <textarea value={b} onChange={(e) => setB(e.target.value)} rows={12} spellCheck={false} placeholder="JSON modificado (B)" aria-label="JSON B" style={box} />
      </div>

      <button onClick={compare} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
        Comparar
      </button>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 13, fontFamily: "monospace" }}>
          ⚠ {error}
        </div>
      )}

      {!error && entries !== null && (
        entries.length === 0 ? (
          <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid #22c55e", borderRadius: 10, padding: "14px 18px", color: "#4ade80", fontSize: 14, fontWeight: 600 }}>
            ✓ Os dois JSON são idênticos
          </div>
        ) : (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            {entries.map((e, i) => (
              <div key={i} style={{ padding: "10px 16px", borderBottom: i < entries.length - 1 ? "1px solid var(--border)" : "none", fontFamily: "monospace", fontSize: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ color: COLORS[e.kind], fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>{LABELS[e.kind]}</span>
                  <span style={{ color: "var(--text)" }}>{e.path}</span>
                </div>
                {e.kind === "removed" && <div style={{ color: "#f87171" }}>− {JSON.stringify(e.before)}</div>}
                {e.kind === "added" && <div style={{ color: "#4ade80" }}>+ {JSON.stringify(e.after)}</div>}
                {e.kind === "changed" && (
                  <>
                    <div style={{ color: "#f87171" }}>− {JSON.stringify(e.before)}</div>
                    <div style={{ color: "#4ade80" }}>+ {JSON.stringify(e.after)}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
