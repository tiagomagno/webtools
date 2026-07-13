"use client";

import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type GridMode = "grid" | "flex";
type FlexDirection = "row" | "column";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
type JustifyContent = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
type AlignItems = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
type Viewport = "mobile" | "tablet" | "desktop";

interface GridConfig {
  mode: GridMode;
  columns: number;
  rows: number;
  colGap: number;
  rowGap: number;
  customColTemplate: string;
  customRowTemplate: string;
  useCustomTemplate: boolean;
  padding: number;
  itemCount: number;
  flexDirection: FlexDirection;
  flexWrap: FlexWrap;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  minItemWidth: number;
  contentWidth: number | "full";
  marginTop: number;
  marginBottom: number;
  marginInline: number;
}

const CONTENT_WIDTHS: { value: number | "full"; label: string; desc: string }[] = [
  { value: 960,  label: "960px",  desc: "Clássico" },
  { value: 1280, label: "1280px", desc: "HD comum" },
  { value: 1366, label: "1366px", desc: "Laptop" },
  { value: 1440, label: "1440px", desc: "MacBook" },
  { value: 1536, label: "1536px", desc: "2K" },
  { value: 1920, label: "1920px", desc: "Full HD" },
  { value: 2560, label: "2560px", desc: "2K Wide" },
  { value: "full", label: "100%",  desc: "Fluido" },
];

const VIEWPORTS: { id: Viewport; label: string; width: number; icon: string }[] = [
  { id: "mobile", label: "Mobile", width: 375, icon: "📱" },
  { id: "tablet", label: "Tablet", width: 768, icon: "📲" },
  { id: "desktop", label: "Desktop", width: 1280, icon: "🖥️" },
];

// ─── CSS Generator ────────────────────────────────────────────────────────────

function generateWrapperCSS(cfg: GridConfig): string {
  const lines: string[] = [];
  if (cfg.contentWidth !== "full") {
    lines.push(`max-width: ${cfg.contentWidth}px;`);
    lines.push(`width: 100%;`);
  }
  const mi = cfg.marginInline > 0 ? `${cfg.marginInline}px` : "auto";
  lines.push(`margin-inline: ${mi};`);
  if (cfg.marginTop > 0)    lines.push(`margin-top: ${cfg.marginTop}px;`);
  if (cfg.marginBottom > 0) lines.push(`margin-bottom: ${cfg.marginBottom}px;`);
  return lines.join("\n");
}

function generateCSS(cfg: GridConfig, forViewport?: number): string {
  if (cfg.mode === "grid") {
    const cols = cfg.useCustomTemplate
      ? cfg.customColTemplate
      : `repeat(${cfg.columns}, 1fr)`;
    const rows = cfg.useCustomTemplate && cfg.customRowTemplate
      ? cfg.customRowTemplate
      : cfg.rows > 1 ? `repeat(${cfg.rows}, 1fr)` : undefined;

    const lines = [
      `display: grid;`,
      `grid-template-columns: ${cols};`,
      rows ? `grid-template-rows: ${rows};` : null,
      `column-gap: ${cfg.colGap}px;`,
      `row-gap: ${cfg.rowGap}px;`,
      cfg.padding ? `padding: ${cfg.padding}px;` : null,
    ].filter(Boolean);

    return lines.join("\n");
  } else {
    const lines = [
      `display: flex;`,
      `flex-direction: ${cfg.flexDirection};`,
      `flex-wrap: ${cfg.flexWrap};`,
      `justify-content: ${cfg.justifyContent};`,
      `align-items: ${cfg.alignItems};`,
      `gap: ${cfg.rowGap}px ${cfg.colGap}px;`,
      cfg.padding ? `padding: ${cfg.padding}px;` : null,
    ].filter(Boolean);

    if (cfg.flexWrap !== "nowrap" && cfg.minItemWidth > 0) {
      lines.push(`/* Item: flex: 0 0 ${cfg.minItemWidth}px; */`);
    }

    return lines.join("\n");
  }
}

