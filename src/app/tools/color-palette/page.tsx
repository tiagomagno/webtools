"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ColorGenerator from "./ColorGenerator";

// ─── Utilitários ──────────────────────────────────────────────────────────────

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

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const bright = Math.max(l1, l2), dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

function bestTextColor(bg: string): "#ffffff" | "#0a0a0a" {
  return contrastRatio(bg, "#ffffff") >= contrastRatio(bg, "#0a0a0a") ? "#ffffff" : "#0a0a0a";
}

function wcagLevel(ratio: number) {
  if (ratio >= 7) return { level: "AAA", color: "#22c55e", pass: true };
  if (ratio >= 4.5) return { level: "AA", color: "#84cc16", pass: true };
  if (ratio >= 3) return { level: "AA Large", color: "#eab308", pass: true };
  return { level: "Fail", color: "#ef4444", pass: false };
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function randomHex(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 50 + Math.floor(Math.random() * 40);
  const l = 35 + Math.floor(Math.random() * 30);
  return hslToHex(h, s, l);
}

// ─── Tipos de harmonia ────────────────────────────────────────────────────────

type HarmonyType = "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "monochromatic";

const HARMONIES: { id: HarmonyType; label: string; desc: string }[] = [
  { id: "complementary",       label: "Complementar",         desc: "Opostos na roda — máximo contraste" },
  { id: "analogous",           label: "Análoga",              desc: "Vizinhos — harmonia natural" },
  { id: "triadic",             label: "Tríade",               desc: "3 cores equidistantes" },
  { id: "split-complementary", label: "Split-Complementar",   desc: "Variação suave do complementar" },
  { id: "tetradic",            label: "Tetrádica",            desc: "4 cores em quadrado na roda" },
  { id: "monochromatic",       label: "Monocromática",        desc: "Tons da mesma matiz" },
];

function generateHarmony(baseHex: string, type: HarmonyType): string[] {
  if (!isValidHex(baseHex)) return [baseHex];
  const [h, s, l] = hexToHsl(baseHex);
  switch (type) {
    case "complementary":
      return [baseHex, hslToHex(h + 180, s, l)];
    case "analogous":
      return [hslToHex(h - 30, s, l), baseHex, hslToHex(h + 30, s, l), hslToHex(h + 60, s, l)];
    case "triadic":
      return [baseHex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)];
    case "split-complementary":
      return [baseHex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)];
    case "tetradic":
      return [baseHex, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)];
    case "monochromatic":
      return [20, 35, 50, 65, 80].map((li) => hslToHex(h, s, li));
  }
}

function generateAllPalettes(baseHex: string) {
  if (!isValidHex(baseHex)) return null;
  const [h, s, l] = hexToHsl(baseHex);
  return {
    shades: [10, 20, 30, 40, 50, 60, 70, 80, 90].map((li) => hslToHex(h, s, li)),
    complementary: generateHarmony(baseHex, "complementary"),
    analogous: generateHarmony(baseHex, "analogous"),
    triadic: generateHarmony(baseHex, "triadic"),
    splitComplementary: generateHarmony(baseHex, "split-complementary"),
    tetradic: generateHarmony(baseHex, "tetradic"),
    monochromatic: generateHarmony(baseHex, "monochromatic"),
  };
}

// ─── Roda de Cores (Canvas) ───────────────────────────────────────────────────

