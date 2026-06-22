"use client";

import { useState, useMemo } from "react";
import { num } from "../../lib/format";

const PRESETS = [
  { key: "balanced",  label: "Equilibrado",  protein: 30, carbs: 40, fat: 30 },
  { key: "low-carb",  label: "Low Carb",     protein: 35, carbs: 25, fat: 40 },
  { key: "keto",      label: "Cetogênico",   protein: 25, carbs: 5,  fat: 70 },
  { key: "bulk",      label: "Ganho massa",  protein: 35, carbs: 45, fat: 20 },
  { key: "cut",       label: "Definição",    protein: 40, carbs: 30, fat: 30 },
];

export default function MacroCalculator() {
  const [calories, setCalories] = useState("");
  const [preset, setPreset] = useState("balanced");
  const [protein, setProtein] = useState(30);
  const [carbs, setCarbs] = useState(40);
  const [fat, setFat] = useState(30);

  function applyPreset(p: typeof PRESETS[0]) {
    setPreset(p.key);
    setProtein(p.protein);
    setCarbs(p.carbs);
    setFat(p.fat);
  }

  const total = protein + carbs + fat;

  const result = useMemo(() => {
    const kcal = parseFloat(calories.replace(",", "."));
    if (!kcal || total !== 100) return null;
    const p = (kcal * protein / 100) / 4;
    const c = (kcal * carbs / 100) / 4;
    const f = (kcal * fat / 100) / 9;
    return { protein: p, carbs: c, fat: f };
  }, [calories, protein, carbs, fat, total]);

  const bar = (pct: number, color: string) => (
    <div style={{ height: 8, borderRadius: 4, background: color, width: `${pct}%`, transition: "width .3s" }} />
  );

  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>META DE CALORIAS (kcal/dia)</label>
      <input type="text" inputMode="decimal" value={calories} onChange={e => setCalories(e.target.value)} placeholder="2000"
        style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 16, marginBottom: 16 }} />

      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>DISTRIBUIÇÃO</label>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {PRESETS.map(p => (
          <button key={p.key} onClick={() => applyPreset(p)}
            style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, background: preset === p.key ? "var(--accent)" : "var(--surface)", color: preset === p.key ? "#fff" : "var(--text)" }}>
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 8 }}>
        {[
          { label: "Proteína (%)", value: protein, set: setProtein, color: "#3b82f6" },
          { label: "Carboidrato (%)", value: carbs, set: setCarbs, color: "#f59e0b" },
          { label: "Gordura (%)", value: fat, set: setFat, color: "#ef4444" },
        ].map(({ label, value, set, color }) => (
          <div key={label}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>{label}</label>
            <input type="number" min={0} max={100} value={value} onChange={e => set(Number(e.target.value))}
              style={{ width: "100%", background: "var(--surface)", border: `1px solid ${color}`, borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 14 }} />
          </div>
        ))}
      </div>

      {total !== 100 && <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>⚠ A soma dos percentuais deve ser 100% (atual: {total}%)</p>}

      <div style={{ height: 12, borderRadius: 6, display: "flex", overflow: "hidden", marginBottom: 16 }}>
        {bar(protein, "#3b82f6")}
        {bar(carbs, "#f59e0b")}
        {bar(fat, "#ef4444")}
      </div>

      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Proteína", value: `${num(result.protein, 0)}g`, sub: `${protein}% · 4 kcal/g`, color: "#3b82f6" },
            { label: "Carboidrato", value: `${num(result.carbs, 0)}g`, sub: `${carbs}% · 4 kcal/g`, color: "#f59e0b" },
            { label: "Gordura", value: `${num(result.fat, 0)}g`, sub: `${fat}% · 9 kcal/g`, color: "#ef4444" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} style={{ background: "var(--surface)", border: `1px solid ${color}30`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
              <div style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
