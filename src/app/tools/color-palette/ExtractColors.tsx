'use client';
import { useState, useRef } from 'react';

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function quantize(data: Uint8ClampedArray, k = 12): Array<{ hex: string; rgb: string; count: number }> {
  const bucket: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const a = data[i + 3];
    if (a < 128) continue;
    const key = `${r},${g},${b}`;
    bucket[key] = (bucket[key] ?? 0) + 1;
  }
  return Object.entries(bucket)
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([key, count]) => {
      const [r, g, b] = key.split(',').map(Number);
      return { hex: rgbToHex(r, g, b), rgb: `rgb(${r},${g},${b})`, count };
    });
}

function isDark(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export default function ExtractColors() {
  const [colors, setColors] = useState<Array<{ hex: string; rgb: string; count: number }>>([]);
  const [preview, setPreview] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      const size = 100;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      setColors(quantize(data));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function copy(val: string) {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 1200);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
        style={{
          border: '2px dashed var(--border)', borderRadius: '0.75rem',
          padding: '2rem', textAlign: 'center', cursor: 'pointer',
          background: 'var(--surface)', color: 'var(--text-muted)',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        🌈 Arraste uma imagem ou clique para selecionar
      </div>

      {preview && colors.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <img src={preview} alt="preview" style={{ maxWidth: '180px', maxHeight: '180px', borderRadius: '0.5rem', objectFit: 'cover' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', flex: 1 }}>
            {colors.map((c, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                <div
                  style={{
                    width: '60px', height: '60px', borderRadius: '0.5rem',
                    background: c.hex, cursor: 'pointer', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isDark(c.hex) ? '#fff' : '#000', fontSize: '0.65rem', fontWeight: 700,
                  }}
                  onClick={() => copy(c.hex)}
                  title="Clique para copiar HEX"
                >
                  {copied === c.hex ? '✓' : ''}
                </div>
                <button onClick={() => copy(c.hex)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text)',
                    padding: '0', lineHeight: 1.2,
                  }}
                >
                  {c.hex.toUpperCase()}
                </button>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{c.rgb}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
