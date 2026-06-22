"use client";

import { useState, useMemo } from "react";
import { calcReajuste } from "../../lib/finance";
import { brl, pct } from "../../lib/format";

const INDEXES = [
  { key: "igpm", label: "IGP-M (ex: 5,5%)" },
  { key: "ipca", label: "IPCA (ex: 4,6%)" },
  { key: "inpc", label: "INPC (ex: 4,8%)" },
  { key: "custom", label: "Personalizado" },
];

export default function RentAdjustment() {
  const [rent, setRent] = useState("");
  const [indexType, setIndexType] = useState("igpm");
  const [customRate, setCustomRate] = useState("");
  const [months, setMonths] = useState(12);

  const rate = customRate ? parseFloat(customRate.replace(",", ".")) : (indexType === "igpm" ? 5.5 : indexType === "ipca" ? 4.6 : 4.8);

  const result = useMemo(() => {
    const r = parseFloat(rent.replace(",", "."));
    if (!r || isNaN(rate)) return null;
    return calcReajuste(r, rate, months);
  }, [rent, rate, months]);

  const inp: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14 };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>ALUGUEL ATUAL (R$)</label>
          <input type="text" inputMode="decimal" value={rent} onChange={e => setRent(e.target.value)} placeholder="1.500,00" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>PERÍODO (meses)</label>
          <input type="number" min={1} max={120} value={months} onChange={e => setMonths(Number(e.target.value))} style={inp} />
        </div>
      </div>

      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>ÍNDICE DE REAJUSTE</label>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {INDEXES.map(ix => (
          <button key={ix.key} onClick={() => setIndexType(ix.key)}
            style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, background: indexType === ix.key ? "var(--accent)" : "var(--surface)", color: indexType === ix.key ? "#fff" : "var(--text)" }}>
            {ix.label}
          </button>
        ))}
      </div>

      {indexType === "custom" && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>PERCENTUAL DE REAJUSTE (%)</label>
          <input type="text" inputMode="decimal" value={customRate} onChange={e => setCustomRate(e.target.value)} placeholder="5,5" style={{ ...inp, width: 140 }} />
        </div>
      )}

      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginTop: 4 }}>
          {[
            { label: "Reajuste aplicado", value: pct(rate), accent: false },
            { label: "Novo aluguel/mês", value: brl(result.newRent), accent: true },
            { label: "Aumento mensal", value: brl(result.diff), accent: false },
            { label: `Diferença em ${months} meses`, value: brl(result.totalDiff), accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{ background: accent ? "var(--accent)14" : "var(--surface)", border: `1px solid ${accent ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