function ColorWheel({ hex, onChange }: { hex: string; onChange: (hex: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const SIZE = 240;
  const R = SIZE / 2;
  const RING = 28;
  const dragging = useRef(false);
  const [brightness, setBrightness] = useState(() => isValidHex(hex) ? hexToHsl(hex)[2] : 50);

  // Draw wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const cx = R, cy = R;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // Outer hue ring
    for (let deg = 0; deg < 360; deg++) {
      const start = ((deg - 1) * Math.PI) / 180;
      const end = ((deg + 1) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R - 2, start, end);
      ctx.closePath();
      ctx.fillStyle = `hsl(${deg}, 100%, 50%)`;
      ctx.fill();
    }

    // Inner white circle mask
    ctx.beginPath();
    ctx.arc(cx, cy, R - RING - 2, 0, Math.PI * 2);
    ctx.fillStyle = "var(--surface, #111)";
    ctx.fill();

    // Inner SL square (simplified: saturation/lightness gradient)
    const innerR = R - RING - 6;
    const x0 = cx - innerR, y0 = cy - innerR;
    const grad1 = ctx.createLinearGradient(x0, y0, x0 + innerR * 2, y0);
    const [h] = isValidHex(hex) ? hexToHsl(hex) : [0, 0, 50];
    grad1.addColorStop(0, "#fff");
    grad1.addColorStop(1, `hsl(${h}, 100%, 50%)`);
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = grad1;
    ctx.fill();
    const grad2 = ctx.createLinearGradient(x0, y0, x0, y0 + innerR * 2);
    grad2.addColorStop(0, "rgba(0,0,0,0)");
    grad2.addColorStop(1, "#000");
    ctx.fillStyle = grad2;
    ctx.fill();
    ctx.restore();

    // Hue indicator on ring
    const hueAngle = (h * Math.PI) / 180;
    const hx = cx + (R - RING / 2 - 2) * Math.cos(hueAngle - Math.PI / 2);
    const hy = cy + (R - RING / 2 - 2) * Math.sin(hueAngle - Math.PI / 2);
    ctx.beginPath();
    ctx.arc(hx, hy, 9, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();
  }, [hex, brightness]);

  const getHueFromCanvas = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left - R;
    const y = clientY - rect.top - R;
    const dist = Math.sqrt(x * x + y * y);

    if (dist >= R - RING - 2 && dist <= R) {
      // On hue ring
      let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;
      const [, s, l] = isValidHex(hex) ? hexToHsl(hex) : [0, 70, 50];
      onChange(hslToHex(Math.round(angle), s, l));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{ borderRadius: "50%", cursor: "crosshair", userSelect: "none" }}
        onMouseDown={(e) => { dragging.current = true; getHueFromCanvas(e); }}
        onMouseMove={(e) => { if (dragging.current) getHueFromCanvas(e); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
      />
      {/* Brightness slider */}
      <div style={{ width: SIZE, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Luminosidade</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{brightness}%</span>
        </div>
        <div style={{ position: "relative", height: 14 }}>
          <div style={{
            position: "absolute", inset: "4px 0",
            borderRadius: 6,
            background: (() => {
              const [h, s] = isValidHex(hex) ? hexToHsl(hex) : [0, 70];
              return `linear-gradient(to right, #000, hsl(${h},${s}%,50%), #fff)`;
            })(),
          }} />
          <input
            type="range" min={5} max={95} value={brightness}
            onChange={(e) => {
              const l = Number(e.target.value);
              setBrightness(l);
              const [h, s] = isValidHex(hex) ? hexToHsl(hex) : [0, 70];
              onChange(hslToHex(h, s, l));
            }}
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Strip de cor (estilo Adobe) ─────────────────────────────────────────────

function ColorStrip({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);
  const textColor = bestTextColor(hex);

  const copy = () => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={copy}
      className="color-strip"
      style={{
        flex: "1 1 60px",
        minWidth: 60,
        height: 220,
        background: hex,
        borderRadius: 10,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "10px 10px",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "flex 0.25s, box-shadow 0.2s, transform 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span style={{
        fontSize: 11, fontWeight: 700, fontFamily: "monospace",
        color: textColor, letterSpacing: "0.04em",
        textAlign: "center",
        opacity: 0.9,
      }}>
        {copied ? "✓" : hex.toUpperCase()}
      </span>
    </div>
  );
}

// ─── Exportação ───────────────────────────────────────────────────────────────

function buildExport(format: string, base: string, harmony: string[], palettes: ReturnType<typeof generateAllPalettes>): string {
  if (!palettes) return "";
  switch (format) {
    case "css":
      return `:root {\n${harmony.map((c, i) => `  --color-${i === 0 ? "base" : i}: ${c};`).join("\n")}\n${palettes.shades.map((c, i) => `  --shade-${(i + 1) * 100}: ${c};`).join("\n")}\n}`;
    case "tailwind":
      return `// tailwind.config.js\ncolors: {\n  palette: {\n${harmony.map((c, i) => `    ${i === 0 ? "DEFAULT" : i}: "${c}",`).join("\n")}\n  },\n  shades: {\n${palettes.shades.map((c, i) => `    ${(i + 1) * 100}: "${c}",`).join("\n")}\n  },\n}`;
    case "json":
      return JSON.stringify({ base, harmony, shades: Object.fromEntries(palettes.shades.map((c, i) => [`${(i + 1) * 100}`, c])) }, null, 2);
    default: return "";
  }
}

// ─── Design System Preview ──────────────────────────────────────────────────────

function DesignSystemPreview({ base, primary, secondary }: { base: string; primary: string; secondary: string }) {
  const [h, s] = hexToHsl(base);
  const dark = hslToHex(h, s, 15);
  const light = hslToHex(h, s, 95);
  const muted = hslToHex(h, Math.max(s - 30, 0), 50);

  const roles = [
    { role: "Base", hex: base, desc: "Fundo principal, neutral base" },
    { role: "Primary", hex: primary, desc: "Ação principal, CTA, links ativos" },
    { role: "Secondary", hex: secondary, desc: "Destaque secundário, badges" },
    { role: "Dark", hex: dark, desc: "Backgrounds, texto sobre claro" },
    { role: "Light", hex: light, desc: "Superfícies, cards, fundo suave" },
    { role: "Muted", hex: muted, desc: "Texto secundário, placeholders" },
  ];

  const textOnDark = bestTextColor(dark);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: base }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Design System Preview</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>Como usar as cores do seu sistema</span>
      </div>

      <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {roles.map(({ role, hex, desc }) => {
          const text = bestTextColor(hex);
          const ratio = contrastRatio(hex, text);
          const wl = wcagLevel(ratio);
          return (
            <div key={role} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface-2)" }}>
              <div style={{ height: 72, background: hex, display: "flex", alignItems: "flex-end", padding: "8px 10px" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: text, opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.1em" }}>{role}</span>
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text)", marginBottom: 3 }}>{hex.toUpperCase()}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.4, marginBottom: 5 }}>{desc}</div>
                <span style={{ fontSize: 9, fontWeight: 700, background: wl.color + "22", color: wl.color, border: `1px solid ${wl.color}44`, borderRadius: 4, padding: "1px 5px" }}>
                  WCAG {wl.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ margin: "0 20px 20px", borderRadius: 10, background: dark, padding: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 11, color: `${textOnDark}88`, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>UI Preview</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button style={{ background: primary, color: bestTextColor(primary), border: "none", borderRadius: 7, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Botão primário</button>
          <button style={{ background: "transparent", color: primary, border: `1.5px solid ${primary}`, borderRadius: 7, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Outlined</button>
          <button style={{ background: secondary, color: bestTextColor(secondary), border: "none", borderRadius: 7, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Secundário</button>
          <span style={{ background: base + "22", color: base, border: `1px solid ${base}44`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600 }}>Badge</span>
        </div>
        <div style={{ marginTop: 14, background: hslToHex(h, s, 22), borderRadius: 8, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: textOnDark, marginBottom: 4 }}>Card de exemplo</div>
          <div style={{ fontSize: 12, color: `${textOnDark}88`, lineHeight: 1.6 }}>Texto de conteúdo usando as cores do design system gerado.</div>
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: primary, marginTop: 3 }} /><span style={{ fontSize: 11, color: primary }}>Link de ação</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Biblioteca (localStorage) ────────────────────────────────────────────────

interface SavedPalette {
  id: string;
  name: string;
  base: string;
  primary: string;
  secondary: string;
  harmony: string[];
  harmonyType: HarmonyType;
  savedAt: number;
}

function SavedLibrary({ base, primary, secondary, harmony, harmonyType, onLoad }: {
  base: string;
  primary: string;
  secondary: string;
  harmony: string[];
  harmonyType: HarmonyType;
  onLoad: (base: string, primary: string, secondary: string, type: HarmonyType) => void;
}) {
  const [saved, setSaved] = useState<SavedPalette[]>([]);
  const [name, setName] = useState("");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    try { const r = localStorage.getItem("cp-library-v2"); if (r) setSaved(JSON.parse(r)); } catch { }
  }, []);

  const persist = (list: SavedPalette[]) => {
    setSaved(list);
    localStorage.setItem("cp-library-v2", JSON.stringify(list));
  };

  const save = () => {
    if (!isValidHex(base)) return;
    persist([{ id: Date.now().toString(), name: name.trim() || `Paleta ${new Date().toLocaleDateString("pt-BR")}`, base, primary, secondary, harmony, harmonyType, savedAt: Date.now() }, ...saved]);
    setName(""); setFlash(true); setTimeout(() => setFlash(false), 1500);
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>📚 Biblioteca</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>{saved.length} salvas</span>
      </div>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <div style={{ display: "flex", gap: 3 }}>
          {harmony.slice(0, 5).map((c, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 5, background: c, border: "1px solid rgba(255,255,255,0.1)" }} />)}
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da paleta..." onKeyDown={(e) => e.key === "Enter" && save()}
          style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", color: "var(--text)", fontSize: 13 }} />
        <button onClick={save}
          style={{ background: flash ? "#22c55e" : "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
          {flash ? "✓" : "Salvar"}
        </button>
      </div>
      {saved.length === 0
        ? <div style={{ padding: 20, textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>Nenhuma paleta salva.</div>
        : saved.map((p, idx) => (
          <div key={p.id} className="lib-row" style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: idx < saved.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ display: "flex", gap: 3 }}>
              {p.harmony.slice(0, 5).map((c, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 3, background: c }} />)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{p.base.toUpperCase()} · {p.harmonyType} · {new Date(p.savedAt).toLocaleDateString("pt-BR")}</div>
            </div>
            <button onClick={() => onLoad(p.base, p.primary || p.base, p.secondary || p.base, p.harmonyType)} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer" }}>Carregar</button>
            <button onClick={() => persist(saved.filter((x) => x.id !== p.id))} style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: "transparent", border: "1px solid #ef444433", color: "#ef4444", cursor: "pointer" }}>✕</button>
          </div>
        ))}
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────

declare global { interface Window { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } } }

type Tab = "design-system" | "generator" | "export" | "library";

export default function ColorPalettePage() {
  const [base, setBase] = useState("#6366f1");
  const [baseText, setBaseText] = useState("#6366f1");
  const [primary, setPrimary] = useState("#3b82f6");
  const [primaryText, setPrimaryText] = useState("#3b82f6");
  const [secondary, setSecondary] = useState("#10b981");
  const [secondaryText, setSecondaryText] = useState("#10b981");
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("complementary");
  const [activeTab, setActiveTab] = useState<Tab>("design-system");
  const [exportFormat, setExportFormat] = useState<"css" | "tailwind" | "json">("css");
  const [codeCopied, setCodeCopied] = useState(false);
  const [picking, setPicking] = useState(false);
  const [hasEyeDropper, setHasEyeDropper] = useState(false);

  useEffect(() => {
    setHasEyeDropper("EyeDropper" in window);
  }, []);

  const validBase = isValidHex(base) ? base : "#6366f1";
  const validPrimary = isValidHex(primary) ? primary : "#3b82f6";
  const validSecondary = isValidHex(secondary) ? secondary : "#10b981";
  const [h, s, l] = hexToHsl(validBase);
  const harmony = generateHarmony(validBase, harmonyType);
  const palettes = generateAllPalettes(validBase);

  const pickColor = async () => {
    if (!window.EyeDropper) return;
    setPicking(true);
    try { const r = await new window.EyeDropper().open(); setBase(r.sRGBHex); setBaseText(r.sRGBHex); }
    catch { } finally { setPicking(false); }
  };

  const randomize = () => {
    const hex1 = randomHex(); setBase(hex1); setBaseText(hex1);
    const hex2 = randomHex(); setPrimary(hex2); setPrimaryText(hex2);
    const hex3 = randomHex(); setSecondary(hex3); setSecondaryText(hex3);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "design-system", label: "🧩 Design System" },
    { id: "generator", label: "🎲 Gerador de Paleta" },
    { id: "export", label: "⟨/⟩ Exportar" },
    { id: "library", label: "📚 Biblioteca" },
  ];

  const exportCode = buildExport(exportFormat, validBase, harmony, palettes);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🎨 Paleta de Cores
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
          Roda de cores interativa, harmonias HSL, exportação de código e biblioteca pessoal.
        </p>
      </div>

      {/* ── CONTROLES PRINCIPAIS (Sempre visíveis) ───────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start", marginBottom: 32 }}>
          {/* Left: wheel + input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <ColorWheel hex={validBase} onChange={(v) => { setBase(v); setBaseText(v); }} />

            {/* Color input rows */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Base", hex: validBase, text: baseText, setHex: setBase, setText: setBaseText },
                { label: "Primária", hex: validPrimary, text: primaryText, setHex: setPrimary, setText: setPrimaryText },
                { label: "Secundária", hex: validSecondary, text: secondaryText, setHex: setSecondary, setText: setSecondaryText },
              ].map((field) => (
                <div key={field.label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 68, fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{field.label}</div>
                  <input type="color" value={field.hex} onChange={(e) => { field.setHex(e.target.value); field.setText(e.target.value); }}
                    style={{ width: 38, height: 38, borderRadius: 8, border: `2px solid ${field.hex}66`, background: "none", cursor: "pointer", padding: 2, flexShrink: 0 }} />
                  <input type="text" value={field.text} onChange={(e) => { field.setText(e.target.value); if (isValidHex(e.target.value)) field.setHex(e.target.value); }}
                    spellCheck={false} placeholder="#000000"
                    style={{ flex: 1, minWidth: 0, background: "var(--surface-2)", border: `1px solid ${isValidHex(field.text) ? "var(--border)" : "#ef444466"}`, borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, fontFamily: "monospace" }} />
                  {hasEyeDropper && (
                    <button onClick={async () => {
                      if (!window.EyeDropper) return;
                      setPicking(true);
                      try { const r = await new window.EyeDropper().open(); field.setHex(r.sRGBHex); field.setText(r.sRGBHex); }
                      catch { } finally { setPicking(false); }
                    }} title={`Conta-gotas ${field.label}`}
                      style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: picking ? "var(--accent)" : "var(--surface-2)", border: `1px solid ${picking ? "var(--accent)" : "var(--border)"}`, color: picking ? "#fff" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M13.5 1.5a1.5 1.5 0 0 0-2.12 0L9.5 3.38 8.62 2.5a1 1 0 0 0-1.41 0L5.5 4.21 2.5 7.21a1 1 0 0 0 0 1.41l.79.79L1.5 11.2A1.5 1.5 0 0 0 1 12.5v1h1a1.5 1.5 0 0 0 1.06-.44l1.79-1.79.79.79a1 1 0 0 0 1.41 0l2.45-2.45 1.71-1.71 1.79-1.79a1.5 1.5 0 0 0 0-2.12L13.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  )}
                </div>
              ))}
              <button onClick={randomize} title="Gerar tudo aleatório"
                style={{ width: "100%", height: 38, display: "flex", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer", fontSize: 13, fontWeight: 500, marginTop: 4 }}>
                ✨ Gerar tudo aleatório
              </button>
            </div>

            {/* HSL info */}
            <div style={{ width: "100%", background: "var(--surface-2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, fontFamily: "monospace", color: "var(--text-muted)" }}>
              Base: HSL({h}°, {s}%, {l}%) &nbsp;·&nbsp; RGB({hexToRgb(validBase).join(", ")})
            </div>
          </div>

          {/* Right: harmony selector + strips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Harmony type */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
                Harmonias de cor
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {HARMONIES.map((h) => (
                  <button key={h.id} onClick={() => setHarmonyType(h.id)}
                    title={h.desc}
                    style={{
                      fontSize: 12, fontWeight: 500, padding: "7px 14px", borderRadius: 8, border: "1px solid",
                      borderColor: harmonyType === h.id ? "var(--accent)" : "var(--border)",
                      background: harmonyType === h.id ? "var(--accent)" : "var(--surface-2)",
                      color: harmonyType === h.id ? "#fff" : "var(--text-muted)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}>
                    {h.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                {HARMONIES.find((h) => h.id === harmonyType)?.desc}
              </div>
            </div>

            {/* Color Strips (estilo Adobe) */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {harmony.map((c, i) => (
                  <ColorStrip key={i} hex={c} />
                ))}
              </div>
              {/* Hex labels */}
              <div style={{ display: "flex", gap: 8 }}>
                {harmony.map((c, i) => {
                  const ratio = contrastRatio(c, bestTextColor(c));
                  const wl = wcagLevel(ratio);
                  return (
                    <div key={i} style={{ flex: "1 1 60px", minWidth: 60, textAlign: "center" }}>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: "var(--text-muted)", marginBottom: 3 }}>{c.toUpperCase()}</div>
                      <span style={{ fontSize: 9, fontWeight: 700, background: wl.color + "22", color: wl.color, border: `1px solid ${wl.color}44`, borderRadius: 4, padding: "1px 5px" }}>{wl.level}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      {/* ── ABAS INFERIORES ────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid var(--border)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            fontSize: 13, fontWeight: 500, padding: "9px 18px",
            background: "transparent", border: "none",
            borderBottom: `2px solid ${activeTab === t.id ? "var(--accent)" : "transparent"}`,
            color: activeTab === t.id ? "var(--text)" : "var(--text-muted)",
            cursor: "pointer", transition: "all 0.15s", marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── DESIGN SYSTEM ──────────────────────────────────────────────────────── */}
      {activeTab === "design-system" && (
        <DesignSystemPreview base={validBase} primary={validPrimary} secondary={validSecondary} />
      )}

      {/* ── GERADOR DE PALETA ──────────────────────────────────────────────────── */}
      {activeTab === "generator" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Gerador de Paleta Aleatória</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Gere combinações harmônicas e trave as cores que você gostar (ícone do cadeado).</p>
          </div>
          <ColorGenerator />
        </div>
      )}

      {/* ── EXPORTAR ───────────────────────────────────────────────────────────── */}
      {activeTab === "export" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Exportar paleta como código</span>
            <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
              {(["css", "tailwind", "json"] as const).map((f) => (
                <button key={f} onClick={() => setExportFormat(f)}
                  style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, border: "1px solid", borderColor: exportFormat === f ? "var(--accent)" : "var(--border)", background: exportFormat === f ? "var(--accent)" : "var(--surface-2)", color: exportFormat === f ? "#fff" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s" }}>
                  {f === "css" ? "CSS Vars" : f === "tailwind" ? "Tailwind" : "JSON"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <pre style={{ margin: 0, padding: 20, fontSize: 12, fontFamily: "monospace", lineHeight: 1.7, color: "var(--text-muted)", maxHeight: 320, overflowY: "auto", background: "var(--surface-2)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {exportCode}
            </pre>
            <button onClick={() => { navigator.clipboard.writeText(exportCode); setCodeCopied(true); setTimeout(() => setCodeCopied(false), 1800); }}
              style={{ position: "absolute", top: 12, right: 12, background: codeCopied ? "#22c55e" : "var(--surface)", border: "1px solid var(--border)", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: codeCopied ? "#fff" : "var(--text)", cursor: "pointer", transition: "all 0.2s" }}>
              {codeCopied ? "✓ Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      {/* ── BIBLIOTECA ─────────────────────────────────────────────────────────── */}
      {activeTab === "library" && (
        <SavedLibrary base={validBase} primary={validPrimary} secondary={validSecondary} harmony={harmony} harmonyType={harmonyType}
          onLoad={(b, p, s, t) => { setBase(b); setBaseText(b); setPrimary(p); setPrimaryText(p); setSecondary(s); setSecondaryText(s); setHarmonyType(t); setActiveTab("design-system"); }} />
      )}

      <style>{`
        .color-strip:hover { flex: 2 !important; box-shadow: 0 12px 32px rgba(0,0,0,0.5); transform: translateY(-3px); }
        .lib-row:hover { background: var(--surface-2); }
      `}</style>
    </div>
  );
}
