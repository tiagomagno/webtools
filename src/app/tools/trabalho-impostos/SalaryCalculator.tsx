"use client";

import { useState, useMemo } from "react";
import { calcSalary } from "../../lib/finance";
import { brl, pct } from "../../lib/format";

export default function SalaryCalculator() {
  const [gross, setGross] = useState("");
  const [dependents, setDependents] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState("");

  const result = useMemo(() => {
    const g = parseFloat(gross.replace(/\./g, "").replace(",", "."));
    const o = parseFloat(otherDeductions.replace(",", ".")) || 0;
    if (!g) return null;
    return calcSalary(g, dependents, o);
  }, [gross, dependents, otherDeductions]);

  const inp: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14 };

  const row = (label: string, value: string, negative = false, highlight = false) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 14, color: highlight ? "var(--text)" : "var(--text-muted)", fontWeight: highlight ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: highlight ? 700 : 500, color: highlight ? "var(--accent)" : negative ? "#ef4444" : "var(--text)" }}>
        {negative ? "−" : ""}{value}
      </span>
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>SALÁRIO BRUTO (R$)</label>
          <input type="text" inputMode="decimal" value={gross} onChange={e => setGross(e.target.value)} placeholder="5.000,00" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>DEPENDENTES</label>
          <input type="number" min={0} max={20} value={dependents} onChange={e => setDependents(Number(e.target.value))} style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>OUTRAS DEDUÇÕES (R$)</label>
          <input type="text" inputMode="decimal" value={otherDeductions} onChange={e => setOtherDeductions(e.target.value)} placeholder="0,00" style={inp} />
        </div>
      </div>

      {result ? (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 16px" }}>
          {row("Salário Bruto", brl(result.gross))}
          {row(`INSS (${pct(result.inss / result.gross * 100)})`, brl(result.inss), true)}
          {result.dependentDeduction > 0 && row(`Dedução dependentes (${dependents}×)`, brl(result.dependentDeduction), true)}
          {result.otherDeductions > 0 && row("Outras deduções", brl(result.otherDeductions), true)}
          {row("Base IRPF", brl(result.irpfBase))}
          {row("IRPF", brl(result.irpf), true)}
          <div style={{ paddingTop: 8 }}>
            {row("SALÁRIO LÍQUIDO", brl(result.net), false, true)}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Tabela INSS e IRPF 2026.</p>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Informe o salário bruto para calcular.</p>
      )}
    </div>
  );
}
