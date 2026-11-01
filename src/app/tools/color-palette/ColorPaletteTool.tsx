"use client";

import { useEffect, useState } from "react";
import { BookmarksSimple, CircleHalf, Code, Eyedropper, Image as ImageIcon, Shuffle } from "@phosphor-icons/react";
import Breadcrumbs from "../../components/Breadcrumbs";
import PageHeader from "../../components/PageHeader";
import Modal from "../../components/Modal";
import SaveToHistory from "../../components/SaveToHistory";
import { parseHistoryPayload, readHistoryHash } from "../../lib/historico";
import { HARMONIES, harmonyColors, randomBase, type HarmonyType } from "../../lib/palette";
import ColorWheel from "./ColorWheel";
import BaseColorPicker from "./BaseColorPicker";
import HarmonyIcon from "./HarmonyIcon";
import ImageSource from "./ImageSource";
import PaletteStrips from "./PaletteStrips";
import ExportPanel from "./ExportPanel";
import LibraryPanel from "./LibraryPanel";
import UiPreview from "./UiPreview";

declare global { interface Window { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } } }

type Mode = "base" | "imagem" | "roda";
type Action = "exportar" | "biblioteca";

const MODES: { id: Mode; label: string; icon: typeof Eyedropper }[] = [
  { id: "base", label: "Cor base", icon: Eyedropper },
  { id: "imagem", label: "Imagem", icon: ImageIcon },
  { id: "roda", label: "Roda de cores", icon: CircleHalf },
];

const ACTIONS: { id: Action; label: string; icon: typeof Code; title: string }[] = [
  { id: "exportar", label: "Exportar", icon: Code, title: "Exportar a paleta como código" },
  { id: "biblioteca", label: "Biblioteca", icon: BookmarksSimple, title: "Salvar e abrir paletas neste navegador" },
];

const actionButtonStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", minHeight: 36, fontSize: 12, fontWeight: 600,
  cursor: "pointer", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", borderRadius: 8,
};

