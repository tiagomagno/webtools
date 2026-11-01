"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import PageHeader from "../../components/PageHeader";
import {
  AlignCenterHorizontal, ArrowsHorizontal, ArrowsLeftRight, Cards, ChartBar, Check, Code, Copy, CaretDown, Desktop, DeviceMobile, DeviceTablet, Eye, GridFour,
  Images, Lightbulb, Newspaper, SidebarSimple, Swatches, type Icon,
} from "@phosphor-icons/react";

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

const VIEWPORTS: { id: Viewport; label: string; width: number; icon: Icon }[] = [
  { id: "mobile", label: "Mobile", width: 375, icon: DeviceMobile },
  { id: "tablet", label: "Tablet", width: 768, icon: DeviceTablet },
  { id: "desktop", label: "Desktop", width: 1280, icon: Desktop },
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

// ─── Grid Preview ─────────────────────────────────────────────────────────────

function GridPreview({ cfg, scale = 1, containerRef }: { cfg: GridConfig; scale?: number; containerRef?: React.Ref<HTMLDivElement> }) {
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
    <div ref={containerRef} style={containerStyle}>
      {items.map((i) => (
        <div key={i} style={{
          background: "color-mix(in srgb, var(--accent-strong) 16%, transparent)",
          border: "2px solid color-mix(in srgb, var(--accent-strong) 55%, transparent)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12 * scale,
          fontWeight: 700,
          color: "var(--accent-text)",
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

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: { label: string; icon: Icon; cfg: Partial<GridConfig> }[] = [
  { label: "Blog", icon: Newspaper, cfg: { mode: "grid", columns: 3, rows: 1, colGap: 24, rowGap: 24, itemCount: 6, useCustomTemplate: false } },
  { label: "Cards", icon: Cards, cfg: { mode: "grid", columns: 4, rows: 1, colGap: 16, rowGap: 16, itemCount: 8, useCustomTemplate: false } },
  { label: "Dashboard", icon: ChartBar, cfg: { mode: "grid", columns: 12, rows: 1, colGap: 16, rowGap: 16, itemCount: 12, useCustomTemplate: false } },
  { label: "Galeria", icon: Images, cfg: { mode: "grid", columns: 3, rows: 1, colGap: 8, rowGap: 8, itemCount: 9, useCustomTemplate: false } },
  { label: "Flex Row", icon: ArrowsLeftRight, cfg: { mode: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "stretch", colGap: 16, rowGap: 16, itemCount: 6, minItemWidth: 200 } },
  { label: "Flex Center", icon: AlignCenterHorizontal, cfg: { mode: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "center", alignItems: "center", colGap: 12, rowGap: 12, itemCount: 4, minItemWidth: 0 } },
  { label: "Auto-fill", icon: GridFour, cfg: { mode: "grid", columns: 4, rows: 1, colGap: 16, rowGap: 16, itemCount: 8, useCustomTemplate: true, customColTemplate: "repeat(auto-fill, minmax(150px, 1fr))", customRowTemplate: "" } },
  { label: "Sidebar", icon: SidebarSimple, cfg: { mode: "grid", columns: 2, rows: 1, colGap: 24, rowGap: 0, itemCount: 2, useCustomTemplate: true, customColTemplate: "280px 1fr", customRowTemplate: "" } },
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

// ─── Componentes de interface ─────────────────────────────────────────────────

const mono = "var(--font-kode), ui-monospace, monospace";
const sectionTitle: React.CSSProperties = { fontFamily: mono, fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 12px" };
const divider: React.CSSProperties = { borderTop: "1px solid var(--border)", paddingTop: 20 };
const fieldLabel: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "var(--text-muted)" };
const chip = (active: boolean): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8,
  border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`, background: active ? "var(--accent-strong)" : "var(--surface)", color: active ? "#fff" : "var(--text)",
});
const selectStyle: React.CSSProperties = { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", color: "var(--text)", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%", minWidth: 0 };
const codeBox: React.CSSProperties = { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, fontSize: 12, fontFamily: mono, color: "var(--text)", lineHeight: 1.7, overflowX: "auto", margin: 0 };
const tag: React.CSSProperties = { fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", padding: "3px 8px", borderRadius: 6, fontFamily: mono };

function Select<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <span style={fieldLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} style={selectStyle}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };
  return (
    <button type="button" onClick={copy} style={{ ...chip(false), minHeight: 32, padding: "6px 12px", background: copied ? "#16a34a" : "var(--surface)", color: copied ? "#fff" : "var(--text)", borderColor: copied ? "#16a34a" : "var(--border)" }}>
      {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />} {copied ? "Copiado" : label}
    </button>
  );
}

// ─── Responsividade ───────────────────────────────────────────────────────────

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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div role="group" aria-label="Tamanho da tela" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {VIEWPORTS.map(({ id, label, width, icon: Icon }) => (
          <button key={id} type="button" aria-pressed={activeVp === id} onClick={() => setActiveVp(id)} style={chip(activeVp === id)}>
            <Icon size={16} /> {label} <span style={{ fontFamily: mono, opacity: 0.75 }}>{width}px</span>
          </button>
        ))}
        {cfg.mode === "grid" && <span style={{ ...tag, marginLeft: "auto" }}>{getColsForVp(activeVp)} {getColsForVp(activeVp) === 1 ? "coluna" : "colunas"}</span>}
      </div>

      <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "var(--surface-2)" }}>
        <div style={{ height: 28, background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 6, padding: "0 12px" }} aria-hidden="true">
          {["#ef4444", "#eab308", "#22c55e"].map((c) => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
          <div style={{ flex: 1, height: 14, background: "var(--surface-2)", borderRadius: 4, marginLeft: 8 }} />
        </div>
        <div style={{ padding: 12, minHeight: 140 }}>
          <div style={{ maxWidth: Math.min(currentVp.width, 1280), margin: "0 auto" }}>
            <GridPreview cfg={vpCfg(activeVp)} scale={0.85} />
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

type Tab = "preview" | "responsive" | "code";
const TABS: { id: Tab; label: string; icon: typeof Eye }[] = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "responsive", label: "Responsividade", icon: DeviceMobile },
  { id: "code", label: "Código CSS", icon: Code },
];

const FLEX_JUSTIFY: JustifyContent[] = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"];
const FLEX_ALIGN: AlignItems[] = ["flex-start", "flex-end", "center", "stretch", "baseline"];
const asOptions = <T extends string>(values: T[]) => values.map((v) => ({ value: v, label: v }));

const small = (active: boolean): React.CSSProperties => ({ ...chip(active), minHeight: 32, padding: "6px 10px" });
const linkButton: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: 0, fontSize: 12, fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: "var(--accent-text)" };
const menuItem: React.CSSProperties = { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", fontSize: 12, fontWeight: 600, textAlign: "left", background: "none", border: "none", borderRadius: 6, cursor: "pointer", color: "var(--text)" };
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const GAP_STEPS = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64];

/** Lista de números para escolher; se o valor atual (de um preset, por exemplo) não está na lista, ele entra. */
function NumberSelect({ label, value, options, unit = "", onChange }: { label: string; value: number; options: number[]; unit?: string; onChange: (v: number) => void }) {
  const list = options.includes(value) ? options : [...options, value].sort((a, b) => a - b);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <span style={fieldLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} style={selectStyle}>
        {list.map((n) => <option key={n} value={n}>{n}{unit}</option>)}
      </select>
    </label>
  );
}

/** Campo para digitar um valor em pixels. */
function NumberField({ label, value, min = 0, onChange }: { label: string; value: number; min?: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <span style={fieldLabel}>{label}</span>
      <span style={{ position: "relative", display: "block" }}>
        <input type="number" min={min} value={value} onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          style={{ ...selectStyle, fontFamily: mono, cursor: "text", paddingRight: 28 }} />
        <span aria-hidden="true" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--text-muted)", pointerEvents: "none" }}>px</span>
      </span>
    </label>
  );
}

// ─── Medidas sobre o preview (estilo Figma) ───────────────────────────────────

interface MeasureBox { x: number; y: number; w: number; h: number; label: string }
const MEASURE = "#f24822";

/** Faixas vermelhas com o valor em px sobre gap, padding e margens, medidas no próprio preview. */
function MeasureOverlay({ cfg, areaRef, wrapperRef, containerRef }: {
  cfg: GridConfig;
  areaRef: React.RefObject<HTMLDivElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [boxes, setBoxes] = useState<MeasureBox[]>([]);

  useEffect(() => {
    const area = areaRef.current, wrap = wrapperRef.current, cont = containerRef.current;
    if (!area || !wrap || !cont) return;
    const measure = () => {
      const a = area.getBoundingClientRect();
      const rel = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - a.left + area.scrollLeft, y: r.top - a.top + area.scrollTop, w: r.width, h: r.height };
      };
      const out: MeasureBox[] = [];
      const add = (x: number, y: number, w: number, h: number, value = Math.round(Math.min(w, h))) => { if (w > 0.5 && h > 0.5) out.push({ x, y, w, h, label: String(value) }); };
      const wr = rel(wrap), c = rel(cont);
      const items = Array.from(cont.children).map(rel);
      const first = items[0];
      if (first && items.length > 1) {
        const side = items.find((it, i) => i > 0 && Math.abs(it.y - first.y) < 2 && it.x >= first.x + first.w - 0.5);
        if (side) add(first.x + first.w, first.y, side.x - first.x - first.w, first.h);
        const below = items.find((it, i) => i > 0 && it.y >= first.y + first.h - 0.5 && it.x < first.x + first.w && it.x + it.w > first.x);
        if (below) add(first.x, first.y + first.h, first.w, below.y - first.y - first.h);
      }
      if (cfg.padding > 0) {
        add(c.x, c.y, c.w, cfg.padding, cfg.padding);
        add(c.x, c.y + cfg.padding, cfg.padding, Math.max(0, Math.min(c.h - 2 * cfg.padding, 48)), cfg.padding);
      }
      if (cfg.marginTop > 0) add(wr.x, wr.y - 18 - cfg.marginTop, wr.w, cfg.marginTop, cfg.marginTop);
      if (cfg.marginBottom > 0) add(wr.x, wr.y + wr.h, wr.w, cfg.marginBottom, cfg.marginBottom);
      if (cfg.marginInline > 0) {
        add(wr.x - cfg.marginInline, wr.y, cfg.marginInline, wr.h, cfg.marginInline);
        add(wr.x + wr.w, wr.y, cfg.marginInline, wr.h, cfg.marginInline);
      }
      setBoxes(out);
    };
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    observer.observe(cont);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [cfg, areaRef, wrapperRef, containerRef]);

  return (
    <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, overflow: "visible", pointerEvents: "none" }}>
      {boxes.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, boxSizing: "border-box", background: "rgba(242,72,34,0.2)", border: "1px solid rgba(242,72,34,0.7)" }}>
          <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", background: MEASURE, color: "#fff", fontSize: 9, fontFamily: mono, lineHeight: "13px", padding: "0 4px", borderRadius: 3, whiteSpace: "nowrap" }}>{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function GridLayoutsPage() {
  const [cfg, setCfg] = useState<GridConfig>(DEFAULT_CFG);
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [presetsOpen, setPresetsOpen] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const update = useCallback(<K extends keyof GridConfig>(key: K, value: GridConfig[K]) => {
    setCfg((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (!presetsOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPresetsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presetsOpen]);

  const css = generateCSS(cfg);
  const responsiveCSS = generateResponsiveCSS(cfg);
  const hasWrapper = cfg.contentWidth !== "full" || cfg.marginTop > 0 || cfg.marginBottom > 0 || cfg.marginInline > 0;

  const headerActions = (
    <>
      {([["grid", "CSS Grid", GridFour], ["flex", "Flexbox", ArrowsHorizontal]] as const).map(([m, text, Icon]) => (
        <button key={m} type="button" aria-pressed={cfg.mode === m} onClick={() => update("mode", m)} style={chip(cfg.mode === m)}>
          <Icon size={16} /> {text}
        </button>
      ))}
    </>
  );

  return (
    <div className="gl-root">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Design", href: "/categoria/design" }, { label: "Layouts" }]} />
      <PageHeader title="Layouts" actions={headerActions}>
        Monte layouts com CSS Grid ou Flexbox, veja como ficam em cada tela e copie o código pronto.
      </PageHeader>

      <div className="gl-grid">
        {/* Resultado */}
        <div className="cut-box gl-sticky" style={{ padding: 16, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div role="tablist" aria-label="Visualização" style={{ display: "flex", gap: 20, flexWrap: "wrap", borderBottom: "1px solid var(--border)" }}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button key={id} role="tab" aria-selected={active} type="button" onClick={() => setActiveTab(id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 0", marginBottom: -1, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "none", border: "none", borderBottom: `2px solid ${active ? "var(--text)" : "transparent"}`, color: active ? "var(--text)" : "var(--text-muted)" }}>
                  <Icon size={18} /> {label}
                </button>
              );
            })}
          </div>

          {activeTab === "preview" && (
            <>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={tag}>{cfg.mode === "grid" ? (cfg.useCustomTemplate ? cfg.customColTemplate : `repeat(${cfg.columns}, 1fr)`) : `flex ${cfg.flexDirection}`}</span>
                <span style={tag}>gap: {cfg.colGap}×{cfg.rowGap}</span>
                <span style={{ ...tag, color: "#0369a1", background: "#0ea5e91f" }}>max: {cfg.contentWidth === "full" ? "100%" : `${cfg.contentWidth}px`}</span>
              </div>
              <div ref={areaRef} style={{ position: "relative", padding: 20, border: "1px solid var(--border)", borderRadius: 8, background: "repeating-linear-gradient(0deg, transparent, transparent 23px, var(--border) 23px, var(--border) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, var(--border) 23px, var(--border) 24px)", backgroundColor: "var(--surface-2)", overflowX: "auto" }}>
                <div ref={wrapperRef} style={{
                  maxWidth: cfg.contentWidth === "full" ? "100%" : `min(100%, ${cfg.contentWidth}px)`,
                  marginInline: cfg.marginInline > 0 ? `${cfg.marginInline}px` : "auto",
                  marginTop: cfg.marginTop > 0 ? cfg.marginTop + 18 : 18,
                  marginBottom: cfg.marginBottom > 0 ? cfg.marginBottom : undefined,
                  position: "relative",
                }}>
                  {cfg.contentWidth !== "full" && (
                    <div style={{ position: "absolute", top: -18, left: 0, right: 0, display: "flex", alignItems: "center" }} aria-hidden="true">
                      <div style={{ flex: 1, borderTop: "1px dashed #0ea5e999" }} />
                      <span style={{ fontSize: 10, color: "#0369a1", background: "var(--surface-2)", padding: "1px 6px", fontFamily: mono, whiteSpace: "nowrap", margin: "0 6px" }}>max-width: {cfg.contentWidth}px</span>
                      <div style={{ flex: 1, borderTop: "1px dashed #0ea5e999" }} />
                    </div>
                  )}
                  <GridPreview cfg={cfg} containerRef={containerRef} />
                </div>
                <MeasureOverlay cfg={cfg} areaRef={areaRef} wrapperRef={wrapperRef} containerRef={containerRef} />
              </div>
            </>
          )}

          {activeTab === "responsive" && <ResponsivePanel cfg={cfg} />}

          {activeTab === "code" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {hasWrapper && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ ...fieldLabel, color: "var(--text)" }}>Wrapper{cfg.contentWidth !== "full" ? ` — ${cfg.contentWidth}px` : ""}{cfg.marginTop > 0 || cfg.marginBottom > 0 || cfg.marginInline > 0 ? " + margens" : ""}</span>
                    <CopyButton text={`.wrapper {\n  ${generateWrapperCSS(cfg).split("\n").join("\n  ")}\n}`} />
                  </div>
                  <pre style={codeBox}>{`.wrapper {\n  ${generateWrapperCSS(cfg).split("\n").join("\n  ")}\n}`}</pre>
                </div>
              )}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ ...fieldLabel, color: "var(--text)" }}>CSS básico (.container)</span>
                  <CopyButton text={css} />
                </div>
                <pre style={codeBox}>{`.container {\n  ${css.split("\n").join("\n  ")}\n}`}</pre>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ ...fieldLabel, color: "var(--text)" }}>CSS responsivo com media queries</span>
                  <CopyButton text={responsiveCSS} />
                </div>
                <pre style={codeBox}>{responsiveCSS}</pre>
              </div>
              <div style={{ background: "var(--surface-2)", borderRadius: 8, padding: 14, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}><Lightbulb size={16} /> Dicas</div>
                <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 5 }}>
                  {(cfg.mode === "grid" ? [
                    "Use repeat(auto-fill, minmax(200px, 1fr)) para grids totalmente responsivos sem media queries.",
                    "grid-template-areas permite nomear células e criar layouts complexos semanticamente.",
                    "gap é a forma curta de row-gap e column-gap, aceita em todos os navegadores modernos.",
                  ] : [
                    "flex-wrap: wrap com flex-basis define colunas que quebram automaticamente.",
                    "Use gap em vez de margin nos itens: funciona melhor com wrap.",
                    "align-self no item sobrescreve o align-items do container.",
                  ]).map((t, i) => <li key={i} style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{t}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Ajustes agrupados */}
        <div className="cut-box" style={{ padding: 16, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <h2 style={{ ...sectionTitle, margin: 0 }}>{cfg.mode === "grid" ? "CSS Grid" : "Flexbox"}</h2>
              <div style={{ position: "relative" }}>
                <button type="button" aria-haspopup="menu" aria-expanded={presetsOpen} onClick={() => setPresetsOpen(!presetsOpen)} style={linkButton}>
                  <Swatches size={14} /> Presets <CaretDown size={12} />
                </button>
                {presetsOpen && (
                  <>
                    <div onClick={() => setPresetsOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                    <div role="menu" aria-label="Presets" style={{ position: "absolute", zIndex: 41, top: "calc(100% + 8px)", right: 0, width: 220, padding: 6, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}>
                      {PRESETS.map(({ label, icon: Icon, cfg: preset }) => (
                        <button key={label} role="menuitem" type="button" className="gl-menu-item" onClick={() => { setCfg((prev) => ({ ...prev, ...preset })); setPresetsOpen(false); }} style={menuItem}>
                          <Icon size={16} /> {label}
                        </button>
                      ))}
                      <div style={{ height: 1, background: "var(--border)", margin: "6px 4px" }} />
                      <button role="menuitemcheckbox" aria-checked={cfg.mode === "grid" && cfg.useCustomTemplate} type="button" className="gl-menu-item"
                        onClick={() => { setCfg((prev) => ({ ...prev, mode: "grid", useCustomTemplate: !prev.useCustomTemplate })); setPresetsOpen(false); }} style={menuItem}>
                        <GridFour size={16} /> Template customizado
                        {cfg.mode === "grid" && cfg.useCustomTemplate && <Check size={14} weight="bold" style={{ marginLeft: "auto" }} />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {cfg.mode === "grid" ? (
              cfg.useCustomTemplate ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={fieldLabel}>grid-template-columns</span>
                    <input type="text" value={cfg.customColTemplate} onChange={(e) => update("customColTemplate", e.target.value)} placeholder="repeat(3, 1fr)" style={{ ...selectStyle, fontFamily: mono, cursor: "text" }} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={fieldLabel}>grid-template-rows (opcional)</span>
                    <input type="text" value={cfg.customRowTemplate} onChange={(e) => update("customRowTemplate", e.target.value)} placeholder="auto" style={{ ...selectStyle, fontFamily: mono, cursor: "text" }} />
                  </label>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  <NumberSelect label="Colunas" value={cfg.columns} options={range(1, 12)} onChange={(v) => update("columns", v)} />
                  <NumberSelect label="Linhas" value={cfg.rows} options={range(1, 6)} onChange={(v) => update("rows", v)} />
                </div>
              )
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  <Select label="Direção" value={cfg.flexDirection} onChange={(v) => update("flexDirection", v)} options={asOptions<FlexDirection>(["row", "column"])} />
                  <Select label="Quebra de linha" value={cfg.flexWrap} onChange={(v) => update("flexWrap", v)} options={asOptions<FlexWrap>(["nowrap", "wrap", "wrap-reverse"])} />
                  <Select label="Alinhamento principal" value={cfg.justifyContent} onChange={(v) => update("justifyContent", v)} options={asOptions(FLEX_JUSTIFY)} />
                  <Select label="Alinhamento cruzado" value={cfg.alignItems} onChange={(v) => update("alignItems", v)} options={asOptions(FLEX_ALIGN)} />
                </div>
                {cfg.flexWrap !== "nowrap" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                    <NumberField label="Largura mínima do item" value={cfg.minItemWidth} min={0} onChange={(v) => update("minItemWidth", v)} />
                  </div>
                )}
              </>
            )}
          </div>

          <div style={divider}>
            <h2 style={sectionTitle}>Espaçamentos</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
              <NumberSelect label="Gap horizontal" value={cfg.colGap} options={GAP_STEPS} unit="px" onChange={(v) => update("colGap", v)} />
              <NumberSelect label="Gap vertical" value={cfg.rowGap} options={GAP_STEPS} unit="px" onChange={(v) => update("rowGap", v)} />
              <NumberSelect label="Padding" value={cfg.padding} options={GAP_STEPS} unit="px" onChange={(v) => update("padding", v)} />
            </div>
          </div>

          <div style={divider}>
            <h2 style={sectionTitle}>Largura, margens e itens</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                  <span style={fieldLabel}>Largura do conteúdo</span>
                  <select value={String(cfg.contentWidth)} onChange={(e) => update("contentWidth", e.target.value === "full" ? "full" : Number(e.target.value))} style={selectStyle}>
                    {CONTENT_WIDTHS.map((cw) => <option key={String(cw.value)} value={String(cw.value)}>{cw.label} — {cw.desc}</option>)}
                  </select>
                </label>
                <NumberSelect label="Itens" value={cfg.itemCount} options={range(1, 24)} onChange={(v) => update("itemCount", v)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                <NumberField label="Margem lateral" value={cfg.marginInline} onChange={(v) => update("marginInline", v)} />
                <NumberField label="Superior" value={cfg.marginTop} onChange={(v) => update("marginTop", v)} />
                <NumberField label="Inferior" value={cfg.marginBottom} onChange={(v) => update("marginBottom", v)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .gl-root { container-type: inline-size; }
        .gl-menu-item:hover { background: var(--surface-2) !important; }
        .gl-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; align-items: start; }
        @container (min-width: 860px) { .gl-grid { grid-template-columns: minmax(0, 1fr) 360px; } .gl-sticky { position: sticky; top: 16px; } }
        @media (max-width: 767px) { .gl-action-label { display: none; } }
      `}</style>
    </div>
  );
}
