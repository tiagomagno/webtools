"use client";

import { useState } from "react";
import {
  ArrowsClockwise, ArrowsLeftRight, Check, Code, Copy, Plus, Prohibit, Pulse, Rainbow, Shuffle, Sparkle, Swatches, Trash, Wind,
} from "@phosphor-icons/react";
import Breadcrumbs from "../../components/Breadcrumbs";
import PageHeader from "../../components/PageHeader";
import Modal from "../../components/Modal";
import {
  baseKind, buildCss, DEFAULT_ANIMATION, DEFAULT_CONFIG, gradientFunction, isRepeating, mixColor, previewCss, randomGradient, stop,
  usesAngle, type Animation, type AnimationDirection, type AnimationSettings, type Easing, type GradientConfig,
  type GradientType, type RadialShape, type RadialSize, type Stop,
} from "../../lib/gradient";
import { isValidHex } from "../../lib/palette";
import GradientBar from "./GradientBar";
import GradientExport from "./GradientExport";
import PositionPicker from "./PositionPicker";
import PresetsPanel from "./PresetsPanel";

const TYPE_LABELS: Record<GradientType, string> = {
  linear: "Linear", radial: "Radial", conic: "Cônico",
  "repeating-linear": "Rep. Linear", "repeating-radial": "Rep. Radial", "repeating-conic": "Rep. Cônico",
};

const SIZE_LABELS: Record<RadialSize, string> = {
  "farthest-corner": "Canto mais distante", "closest-corner": "Canto mais próximo", "farthest-side": "Lado mais distante", "closest-side": "Lado mais próximo",
};
const SHAPE_LABELS: Record<RadialShape, string> = { circle: "Círculo", ellipse: "Elipse" };

const ANIMATIONS: { id: Animation; label: string; desc: string; icon: typeof Prohibit }[] = [
  { id: "none", label: "Nenhuma", desc: "", icon: Prohibit },
  { id: "rotate", label: "Girar", desc: "Gira o ângulo continuamente (linear e cônico).", icon: ArrowsClockwise },
  { id: "shift", label: "Deslizar", desc: "Move o gradiente de um lado para o outro.", icon: ArrowsLeftRight },
  { id: "pulse", label: "Pulsar", desc: "A opacidade sobe e desce suavemente.", icon: Pulse },
  { id: "hue", label: "Matiz", desc: "Percorre todas as cores da roda.", icon: Rainbow },
  { id: "breathe", label: "Respirar", desc: "O gradiente aumenta e diminui, como uma respiração.", icon: Wind },
  { id: "shimmer", label: "Brilho", desc: "Um reflexo claro atravessa o gradiente.", icon: Sparkle },
];

const DIRECTION_LABELS: Record<AnimationDirection, string> = { normal: "Normal", alternate: "Vai e volta", reverse: "Reverso" };
const EASING_LABELS: Record<Easing, string> = { linear: "Constante", ease: "Suave", "ease-in-out": "Entra e sai devagar" };

const sectionLabel: React.CSSProperties = { fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 12 };
const section: React.CSSProperties = { borderTop: "1px solid var(--border)", paddingTop: 20 };
const selectStyle: React.CSSProperties = { padding: "7px 10px", fontSize: 12, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface-2)", color: "var(--text)", cursor: "pointer", minWidth: 0 };
const mono = "var(--font-kode), ui-monospace, monospace";

const actionButton: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", minHeight: 36, fontSize: 12, fontWeight: 600,
  cursor: "pointer", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", borderRadius: 8,
};

const toggle = (active: boolean, accent = "var(--accent-strong)"): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8,
  border: `1px solid ${active ? accent : "var(--border)"}`, background: active ? accent : "var(--surface)", color: active ? "#fff" : "var(--text)",
});

const numberField: React.CSSProperties = { width: "100%", height: 36, padding: "0 22px 0 8px", fontSize: 13, fontFamily: mono, background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, textAlign: "right" };
const ROW_COLUMNS = "40px minmax(88px, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) 36px";

