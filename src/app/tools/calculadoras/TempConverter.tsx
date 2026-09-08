"use client";

import { useState } from "react";
import { num } from "../../lib/format";

type Unit = "c" | "f" | "k";

function toCelsius(v: number, from: Unit): number {
  if (from === "c") return v;
  if (from === "f") return (v - 32) * (5 / 9);
  return v - 273.15;
}
function fromCelsius(c: number, to: Unit): number {
  if (to === "c") return c;
  if (to === "f") return c * (9 / 5) + 32;
  return c + 273.15;
}

const UNITS: { id: Unit; label: string; symbol: string }[] = [
  { id: "c", label: "Celsius", symbol: "°C" },
  { id: "f", label: "Fahrenheit", symbol: "°F" },
  { id: "k", label: "Kelvin", symbol: "K" },
];

export default function TempConverter() {
  const [value, setValue] = useState("25");
  const [from, setFrom] = useState<Unit>("c");

  const n = parseFloat(value.replace(",", "."));
  const valid = Number.isFinite(n);
  const celsius = valid ? toCelsius(n, from) : NaN;

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>VALOR</label>
          <input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 16, fontFamily: "monospace" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>DE</label>
          <div style={{ display: "flex", gap: 6 }}>
            {UNITS.map((u) => (
              <button key={u.id} onClick={() => setFrom(u.id)} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid", borderColor: from === u.id ? "var(--accent)" : "var(--border)", background: from === u.id ? "var(--accent)" : "var(--surface-2)", color: from === u.id ? "#fff" : "var(--text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                {u.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {valid ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {UNITS.map((u) => (
            <div key={u.id} style={{ background: u.id === from ? "var(--accent)14" : "var(--surface)", border: `1px solid ${u.id === from ? "var(--accent)" : "var(--border)"}`, borderRadius: 12, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{num(fromCelsius(celsius, u.id), 2)}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{u.symbol} · {u.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 14, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Informe um valor numérico.</p>
      )}
    </div>
  );
}
