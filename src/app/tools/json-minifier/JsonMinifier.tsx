'use client';
import { useState, useMemo } from 'react';

export default function JsonMinifier() {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const minified = JSON.stringify(JSON.parse(input));
      const reduction = ((1 - minified.length / input.length) * 100).toFixed(1);
      return { minified, reduction: Number(reduction), error: null };
    } catch (e: unknown) {
      return { minified: '', reduction: 0, error: e instanceof Error ? e.message : 'JSON inválido' };
    }
  }, [input]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Cole o JSON aqui…\n{\n  "nome": "João",\n  "idade": 30\n}'
        rows={8}
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
          border: '1px solid var(--border)', background: 'var(--surface)',
          color: 'var(--text)', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem',
        }}
      />

      {result?.error && (
        <p style={{ color: '#ef4444', padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
          ⚠️ {result.error}
        </p>
      )}

      {result?.minified && (
        <>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'var(--accent)', color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
              -{result.reduction}% menor
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {input.length} → {result.minified.length} bytes
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              readOnly value={result.minified} rows={4}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: 'var(--accent)', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem',
              }}
            />
            <button
              onClick={() => navigator.clipboard.writeText(result.minified)}
              style={{
                position: 'absolute', top: '0.5rem', right: '0.5rem',
                padding: '0.25rem 0.75rem', borderRadius: '0.4rem',
                background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              }}
            >
              Copiar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
