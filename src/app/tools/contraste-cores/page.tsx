"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import PageHeader from "../../components/PageHeader";
import { jakarta, kodeMono } from "../../lib/fonts";

// ─── Utilitários ──────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
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
  const b = Math.max(l1, l2), d = Math.min(l1, l2);
  return (b + 0.05) / (d + 0.05);
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function mixColors(fg: string, bg: string, weight: number): string {
  const [fr, fg_, fb] = hexToRgb(fg);
  const [br, bg_, bb] = hexToRgb(bg);
  return rgbToHex(
    Math.round(fr * weight + br * (1 - weight)),
    Math.round(fg_ * weight + bg_ * (1 - weight)),
    Math.round(fb * weight + bb * (1 - weight))
  );
}

// Sugere uma versão da cor do texto com melhor contraste
function suggestBetterColor(textHex: string, bgHex: string): string {
  const [r, g, b] = hexToRgb(textHex);
  // Tenta versão mais escura e mais clara
  for (let factor = 0; factor <= 1; factor += 0.05) {
    const darker = rgbToHex(Math.round(r * (1 - factor)), Math.round(g * (1 - factor)), Math.round(b * (1 - factor)));
    if (contrastRatio(darker, bgHex) >= 4.5) return darker;
    const lighter = rgbToHex(Math.min(255, Math.round(r + (255 - r) * factor)), Math.min(255, Math.round(g + (255 - g) * factor)), Math.min(255, Math.round(b + (255 - b) * factor)));
    if (contrastRatio(lighter, bgHex) >= 4.5) return lighter;
  }
  return contrastRatio("#000000", bgHex) >= contrastRatio("#ffffff", bgHex) ? "#000000" : "#ffffff";
}


// ─── Estilos compartilhados (layout do Figma "WebTools", nó 1:2) ────────────────


const MONO = "var(--font-kode), ui-monospace, monospace";

const cardStyle: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16,
  display: "flex", flexDirection: "column", gap: 16, minWidth: 0,
};

const cardTitleStyle: React.CSSProperties = { fontFamily: MONO, fontSize: 16, fontWeight: 600, lineHeight: "19.5px", color: "var(--text)", margin: 0 };

// ─── Componentes ──────────────────────────────────────────────────────────────

declare global { interface Window { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } } }

