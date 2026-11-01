"use client";

import { useState, useMemo } from "react";
import { calcRescisao } from "../../lib/finance";
import { brl } from "../../lib/format";

const TYPES = [
  { key: "sem-justa-causa", label: "Demissão sem justa causa" },
  { key: "pedido-demissao", label: "Pedido de demissão" },
  { key: "justa-causa",     label: "Demissão por justa causa" },
] as const;

export default function RescisaoCalculator() {
  const [salary, setSalary] = useState("");
  const [daysWorked, setDaysWorked] = useState("");
  const [monthsWorked, setMonthsWorked] = useState("");
  const [type, setType] = useState<"sem-justa-causa" | "pedido-demissao" | "justa-causa">("sem-justa-causa");
  const [hasNotice, setHasNotice] = useState(true);
  const [vacationBalance, setVacationBalance] = useState(false);
  const [fgtsBalance, setFgtsBalance] = useState("");

  const result = useMemo(() => {
    const s = parseFloat(salary.replace(",", "."));
    const d = parseInt(daysWorked) || 0;
    const m = parseInt(monthsWorked) || 0;
    const fgts = parseFloat(fgtsBalance.replace(",", ".")) || 0;
    if (!s) return null;
    return calcRescisao(s, d, m, hasNotice, vacationBalance, fgts, type);
  }, [salary, daysWorked, monthsWorked, type, hasNotice, vacationBalance, fgtsBalance]);

  const inp: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14 };

  const row = (label: string, value: number) => value === 0 ? null : (
    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: 14, color: "var(--text)" }}>{brl(value)}</span>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {TYPES.map(t => (
          <button key={t.key} onClick={() => setType(t.key)}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, background: type === t.key ? "var(--accent)" : "var(--surface)", color: type === t.key ? "#fff" : "var(--text)" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        {[
          { label: "ÚLTIMO SALÁRIO (R$)", value: salary, set: setSalary, placeholder: "3.000,00" },
          { label: "DIAS TRABALHADOS NO MÊS", value: daysWorked, set: setDaysWorked, placeholder: "15" },
          { label: "MESES NO ANO ATUAL", value: monthsWorked, set: setMonthsWorked, placeholder: "6" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>{label}</label>
            <input type="text" inputMode="decimal" value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={inp} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        {type === "sem-justa-causa" && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>SALDO FGTS (R$)</label>
            <input type="text" inputMode="decimal" value={fgtsBalance} onChange={e => setFgtsBalance(e.target.value)} placeholder="10.000" style={inp} />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 20 }}>
          <input type="checkbox" id="notice" checked={hasNotice} onChange={e => setHasNotice(e.target.checked)} />
          <label htmlFor="notice" style={{ fontSize: 13, color: "var(--text)", cursor: "pointer" }}>Aviso prévio indenizado</label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 20 }}>
          <input type="checkbox" id="vacation" checked={vacationBalance} onChange={e => setVacationBalance(e.target.checked)} />
          <label htmlFor="vacation" style={{ fontSize: 13, color: "var(--text)", cursor: "pointer" }}>Férias vencidas não pagas</label>
        </div>
      </div>

      {result ? (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 16px" }}>
          {row("Saldo de salário", result.saldoSalario)}
          {row("Aviso prévio indenizado", result.aviso)}
          {row("Férias proporcionais", result.feriasProporcional)}
          {row("Férias vencidas", result.feriasVencidas)}
          {row("1/3 de férias", result.terco)}
          {row("13° salário proporcional", result.decimoTerceiro)}
          {row("FGTS a receber", result.fgts)}
          {row("Multa FGTS (40%)", result.multaFgts)}
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>TOTAL ESTIMADO</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>{brl(result.total)}</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Estimativa. Consulte um advogado trabalhista para cálculo definitivo.</p>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Informe o salário para calcular.</p>
      )}
    </div>
  );
}