export default function ColorPaletteTool() {
  const [mode, setMode] = useState<Mode>("roda");
  const [base, setBase] = useState("#6366f1");
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("complementary");
  /** Paleta fixa (imagem, biblioteca ou histórico). Mudar a base ou a harmonia volta ao cálculo automático. */
  const [custom, setCustom] = useState<string[] | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [hasEyeDropper, setHasEyeDropper] = useState(false);

  const calculated = harmonyColors(base, harmonyType);
  const colors = custom ?? calculated.colors;
  const baseIndex = custom ? Math.max(custom.indexOf(base.toLowerCase()), 0) : calculated.baseIndex;
  const harmony = HARMONIES.find((h) => h.id === harmonyType) ?? HARMONIES[0];

  // Entrada por link: ?modo= e ?acao= (redirects das páginas antigas) e #h= (histórico da conta).
  useEffect(() => {
    setHasEyeDropper("EyeDropper" in window);
    const params = new URLSearchParams(window.location.search);
    const m = params.get("modo");
    if (m === "base" || m === "imagem" || m === "roda") setMode(m);
    const a = params.get("acao");
    if (a === "exportar" || a === "biblioteca") setAction(a);
    const raw = readHistoryHash(window.location.hash);
    const palette = parseHistoryPayload("color-palette", raw);
    if (palette) { setCustom(palette.colors); setBase(palette.colors[0]); return; }
    const single = parseHistoryPayload("conversor-cores", raw);
    if (single) { setBase(single.hex); setCustom([single.hex, ...harmonyColors(single.hex, "complementary").colors.slice(1)]); setMode("base"); }
  }, []);

  /** Roda e aleatória: a paleta inteira é recalculada pela harmonia. */
  const changeBase = (hex: string) => { setBase(hex.toLowerCase()); setCustom(null); };
  /** Cor base: só a primeira cor muda; as outras ficam como estão. */
  const changeFirstColor = (hex: string) => { const h = hex.toLowerCase(); setBase(h); setCustom([h, ...colors.slice(1)]); };
  const applyColor = mode === "base" ? changeFirstColor : changeBase;

  const randomize = () => {
    const next = HARMONIES[Math.floor(Math.random() * HARMONIES.length)].id;
    setHarmonyType(next);
    changeBase(randomBase());
    if (mode === "imagem") setMode("roda");
  };

  const pickWithEyeDropper = async () => {
    if (!window.EyeDropper) return;
    try { applyColor((await new window.EyeDropper().open()).sRGBHex); } catch { /* cancelado */ }
  };

  const closeAction = () => setAction(null);

  const headerActions = (
    <>
      <button type="button" onClick={randomize} title="Gerar uma paleta aleatória" style={{ ...actionButtonStyle, background: "var(--accent-strong)", borderColor: "var(--accent-strong)", color: "#fff" }}>
        <Shuffle size={16} /> <span className="cp-action-label">Aleatória</span>
      </button>
      {ACTIONS.map(({ id, label, icon: Icon, title }) => (
        <button key={id} type="button" onClick={() => setAction(id)} title={title} aria-label={label} style={actionButtonStyle}>
          <Icon size={16} /> <span className="cp-action-label">{label}</span>
        </button>
      ))}
    </>
  );

  return (
    <div className="cp-root">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Design", href: "/categoria/design" }, { label: "Paleta de Cores" }]} />
      <PageHeader title="Paleta de Cores" actions={headerActions}>
        Parta de uma cor, de uma imagem ou da roda e veja a paleta completa pronta para copiar.
      </PageHeader>

      <div className="cp-grid">
        {/* ── Origem da paleta ─────────────────────────────────────────────── */}
        <section aria-label="Origem da paleta" style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div role="tablist" aria-label="Como montar a paleta" style={{ display: "flex", gap: 20, borderBottom: "1px solid var(--border)" }}>
            {MODES.map(({ id, label, icon: Icon }) => {
              const active = id === mode;
              return (
                <button key={id} role="tab" aria-selected={active} type="button" onClick={() => setMode(id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 0", marginBottom: -1, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "none", border: "none", borderBottom: `2px solid ${active ? "var(--text)" : "transparent"}`, color: active ? "var(--text)" : "var(--text-muted)" }}>
                  <Icon size={18} /> {label}
                </button>
              );
            })}
          </div>

          {mode === "base" && <BaseColorPicker hex={colors[0]} onChange={changeFirstColor} hasEyeDropper={hasEyeDropper} onEyeDropper={pickWithEyeDropper} />}

          {mode === "imagem" && <ImageSource onExtract={(c) => { setCustom(c); setBase(c[0]); }} />}
          {mode === "roda" && <ColorWheel base={base} colors={colors} onChange={changeBase} />}

          {mode === "roda" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 13, color: "var(--text)" }}>
                <strong>Harmonia de cores:</strong> {harmony.label}
              </div>
              <div role="group" aria-label="Harmonia de cores" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {HARMONIES.map((h) => {
                  const active = h.id === harmonyType;
                  return (
                    <button key={h.id} type="button" aria-pressed={active} aria-label={h.label} title={h.label}
                      onClick={() => { setHarmonyType(h.id); setCustom(null); }}
                      style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `1px solid ${active ? "var(--text)" : "var(--border)"}`, background: active ? "var(--surface)" : "var(--surface-2)", color: active ? "var(--text)" : "var(--text-muted)", boxShadow: active ? "inset 0 0 0 1px var(--text)" : "none" }}>
                      <HarmonyIcon type={h.id} />
                    </button>
                  );
                })}
              </div>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "var(--text-muted)" }}>{harmony.instruction}</p>
            </div>
          )}
        </section>

        {/* ── Paleta ───────────────────────────────────────────────────────── */}
        <section aria-label="Paleta de cores" style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <PaletteStrips colors={colors} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveToHistory slug="color-palette" hideInvite getPayload={() => ({ colors })} />
          </div>
        </section>
      </div>

      <div style={{ marginTop: 24 }}>
        <UiPreview colors={colors} baseIndex={baseIndex} />
      </div>

      <Modal open={action === "exportar"} title="Exportar paleta" onClose={closeAction} width={560}>
        <ExportPanel colors={colors} />
      </Modal>
      <Modal open={action === "biblioteca"} title="Biblioteca de paletas" onClose={closeAction} width={560}>
        <LibraryPanel colors={colors} base={base} harmonyType={harmonyType}
          onLoad={({ colors: c, base: b, harmonyType: t }) => {
            setHarmonyType(t);
            setBase(b);
            setCustom(c.length > 0 ? c : null);
            closeAction();
          }} />
      </Modal>

      <style>{`
        .cp-root { container-type: inline-size; }
        .cp-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 32px; align-items: start; }
        .cp-strip { height: 220px; }
        .cp-preview-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; align-items: start; }
        @container (min-width: 820px) {
          .cp-grid { grid-template-columns: minmax(300px, 340px) minmax(0, 1fr); }
          .cp-strip { height: 380px; }
          .cp-preview-grid { grid-template-columns: minmax(0, 1fr) 320px; }
        }
        @media (max-width: 767px) { .cp-action-label { display: none; } }
      `}</style>
    </div>
  );
}
