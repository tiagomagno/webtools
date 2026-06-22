"use client";

import { useState, useMemo } from "react";
import { brl } from "../../lib/format";

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPct, setTipPct] = useState(10);
  const [people, setPeople] = useState(2);

  const result = useMemo(() => {
    const b = parseFloat(bill.replace(",", "."));
    if (!b) return null;
    const tip = b * tipPct / 100;
    const total = b + tip;
    const perPerson = total / people;
    const tipPerPerson = tip / people;
    return { tip, total, perPerson, tipPerPerson };
  }, [bill, tipPct, people]);

  const inp: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 15 };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>VALOR DA CONTA (R$)</label>
          <input type="text" inputMode="decimal" value={bill} onChange={e => setBill(e.target.value)} placeholder="150,00" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>PESSOAS</label>
          <input type="number" min={1} max={50} value={people} onChange={e => setPeople(Math.max(1, Number(e.target.value)))} style={inp} />
        </div>
      </div>

      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>GORJETA</label>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {[0, 5, 10, 12, 15, 20].map(p => (
          <button key={p} onClick={() => setTipPct(p)}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, background: tipPct === p ? "var(--accent)" : "var(--surface)", color: tipPct === p ? "#fff" : "var(--text)" }}>
            {p}%
          </button>
        ))}
        <input type="number" min={0} max={100} value={tipPct} onChange={e => setTipPct(Number(e.target.value))}
          style={{ width: 60, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", color: "var(--text)", fontSize: 13 }} />
      </div>

      {result ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {[
            { label: "Gorjeta",           value: brl(result.tip), accent: false },
            { label: "Total com gorjeta", value: brl(result.total), accent: true },
            { label: "Por pessoa",        value: brl(result.perPerson), accent: true },
            { label: "Gorjeta/pessoa",    value: brl(result.tipPerPerson), accent: false },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{ background: accent ? "var(--accent)14" : "var(--surface)", border: `1px solid ${accent ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Informe o valor da conta para calcular.</p>
      )}
    </div>
  );
}
