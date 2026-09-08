"use client";

import { useState, useMemo } from "react";
import { num } from "../../lib/format";

const CATEGORIES = [
  { max: 18.5, label: "Abaixo do peso", color: "#0ea5e9" },
  { max: 25, label: "Peso normal", color: "#22c55e" },
  { max: 30, label: "Sobrepeso", color: "#f59e0b" },
  { max: 35, label: "Obesidade grau I", color: "#f97316" },
  { max: 40, label: "Obesidade grau II", color: "#ef4444" },
  { max: Infinity, label: "Obesidade grau III", color: "#dc2626" },
];

function classify(bmi: number) {
  return CATEGORIES.find((c) => bmi < c.max) ?? CATEGORIES[CATEGORIES.length - 1];
}

export default function BmiCalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const result = useMemo(() => {
    const w = parseFloat(weight.replace(",", "."));
    const hCm = parseFloat(height.replace(",", "."));
    if (!w || !hCm || w <= 0 || hCm <= 0) return null;
    const h = hCm / 100;
    const bmi = w / (h * h);
    if (!Number.isFinite(bmi)) return null;
    const cat = classify(bmi);
    const idealMin = 18.5 * h * h;
    const idealMax = 24.9 * h * h;
    return { bmi, cat, idealMin, idealMax };
  }, [weight, height]);

  const inputStyle: React.CSSProperties = { width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" };

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>PESO (kg)</label>
          <input inputMode="decimal" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>ALTURA (cm)</label>
          <input inputMode="decimal" placeholder="175" value={height} onChange={(e) => setHeight(e.target.value)} style={inputStyle} />
        </div>
      </div>

      {result ? (
        <>
          <div style={{ background: `${result.cat.color}1a`, border: `1px solid ${result.cat.color}`, borderRadius: 12, padding: 22, textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Seu IMC</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{num(result.bmi, 1)}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: result.cat.color, marginTop: 4 }}>{result.cat.label}</div>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", fontSize: 14, color: "var(--text-muted)", textAlign: "center" }}>
            Peso ideal para sua altura: <strong style={{ color: "var(--text)" }}>{num(result.idealMin, 1)} – {num(result.idealMax, 1)} kg</strong>
          </div>
        </>
      ) : (
        <p style={{ fontSize: 14, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Informe peso e altura para calcular o IMC.</p>
      )}

      <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 16, lineHeight: 1.6 }}>
        O IMC é um indicador geral e não substitui avaliação médica. Ele não distingue massa muscular de gordura.
      </p>
    </div>
  );
}
