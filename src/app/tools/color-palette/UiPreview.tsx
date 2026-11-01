"use client";

import { useState } from "react";
import { Check, Moon, Sun, X } from "@phosphor-icons/react";
import { bestTextColor, contrastRatio, wcagLevel } from "../../lib/palette";

const SURFACES = {
  claro: { label: "Claro", icon: Sun, bg: "#ffffff", card: "#f4f5f7", text: "#111111", muted: "#52606d" },
  escuro: { label: "Escuro", icon: Moon, bg: "#0f0f10", card: "#1b1b1d", text: "#f4f4f5", muted: "#9a9aa2" },
} as const;

type SurfaceKey = keyof typeof SURFACES;

const titleStyle: React.CSSProperties = { fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text)" };

/** Paleta aplicada sobre fundo claro ou escuro e, ao lado, quais cores passam no contraste sobre esse fundo. */
export default function UiPreview({ colors, baseIndex }: { colors: string[]; baseIndex: number }) {
  const [surface, setSurface] = useState<SurfaceKey>("claro");
  const s = SURFACES[surface];
  const primary = colors[Math.max(baseIndex, 0)] ?? colors[0];
  const secondary = colors.find((c) => c !== primary) ?? primary;
  const accent = [...colors].reverse().find((c) => c !== primary && c !== secondary) ?? secondary;

  return (
    <section aria-label="Aplicação da paleta" style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <h2 style={titleStyle}>Aplicação da paleta</h2>
        <div role="group" aria-label="Fundo do preview" style={{ display: "flex", gap: 8 }}>
          {(Object.keys(SURFACES) as SurfaceKey[]).map((key) => {
            const Icon = SURFACES[key].icon;
            const active = key === surface;
            return (
              <button key={key} type="button" aria-pressed={active} onClick={() => setSurface(key)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`, background: active ? "var(--accent-strong)" : "var(--surface)", color: active ? "#fff" : "var(--text)" }}>
                <Icon size={16} /> {SURFACES[key].label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="cp-preview-grid">
        <div style={{ background: s.bg, border: "1px solid var(--border)", padding: 20, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" style={{ background: primary, color: bestTextColor(primary), border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "default" }}>Botão primário</button>
            <button type="button" style={{ background: "transparent", color: primary, border: `2px solid ${primary}`, borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "default" }}>Contorno</button>
            <button type="button" style={{ background: secondary, color: bestTextColor(secondary), border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "default" }}>Secundário</button>
            <span style={{ background: accent + "33", color: accent, border: `1px solid ${accent}66`, borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 600 }}>Etiqueta</span>
          </div>
          <div style={{ background: s.card, padding: 16, borderLeft: `4px solid ${primary}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: s.text, marginBottom: 4 }}>Cartão de exemplo</div>
            <div style={{ fontSize: 12, color: s.muted, lineHeight: 1.6 }}>Texto de apoio sobre o fundo {s.label.toLowerCase()}, com um destaque na cor primária.</div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: primary }}>Link de ação</div>
          </div>
        </div>

        <div className="cut-box" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          <h3 style={{ ...titleStyle, fontSize: 14 }}>Contraste sobre o fundo {s.label.toLowerCase()}</h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {colors.map((c, i) => {
              const ratio = contrastRatio(c, s.bg);
              const wl = wcagLevel(ratio);
              const pass = ratio >= 4.5;
              const tone = pass ? "#22c55e" : "#ef4444";
              return (
                <li key={`${c}-${i}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderRadius: 10, background: pass ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${pass ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                  <span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: 11, background: tone, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {pass ? <Check size={11} weight="bold" /> : <X size={11} weight="bold" />}
                  </span>
                  <span aria-hidden="true" style={{ width: 16, height: 16, background: c, flexShrink: 0, border: "1px solid rgba(128,128,128,0.4)" }} />
                  <span style={{ fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: 11, color: "var(--text)" }}>{c.toUpperCase()}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: tone, whiteSpace: "nowrap" }}>
                    {ratio.toFixed(1)}:1 · {wl.level}
                  </span>
                </li>
              );
            })}
          </ul>
          <p style={{ margin: "4px 0 0", fontSize: 10, lineHeight: 1.6, color: "var(--text-muted)" }}>
            Passa quando o contraste é de pelo menos 4,5:1 (WCAG AA para texto normal).
          </p>
        </div>
      </div>
    </section>
  );
}
