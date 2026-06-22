"use client";

import { useState, useMemo } from "react";
import { calcInvestment } from "../../lib/finance";
import { brl, pct } from "../../lib/format";

export default function InvestmentCalculator() {
  const [principal, setPrincipal] = useState("");
  const [months, setMonths] = useState("12");
  const [cdi, setCdi] = useState("10.65");
  const [cdbRate, setCdbRate] = useState("110");
  const [lciRate, setLciRate] = useState("95");

  const result = useMemo(() => {
    const p = parseFloat(principal.replace(",", "."));
    const m = parseInt(months);
    const c = parseFloat(cdi.replace(",", "."));
    const cdb = parseFloat(cdbRate.replace(",", "."));
    const lci = parseFloat(lciRate.replace(",", "."));
    if (!p || !m || !c) return null;
    return calcInvestment(p, m, c, { cdb, lci, poupanca: 70 });
  }, [principal, months, cdi, cdbRate, lciRate]);

  const irNote = months <= 6 ? "22,5% IR" : parseInt(months) <= 12 ? "20% IR" : parseInt(months) <= 24 ? "17,5% IR" : "15% IR";
  const irNoteM = parseInt(months);

  const inp: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14 };

  const best = result ? Object.entries(result).sort((a, b) => b[1].net - a[1].net)[0][0] : null;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "VALOR INICIAL (R$)", value: principal, set: setPrincipal, placeholder: "10.000" },
          { label: "PRAZO (meses)", value: months, set: setMonths, placeholder: "12" },
          { label: "CDI ANUAL (%)", value: cdi, set: setCdi, placeholder: "10,65" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>{label}</label>
            <input type="text" inputMode="decimal" value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={inp} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>CDB (% do CDI)</label>
          <input type="text" inputMode="decimal" value={cdbRate} onChange={e => setCdbRate(e.target.value)} placeholder="110" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>LCI/LCA (% do CDI — isento IR)</label>
          <input type="text" inputMode="decimal" value={lciRate} onChange={e => setLciRate(e.target.value)} placeholder="95" style={inp} />
        </div>
      </div>

      {result && (
        <>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
            CDB com {irNoteM <= 6 ? "22,5%" : irNoteM <= 12 ? "20%" : irNoteM <= 24 ? "17,5%" : "15%"} de IR (prazo {months} meses). LCI/LCA e Poupança isentos.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { key: "cdb", label: "CDB", rate: `${cdbRate}% CDI`, taxed: true },
              { key: "lci", label: "LCI / LCA", rate: `${lciRate}% CDI`, taxed: false },
              { key: "poupanca", label: "Poupança", rate: "70% CDI", taxed: false },
            ].map(({ key, label, rate, taxed }) => {
              const r = result[key as keyof typeof result];
              const isBest = key === best;
              return (
                <div key={key} style={{ background: isBest ? "var(--accent)14" : "var(--surface)", border: `1px solid ${isBest ? "var(--accent)" : "var(--border)"}`, borderRadius: 12, padding: "14px 16px", position: "relative" }}>
                  {isBest && <span style={{ position: "absolute", top: 10, right: 10, fontSize: 10, background: "var(--accent)", color: "#fff", borderRadius: 4, padding: "2px 6px" }}>Melhor</span>}
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>{rate}{taxed ? " · com IR" : " · isento IR"}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Rendimento bruto</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{brl(r.gross)}</div>
                  {r.tax > 0 && <><div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>IR</div><div style={{ fontSize: 13, color: "#ef4444" }}>−{brl(r.tax)}</div></>}
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Rendimento líquido</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: isBest ? "var(--accent)" : "var(--text)" }}>{brl(r.net)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Total final</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{brl(r.final)}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!result && (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Preencha os dados para comparar.</p>
      )}
    </div>
  );
}