function ColorInput({ label, value, inputText, onChange, onPickerChange }: {
  label: string;
  value: string;
  inputText: string;
  onChange: (v: string) => void;
  onPickerChange: (v: string) => void;
}) {
  const [picking, setPicking] = useState(false);
  const [hasEyeDropper, setHasEyeDropper] = useState(false);
  const valid = isValidHex(value);

  useEffect(() => { setHasEyeDropper("EyeDropper" in window); }, []);

  const pick = async () => {
    if (!window.EyeDropper) return;
    setPicking(true);
    try { const r = await new window.EyeDropper().open(); onPickerChange(r.sRGBHex); }
    catch { } finally { setPicking(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 12, fontWeight: 700, lineHeight: "16.5px", color: "var(--text-muted)" }}>{label}</label>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ position: "relative", width: 42, height: 42, flexShrink: 0 }}>
          <input type="color" value={valid ? value : "#000000"} onChange={(e) => onPickerChange(e.target.value)} aria-label={label}
            style={{ width: 42, height: 42, borderRadius: 12, border: `2px solid ${valid ? value + "66" : "var(--border)"}`, background: "none", cursor: "pointer", padding: 3 }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 12, pointerEvents: "none", border: "1px solid rgba(255,255,255,0.1)" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input type="text" value={inputText} onChange={(e) => onChange(e.target.value)} spellCheck={false} placeholder="#000000" aria-label={`${label} em hexadecimal`}
            style={{ width: "100%", height: 42, background: "var(--surface-2)", border: `1px solid ${isValidHex(inputText) ? "var(--border)" : "#ef444466"}`, borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 14, fontFamily: MONO, fontWeight: 500, transition: "border-color 0.2s" }} />
          {valid && (
            <div style={{ fontSize: 10, lineHeight: "15px", color: "var(--text-muted)", paddingTop: 4 }}>
              RGB({hexToRgb(value).join(", ")})
            </div>
          )}
        </div>
        {hasEyeDropper && (
          <button onClick={pick} title={picking ? "Clique na cor..." : "Conta-gotas"} aria-label="Conta-gotas"
            style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: picking ? "var(--accent)" : "var(--surface-2)", border: `1px solid ${picking ? "var(--accent)" : "var(--border)"}`, color: picking ? "#fff" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M12.6 1.4C12.3375 1.13783 11.9817 0.990565 11.6107 0.990565C11.2397 0.990565 10.8838 1.13783 10.6213 1.4L8.86667 3.15467L8.04533 2.33333C7.87046 2.1595 7.63391 2.06193 7.38733 2.06193C7.14076 2.06193 6.9042 2.1595 6.72933 2.33333L5.13333 3.92933L2.33333 6.72933C2.1595 6.90421 2.06193 7.14076 2.06193 7.38733C2.06193 7.63391 2.1595 7.87046 2.33333 8.04533L3.07067 8.78267L1.4 10.4533C1.2299 10.6028 1.09858 10.7912 1.0173 11.0026C0.936019 11.2139 0.907207 11.4418 0.933333 11.6667V12.6H1.86667C2.23784 12.5997 2.5937 12.452 2.856 12.1893L4.52667 10.5187L5.264 11.256C5.43887 11.4298 5.67543 11.5274 5.922 11.5274C6.16857 11.5274 6.40513 11.4298 6.58 11.256L8.86667 8.96933L10.4627 7.37333L12.1333 5.70267C12.3955 5.44017 12.5428 5.08433 12.5428 4.71333C12.5428 4.34233 12.3955 3.9865 12.1333 3.724L12.6 1.4Z" stroke="currentColor" strokeWidth="1.12" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

function WcagBadge({ label, pass }: { label: string; pass: boolean }) {
  const color = pass ? "#22c55e" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderRadius: 10, background: pass ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${pass ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>
      <div style={{ width: 18, height: 18, borderRadius: 11, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700, flexShrink: 0 }} aria-hidden="true">
        {pass ? "✓" : "✕"}
      </div>
      <span style={{ fontSize: 10, lineHeight: "19.5px", fontWeight: 600, color }}>{label}</span>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ContrastePage() {
  const [fg, setFg] = useState("#1a1a2e");
  const [fgText, setFgText] = useState("#1a1a2e");
  const [bg, setBg] = useState("#ffffff");
  const [bgText, setBgText] = useState("#ffffff");

  const validFg = isValidHex(fg) ? fg : "#000000";
  const validBg = isValidHex(bg) ? bg : "#ffffff";
  const ratio = contrastRatio(validFg, validBg);
  const ratioStr = ratio.toFixed(2);

  // WCAG checks
  const passAANormal = ratio >= 4.5;
  const passAALarge = ratio >= 3;
  const passAAANormal = ratio >= 7;
  const passAAALarge = ratio >= 4.5;
  const passUI = ratio >= 3;

  // Nível geral
  let overallLevel = "Fail";
  let overallColor = "#ef4444";
  if (ratio >= 7) { overallLevel = "AAA"; overallColor = "#22c55e"; }
  else if (ratio >= 4.5) { overallLevel = "AA"; overallColor = "#84cc16"; }
  else if (ratio >= 3) { overallLevel = "AA Large"; overallColor = "#eab308"; }

  const suggestion = suggestBetterColor(validFg, validBg);
  const suggestionRatio = contrastRatio(suggestion, validBg);

  const swap = () => {
    setFg(validBg); setFgText(validBg);
    setBg(validFg); setBgText(validFg);
  };

  const smallText: React.CSSProperties = { fontSize: 10, lineHeight: "15px", color: "var(--text-muted)" };

  return (
    <div className={`cc-root ${jakarta.variable} ${kodeMono.variable}`} style={{ fontFamily: "var(--font-jakarta), Inter, system-ui, sans-serif" }}>
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Design", href: "/categoria/design" }, { label: "Contraste de Cores" }]} />

      <PageHeader title="Contraste de Cores">
        Verifique a acessibilidade do contraste entre texto e fundo conforme as diretrizes WCAG 2.1.
      </PageHeader>

      <div className="cc-top">
        {/* Seleção de cores */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <h2 style={cardTitleStyle}>Seleção de cores</h2>
            <button onClick={swap} title="Trocar cores"
              style={{ background: "none", border: "none", padding: 0, fontSize: 12, lineHeight: "18px", color: "var(--accent-dim)", cursor: "pointer", fontFamily: "inherit" }}>
              ↕ Trocar cores
            </button>
          </div>
          <ColorInput label="Cor do texto" value={fg} inputText={fgText}
            onChange={(v) => { setFgText(v); if (isValidHex(v)) setFg(v); }}
            onPickerChange={(v) => { setFg(v); setFgText(v); }} />
          <ColorInput label="Cor de fundo" value={bg} inputText={bgText}
            onChange={(v) => { setBgText(v); if (isValidHex(v)) setBg(v); }}
            onPickerChange={(v) => { setBg(v); setBgText(v); }} />
        </div>

        {/* Razão + medidor */}
        <div style={cardStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }} aria-live="polite">
              <span style={{ fontFamily: MONO, fontSize: 56, fontWeight: 700, lineHeight: "56px", letterSpacing: "-0.04em", color: overallColor }}>{ratioStr}</span>
              <span style={{ fontSize: 15, lineHeight: "22.5px", color: "var(--text-muted)" }}>:1</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, lineHeight: "21px", padding: "5px 18px", borderRadius: 20, background: overallColor + "22", color: overallColor, border: `1px solid ${overallColor}44` }}>
                {overallLevel}
              </span>
            </div>
          </div>

          <div>
            <div style={{ position: "relative", height: 10, borderRadius: 6, background: "var(--surface-2)", overflow: "hidden" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${Math.min(100, (ratio / 21) * 100)}%`,
                background: `linear-gradient(90deg, #ef4444 0%, #eab308 ${(3 / 21) * 100}%, #84cc16 ${(4.5 / 21) * 100}%, #22c55e ${(7 / 21) * 100}%)`,
                borderRadius: 6, transition: "width 0.3s",
              }} />
              {[3, 4.5, 7].map((t) => (
                <div key={t} style={{ position: "absolute", top: -2, height: 14, left: `${(t / 21) * 100}%`, width: 2, background: "var(--surface)", opacity: 0.8 }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4, fontSize: 9, lineHeight: "13.5px", color: "var(--text-muted)" }}>
              <span>1</span><span>3:1 AA Large</span><span>4.5:1 AA</span><span>7:1 AAA</span><span>21</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {[["Texto", validFg], ["Fundo", validBg]].map(([label, hex]) => (
              <div key={label} style={{ flex: 1, minWidth: 0, background: "var(--surface-2)", borderRadius: 8, padding: "8px 12px" }}>
                <div style={smallText}>{label}</div>
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500, lineHeight: "18px", color: "var(--text)", paddingTop: 2 }}>{hex.toUpperCase()}</div>
                <div style={smallText}>L: {relativeLuminance(hex as string).toFixed(3)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WCAG Checklist */}
        <div className="cc-wcag" style={{ ...cardStyle, gap: 8 }}>
          <h2 style={cardTitleStyle}>WCAG 2.1 — Checklist</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <WcagBadge label="AA — Texto normal (≥ 4.5:1)" pass={passAANormal} />
            <WcagBadge label="AA — Texto grande (≥ 3:1)" pass={passAALarge} />
            <WcagBadge label="AAA — Texto normal (≥ 7:1)" pass={passAAANormal} />
            <WcagBadge label="AAA — Texto grande (≥ 4.5:1)" pass={passAAALarge} />
            <WcagBadge label="Componentes de UI (≥ 3:1)" pass={passUI} />
          </div>
          <p style={{ fontSize: 10, lineHeight: "19.2px", color: "var(--text-muted)", margin: 0 }}>
            <strong style={{ color: "var(--text)" }}>Texto normal:</strong> abaixo de 18pt (24px) ou 14pt (18.67px) bold.
          </p>
          <p style={{ fontSize: 10, lineHeight: "19.2px", color: "var(--text-muted)", margin: 0 }}>
            <strong style={{ color: "var(--text)" }}>Texto grande:</strong> 18pt ou 14pt bold ou maior.
          </p>
        </div>
      </div>

      <div className={`cc-bottom${passAANormal ? " cc-bottom--single" : ""}`} style={{ marginTop: 20 }}>
        {/* Preview */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", minWidth: 0 }}>
          <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
            <h2 style={cardTitleStyle}>Preview de texto</h2>
          </div>
          <div style={{ padding: 16, background: validBg }}>
            <div style={{ fontSize: 28, fontWeight: 700, lineHeight: "42px", letterSpacing: "-0.02em", color: validFg }}>
              Título em destaque
            </div>
            <div style={{ fontSize: 14, color: validFg, lineHeight: "20px", paddingTop: 12 }}>
              Este é um exemplo de parágrafo com texto em tamanho normal. A legibilidade depende do contraste entre o texto e o fundo — um contraste adequado garante acessibilidade para pessoas com baixa visão.
            </div>
            <div style={{ fontSize: 13, color: validFg, lineHeight: "20.8px", opacity: 0.8, paddingTop: 12 }}>
              Texto menor — 13px
            </div>
            <div style={{ paddingTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={{ background: validFg, color: validBg, border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 600, lineHeight: "21px", cursor: "default", fontFamily: "inherit" }}>Botão</button>
              <button style={{ background: "transparent", color: validFg, border: `2px solid ${validFg}`, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, lineHeight: "21px", cursor: "default", fontFamily: "inherit" }}>Outlined</button>
              <span style={{ background: validFg + "22", color: validFg, border: `1px solid ${validFg}44`, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, lineHeight: "18px", alignSelf: "stretch", display: "flex", alignItems: "center" }}>Badge</span>
            </div>
          </div>
        </div>

        {/* Sugestão */}
        {!passAANormal && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12, minWidth: 0 }}>
            <h2 style={cardTitleStyle}>Sugestão para melhorar o contraste</h2>
            <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: suggestion, border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, lineHeight: "21px", color: "var(--text)" }}>{suggestion.toUpperCase()}</div>
                  <div style={{ fontSize: 12, lineHeight: "18px", color: "var(--text-muted)" }}>Contraste: {suggestionRatio.toFixed(2)}:1</div>
                  <span style={{ fontSize: 11, fontWeight: 700, lineHeight: "16.5px", color: suggestionRatio >= 4.5 ? "#22c55e" : "#eab308" }}>
                    {suggestionRatio >= 7 ? "AAA" : suggestionRatio >= 4.5 ? "AA ✓" : "AA Large"}
                  </span>
                </div>
              </div>
              <button onClick={() => { setFg(suggestion); setFgText(suggestion); }}
                style={{ minHeight: 42, padding: "8px 16px", borderRadius: 8, background: "var(--accent-dim)", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Aplicar sugestão
              </button>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "4px 0", width: "100%" }} />

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, lineHeight: "18px", color: "var(--text-muted)" }}>Escala de variações</div>
              <div style={{ display: "flex", gap: 4, paddingTop: 8 }}>
                {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((w) => {
                  const mixed = mixColors("#000000", validFg, w);
                  const r = contrastRatio(mixed, validBg);
                  const wl = r >= 4.5 ? "#22c55e" : r >= 3 ? "#eab308" : "#ef4444";
                  return (
                    <button key={w} onClick={() => { setFg(mixed); setFgText(mixed); }}
                      aria-label={`Usar ${mixed.toUpperCase()}, contraste ${r.toFixed(1)}:1`}
                      title={`${mixed.toUpperCase()} — ${r.toFixed(1)}:1`}
                      className="shade-swatch"
                      style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "flex-start", padding: 10, borderRadius: 6, background: mixed, cursor: "pointer", border: `2px solid ${mixed === validFg ? "#fff" : "transparent"}`, transition: "transform 0.1s" }}>
                      <span style={{ width: 6, height: 6, borderRadius: 3, background: wl, flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
              <div style={{ paddingTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[["#22c55e", "AA (≥4.5)"], ["#eab308", "AA Large (≥3)"], ["#ef4444", "Fail"]].map(([color, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: color }} />
                    <span style={smallText}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .shade-swatch:hover { transform: scaleY(1.15); }
        .cc-top, .cc-bottom { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; align-items: stretch; }
        .cc-root { container-type: inline-size; }
        @container (min-width: 600px) {
          .cc-top { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .cc-wcag { grid-column: 1 / -1; }
        }
        @container (min-width: 700px) { .cc-bottom:not(.cc-bottom--single) { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @container (min-width: 900px) {
          .cc-top { grid-template-columns: minmax(280px, 1.15fr) minmax(240px, 1fr) minmax(260px, 1fr); }
          .cc-wcag { grid-column: auto; }
        }
      `}</style>
    </div>
  );
}
