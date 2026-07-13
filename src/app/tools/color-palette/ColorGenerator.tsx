'use client';
import { useState, useCallback } from 'react';

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function isDark(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function generatePalette(count = 5, existing: Array<{ hex: string; locked: boolean }>) {
  const baseH = randInt(0, 359);
  return Array.from({ length: count }, (_, i) => {
    if (existing[i]?.locked) return existing[i];
    const h = (baseH + i * 37) % 360;
    const s = randInt(55, 85);
    const l = randInt(35, 70);
    const hex = hslToHex(h, s, l);
    return { hex, locked: false, h, s, l };
  });
}

type Swatch = { hex: string; locked: boolean; h?: number; s?: number; l?: number };

export default function ColorGenerator() {
  const [palette, setPalette] = useState<Swatch[]>(() => generatePalette(5, []));
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => setPalette(p => generatePalette(5, p));

  const toggleLock = (i: number) => setPalette(p => p.map((s, idx) => idx === i ? { ...s, locked: !s.locked } : s));

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <button
        onClick={generate}
        style={{
          padding: '0.6rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer',
          background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '1rem',
          alignSelf: 'flex-start',
        }}
      >
        🎲 Gerar Paleta
      </button>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {palette.map((sw, i) => {
          const { r, g, b } = hexToRgb(sw.hex);
          const dark = isDark(sw.hex);
          const textColor = dark ? '#fff' : '#000';
          const { h = 0, s = 0, l = 0 } = sw;
          return (
            <div key={i} style={{ flex: '1 1 120px', minWidth: '100px' }}>
              <div style={{
                background: sw.hex, borderRadius: '0.75rem 0.75rem 0 0',
                height: '140px', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                padding: '0.5rem', cursor: 'pointer',
              }} onClick={() => toggleLock(i)}>
                <span style={{ fontSize: '1.2rem' }} title={sw.locked ? 'Travado' : 'Clique para travar'}>{sw.locked ? '🔒' : '🔓'}</span>
              </div>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderTop: 'none',
                borderRadius: '0 0 0.75rem 0.75rem', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem',
              }}>
                {[
                  { label: sw.hex.toUpperCase(), val: sw.hex },
                  { label: `rgb(${r},${g},${b})`, val: `rgb(${r},${g},${b})` },
                  { label: `hsl(${h},${s}%,${l}%)`, val: `hsl(${h},${s}%,${l}%)` },
                ].map(({ label, val }) => (
                  <button
                    key={val}
                    onClick={() => copy(val)}
                    title="Clique para copiar"
                    style={{
                      padding: '0.2rem 0.4rem', borderRadius: '0.3rem', cursor: 'pointer',
                      background: copied === val ? 'var(--accent)' : 'transparent',
                      color: copied === val ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--border)', fontSize: '0.7rem', fontFamily: 'monospace', textAlign: 'left',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Clique no cadeado para travar uma cor. Clique nos códigos para copiar.
      </p>
    </div>
  );
}
