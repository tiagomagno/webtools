"use client";

import { useState, useMemo } from "react";
import { num, brl } from "../../lib/format";

export default function FuelCalculator() {
  const [distance, setDistance] = useState("");
  const [consumption, setConsumption] = useState("");
  const [price, setPrice] = useState("");

  const result = useMemo(() => {
    const d = parseFloat(distance.replace(",", "."));
    const c = parseFloat(consumption.replace(",", "."));
    const p = parseFloat(price.replace(",", "."));
    if (!d || !c || !p || c === 0) return null;
    const liters = d / c;
    const total = liters * p;
    const costPerKm = total / d;
    return { liters, total, costPerKm };
  }, [distance, consumption, price]);

  const inp: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 15 };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "DISTÂNCIA (km)", value: distance, set: setDistance, placeholder: "300" },
          { label: "CONSUMO (km/l)", value: consumption, set: setConsumption, placeholder: "12" },
          { label: "PREÇO DO LITRO (R$)", value: price, set: setPrice, placeholder: "5,89" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>{label}</label>
            <input type="text" inputMode="decimal" value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={inp} />
          </div>
        ))}
      </div>

      {result ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {[
            { label: "Litros necessários", value: `${num(result.liters)} L`, accent: true },
            { label: "Custo total", value: brl(result.total), accent: true },
            { label: "Custo por km", value: brl(result.costPerKm) },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{ background: accent ? "var(--accent)14" : "var(--surface)", border: `1px solid ${accent ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Preencha distância, consumo e preço para calcular.</p>
      )}
    </div>
  );
}
