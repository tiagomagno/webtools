"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { applyPreset, gradientFunction, PRESETS, stop, type GradientConfig, type Preset } from "../../lib/gradient";
import { isValidHex } from "../../lib/palette";

// Mesma biblioteca da Paleta de Cores (salva neste navegador): `harmony` guarda as cores de cada paleta.
const LIBRARY_KEY = "cp-library-v2";

interface SavedPalette { id: string; name: string; harmony: string[] }

interface PresetsPanelProps {
  current: GradientConfig;
  onApply: (cfg: GradientConfig) => void;
}

/** Presets prontos e gradientes montados a partir das paletas salvas na Paleta de Cores. */
export default function PresetsPanel({ current, onApply }: PresetsPanelProps) {
  const [saved, setSaved] = useState<SavedPalette[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LIBRARY_KEY);
      if (raw) setSaved((JSON.parse(raw) as SavedPalette[]).filter((p) => Array.isArray(p.harmony)));
    } catch { /* sem biblioteca */ }
  }, []);

  const sample = (preset: Preset) => gradientFunction({ ...applyPreset(current, preset), space: "srgb", angle: preset.type === "linear" ? 135 : preset.angle });

  const fromPalette = (palette: SavedPalette): GradientConfig => {
    const colors = palette.harmony.filter(isValidHex);
    const n = colors.length;
    return { ...current, type: current.type, hard: false, stops: colors.map((c, i) => stop(c, n === 1 ? 0 : Math.round((i / (n - 1)) * 100))) };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <section aria-label="Presets">
        <h3 style={sectionTitle}>Presets</h3>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
          {PRESETS.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => onApply(applyPreset(current, p))}
                style={{ width: "100%", padding: 6, textAlign: "left", cursor: "pointer", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}>
                <span aria-hidden="true" style={{ display: "block", height: 56, borderRadius: 6, background: sample(p), border: "1px solid var(--border)" }} />
                <span style={{ display: "block", marginTop: 6, fontSize: 12, fontWeight: 600 }}>{p.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Das suas paletas" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
        <h3 style={sectionTitle}>Das suas paletas</h3>
        {saved.length === 0 ? (
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Nenhuma paleta salva ainda. Salve uma na <Link href="/tools/color-palette" style={{ color: "var(--accent-text)", fontWeight: 600 }}>Paleta de Cores</Link> (botão Biblioteca) e ela aparece aqui.
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {saved.map((p) => {
              const next = fromPalette(p);
              return (
                <li key={p.id}>
                  <button type="button" onClick={() => onApply(next)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: 6, textAlign: "left", cursor: "pointer", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}>
                    <span aria-hidden="true" style={{ width: 96, height: 32, borderRadius: 6, flexShrink: 0, background: gradientFunction({ ...next, type: "linear", angle: 90, space: "srgb" }) }} />
                    <span style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

const sectionTitle: React.CSSProperties = { fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "var(--text)" };
