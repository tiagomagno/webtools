"use client";

import { useState, useMemo } from "react";
import { brl } from "../../lib/format";

function parse(v: string) { const n = parseFloat(v.replace(",", ".")); return Number.isFinite(n) ? n : 0; }

const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 15, fontFamily: "monospace" };

export default function CompoundCalculator() {
  const [principal, setPrincipal] = useState("1000");
  const [monthly, setMonthly] = useState("100");
  const [rate, setRate] = useState("1");
  const [ratePeriod, setRatePeriod] = useState<"month" | "year">("month");
  const [months, setMonths] = useState("24");

  const result = useMemo(() => {
    const P = parse(principal);
    const PMT = parse(monthly);
    const n = Math.round(parse(months));
    const annual = ratePeriod === "year" ? parse(rate) / 100 : 0;
    const i = ratePeriod === "month" ? parse(rate) / 100 : Math.pow(1 + annual, 1 / 12) - 1;
    if (n <= 0) return null;

    let balance = P;
    let invested = P;
    const series: { month: number; balance: number; invested: number }[] = [];
    for (let m = 1; m <= n; m++) {
      balance = balance * (1 + i) + PMT;
      invested += PMT;
      if (m % Math.max(1, Math.ceil(n / 12)) === 0 || m === n) series.push({ month: m, balance, invested });
    }
    return { final: balance, invested, interest: balance - invested, series, monthlyRate: i };
  }, [principal, monthly, rate, ratePeriod, months]);

  const field = (label: string, value: string, setter: (v: string) => void, placeholder?: string) => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>{label}</label>
      <input inputMode="decimal" value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {field("VALOR INICIAL (R$)", principal, setPrincipal, "1000")}
        {field("APORTE MENSAL (R$)", monthly, setMonthly, "100")}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>TAXA DE JUROS (%)</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} style={{ ...inputStyle, width: "auto", flex: 1 }} />
            <select value={ratePeriod} onChange={(e) => setRatePeriod(e.target.value as "month" | "year")} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "0 10px", color: "var(--text)", fontSize: 13 }}>
              <option value="month">ao mês</option>
              <option value="year">ao ano</option>
            </select>
          </div>
        </div>
        {field("PERÍODO (meses)", months, setMonths, "24")}
      </div>

      {result ? (
        <>
          <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 22, textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Valor final</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{brl(result.final)}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{brl(result.invested)}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Total investido</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#10b981" }}>{brl(result.interest)}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Juros acumulados</div>
            </div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              <span>Mês</span><span style={{ textAlign: "right" }}>Investido</span><span style={{ textAlign: "right" }}>Acumulado</span>
            </div>
            {result.series.map((row) => (
              <div key={row.month} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "9px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, fontFamily: "monospace" }}>
                <span style={{ color: "var(--text-muted)" }}>{row.month}</span>
                <span style={{ textAlign: "right", color: "var(--text-muted)" }}>{brl(row.invested)}</span>
                <span style={{ textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{brl(row.balance)}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ fontSize: 14, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Informe um período válido em meses.</p>
      )}
    </div>
  );
}