function generateResponsiveCSS(cfg: GridConfig): string {
  const base = generateCSS(cfg);
  const maxWidth = cfg.contentWidth === "full" ? null : `max-width: ${cfg.contentWidth}px;\n  margin-inline: auto;`;

  if (cfg.mode === "flex") {
    const wrapperLines = maxWidth ? `\n.wrapper {\n  ${maxWidth}\n  width: 100%;\n}\n\n` : "";
    return `${wrapperLines}.container {\n  ${base.split("\n").join("\n  ")}\n}\n\n.item {\n  ${cfg.flexWrap !== "nowrap" && cfg.minItemWidth > 0 ? `flex: 0 0 ${cfg.minItemWidth}px;\n  min-width: 0;` : "flex: 1 1 auto;\n  min-width: 0;"}\n}`;
  }

  const mobileCols = Math.max(1, Math.min(2, cfg.columns));
  const tabletCols = Math.max(1, Math.ceil(cfg.columns / 2));
  const wrapperLines = maxWidth ? `\n.wrapper {\n  ${maxWidth}\n  width: 100%;\n}\n\n` : "";

  return `${wrapperLines}.container {\n  ${base.split("\n").join("\n  ")}\n}\n\n/* Tablet (≤ 768px) */\n@media (max-width: 768px) {\n  .container {\n    grid-template-columns: repeat(${tabletCols}, 1fr);\n  }\n}\n\n/* Mobile (≤ 480px) */\n@media (max-width: 480px) {\n  .container {\n    grid-template-columns: repeat(${mobileCols}, 1fr);\n  }\n}`;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function Slider({ label, value, min, max, step = 1, unit = "px", onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "monospace", background: "var(--surface-2)", padding: "2px 8px", borderRadius: 6 }}>
          {value}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

function Select<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 13, cursor: "pointer" }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button onClick={copy}
      style={{ padding: "6px 14px", borderRadius: 7, background: copied ? "#22c55e22" : "var(--surface-2)", border: `1px solid ${copied ? "#22c55e55" : "var(--border)"}`, color: copied ? "#22c55e" : "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
      {copied ? "✓ Copiado" : "Copiar CSS"}
    </button>
  );
}

// ─── Grid Preview ─────────────────────────────────────────────────────────────

