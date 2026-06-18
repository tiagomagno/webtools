"use client";

import { useState } from "react";
import Link from "next/link";

interface Stop {
  id: number;
  color: string;
  position: number;
}

let nextId = 3;

export default function GradientsPage() {
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [stops, setStops] = useState<Stop[]>([
    { id: 1, color: "#6366f1", position: 0 },
    { id: 2, color: "#ec4899", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  const gradientCss =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
      : `radial-gradient(circle, ${sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;

  const fullCss = `background: ${gradientCss};`;

  const copy = () => {
    navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const updateStop = (id: number, field: keyof Stop, value: string | number) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addStop = () => {
    const mid = Math.round(
      sortedStops.length > 1
        ? (sortedStops[0].position + sortedStops[sortedStops.length - 1].position) / 2
        : 50
    );
    setStops((prev) => [...prev, { id: nextId++, color: "#ffffff", position: mid }]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>
          ← Ferramentas
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🌈 Gerador de Gradientes
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Crie gradientes CSS com controle visual e copie o código pronto.
        </p>
      </div>

      {/* Preview */}
      <div
        style={{
          height: 200,
          borderRadius: 16,
          background: gradientCss,
          border: "1px solid var(--border)",
          marginBottom: 24,
          transition: "background 0.2s",
        }}
      />

      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Type + Angle */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>Tipo</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["linear", "radial"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: type === t ? "var(--accent)" : "var(--border)",
                    background: type === t ? "var(--accent)" : "var(--surface-2)",
                    color: type === t ? "#fff" : "var(--text-muted)",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {type === "linear" && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>
                Ângulo — {angle}°
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>

        {/* Stops */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>COLOR STOPS</span>
            <button
              onClick={addStop}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 12,
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              + Adicionar stop
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sortedStops.map((stop) => (
              <div key={stop.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "none",
                    cursor: "pointer",
                    padding: 2,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-muted)", minWidth: 70 }}>
                  {stop.color}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-muted)", minWidth: 36 }}>
                  {stop.position}%
                </span>
                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  style={{
                    background: "none",
                    border: "none",
                    color: stops.length <= 2 ? "var(--text-subtle)" : "var(--text-muted)",
                    cursor: stops.length <= 2 ? "not-allowed" : "pointer",
                    fontSize: 16,
                    lineHeight: 1,
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Output */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>CSS</span>
            <button
              onClick={copy}
              style={{
                background: copied ? "#10b981" : "var(--accent)",
                border: "none",
                borderRadius: 8,
                padding: "7px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {copied ? "✓ Copiado!" : "Copiar CSS"}
            </button>
          </div>
          <code
            style={{
              display: "block",
              background: "var(--surface-2)",
              borderRadius: 8,
              padding: "12px 16px",
              fontSize: 13,
              fontFamily: "monospace",
              color: "var(--text)",
              wordBreak: "break-all",
              lineHeight: 1.6,
            }}
          >
            {fullCss}
          </code>
        </div>
      </div>
    </div>
  );
}
