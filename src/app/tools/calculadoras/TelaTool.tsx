'use client';
import { useState, useMemo } from 'react';
import { num } from '@/app/lib/format';

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }

const PRESETS = [
  { label: 'Full HD 1080p', w: 1920, h: 1080 },
  { label: '2K QHD', w: 2560, h: 1440 },
  { label: '4K UHD', w: 3840, h: 2160 },
  { label: 'iPhone 15 Pro', w: 2556, h: 1179 },
  { label: 'MacBook 14"', w: 3024, h: 1964 },
];

export default function TelaTool() {
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [diagonal, setDiagonal] = useState('27');

  const result = useMemo(() => {
    const w = parseInt(width) || 0;
    const h = parseInt(height) || 0;
    const d = parseFloat(diagonal) || 0;
    if (!w || !h || !d) return null;

    const ppi = Math.sqrt(w * w + h * h) / d;
    const diagonalPx = Math.sqrt(w * w + h * h);
    const g = gcd(w, h);
    const ratioW = w / g;
    const ratioH = h / g;
    const physW = w / ppi;
    const physH = h / ppi;
    const area = physW * physH;

    return { ppi, diagonalPx, ratioW, ratioH, physW, physH, area };
  }, [width, height, diagonal]);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => { setWidth(String(p.w)); setHeight(String(p.h)); }}
            style={{
              padding: '0.3rem 0.7rem', borderRadius: '0.4rem', cursor: 'pointer',
              background: 'var(--surface)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', fontSize: '0.8rem',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Largura (px)</span>
          <input style={inputStyle} value={width} onChange={e => setWidth(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Altura (px)</span>
          <input style={inputStyle} value={height} onChange={e => setHeight(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Diagonal (pol.)</span>
          <input style={inputStyle} value={diagonal} onChange={e => setDiagonal(e.target.value)} />
        </label>
      </div>

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'PPI', value: num(result.ppi, 0), big: true },
            { label: 'Proporção', value: `${result.ratioW}:${result.ratioH}` },
            { label: 'Total de pixels', value: `${(parseInt(width) * parseInt(height) / 1_000_000).toFixed(1)} MP` },
            { label: 'Largura física', value: `${num(result.physW, 2)} pol` },
            { label: 'Altura física', value: `${num(result.physH, 2)} pol` },
            { label: 'Área da tela', value: `${num(result.area, 1)} pol²` },
          ].map(({ label, value, big }) => (
            <div key={label} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: big ? '2rem' : '1.25rem', fontWeight: 700, color: big ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {result.ppi >= 300 ? '✅ PPI excelente (smartphone/retina)' :
           result.ppi >= 180 ? '✅ PPI muito bom' :
           result.ppi >= 110 ? '👍 PPI bom para uso a distância' :
           '⚠️ PPI baixo — pixels podem ser visíveis de perto'}
        </div>
      )}
    </div>
  );
}
