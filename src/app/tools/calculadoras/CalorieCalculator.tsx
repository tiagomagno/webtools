"use client";

import { useState, useMemo } from "react";
import { num } from "../../lib/format";

const ACTIVITY = [
  { key: "sedentary",  label: "Sedentário (sem exercício)",       factor: 1.2 },
  { key: "light",     label: "Leve (1–3 dias/sem)",              factor: 1.375 },
  { key: "moderate",  label: "Moderado (3–5 dias/sem)",           factor: 1.55 },
  { key: "active",    label: "Ativo (6–7 dias/sem)",             factor: 1.725 },
  { key: "very",      label: "Muito ativo (2× por dia)",          factor: 1.9 },
];

const GOALS = [
  { key: "lose2",   label: "Perder 1 kg/sem",  delta: -1100 },
  { key: "lose1",   label: "Perder 0,5 kg/sem", delta: -550 },
  { key: "maintain",label: "Manter peso",        delta: 0 },
  { key: "gain1",   label: "Ganhar 0,5 kg/sem", delta: 550 },
  { key: "gain2",   label: "Ganhar 1 kg/sem",   delta: 1100 },
];

export default function CalorieCalculator() {
  const [sex, setSex] = useState<"m" | "f">("m");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");

  const result = useMemo(() => {
    const a = parseInt(age), w = parseFloat(weight.replace(",", ".")), h = parseInt(height);
    if (!a || !w || !h) return null;
    const bmr = sex === "m"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    const factor = ACTIVITY.find(x => x.key === activity)?.factor ?? 1.55;
    const tdee = bmr * factor;
    const delta = GOALS.find(x => x.key === goal)?.delta ?? 0;
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(tdee + delta) };
  }, [sex, age, weight, height, activity, goal]);

  const inp: React.CSSProperties = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14 };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>SEXO</label>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ k: "m", l: "Masc." }, { k: "f", l: "Fem." }].map(({ k, l }) => (
              <button key={k} onClick={() => setSex(k as "m"|"f")}
                style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, background: sex === k ? "var(--accent)" : "var(--surface)", color: sex === k ? "#fff" : "var(--text)" }}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>IDADE (anos)</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="30" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>PESO (kg)</label>
          <input type="text" inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>ALTURA (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" style={inp} />
        </div>
      </div>

      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>NÍVEL DE ATIVIDADE</label>
      <select value={activity} onChange={e => setActivity(e.target.value)} style={{ ...inp, marginBottom: 12 }}>
        {ACTIVITY.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
      </select>

      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>OBJETIVO</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {GOALS.map(g => (
          <button key={g.key} onClick={() => setGoal(g.key)}
            style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, background: goal === g.key ? "var(--accent)" : "var(--surface)", color: goal === g.key ? "#fff" : "var(--text)" }}>
            {g.label}
          </button>
        ))}
      </div>

      {result ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {[
            { label: "TMB (repouso)", value: `${num(result.bmr, 0)} kcal` },
            { label: "TDEE (manutenção)", value: `${num(result.tdee, 0)} kcal`, accent: true },
            { label: "Meta diária", value: `${num(result.target, 0)} kcal`, accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{ background: accent ? "var(--accent)14" : "var(--surface)", border: `1px solid ${accent ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--text-subtle)", textAlign: "center", padding: 20 }}>Preencha os dados para calcular.</p>
      )}
    </div>
  );
}
