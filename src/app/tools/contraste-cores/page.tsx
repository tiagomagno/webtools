"use client";

import { useState, useEffect } from "react";

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
  const hasEyeDropper = typeof window !== "undefined" && "EyeDropper" in window;
  const valid = isValidHex(value);

  const pick = async () => {
    if (!window.EyeDropper) return;
    setPicking(true);
    try { const r = await new window.EyeDropper().open(); onPickerChange(r.sRGBHex); }
    catch { } finally { setPicking(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <input type="color" value={valid ? value : "#000000"} onChange={(e) => onPickerChange(e.target.value)}
            style={{ width: 52, height: 52, borderRadius: 12, border: `2px solid ${valid ? value + "66" : "var(--border)"}`, background: "none", cursor: "pointer", padding: 3 }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 12, pointerEvents: "none", border: "1px solid rgba(255,255,255,0.1)" }} />
        </div>
        <div style={{ flex: 1 }}>
          <input type="text" value={inputText} onChange={(e) => onChange(e.target.value)} spellCheck={false} placeholder="#000000"
            style={{ width: "100%", background: "var(--surface-2)", border: `1px solid ${isValidHex(inputText) ? "var(--border)" : "#ef444466"}`, borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace", transition: "border-color 0.2s" }} />
          {valid && (
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, fontFamily: "monospace" }}>
              RGB({hexToRgb(value).join(", ")})
            </div>
          )}
        </div>
        {hasEyeDropper && (
          <button onClick={pick} title={picking ? "Clique na cor..." : "Conta-gotas"}
            style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: picking ? "var(--accent)" : "var(--surface-2)", border: `1px solid ${picking ? "var(--accent)" : "var(--border)"}`, color: picking ? "#fff" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M13.5 1.5a1.5 1.5 0 0 0-2.12 0L9.5 3.38 8.62 2.5a1 1 0 0 0-1.41 0L5.5 4.21 2.5 7.21a1 1 0 0 0 0 1.41l.79.79L1.5 11.2A1.5 1.5 0 0 0 1 12.5v1h1a1.5 1.5 0 0 0 1.06-.44l1.79-1.79.79.79a1 1 0 0 0 1.41 0l2.45-2.45 1.71-1.71 1.79-1.79a1.5 1.5 0 0 0 0-2.12L13.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

function WcagBadge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: pass ? "#22c55e15" : "#ef444415", border: `1px solid ${pass ? "#22c55e33" : "#ef444433"}` }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: pass ? "#22c55e" : "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
        {pass ? "✓" : "✕"}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: pass ? "#22c55e" : "#ef4444" }}>{label}</span>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ContrastePage() {
  const [fg, setFg] = useState("#1a1a2e");
  const [fgText, setFgText] = useState("#1a1a2e");
  const [bg, setBg] = useState("#ffffff");
  const [bgText, setBgText] = useState("#ffffff");
  const [swapped, setSwapped] = useState(false);

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
    setSwapped(!swapped);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🔍 Contraste de Cores
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
          Verifique a acessibilidade do contraste entre texto e fundo conforme as diretrizes WCAG 2.1.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Color inputs */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
          <ColorInput label="Cor do texto" value={fg} inputText={fgText}
            onChange={(v) => { setFgText(v); if (isValidHex(v)) setFg(v); }}
            onPickerChange={(v) => { setFg(v); setFgText(v); }} />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={swap} title="Trocar cores"
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "7px 16px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", transition: "all 0.15s" }}>
              ↕ Trocar cores
            </button>
          </div>

          <ColorInput label="Cor de fundo" value={bg} inputText={bgText}
            onChange={(v) => { setBgText(v); if (isValidHex(v)) setBg(v); }}
            onPickerChange={(v) => { setBg(v); setBgText(v); }} />
        </div>

        {/* Ratio + gauge */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Big ratio */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.04em", color: overallColor, lineHeight: 1 }}>
              {ratioStr}
            </div>
            <div style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 4 }}>:1</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ display: "inline-block", fontSize: 14, fontWeight: 700, padding: "5px 18px", borderRadius: 20, background: overallColor + "22", color: overallColor, border: `1px solid ${overallColor}44` }}>
                {overallLevel}
              </span>
            </div>
          </div>

          {/* Visual gauge */}
          <div>
            <div style={{ position: "relative", height: 10, borderRadius: 6, background: "var(--surface-2)", overflow: "hidden" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${Math.min(100, (ratio / 21) * 100)}%`,
                background: `linear-gradient(to right, #ef4444, #eab308 ${(3 / 21) * 100}%, #84cc16 ${(4.5 / 21) * 100}%, #22c55e ${(7 / 21) * 100}%)`,
                borderRadius: 6, transition: "width 0.3s",
              }} />
              {/* Threshold markers */}
              {[3, 4.5, 7].map((t) => (
                <div key={t} style={{ position: "absolute", top: -2, bottom: -2, left: `${(t / 21) * 100}%`, width: 2, background: "var(--surface)", opacity: 0.8 }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: "var(--text-muted)", fontFamily: "monospace" }}>
              <span>1</span><span>3:1 AA Large</span><span>4.5:1 AA</span><span>7:1 AAA</span><span>21</span>
            </div>
          </div>

          {/* Luminance info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["Texto", validFg], ["Fundo", validBg]].map(([label, hex]) => (
              <div key={label} style={{ background: "var(--surface-2)", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text)" }}>{hex.toUpperCase()}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>L: {relativeLuminance(hex as string).toFixed(3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WCAG Checklist */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>WCAG 2.1 — Checklist</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
          <WcagBadge label="AA — Texto normal (≥ 4.5:1)" pass={passAANormal} />
          <WcagBadge label="AA — Texto grande (≥ 3:1)" pass={passAALarge} />
          <WcagBadge label="AAA — Texto normal (≥ 7:1)" pass={passAAANormal} />
          <WcagBadge label="AAA — Texto grande (≥ 4.5:1)" pass={passAAALarge} />
          <WcagBadge label="Componentes de UI (≥ 3:1)" pass={passUI} />
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text)" }}>Texto normal:</strong> abaixo de 18pt (24px) ou 14pt (18.67px) bold. &nbsp;
          <strong style={{ color: "var(--text)" }}>Texto grande:</strong> 18pt ou 14pt bold ou maior.
        </div>
      </div>

      {/* Preview */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
          Preview de texto
        </div>
        <div style={{ padding: 24, background: validBg }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: validFg, marginBottom: 12, letterSpacing: "-0.02em" }}>
            Título em destaque
          </div>
          <div style={{ fontSize: 16, color: validFg, lineHeight: 1.7, marginBottom: 12 }}>
            Este é um exemplo de parágrafo com texto em tamanho normal. A legibilidade depende do contraste entre o texto e o fundo — um contraste adequado garante acessibilidade para pessoas com baixa visão.
          </div>
          <div style={{ fontSize: 13, color: validFg, lineHeight: 1.6, opacity: 0.8 }}>
            Texto menor — 13px
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={{ background: validFg, color: validBg, border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "default" }}>Botão</button>
            <button style={{ background: "transparent", color: validFg, border: `2px solid ${validFg}`, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: "default" }}>Outlined</button>
            <span style={{ background: validFg + "22", color: validFg, border: `1px solid ${validFg}44`, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600 }}>Badge</span>
          </div>
        </div>
      </div>

      {/* Suggestion */}
      {!passAANormal && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
            💡 Sugestão para melhorar o contraste
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: suggestion, border: "1px solid rgba(255,255,255,0.1)" }} />
              <div>
                <div style={{ fontSize: 14, fontFamily: "monospace", color: "var(--text)", fontWeight: 600 }}>{suggestion.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Contraste: {suggestionRatio.toFixed(2)}:1</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: suggestionRatio >= 4.5 ? "#22c55e" : "#eab308" }}>
                  {suggestionRatio >= 7 ? "AAA" : suggestionRatio >= 4.5 ? "AA ✓" : "AA Large"}
                </span>
              </div>
            </div>
            <button onClick={() => { setFg(suggestion); setFgText(suggestion); }}
              style={{ padding: "10px 20px", borderRadius: 8, background: "var(--accent)", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Aplicar sugestão
            </button>
          </div>

          {/* Gradient de ajuste */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Escala de variações</div>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((w, i) => {
                const mixed = mixColors("#000000", validFg, w);
                const r = contrastRatio(mixed, validBg);
                const wl = r >= 4.5 ? "#22c55e" : r >= 3 ? "#eab308" : "#ef4444";
                return (
                  <div key={i} onClick={() => { setFg(mixed); setFgText(mixed); }}
                    style={{ flex: 1, height: 44, borderRadius: 6, background: mixed, cursor: "pointer", border: `2px solid ${mixed === validFg ? "#fff" : "transparent"}`, position: "relative", transition: "transform 0.1s" }}
                    title={`${mixed.toUpperCase()} — ${r.toFixed(1)}:1`}
                    className="shade-swatch">
                    <div style={{ position: "absolute", bottom: -14, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: wl }} />
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} /><span style={{ fontSize: 10, color: "var(--text-muted)" }}>AA (≥4.5)</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308" }} /><span style={{ fontSize: 10, color: "var(--text-muted)" }}>AA Large (≥3)</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} /><span style={{ fontSize: 10, color: "var(--text-muted)" }}>Fail</span></div>
            </div>
          </div>
        </div>
      )}

      <style>{`.shade-swatch:hover { transform: scaleY(1.15); }`}</style>
    </div>
  );
}
