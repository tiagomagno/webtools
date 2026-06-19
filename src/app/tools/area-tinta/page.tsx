"use client";

import { useState, useCallback } from "react";

// ─── tipos ───────────────────────────────────────────────────────────────────

type Shape = "retangulo" | "circulo" | "triangulo" | "trapezio" | "losango";
type PaintType = "pva" | "acrilica" | "latex" | "textura";

interface Wall {
  id: number;
  label: string;
  width: string;
  height: string;
}

interface Deduction {
  id: number;
  label: string;
  width: string;
  height: string;
}

// ─── dados ───────────────────────────────────────────────────────────────────

const SHAPES: { value: Shape; label: string; fields: string[] }[] = [
  { value: "retangulo", label: "Retângulo / Quadrado", fields: ["Largura (m)", "Altura / Comprimento (m)"] },
  { value: "circulo",   label: "Círculo",              fields: ["Raio (m)"] },
  { value: "triangulo", label: "Triângulo",            fields: ["Base (m)", "Altura (m)"] },
  { value: "trapezio",  label: "Trapézio",             fields: ["Base maior (m)", "Base menor (m)", "Altura (m)"] },
  { value: "losango",   label: "Losango",              fields: ["Diagonal maior (m)", "Diagonal menor (m)"] },
];

const PAINT_TYPES: { value: PaintType; label: string; yield: number; note: string }[] = [
  { value: "pva",      label: "Tinta PVA",      yield: 11, note: "~11 m²/L por demão" },
  { value: "acrilica", label: "Tinta Acrílica", yield: 10, note: "~10 m²/L por demão" },
  { value: "latex",    label: "Tinta Látex",    yield: 9,  note: "~9 m²/L por demão"  },
  { value: "textura",  label: "Textura",        yield: 1.5, note: "~1,5 m²/L por demão" },
];

const CAN_SIZES = [0.9, 3.6, 18];

let nextId = 1;

// ─── helpers ─────────────────────────────────────────────────────────────────

function calcArea(shape: Shape, vals: number[]): number {
  switch (shape) {
    case "retangulo": return vals[0] * vals[1];
    case "circulo":   return Math.PI * vals[0] ** 2;
    case "triangulo": return (vals[0] * vals[1]) / 2;
    case "trapezio":  return ((vals[0] + vals[1]) / 2) * vals[2];
    case "losango":   return (vals[0] * vals[1]) / 2;
  }
}

function n(v: string) { return parseFloat(v) || 0; }

function bestCans(liters: number) {
  const results: { size: number; qty: number; total: number }[] = [];
  const sizes = [...CAN_SIZES].sort((a, b) => b - a);
  let remaining = liters;
  const qty: Record<number, number> = {};
  for (const s of sizes) {
    if (remaining <= 0) break;
    const count = Math.floor(remaining / s);
    if (count > 0) { qty[s] = count; remaining -= count * s; }
  }
  if (remaining > 0) {
    const smallest = sizes[sizes.length - 1];
    qty[smallest] = (qty[smallest] || 0) + 1;
  }
  for (const [size, count] of Object.entries(qty)) {
    results.push({ size: Number(size), qty: count, total: Number(size) * count });
  }
  return results.sort((a, b) => b.size - a.size);
}

// ─── componentes auxiliares ───────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px", marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 16, letterSpacing: "-0.01em" }}>{title}</div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 5 }}>{children}</div>;
}

function Input({ value, onChange, placeholder, unit }: { value: string; onChange: (v: string) => void; placeholder?: string; unit?: string }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? "0"}
        style={{
          width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 8, padding: unit ? "8px 36px 8px 10px" : "8px 10px",
          color: "var(--text)", fontSize: 13, outline: "none",
        }}
      />
      {unit && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-muted)" }}>{unit}</span>}
    </div>
  );
}

