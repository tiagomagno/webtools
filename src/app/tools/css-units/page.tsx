"use client";

import { useState } from "react";
import Link from "next/link";

const BASE_FONT_SIZE = 16;
const VIEWPORT_WIDTH = 1440;
const VIEWPORT_HEIGHT = 900;

type Unit = "px" | "rem" | "em" | "vw" | "vh" | "%";

function convert(value: number, from: Unit, baseFontSize: number, parentSize: number): Record<Unit, string> {
  let px = 0;
  switch (from) {
    case "px":  px = value; break;
    case "rem": px = value * baseFontSize; break;
    case "em":  px = value * parentSize; break;
    case "vw":  px = (value / 100) * VIEWPORT_WIDTH; break;
    case "vh":  px = (value / 100) * VIEWPORT_HEIGHT; break;
    case "%":   px = (value / 100) * parentSize; break;
  }

  const fmt = (n: number) => parseFloat(n.toFixed(4)).toString();

  return {
    px:  fmt(px),
    rem: fmt(px / baseFontSize),
    em:  fmt(px / parentSize),
    vw:  fmt((px / VIEWPORT_WIDTH) * 100),
    vh:  fmt((px / VIEWPORT_HEIGHT) * 100),
    "%": fmt((px / parentSize) * 100),
  };
}

const UNIT_LABELS: Record<Unit, string> = {
  px: "px — pixels",
  rem: "rem — relativo ao root",
  em: "em — relativo ao pai",
  vw: "vw — largura da viewport",
  vh: "vh — altura da viewport",
  "%": "% — porcentagem do pai",
};

const UNITS: Unit[] = ["px", "rem", "em", "vw", "vh", "%"];

export default function CssUnitsPage() {
  const [value, setValue] = useState("16");
  const [from, setFrom] = useState<Unit>("px");
  const [baseFontSize, setBaseFontSize] = useState(BASE_FONT_SIZE);
  const [parentSize, setParentSize] = useState(16);
  const [copied, setCopied] = useState<string | null>(null);

  const num = parseFloat(value) || 0;
  const results = convert(num, from, baseFontSize, parentSize);

  const copy = (unit: string, val: string) => {
    navigator.clipboard.writeText(`${val}${unit}`);
    setCopied(unit);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>
          ← Ferramentas
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          📐 Conversor CSS
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Converta entre unidades CSS. Viewport: {VIEWPORT_WIDTH}×{VIEWPORT_HEIGHT}px. Clique no resultado para copiar.
        </p>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
              Valor
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{
                width: "100%",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "10px 14px",
                color: "var(--text)",
                fontSize: 20,
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            />
          </div>
          <div style={{ flex: 2, minWidth: 200 }}>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
              Unidade de origem
            </label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => setFrom(u)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: from === u ? "var(--accent)" : "var(--border)",
                    background: from === u ? "var(--accent)" : "var(--surface-2)",
                    color: from === u ? "#fff" : "var(--text-muted)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "monospace",
                    transition: "all 0.1s",
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        {UNITS.map((unit, i) => (
          <div
            key={unit}
            onClick={() => copy(unit, results[unit])}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom: i < UNITS.length - 1 ? "1px solid var(--border)" : "none",
              cursor: "pointer",
              background: unit === from ? "var(--surface-2)" : "transparent",
              transition: "background 0.1s",
            }}
            className="result-row"
          >
            <div>
              <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>
                {UNIT_LABELS[unit]}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", color: unit === from ? "var(--accent)" : "var(--text)" }}>
                {results[unit]}
                <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 2, color: "var(--text-muted)" }}>{unit}</span>
              </span>
              <span style={{ fontSize: 11, color: "var(--text-subtle)", minWidth: 52, textAlign: "right" }}>
                {copied === unit ? "✓ copiado" : "copiar"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 20,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
            Font-size raiz (rem)
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={10}
              max={24}
              value={baseFontSize}
              onChange={(e) => setBaseFontSize(Number(e.target.value))}
              style={{ width: 120 }}
            />
            <span style={{ fontSize: 13, fontFamily: "monospace", color: "var(--text)" }}>{baseFontSize}px</span>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 500 }}>
            Tamanho do pai (em / %)
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={10}
              max={72}
              value={parentSize}
              onChange={(e) => setParentSize(Number(e.target.value))}
              style={{ width: 120 }}
            />
            <span style={{ fontSize: 13, fontFamily: "monospace", color: "var(--text)" }}>{parentSize}px</span>
          </div>
        </div>
      </div>

      <style>{`.result-row:hover { background: var(--surface-2) !important; }`}</style>
    </div>
  );
}
