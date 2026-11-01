"use client";

import { useState } from "react";
import { Check, Copy, DownloadSimple } from "@phosphor-icons/react";
import {
  buildCss, canRenderImage, baseKind, expandStops, linearLine, radialRadii, svgMarkup, tailwindClass,
  type AnimationSettings, type GradientConfig,
} from "../../lib/gradient";
import { hexToRgb } from "../../lib/palette";

type Format = "css" | "tailwind" | "svg" | "png";

const FORMATS: { id: Format; label: string }[] = [
  { id: "css", label: "CSS" },
  { id: "tailwind", label: "Tailwind" },
  { id: "svg", label: "SVG" },
  { id: "png", label: "PNG" },
];

const PNG_SIZES = [
  { id: "1200x800", w: 1200, h: 800, label: "1200 × 800" },
  { id: "1920x1080", w: 1920, h: 1080, label: "1920 × 1080 (tela cheia)" },
  { id: "1080x1080", w: 1080, h: 1080, label: "1080 × 1080 (quadrado)" },
  { id: "1080x1920", w: 1080, h: 1920, label: "1080 × 1920 (vertical)" },
];

const chip = (active: boolean): React.CSSProperties => ({
  padding: "8px 12px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8,
  border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`,
  background: active ? "var(--accent-strong)" : "var(--surface)", color: active ? "#fff" : "var(--text)",
});

const primary: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", minHeight: 36, fontSize: 12, fontWeight: 600,
  cursor: "pointer", border: "none", borderRadius: 8, background: "var(--accent-strong)", color: "#fff",
};

function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
}

/** Desenha o gradiente (linear ou radial) em um canvas e baixa como PNG. */
function downloadPng(cfg: GradientConfig, w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const addStops = (g: CanvasGradient) => expandStops(cfg).forEach((s) => {
    const [r, gr, b] = hexToRgb(s.color);
    g.addColorStop(s.offset, `rgba(${r}, ${gr}, ${b}, ${s.alpha / 100})`);
  });
  if (baseKind(cfg.type) === "linear") {
    const l = linearLine(cfg.angle, w, h);
    const g = ctx.createLinearGradient(l.x1, l.y1, l.x2, l.y2);
    addStops(g);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  } else {
    const { rx, ry } = radialRadii(cfg, w, h);
    const [cx, cy] = [(cfg.x / 100) * w, (cfg.y / 100) * h];
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    addStops(g);
    ctx.translate(cx, cy);
    ctx.scale(rx || 1, ry || 1);
    ctx.fillStyle = g;
    ctx.fillRect(-cx / (rx || 1), -cy / (ry || 1), w / (rx || 1), h / (ry || 1));
  }
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    download(url, "gradiente.png");
    URL.revokeObjectURL(url);
  }, "image/png");
}

/** Exportação do gradiente: CSS, Tailwind, SVG e PNG. */
export default function GradientExport({ cfg, anim }: { cfg: GradientConfig; anim: AnimationSettings }) {
  const [format, setFormat] = useState<Format>("css");
  const [size, setSize] = useState(PNG_SIZES[0].id);
  const [copied, setCopied] = useState(false);
  const supported = canRenderImage(cfg);
  const picked = PNG_SIZES.find((s) => s.id === size) ?? PNG_SIZES[0];

  const code = format === "css" ? buildCss(cfg, anim, null)
    : format === "tailwind" ? tailwindClass(cfg)
    : format === "svg" ? svgMarkup(cfg, 1200, 800) ?? ""
    : "";

  const copy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div role="group" aria-label="Formato de exportação" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {FORMATS.map((f) => (
          <button key={f.id} type="button" aria-pressed={f.id === format} onClick={() => setFormat(f.id)} style={chip(f.id === format)}>{f.label}</button>
        ))}
      </div>

      {(format === "svg" || format === "png") && !supported && (
        <p role="note" style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "var(--text-muted)", padding: 12, border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface-2)" }}>
          SVG e PNG só existem para os tipos <strong>Linear</strong> e <strong>Radial</strong> (sem repetição). Para este tipo, use o CSS.
        </p>
      )}

      {format === "png" ? (
        supported && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>
              Tamanho
              <select value={size} onChange={(e) => setSize(e.target.value)} style={{ padding: "8px 10px", fontSize: 13, border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface-2)", color: "var(--text)" }}>
                {PNG_SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>A imagem é gerada no seu navegador. Nos espaços OKLab e OKLCH a mistura é aproximada por pontos intermediários.</p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => downloadPng(cfg, picked.w, picked.h)} style={primary}><DownloadSimple size={14} /> Baixar PNG</button>
            </div>
          </div>
        )
      ) : (
        (format === "css" || format === "tailwind" || supported) && (
          <>
            <pre style={{ margin: 0, padding: 16, fontSize: 12, lineHeight: 1.7, fontFamily: "var(--font-kode), ui-monospace, monospace", color: "var(--text)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "auto", maxHeight: 300, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {code}
            </pre>
            {format === "tailwind" && <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>A animação não entra na classe: use o CSS para animar.</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              {format === "svg" && (
                <button type="button" onClick={() => { const url = URL.createObjectURL(new Blob([code], { type: "image/svg+xml" })); download(url, "gradiente.svg"); URL.revokeObjectURL(url); }} style={{ ...primary, background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>
                  <DownloadSimple size={14} /> Baixar SVG
                </button>
              )}
              <button type="button" onClick={copy} style={primary}>{copied ? <Check size={14} weight="bold" /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar"}</button>
            </div>
          </>
        )
      )}
    </div>
  );
}