/** Campo numérico de 0 a 100 com o símbolo % dentro. */
function PercentField({ value, label, onChange, onFocus }: { value: number; label: string; onChange: (v: number) => void; onFocus: () => void }) {
  return (
    <span style={{ position: "relative", display: "block", minWidth: 0 }}>
      <input type="number" min={0} max={100} value={value} aria-label={label} title={label} onFocus={onFocus}
        onChange={(e) => onChange(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} style={numberField} />
      <span aria-hidden="true" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-muted)", pointerEvents: "none" }}>%</span>
    </span>
  );
}

/** Uma cor do gradiente em uma linha: cor, HEX, posição, opacidade e remover. */
function StopRow({ stop: s, selected, canRemove, onSelect, onChange, onRemove }: { stop: Stop; selected: boolean; canRemove: boolean; onSelect: () => void; onChange: (patch: Partial<Stop>) => void; onRemove: () => void }) {
  const [text, setText] = useState(s.color);
  return (
    <div style={{ display: "grid", gridTemplateColumns: ROW_COLUMNS, gap: 8, alignItems: "center", padding: 6, borderRadius: 8, border: "1px solid " + (selected ? "var(--accent-strong)" : "transparent"), background: selected ? "var(--surface-2)" : "none" }}>
      <input type="color" value={s.color} aria-label={"Cor " + s.color.toUpperCase()} onFocus={onSelect} onChange={(e) => { setText(e.target.value); onChange({ color: e.target.value }); }}
        style={{ width: 40, height: 36, padding: 2, border: "1px solid var(--border)", borderRadius: 8, background: "none", cursor: "pointer" }} />
      <input value={text} spellCheck={false} maxLength={7} aria-label="HEX da cor" onFocus={onSelect}
        onChange={(e) => { setText(e.target.value); if (isValidHex(e.target.value)) onChange({ color: e.target.value.toLowerCase() }); }}
        style={{ width: "100%", height: 36, padding: "0 8px", fontSize: 13, fontFamily: mono, background: "var(--surface-2)", color: "var(--text)", border: "1px solid " + (isValidHex(text) ? "var(--border)" : "#ef444466"), borderRadius: 8 }} />
      <PercentField value={s.position} label="Posição da cor (%)" onFocus={onSelect} onChange={(position) => onChange({ position })} />
      <PercentField value={s.alpha} label="Opacidade da cor (%)" onFocus={onSelect} onChange={(alpha) => onChange({ alpha })} />
      <button type="button" onClick={onRemove} disabled={!canRemove} aria-label="Remover cor" data-tip="Remover cor" className="has-tip"
        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: canRemove ? "pointer" : "not-allowed", border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)", color: canRemove ? "#ef4444" : "var(--text-subtle)" }}>
        <Trash size={16} />
      </button>
    </div>
  );
}

const INITIAL: GradientConfig = {
  ...DEFAULT_CONFIG,
  stops: [{ id: 1, color: "#6366f1", position: 0, alpha: 100 }, { id: 2, color: "#ec4899", position: 100, alpha: 100 }],
};

type Panel = "presets" | "exportar";

