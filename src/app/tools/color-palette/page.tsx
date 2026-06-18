"use client";

import { useState } from "react";
import Link from "next/link";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalettes(baseHex: string) {
  const [h, s, l] = hexToHsl(baseHex);
  return {
    complementary: [baseHex, hslToHex(h + 180, s, l)],
    analogous: [
      hslToHex(h - 30, s, l),
      baseHex,
      hslToHex(h + 30, s, l),
    ],
    triadic: [
      baseHex,
      hslToHex(h + 120, s, l),
      hslToHex(h + 240, s, l),
    ],
    splitComplementary: [
      baseHex,
      hslToHex(h + 150, s, l),
      hslToHex(h + 210, s, l),
    ],
    shades: [10, 20, 30, 40, 50, 60, 70, 80, 90].map((light) =>
      hslToHex(h, s, light)
    ),
  };
}

function ColorSwatch({ hex, size = "md" }: { hex: string; size?: "sm" | "md" | "lg" }) {
  const [copied, setCopied] = useState(false);
  const sizes = { sm: 48, md: 72, lg: 88 };
  const px = sizes[size];

  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={copy}
      title={hex}
      style={{
        width: px,
        height: px,
        borderRadius: 10,
        background: hex,
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.1s",
        flexShrink: 0,
        position: "relative",
      }}
      className="swatch"
    >
      {copied && (
        <span
          style={{
            position: "absolute",
            bottom: -22,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 10,
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
          }}
        >
          copiado!
        </span>
      )}
    </div>
  );
}

function PaletteRow({ label, colors }: { label: string; colors: string[] }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingBottom: 24 }}>
        {colors.map((c, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <ColorSwatch hex={c} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

export default function ColorPalettePage() {
  const [base, setBase] = useState("#6366f1");
  const [picking, setPicking] = useState(false);
  const palettes = generatePalettes(base);
  const hasEyeDropper = typeof window !== "undefined" && "EyeDropper" in window;

  const pickColor = async () => {
    if (!window.EyeDropper) return;
    setPicking(true);
    try {
      const result = await new window.EyeDropper().open();
      setBase(result.sRGBHex);
    } catch {
      // usuário cancelou
    } finally {
      setPicking(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
          ← Ferramentas
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🎨 Paleta de Cores
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Escolha uma cor base e explore paletas harmônicas. Clique em qualquer swatch para copiar o hex.
        </p>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Cor base</label>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="color"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "none",
              cursor: "pointer",
              padding: 2,
            }}
          />
          <input
            type="text"
            value={base}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setBase(v);
            }}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "8px 12px",
              color: "var(--text)",
              fontSize: 14,
              fontFamily: "monospace",
              width: 110,
            }}
          />
        </div>
        {hasEyeDropper && (
          <button
            onClick={pickColor}
            title="Capturar cor da tela"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: picking ? "var(--accent)" : "var(--surface-2)",
              border: "1px solid",
              borderColor: picking ? "var(--accent)" : "var(--border)",
              borderRadius: 8,
              padding: "9px 14px",
              color: picking ? "#fff" : "var(--text-muted)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M13.5 1.5a1.5 1.5 0 0 0-2.12 0L9.5 3.38 8.62 2.5a1 1 0 0 0-1.41 0L5.5 4.21 2.5 7.21a1 1 0 0 0 0 1.41l.79.79L1.5 11.2A1.5 1.5 0 0 0 1 12.5v1h1a1.5 1.5 0 0 0 1.06-.44l1.79-1.79.79.79a1 1 0 0 0 1.41 0l2.45-2.45 1.71-1.71 1.79-1.79a1.5 1.5 0 0 0 0-2.12L13.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {picking ? "Clique na cor..." : "Conta-gotas"}
          </button>
        )}
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          HSL: {hexToHsl(base.length === 7 ? base : "#6366f1").join("° / ")}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <PaletteRow label="Complementar" colors={palettes.complementary} />
        <PaletteRow label="Análoga" colors={palettes.analogous} />
        <PaletteRow label="Tríade" colors={palettes.triadic} />
        <PaletteRow label="Split-Complementar" colors={palettes.splitComplementary} />
        <PaletteRow label="Tons (lightness 10–90%)" colors={palettes.shades} />
      </div>

      <style>{`.swatch:hover { transform: scale(1.08); }`}</style>
    </div>
  );
}
