"use client";

import { useState, useMemo } from "react";
import { num } from "../../lib/format";

export default function RuleOfThree() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [inverse, setInverse] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const av = parseFloat(a.replace(",", "."));
    const bv = parseFloat(b.replace(",", "."));
    const cv = parseFloat(c.replace(",", "."));
    if (!av || !bv || !cv) return null;
    return inverse ? (av * cv) / bv : (bv * cv) / av;
  }, [a, b, c, inverse]);

  function copy() { if (result !== null) { navigator.clipboard.writeText(result.toString()); setCopied(true); setTimeout(() => setCopied(false), 1500); } }

  const inp: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 16 };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ k: false, l: "Direta (A/B = C/X)" }, { k: true, l: "Inversa (A·X = B·C)" }].map(({ k, l }) => (
          <button key={l} onClick={() => setInverse(k)}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, background: inverse === k ? "var(--accent)" : "var(--surface)", color: inverse === k ? "#fff" : "var(--text)" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto 1fr", gap: 12, alignItems: "end", marginBottom: 16 }}>
        {[
          { label: "A", value: a, set: setA },
          { label: "B", value: b, set: setB },
          { label: "C", value: c, set: setC },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <label style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", display: "block", marginBottom: 6 }}>{label}</label>
            <input type="text" inputMode="decimal" value={value} onChange={e => set(e.target.value)} placeholder="0" style={inp} />
          </div>
        ))}
        <div style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: "var(--text-muted)", paddingBottom: 4 }}>→</div>
        <div>
          <label style={{ fontSize: 14, fontWeight: 700, color: "#22c55e", display: "block", marginBottom: 6 }}>X</label>
          <input readOnly value={result !== null ? num(result) : ""} placeholder="?" style={{ ...inp, color: "#22c55e", fontWeight: 700 }} />
        </div>
      </div>

      {result !== null && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 10, padding: "12px 16px" }}>
          <span style={{ fontSize: 16, color: "var(--text)" }}>
            Se {a} corresponde a {b}, então {c} corresponde a <strong style={{ color: "#22c55e" }}>{num(result)}</strong>
          </span>
          <button onClick={copy} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", cursor: "pointer" }}>{copied ? "✓" : "Copiar"}</button>
        </div>
      )}
    </div>
  );
}