export default function GradientTool() {
  const [cfg, setCfg] = useState<GradientConfig>(INITIAL);
  const [anim, setAnim] = useState<AnimationSettings>(DEFAULT_ANIMATION);
  const [selectedId, setSelectedId] = useState(1);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (patch: Partial<GradientConfig>) => setCfg((c) => ({ ...c, ...patch }));
  const kind = baseKind(cfg.type);
  const repeating = isRepeating(cfg.type);
  const selected = cfg.stops.find((s) => s.id === selectedId) ?? cfg.stops[0];
  const current = ANIMATIONS.find((a) => a.id === anim.animation) ?? ANIMATIONS[0];

  const updateStop = (id: number, patch: Partial<Stop>) => setCfg((c) => ({ ...c, stops: c.stops.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));

  const addStopAt = (position: number) => {
    const sorted = [...cfg.stops].sort((a, b) => a.position - b.position);
    const left = [...sorted].reverse().find((s) => s.position <= position) ?? sorted[0];
    const right = sorted.find((s) => s.position >= position) ?? sorted[sorted.length - 1];
    const span = right.position - left.position;
    const color = span === 0 ? left.color : mixColor(left.color, right.color, (position - left.position) / span, cfg.space);
    const created = stop(color, position);
    setCfg((c) => ({ ...c, stops: [...c.stops, created] }));
    setSelectedId(created.id);
  };

  const removeStop = (id: number) => {
    if (cfg.stops.length <= 2) return;
    const rest = cfg.stops.filter((s) => s.id !== id);
    setCfg((c) => ({ ...c, stops: rest }));
    setSelectedId(rest[0].id);
  };

  const replaceConfig = (next: GradientConfig) => { setCfg(next); setSelectedId(next.stops[0].id); };

  const cssText = buildCss(cfg, anim, null);
  const copyCss = () => {
    void navigator.clipboard.writeText(cssText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Miniatura de cada tipo, com a primeira e a última cor atuais (período pequeno para os repetidos aparecerem).
  const sorted = [...cfg.stops].sort((a, b) => a.position - b.position);
  const sample = (t: GradientType): string => gradientFunction({
    ...cfg, type: t, angle: 135, space: "srgb", hard: false, x: 50, y: 50, shape: "circle", size: "farthest-corner",
    period: baseKind(t) === "conic" ? 90 : 14,
    stops: [{ id: 0, color: sorted[0].color, position: 0, alpha: 100 }, { id: 1, color: sorted[sorted.length - 1].color, position: 100, alpha: 100 }],
  });

  const headerActions = (
    <>
      <button type="button" onClick={() => replaceConfig(randomGradient(cfg))} title="Gerar um gradiente aleatório" style={{ ...actionButton, background: "var(--accent-strong)", borderColor: "var(--accent-strong)", color: "#fff" }}>
        <Shuffle size={16} /> <span className="gr-action-label">Aleatório</span>
      </button>
      <button type="button" onClick={() => setPanel("presets")} title="Presets e paletas salvas" aria-label="Presets" style={actionButton}>
        <Swatches size={16} /> <span className="gr-action-label">Presets</span>
      </button>
      <button type="button" onClick={() => setPanel("exportar")} title="Exportar como CSS, Tailwind, SVG ou PNG" aria-label="Exportar" style={actionButton}>
        <Code size={16} /> <span className="gr-action-label">Exportar</span>
      </button>
    </>
  );

  return (
    <div className="gr-root">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Design", href: "/categoria/design" }, { label: "Gradientes" }]} />
      <PageHeader title="Gerador de Gradientes" actions={headerActions}>
        Crie gradientes CSS com controle visual, anime e exporte em CSS, Tailwind, SVG ou PNG.
      </PageHeader>

      <div className="gr-grid">
        {/* Resultado */}
        <div className="cut-box" style={{ padding: 16, minWidth: 0, minHeight: 280, display: "flex" }}>
          <div style={{ position: "relative", flex: 1, overflow: "hidden", border: "1px solid var(--border)", borderRadius: 8, backgroundImage: "repeating-conic-gradient(#d4d4d8 0% 25%, #fff 0% 50%)", backgroundSize: "16px 16px" }}>
            <style>{previewCss(cfg, anim)}</style>
            <div className="gr-demo" role="img" aria-label="Prévia do gradiente" style={{ position: "absolute", inset: 0 }} />
          </div>
        </div>

        {/* Propriedades, agrupadas */}
        <div className="cut-box" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div>
            <div style={sectionLabel}>Tipo</div>
            <div role="group" aria-label="Tipo de gradiente" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 6 }}>
              {(Object.keys(TYPE_LABELS) as GradientType[]).map((t) => {
                const active = cfg.type === t;
                return (
                  <button key={t} type="button" aria-pressed={active} onClick={() => set({ type: t })} title={TYPE_LABELS[t]}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "8px 4px", minWidth: 0, cursor: "pointer", borderRadius: 8, border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`, background: active ? "var(--surface)" : "var(--surface-2)", boxShadow: active ? "inset 0 0 0 1px var(--accent-strong)" : "none", color: active ? "var(--text)" : "var(--text-muted)" }}>
                    <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: 6, border: "1px solid var(--border)", background: sample(t) }} />
                    <span style={{ fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }}>{TYPE_LABELS[t]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={section}>
            <div style={sectionLabel}>{kind === "linear" ? "Direção" : kind === "radial" ? "Formato e centro" : "Ângulo e centro"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {usesAngle(cfg.type) && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
                  {kind === "conic" ? "Início" : "Ângulo"}
                  <input type="range" min={0} max={360} value={cfg.angle} aria-label="Ângulo" onChange={(e) => set({ angle: Number(e.target.value) })} style={{ flex: 1, accentColor: "var(--accent-strong)" }} />
                  <span style={{ width: 42, textAlign: "right", fontFamily: mono, color: "var(--text)" }}>{cfg.angle}°</span>
                </label>
              )}
              {kind === "radial" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <div role="group" aria-label="Formato" style={{ display: "flex", gap: 8 }}>
                    {(Object.keys(SHAPE_LABELS) as RadialShape[]).map((sh) => (
                      <button key={sh} type="button" aria-pressed={cfg.shape === sh} onClick={() => set({ shape: sh })} style={toggle(cfg.shape === sh)}>{SHAPE_LABELS[sh]}</button>
                    ))}
                  </div>
                  <select aria-label="Tamanho" value={cfg.size} onChange={(e) => set({ size: e.target.value as RadialSize })} style={selectStyle}>
                    {(Object.keys(SIZE_LABELS) as RadialSize[]).map((s) => <option key={s} value={s}>{SIZE_LABELS[s]}</option>)}
                  </select>
                </div>
              )}
              {kind !== "linear" && <PositionPicker x={cfg.x} y={cfg.y} onChange={(x, y) => set({ x, y })} />}
              {repeating && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
                  Repetir a cada
                  <input type="range" min={kind === "conic" ? 10 : 10} max={kind === "conic" ? 180 : 300} value={cfg.period} aria-label="Tamanho da repetição" onChange={(e) => set({ period: Number(e.target.value) })} style={{ flex: 1, accentColor: "var(--accent-strong)" }} />
                  <span style={{ width: 48, textAlign: "right", fontFamily: mono, color: "var(--text)" }}>{cfg.period}{kind === "conic" ? "°" : "px"}</span>
                </label>
              )}
            </div>
          </div>

          <div style={section}>
            <div style={{ ...sectionLabel, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span>Cores</span>
              <span style={{ display: "flex", gap: 8 }}>
                <button type="button" role="switch" aria-checked={cfg.hard} onClick={() => set({ hard: !cfg.hard })} style={{ ...toggle(cfg.hard), minHeight: 32, padding: "6px 10px" }} title="Cada cor começa onde a anterior termina, sem transição">
                  Cortes secos
                </button>
                <button type="button" onClick={() => addStopAt(50)} style={{ ...actionButton, minHeight: 32, padding: "6px 10px" }}><Plus size={14} /> Adicionar</button>
              </span>
            </div>
            <GradientBar cfg={cfg} selectedId={selected.id} onSelect={setSelectedId} onMove={(id, position) => updateStop(id, { position })} onAdd={addStopAt} />
            <div style={{ display: "grid", gridTemplateColumns: ROW_COLUMNS, gap: 8, padding: "12px 6px 4px", fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }} aria-hidden="true">
              <span>Cor</span><span>HEX</span><span>Posição</span><span>Opacidade</span><span />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {cfg.stops.map((st) => (
                <StopRow
                  key={st.id} stop={st} selected={st.id === selected.id} canRemove={cfg.stops.length > 2}
                  onSelect={() => setSelectedId(st.id)} onChange={(patch) => updateStop(st.id, patch)} onRemove={() => removeStop(st.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animação: linha inteira, só ícones (com dica) e as configurações ao lado */}
      <div className="cut-box" style={{ marginTop: 16, padding: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ ...sectionLabel, marginBottom: 0 }}>Animação</div>
        <div role="group" aria-label="Animação" style={{ display: "flex", gap: 6 }}>
          {ANIMATIONS.map(({ id, label, desc, icon: Icon }) => {
            const active = anim.animation === id;
            return (
              <button
                key={id} type="button" aria-pressed={active} aria-label={label} data-tip={desc ? label + ": " + desc : "Sem animação"}
                className="has-tip" onClick={() => setAnim((a) => ({ ...a, animation: id }))}
                style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 8, border: "1px solid " + (active ? "var(--accent-strong)" : "var(--border)"), background: active ? "var(--accent-strong)" : "var(--surface)", color: active ? "#fff" : "var(--text)" }}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
        {anim.animation !== "none" && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginLeft: "auto" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
              Duração
              <input type="range" min={1} max={20} value={anim.duration} onChange={(e) => setAnim((a) => ({ ...a, duration: Number(e.target.value) }))} style={{ width: 120, accentColor: "var(--accent-strong)" }} />
              <span style={{ width: 30, fontFamily: mono, color: "var(--text)" }}>{anim.duration}s</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
              Direção
              <select value={anim.direction} onChange={(e) => setAnim((a) => ({ ...a, direction: e.target.value as AnimationDirection }))} style={selectStyle}>
                {(Object.keys(DIRECTION_LABELS) as AnimationDirection[]).map((d) => <option key={d} value={d}>{DIRECTION_LABELS[d]}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
              Ritmo
              <select value={anim.easing} onChange={(e) => setAnim((a) => ({ ...a, easing: e.target.value as Easing }))} style={selectStyle}>
                {(Object.keys(EASING_LABELS) as Easing[]).map((d) => <option key={d} value={d}>{EASING_LABELS[d]}</option>)}
              </select>
            </label>
          </div>
        )}
      </div>

      {/* CSS: linha inteira */}
      <div className="cut-box" style={{ marginTop: 16, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ ...sectionLabel, marginBottom: 0 }}>CSS</span>
          <button type="button" onClick={copyCss}
            style={{ display: "flex", alignItems: "center", gap: 6, background: copied ? "#16a34a" : "var(--accent-strong)", border: "none", borderRadius: 8, padding: "8px 16px", minHeight: 36, fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", transition: "background 0.2s" }}>
            {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar CSS"}
          </button>
        </div>
        <pre style={{ display: "block", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", fontSize: 12, fontFamily: mono, color: "var(--text)", wordBreak: "break-all", whiteSpace: "pre-wrap", lineHeight: 1.7, margin: 0, overflow: "auto" }}>
          {cssText}
        </pre>
      </div>

      <Modal open={panel === "presets"} title="Presets" onClose={() => setPanel(null)} width={620}>
        <PresetsPanel current={cfg} onApply={(next) => { replaceConfig(next); setPanel(null); }} />
      </Modal>
      <Modal open={panel === "exportar"} title="Exportar gradiente" onClose={() => setPanel(null)} width={620}>
        <GradientExport cfg={cfg} anim={anim} />
      </Modal>

      <style>{`
        .gr-root { container-type: inline-size; }
        .gr-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; align-items: stretch; }
        @container (min-width: 760px) { .gr-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 767px) { .gr-action-label { display: none; } }
      `}</style>
    </div>
  );
}
