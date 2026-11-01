"use client";

import { useState, useMemo } from "react";
import { calcSac, calcPrice } from "../../lib/finance";
import { brl, num } from "../../lib/format";

export default function LoanSimulator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [system, setSystem] = useState<"SAC" | "PRICE">("PRICE");
  const [showTable, setShowTable] = useState(false);

  const rows = useMemo(() => {
    const p = parseFloat(principal.replace(/\./g, "").replace(",", "."));
    const r = parseFloat(rate.replace(",", "."));
    const m = parseInt(months);
    if (!p || !r || !m || m > 480) return null;
    return system === "SAC" ? calcSac(p, r, m) : calcPrice(p, r, m);
  }, [principal, rate, months, system]);

  const summary = rows ? {
    first: rows[0].payment,
    last: rows[rows.length - 1].payment,
    totalPaid: rows.reduce((s, r) => s + r.payment, 0),
    totalInterest: rows.reduce((s, r) => s + r.interest, 0),
  } : null;

  const inp: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14 };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["PRICE", "SAC"] as const).map(s => (
          <button key={s} onClick={() => setSystem(s)}
            style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 14, fontWeight: 600, background: system === s ? "var(--accent)" : "var(--surface)", color: system === s ? "#fff" : "var(--text)" }}>
            {s} {s === "PRICE" ? "— parcelas fixas" : "— parcelas decrescentes"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "VALOR FINANCIADO (R$)", value: principal, set: setPrincipal, placeholder: "200.000" },
          { label: "TAXA ANUAL (%)", value: rate, set: setRate, placeholder: "12" },
          { label: "PRAZO (meses)", value: months, set: setMonths, placeholder: "360" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>{label}</label>
            <input type="text" inputMode="decimal" value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={inp} />
          </div>
        ))}
      </div>

      {summary && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
            {[
              { label: system === "PRICE" ? "Parcela fixa" : "1ª parcela", value: brl(summary.first), accent: true },
              { label: system === "SAC" ? "Última parcela" : "", value: system === "SAC" ? brl(summary.last) : "", accent: false, skip: system !== "SAC" },
              { label: "Total pago", value: brl(summary.totalPaid), accent: true },
              { label: "Total de juros", value: brl(summary.totalInterest), accent: false },
            ].filter(x => !x.skip).map(({ label, value, accent }) => (
              <div key={label} style={{ background: accent ? "var(--accent)14" : "var(--surface)", border: `1px solid ${accent ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)" }}>{value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <button onClick={() => setShowTable(v => !v)}
            style={{ width: "100%", padding: "8px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "var(--text)", marginBottom: showTable ? 12 : 0 }}>
            {showTable ? "Ocultar" : "Ver"} tabela de amortização ({rows!.length} meses)
          </button>

          {showTable && (
            <div style={{ maxHeight: 360, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead style={{ position: "sticky", top: 0, background: "var(--surface-2)" }}>
                  <tr>
                    {["Mês", "Parcela", "Amortização", "Juros", "Saldo"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows!.map(r => (
                    <tr key={r.month} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: "var(--text-muted)" }}>{r.month}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: "var(--accent)", fontWeight: 600 }}>{brl(r.payment)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right" }}>{brl(r.amortization)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: "#ef4444" }}>{brl(r.interest)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right" }}>{brl(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!rows && (principal || rate || months) && (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Verifique os valores informados. Prazo máximo: 480 meses.</p>
      )}
    </div>
  );
}