const ITEM_COLORS = ["#6366f1", "#0ea5e9", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#f43f5e", "#a855f7", "#06b6d4", "#84cc16", "#fb923c"];

function GridPreview({ cfg, scale = 1 }: { cfg: GridConfig; scale?: number }) {
  const items = Array.from({ length: cfg.itemCount }, (_, i) => i);

  const containerStyle: React.CSSProperties = cfg.mode === "grid"
    ? {
      display: "grid",
      gridTemplateColumns: cfg.useCustomTemplate ? cfg.customColTemplate : `repeat(${cfg.columns}, 1fr)`,
      gridTemplateRows: cfg.useCustomTemplate && cfg.customRowTemplate ? cfg.customRowTemplate : cfg.rows > 1 ? `repeat(${cfg.rows}, 1fr)` : undefined,
      columnGap: cfg.colGap,
      rowGap: cfg.rowGap,
      padding: cfg.padding,
      width: "100%",
      minHeight: 120,
    }
    : {
      display: "flex",
      flexDirection: cfg.flexDirection,
      flexWrap: cfg.flexWrap,
      justifyContent: cfg.justifyContent,
      alignItems: cfg.alignItems,
      gap: `${cfg.rowGap}px ${cfg.colGap}px`,
      padding: cfg.padding,
      width: "100%",
      minHeight: 120,
    };

  return (
    <div style={containerStyle}>
      {items.map((i) => (
        <div key={i} style={{
          background: ITEM_COLORS[i % ITEM_COLORS.length] + "33",
          border: `2px solid ${ITEM_COLORS[i % ITEM_COLORS.length]}66`,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12 * scale,
          fontWeight: 700,
          color: ITEM_COLORS[i % ITEM_COLORS.length],
          minHeight: 52,
          ...(cfg.mode === "flex" && cfg.flexWrap !== "nowrap" && cfg.minItemWidth > 0
            ? { flex: `0 0 ${cfg.minItemWidth}px`, minWidth: 0 }
            : cfg.mode === "flex" ? { flex: "1 1 auto", minWidth: 0 } : {}),
        }}>
          {i + 1}
        </div>
      ))}
    </div>
  );
}

// ─── Responsive Analysis ──────────────────────────────────────────────────────

function ResponsivePanel({ cfg }: { cfg: GridConfig }) {
  const [activeVp, setActiveVp] = useState<Viewport>("desktop");

  const getColsForVp = (vp: Viewport) => {
    if (cfg.mode === "flex") return null;
    if (vp === "mobile") return Math.max(1, Math.min(2, cfg.columns));
    if (vp === "tablet") return Math.max(1, Math.ceil(cfg.columns / 2));
    return cfg.columns;
  };

  const vpCfg = (vp: Viewport): GridConfig => {
    const cols = getColsForVp(vp);
    if (!cols || vp === "desktop") return cfg;
    return { ...cfg, columns: cols };
  };

  const currentVp = VIEWPORTS.find((v) => v.id === activeVp)!;

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Análise de Responsividade</span>
        <div style={{ display: "flex", gap: 6 }}>
          {VIEWPORTS.map((vp) => (
            <button key={vp.id} onClick={() => setActiveVp(vp.id)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                background: activeVp === vp.id ? "var(--accent)" : "var(--surface-2)",
                border: `1px solid ${activeVp === vp.id ? "var(--accent)" : "var(--border)"}`,
                color: activeVp === vp.id ? "#fff" : "var(--text-muted)",
              }}>
              {vp.icon} {vp.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", padding: "4px 10px", borderRadius: 6, fontFamily: "monospace" }}>
            {currentVp.width}px
          </span>
          {cfg.mode === "grid" && activeVp !== "desktop" && (
            <span style={{ fontSize: 11, color: "#0ea5e9", background: "#0ea5e922", padding: "4px 10px", borderRadius: 6, fontFamily: "monospace", border: "1px solid #0ea5e944" }}>
              {getColsForVp(activeVp)} colunas
            </span>
          )}
          {cfg.mode === "grid" && activeVp === "desktop" && (
            <span style={{ fontSize: 11, color: "#22c55e", background: "#22c55e22", padding: "4px 10px", borderRadius: 6, fontFamily: "monospace", border: "1px solid #22c55e44" }}>
              {cfg.columns} colunas
            </span>
          )}
        </div>

        {/* Simulação visual do viewport */}
        <div style={{
          width: "100%", overflow: "hidden", borderRadius: 10,
          border: "2px solid var(--border)", background: "var(--surface-2)",
          position: "relative",
        }}>
          {/* Barra de "browser" */}
          <div style={{ height: 28, background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 6, padding: "0 12px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            <div style={{ flex: 1, height: 14, background: "var(--surface-2)", borderRadius: 4, marginLeft: 8 }} />
          </div>

          <div style={{ padding: 12, minHeight: 140 }}>
            <GridPreview cfg={vpCfg(activeVp)} scale={0.85} />
          </div>
        </div>

        {/* Comparativo de breakpoints */}
        {cfg.mode === "grid" && (
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {VIEWPORTS.map((vp) => {
              const cols = getColsForVp(vp.id) ?? cfg.columns;
              const isActive = vp.id === activeVp;
              return (
                <div key={vp.id} onClick={() => setActiveVp(vp.id)}
                  style={{
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
                    background: isActive ? "var(--accent)11" : "var(--surface-2)",
                    border: `1px solid ${isActive ? "var(--accent)55" : "var(--border)"}`,
                  }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{vp.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? "var(--accent)" : "var(--text)" }}>{vp.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>{vp.width}px</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? "var(--accent)" : "var(--text)", marginTop: 4 }}>
                    {cols} col{cols !== 1 ? "s" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: { label: string; icon: string; cfg: Partial<GridConfig> }[] = [
  { label: "Blog", icon: "📰", cfg: { mode: "grid", columns: 3, rows: 1, colGap: 24, rowGap: 24, itemCount: 6, useCustomTemplate: false } },
  { label: "Cards", icon: "🃏", cfg: { mode: "grid", columns: 4, rows: 1, colGap: 16, rowGap: 16, itemCount: 8, useCustomTemplate: false } },
  { label: "Dashboard", icon: "📊", cfg: { mode: "grid", columns: 12, rows: 1, colGap: 16, rowGap: 16, itemCount: 12, useCustomTemplate: false } },
  { label: "Galeria", icon: "🖼️", cfg: { mode: "grid", columns: 3, rows: 1, colGap: 8, rowGap: 8, itemCount: 9, useCustomTemplate: false } },
  { label: "Flex Row", icon: "↔️", cfg: { mode: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "stretch", colGap: 16, rowGap: 16, itemCount: 6, minItemWidth: 200 } },
  { label: "Flex Center", icon: "⬛", cfg: { mode: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center", alignItems: "center", colGap: 12, rowGap: 12, itemCount: 4, minItemWidth: 0 } },
  { label: "Auto-fill", icon: "🔲", cfg: { mode: "grid", columns: 4, rows: 1, colGap: 16, rowGap: 16, itemCount: 8, useCustomTemplate: true, customColTemplate: "repeat(auto-fill, minmax(150px, 1fr))", customRowTemplate: "" } },
  { label: "Sidebar", icon: "📋", cfg: { mode: "grid", columns: 2, rows: 1, colGap: 24, rowGap: 0, itemCount: 2, useCustomTemplate: true, customColTemplate: "280px 1fr", customRowTemplate: "" } },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const DEFAULT_CFG: GridConfig = {
  mode: "grid",
  columns: 3,
  rows: 1,
  colGap: 16,
  rowGap: 16,
  customColTemplate: "repeat(3, 1fr)",
  customRowTemplate: "",
  useCustomTemplate: false,
  padding: 0,
  itemCount: 6,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "stretch",
  minItemWidth: 180,
  contentWidth: 1280,
  marginTop: 0,
  marginBottom: 0,
  marginInline: 0,
};

export default function GridLayoutsPage() {
  const [cfg, setCfg] = useState<GridConfig>(DEFAULT_CFG);
  const [activeTab, setActiveTab] = useState<"preview" | "responsive" | "code">("preview");

  const update = useCallback(<K extends keyof GridConfig>(key: K, value: GridConfig[K]) => {
    setCfg((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyPreset = (preset: Partial<GridConfig>) => {
    setCfg((prev) => ({ ...prev, ...preset }));
  };

  const css = generateCSS(cfg);
  const responsiveCSS = generateResponsiveCSS(cfg);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          📐 Grid & Layout Builder
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
          Crie layouts CSS Grid e Flexbox com controle de espaçamentos, análise de responsividade e geração de código.
        </p>
      </div>

      {/* Presets */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Presets rápidos</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => applyPreset(p.cfg)}
              style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{p.icon}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
        {/* ── Painel de controles ────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Modo */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Modo de layout</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {(["grid", "flex"] as GridMode[]).map((m) => (
                <button key={m} onClick={() => update("mode", m)}
                  style={{
                    padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                    background: cfg.mode === m ? "var(--accent)" : "var(--surface-2)",
                    border: `1px solid ${cfg.mode === m ? "var(--accent)" : "var(--border)"}`,
                    color: cfg.mode === m ? "#fff" : "var(--text)",
                  }}>
                  {m === "grid" ? "⊞ CSS Grid" : "↔ Flexbox"}
                </button>
              ))}
            </div>
          </div>

          {/* Controles de Grid */}
          {cfg.mode === "grid" && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>CSS Grid</div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" id="custom-template" checked={cfg.useCustomTemplate}
                  onChange={(e) => update("useCustomTemplate", e.target.checked)}
                  style={{ accentColor: "var(--accent)", width: 14, height: 14 }} />
                <label htmlFor="custom-template" style={{ fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>Template customizado</label>
              </div>

              {cfg.useCustomTemplate ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>grid-template-columns</label>
                    <input type="text" value={cfg.customColTemplate}
                      onChange={(e) => update("customColTemplate", e.target.value)}
                      placeholder="repeat(3, 1fr)"
                      style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 12, fontFamily: "monospace", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>grid-template-rows (opcional)</label>
                    <input type="text" value={cfg.customRowTemplate}
                      onChange={(e) => update("customRowTemplate", e.target.value)}
                      placeholder="auto"
                      style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 12, fontFamily: "monospace", boxSizing: "border-box" }} />
                  </div>
                </div>
              ) : (
                <>
                  <Slider label="Colunas" value={cfg.columns} min={1} max={12} unit="" onChange={(v) => update("columns", v)} />
                  <Slider label="Linhas" value={cfg.rows} min={1} max={6} unit="" onChange={(v) => update("rows", v)} />
                </>
              )}
            </div>
          )}

          {/* Controles de Flex */}
          {cfg.mode === "flex" && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Flexbox</div>
              <Select label="flex-direction" value={cfg.flexDirection} onChange={(v) => update("flexDirection", v)}
                options={[{ value: "row", label: "row" }, { value: "column", label: "column" }]} />
              <Select label="flex-wrap" value={cfg.flexWrap} onChange={(v) => update("flexWrap", v)}
                options={[{ value: "nowrap", label: "nowrap" }, { value: "wrap", label: "wrap" }, { value: "wrap-reverse", label: "wrap-reverse" }]} />
              <Select label="justify-content" value={cfg.justifyContent} onChange={(v) => update("justifyContent", v)}
                options={[
                  { value: "flex-start", label: "flex-start" },
                  { value: "flex-end", label: "flex-end" },
                  { value: "center", label: "center" },
                  { value: "space-between", label: "space-between" },
                  { value: "space-around", label: "space-around" },
                  { value: "space-evenly", label: "space-evenly" },
                ]} />
              <Select label="align-items" value={cfg.alignItems} onChange={(v) => update("alignItems", v)}
                options={[
                  { value: "flex-start", label: "flex-start" },
                  { value: "flex-end", label: "flex-end" },
                  { value: "center", label: "center" },
                  { value: "stretch", label: "stretch" },
                  { value: "baseline", label: "baseline" },
                ]} />
              {cfg.flexWrap !== "nowrap" && (
                <Slider label="Largura mínima do item" value={cfg.minItemWidth} min={80} max={400} onChange={(v) => update("minItemWidth", v)} />
              )}
            </div>
          )}

          {/* Espaçamentos */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Espaçamentos</div>
            <Slider label="Gap horizontal (column-gap)" value={cfg.colGap} min={0} max={64} onChange={(v) => update("colGap", v)} />
            <Slider label="Gap vertical (row-gap)" value={cfg.rowGap} min={0} max={64} onChange={(v) => update("rowGap", v)} />
            <Slider label="Padding do container" value={cfg.padding} min={0} max={64} onChange={(v) => update("padding", v)} />
            <div style={{ height: 1, background: "var(--border)", marginBlock: 2 }} />
            <Slider label="Margem lateral (inline)" value={cfg.marginInline} min={0} max={120} onChange={(v) => update("marginInline", v)} />
            <Slider label="Margem superior (top)" value={cfg.marginTop} min={0} max={120} onChange={(v) => update("marginTop", v)} />
            <Slider label="Margem inferior (bottom)" value={cfg.marginBottom} min={0} max={120} onChange={(v) => update("marginBottom", v)} />
          </div>

          {/* Largura do conteúdo */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Largura do conteúdo</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {CONTENT_WIDTHS.map((cw) => {
                const active = cfg.contentWidth === cw.value;
                return (
                  <button key={String(cw.value)} onClick={() => update("contentWidth", cw.value)}
                    style={{
                      padding: "8px 10px", borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                      background: active ? "var(--accent)" : "var(--surface-2)",
                      border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                      color: active ? "#fff" : "var(--text)",
                    }}>
                    <div style={{ fontFamily: "monospace" }}>{cw.label}</div>
                    <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 400, marginTop: 1 }}>{cw.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Itens */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Preview</div>
            <Slider label="Número de itens" value={cfg.itemCount} min={1} max={24} unit="" onChange={(v) => update("itemCount", v)} />
          </div>
        </div>

        {/* ── Painel direito ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 4 }}>
            {(["preview", "responsive", "code"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: "8px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                  background: activeTab === tab ? "var(--accent)" : "transparent",
                  border: "none",
                  color: activeTab === tab ? "#fff" : "var(--text-muted)",
                }}>
                {tab === "preview" ? "⬛ Preview" : tab === "responsive" ? "📱 Responsividade" : "📋 Código CSS"}
              </button>
            ))}
          </div>

          {activeTab === "preview" && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Preview do Layout</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", padding: "3px 8px", borderRadius: 5, fontFamily: "monospace" }}>
                    {cfg.mode === "grid"
                      ? (cfg.useCustomTemplate ? cfg.customColTemplate : `repeat(${cfg.columns}, 1fr)`)
                      : `flex ${cfg.flexDirection}`}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", padding: "3px 8px", borderRadius: 5, fontFamily: "monospace" }}>
                    gap: {cfg.colGap}×{cfg.rowGap}
                  </span>
                  <span style={{ fontSize: 11, color: "#0ea5e9", background: "#0ea5e922", padding: "3px 8px", borderRadius: 5, fontFamily: "monospace", border: "1px solid #0ea5e944" }}>
                    max: {cfg.contentWidth === "full" ? "100%" : `${cfg.contentWidth}px`}
                  </span>
                </div>
              </div>

              {/* Régua de referência */}
              <div style={{ height: 20, background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 8px", overflow: "hidden" }}>
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} style={{ flex: 1, height: "100%", borderLeft: i > 0 ? "1px solid var(--border)" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 8, color: "var(--text-muted)", userSelect: "none" }}>{i * 5}%</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: 20, background: "repeating-linear-gradient(0deg, transparent, transparent 23px, var(--border) 23px, var(--border) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, var(--border) 23px, var(--border) 24px)" }}>
                {/* Wrapper com max-width simulado — escala relativa ao container */}
                <div style={{
                  maxWidth: cfg.contentWidth === "full" ? "100%" : `min(100%, ${cfg.contentWidth}px)`,
                  marginInline: cfg.marginInline > 0 ? `${cfg.marginInline}px` : "auto",
                  marginTop: cfg.marginTop > 0 ? cfg.marginTop : undefined,
                  marginBottom: cfg.marginBottom > 0 ? cfg.marginBottom : undefined,
                  position: "relative",
                }}>
                  {cfg.contentWidth !== "full" && (
                    <div style={{
                      position: "absolute", top: -18, left: 0, right: 0,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div style={{ height: 1, flex: 1, background: "#0ea5e966", borderTop: "1px dashed #0ea5e966" }} />
                      <span style={{ fontSize: 9, color: "#0ea5e9", background: "var(--surface-2)", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", whiteSpace: "nowrap", margin: "0 6px" }}>
                        max-width: {cfg.contentWidth}px
                      </span>
                      <div style={{ height: 1, flex: 1, background: "#0ea5e966", borderTop: "1px dashed #0ea5e966" }} />
                    </div>
                  )}
                  <GridPreview cfg={cfg} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "responsive" && <ResponsivePanel cfg={cfg} />}

          {activeTab === "code" && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Código CSS Gerado</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <CopyButton text={css} />
                  <CopyButton text={responsiveCSS} />
                </div>
              </div>

              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Wrapper CSS */}
                {(cfg.contentWidth !== "full" || cfg.marginTop > 0 || cfg.marginBottom > 0 || cfg.marginInline > 0) && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#0ea5e9", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                      Wrapper{cfg.contentWidth !== "full" ? ` — ${cfg.contentWidth}px` : ""}{(cfg.marginTop > 0 || cfg.marginBottom > 0 || cfg.marginInline > 0) ? " + margens" : ""}
                    </div>
                    <pre style={{
                      background: "#0ea5e908", borderRadius: 10, padding: 16, fontSize: 13, fontFamily: "monospace", color: "var(--text)", lineHeight: 1.7,
                      overflowX: "auto", margin: 0, border: "1px solid #0ea5e933",
                    }}>
                      {`.wrapper {\n  ${generateWrapperCSS(cfg).split("\n").join("\n  ")}\n}`}
                    </pre>
                  </div>
                )}

                {/* CSS simples */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>CSS básico — .container</div>
                  <pre style={{
                    background: "var(--surface-2)", borderRadius: 10, padding: 16, fontSize: 13, fontFamily: "monospace", color: "var(--text)", lineHeight: 1.7,
                    overflowX: "auto", margin: 0, border: "1px solid var(--border)",
                  }}>
                    {`.container {\n  ${css.split("\n").join("\n  ")}\n}`}
                  </pre>
                </div>

                {/* CSS responsivo */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>CSS responsivo com media queries</div>
                  <pre style={{
                    background: "var(--surface-2)", borderRadius: 10, padding: 16, fontSize: 13, fontFamily: "monospace", color: "var(--text)", lineHeight: 1.7,
                    overflowX: "auto", margin: 0, border: "1px solid var(--border)",
                  }}>
                    {responsiveCSS}
                  </pre>
                </div>

                {/* Dicas */}
                <div style={{ background: "var(--surface-2)", borderRadius: 10, padding: 14, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>💡 Dicas</div>
                  <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 5 }}>
                    {cfg.mode === "grid" ? [
                      "Use repeat(auto-fill, minmax(200px, 1fr)) para grids totalmente responsivos sem media queries.",
                      "grid-template-areas permite nomear células e criar layouts complexos semanticamente.",
                      "gap é shorthand para row-gap e column-gap — suportado em todos os browsers modernos.",
                    ] : [
                      "flex-wrap: wrap com flex-basis define colunas que quebram automaticamente.",
                      "Use gap ao invés de margin nos itens — funciona melhor com wrap.",
                      "align-self no item sobrescreve o align-items do container.",
                    ].map((tip, i) => (
                      <li key={i} style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 300px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
