"use client";

import { useState, useMemo } from "react";
import { UNITS, convert, UnitCategory } from "../../lib/units";

const CATEGORIES: { key: UnitCategory; label: string; emoji: string }[] = [
  { key: "comprimento", label: "Comprimento", emoji: "📏" },
  { key: "peso",        label: "Peso",        emoji: "⚖️" },
  { key: "volume",      label: "Volume",      emoji: "🥛" },
  { key: "area",        label: "Área",        emoji: "📐" },
  { key: "velocidade",  label: "Velocidade",  emoji: "💨" },
  { key: "temperatura", label: "Temperatura", emoji: "🌡️" },
];

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("comprimento");
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");

  const units = UNITS[category];
  const keys = Object.keys(units);

  const result = useMemo(() => {
    if (!value) return null;
    const num = parseFloat(value.replace(",", "."));
    if (isNaN(num)) return null;
    return convert(num, from, to, category);
  }, [value, from, to, category]);

  function switchCategory(cat: UnitCategory) {
    setCategory(cat);
    const newKeys = Object.keys(UNITS[cat]);
    setFrom(newKeys[0]);
    setTo(newKeys[1] ?? newKeys[0]);
    setValue("");
  }

  const sel: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14, width: "100%" };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => switchCategory(c.key)}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, background: category === c.key ? "var(--accent)" : "var(--surface)", color: category === c.key ? "#fff" : "var(--text)" }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>DE</label>
          <select value={from} onChange={e => setFrom(e.target.value)} style={sel}>
            {keys.map(k => <option key={k} value={k}>{units[k].label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>PARA</label>
          <select value={to} onChange={e => setTo(e.target.value)} style={sel}>
            {keys.map(k => <option key={k} value={k}>{units[k].label}</option>)}
          </select>
        </div>
      </div>

      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>VALOR</label>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="0"
        style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", color: "var(--text)", fontSize: 18, marginBottom: 16 }}
      />

      {result !== null && value && (
        <div style={{ background: "var(--accent)14", border: "1px solid var(--accent)", borderRadius: 12, padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 6 }}>
            {value} {units[from]?.label} =
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)" }}>
            {result.toLocaleString("pt-BR", { maximumFractionDigits: 8 })} {units[to]?.label}
          </div>
        </div>
      )}

      {value && result === null && (
        <p style={{ fontSize: 13, color: "#ef4444", textAlign: "center" }}>Valor inválido.</p>
      )}
    </div>
  );
}