function ResultBox({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? "var(--accent)12" : "var(--surface-2)",
      border: `1px solid ${accent ? "var(--accent)40" : "var(--border)"}`,
      borderRadius: 10, padding: "14px 16px", textAlign: "center",
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)", letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── aba de área ──────────────────────────────────────────────────────────────

function TabArea() {
  const [shape, setShape] = useState<Shape>("retangulo");
  const [vals, setVals] = useState(["", "", ""]);

  const shapeInfo = SHAPES.find(s => s.value === shape)!;
  const numVals = shapeInfo.fields.map((_, i) => n(vals[i]));
  const valid = numVals.slice(0, shapeInfo.fields.length).every(v => v > 0);
  const area = valid ? calcArea(shape, numVals) : null;

  const setVal = (i: number, v: string) => setVals(prev => { const next = [...prev]; next[i] = v; return next; });

  return (
    <div>
      <Section title="Forma geométrica">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginBottom: 20 }}>
          {SHAPES.map(s => (
            <button
              key={s.value}
              onClick={() => { setShape(s.value); setVals(["", "", ""]); }}
              style={{
                padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: shape === s.value ? 600 : 400,
                border: "1px solid", cursor: "pointer", textAlign: "left",
                borderColor: shape === s.value ? "var(--accent)" : "var(--border)",
                background: shape === s.value ? "var(--accent)12" : "var(--surface-2)",
                color: shape === s.value ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${shapeInfo.fields.length}, 1fr)`, gap: 10 }}>
          {shapeInfo.fields.map((label, i) => (
            <div key={i}>
              <Label>{label}</Label>
              <Input value={vals[i]} onChange={v => setVal(i, v)} unit="m" />
            </div>
          ))}
        </div>
      </Section>

      {area !== null && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <ResultBox label="Área" value={`${area.toFixed(2)} m²`} accent />
          <ResultBox label="Em cm²" value={`${(area * 10000).toFixed(0)} cm²`} />
        </div>
      )}
    </div>
  );
}

// ─── aba de tinta ─────────────────────────────────────────────────────────────

function TabTinta() {
  const [walls, setWalls] = useState<Wall[]>([
    { id: nextId++, label: "Parede 1", width: "", height: "" },
    { id: nextId++, label: "Parede 2", width: "", height: "" },
  ]);
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: nextId++, label: "Porta", width: "0.9", height: "2.1" },
  ]);
  const [paintType, setPaintType] = useState<PaintType>("acrilica");
  const [coats, setCoats] = useState(2);
  const [waste, setWaste] = useState(10);

  const addWall = () => setWalls(prev => [...prev, { id: nextId++, label: `Parede ${prev.length + 1}`, width: "", height: "" }]);
  const removeWall = (id: number) => setWalls(prev => prev.filter(w => w.id !== id));
  const updateWall = (id: number, field: "width" | "height" | "label", value: string) =>
    setWalls(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));

  const addDeduction = () => setDeductions(prev => [...prev, { id: nextId++, label: "Janela", width: "1.2", height: "1.0" }]);
  const removeDeduction = (id: number) => setDeductions(prev => prev.filter(d => d.id !== id));
  const updateDeduction = (id: number, field: "width" | "height" | "label", value: string) =>
    setDeductions(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));

  const totalWalls = walls.reduce((sum, w) => sum + n(w.width) * n(w.height), 0);
  const totalDeductions = deductions.reduce((sum, d) => sum + n(d.width) * n(d.height), 0);
  const netArea = Math.max(0, totalWalls - totalDeductions);
  const paint = PAINT_TYPES.find(p => p.value === paintType)!;
  const litersBase = (netArea * coats) / paint.yield;
  const litersTotal = litersBase * (1 + waste / 100);
  const cans = litersTotal > 0 ? bestCans(litersTotal) : [];

  return (
    <div>
      {/* Paredes */}
      <Section title="Paredes / superfícies">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {walls.map(w => (
            <div key={w.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 32px", gap: 8, alignItems: "end" }}>
              <div>
                <Label>Nome</Label>
                <input
                  value={w.label}
                  onChange={e => updateWall(w.id, "label", e.target.value)}
                  style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, outline: "none" }}
                />
              </div>
              <div>
                <Label>Largura (m)</Label>
                <Input value={w.width} onChange={v => updateWall(w.id, "width", v)} />
              </div>
              <div>
                <Label>Altura (m)</Label>
                <Input value={w.height} onChange={v => updateWall(w.id, "height", v)} />
              </div>
              <button
                onClick={() => removeWall(w.id)}
                style={{ width: 32, height: 32, marginTop: 20, borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer", fontSize: 16 }}
              >×</button>
            </div>
          ))}
        </div>
        <button
          onClick={addWall}
          style={{ marginTop: 12, padding: "8px 14px", borderRadius: 8, border: "1px dashed var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 12, cursor: "pointer" }}
        >
          + Adicionar parede
        </button>
      </Section>

      {/* Descontos */}
      <Section title="Descontos (portas, janelas, etc.)">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {deductions.map(d => (
            <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 32px", gap: 8, alignItems: "end" }}>
              <div>
                <Label>Nome</Label>
                <input
                  value={d.label}
                  onChange={e => updateDeduction(d.id, "label", e.target.value)}
                  style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, outline: "none" }}
                />
              </div>
              <div>
                <Label>Largura (m)</Label>
                <Input value={d.width} onChange={v => updateDeduction(d.id, "width", v)} />
              </div>
              <div>
                <Label>Altura (m)</Label>
                <Input value={d.height} onChange={v => updateDeduction(d.id, "height", v)} />
              </div>
              <button
                onClick={() => removeDeduction(d.id)}
                style={{ width: 32, height: 32, marginTop: 20, borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer", fontSize: 16 }}
              >×</button>
            </div>
          ))}
        </div>
        <button
          onClick={addDeduction}
          style={{ marginTop: 12, padding: "8px 14px", borderRadius: 8, border: "1px dashed var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 12, cursor: "pointer" }}
        >
          + Adicionar desconto
        </button>
      </Section>

      {/* Configurações */}
      <Section title="Configurações">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <Label>Tipo de tinta</Label>
            <select
              value={paintType}
              onChange={e => setPaintType(e.target.value as PaintType)}
              style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, outline: "none" }}
            >
              {PAINT_TYPES.map(p => (
                <option key={p.value} value={p.value}>{p.label} — {p.note}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Número de demãos</Label>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3].map(c => (
                <button
                  key={c}
                  onClick={() => setCoats(c)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: coats === c ? 600 : 400,
                    border: "1px solid", cursor: "pointer",
                    borderColor: coats === c ? "var(--accent)" : "var(--border)",
                    background: coats === c ? "var(--accent)12" : "var(--surface-2)",
                    color: coats === c ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  {c}×
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Perda / desperdício (%)</Label>
            <Input value={String(waste)} onChange={v => setWaste(Number(v) || 0)} unit="%" />
          </div>
        </div>
      </Section>

      {/* Resultado */}
      {netArea > 0 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
            <ResultBox label="Área bruta" value={`${totalWalls.toFixed(2)} m²`} />
            <ResultBox label="Área líquida" value={`${netArea.toFixed(2)} m²`} />
            <ResultBox label="Tinta necessária" value={`${litersTotal.toFixed(1)} L`} accent />
          </div>

          {/* Latas */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12 }}>
              Sugestão de compra
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {cans.map(c => (
                <div
                  key={c.size}
                  style={{
                    background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10,
                    padding: "12px 16px", minWidth: 110, textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{c.qty}×</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{c.size} L</div>
                  <div style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 2 }}>{c.total.toFixed(1)} L total</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 12 }}>
              Rendimento: {paint.note} · {coats} demão{coats > 1 ? "s" : ""} · +{waste}% desperdício
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── página principal ─────────────────────────────────────────────────────────

export default function AreaTintaPage() {
  const [tab, setTab] = useState<"area" | "tinta">("area");

  return (
    <div style={{ padding: "32px 24px", maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>
          🪣 Área e Tinta
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Calcule áreas de formas geométricas e estime a quantidade de tinta para pintura de ambientes.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 4 }}>
        {(["area", "tinta"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 7, fontSize: 13, fontWeight: tab === t ? 600 : 400,
              border: "none", cursor: "pointer",
              background: tab === t ? "var(--surface-2)" : "transparent",
              color: tab === t ? "var(--text)" : "var(--text-muted)",
              transition: "all 0.1s",
            }}
          >
            {t === "area" ? "📐 Calcular Área" : "🪣 Calcular Tinta"}
          </button>
        ))}
      </div>

      {tab === "area" ? <TabArea /> : <TabTinta />}
    </div>
  );
}
