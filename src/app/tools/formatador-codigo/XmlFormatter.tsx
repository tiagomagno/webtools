'use client';
import { useState, useMemo } from 'react';

function formatXml(xml: string, indent = 2): string {
  let result = '';
  let level = 0;
  const pad = (n: number) => ' '.repeat(n * indent);

  const tokens = xml.replace(/>\s*</g, '><').split(/(?=<)|(?<=>)/);
  for (const token of tokens) {
    if (!token.trim()) continue;
    if (token.startsWith('</')) {
      level = Math.max(0, level - 1);
      result += pad(level) + token.trim() + '\n';
    } else if (token.startsWith('<') && !token.startsWith('<?') && !token.startsWith('<!') && !token.endsWith('/>')) {
      result += pad(level) + token.trim() + '\n';
      level++;
    } else {
      result += pad(level) + token.trim() + '\n';
    }
  }
  return result.trim();
}

function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
}

function validateXml(xml: string): string | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const err = doc.querySelector('parsererror');
    return err ? err.textContent ?? 'Erro desconhecido' : null;
  } catch {
    return 'Falha ao parsear XML.';
  }
}

type Mode = 'format' | 'minify';

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null };
    const err = validateXml(input);
    if (err) return { output: '', error: err };
    return { output: mode === 'format' ? formatXml(input) : minifyXml(input), error: null };
  }, [input, mode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['format', 'minify'] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
              background: mode === m ? 'var(--accent)' : 'var(--surface)',
              color: mode === m ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)', fontWeight: mode === m ? 700 : 400,
            }}
          >
            {m === 'format' ? 'Formatar' : 'Minificar'}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Cole o XML aqui…"
        rows={8}
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
          border: '1px solid var(--border)', background: 'var(--surface)',
          color: 'var(--text)', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem',
        }}
      />

      {error && (
        <p style={{ color: '#ef4444', padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </p>
      )}

      {output && (
        <div style={{ position: 'relative' }}>
          <textarea
            readOnly value={output} rows={8}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border)', background: 'var(--surface)',
              color: 'var(--accent)', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem',
            }}
          />
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            style={{
              position: 'absolute', top: '0.5rem', right: '0.5rem',
              padding: '0.25rem 0.75rem', borderRadius: '0.4rem',
              background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
            }}
          >
            Copiar
          </button>
        </div>
      )}
    </div>
  );
}
