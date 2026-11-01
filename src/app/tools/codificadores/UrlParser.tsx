'use client';
import { useState, useMemo } from 'react';

function parseUrl(raw: string) {
  try {
    const u = new URL(raw);
    const params = Array.from(u.searchParams.entries()).map(([k, v]) => ({ key: k, value: v }));
    return {
      protocol: u.protocol.replace(':', ''),
      host: u.hostname,
      port: u.port || (u.protocol === 'https:' ? '443' : '80'),
      pathname: u.pathname,
      search: u.search,
      hash: u.hash.replace('#', ''),
      params,
      origin: u.origin,
      error: null,
    };
  } catch {
    return null;
  }
}

const EXAMPLES = [
  'https://www.exemplo.com.br/blog/artigo?id=42&lang=pt#comentarios',
  'https://api.github.com/repos/vercel/next.js/issues?state=open&per_page=30',
];

export default function UrlParser() {
  const [url, setUrl] = useState('');
  const result = useMemo(() => url ? parseUrl(url) : null, [url]);

  const fields = result ? [
    { label: 'Protocolo', value: result.protocol },
    { label: 'Host', value: result.host },
    { label: 'Porta', value: result.port },
    { label: 'Path', value: result.pathname },
    { label: 'Query', value: result.search || '—' },
    { label: 'Hash / Âncora', value: result.hash || '—' },
    { label: 'Origin', value: result.origin },
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Cole uma URL completa aqui…"
          style={{
            width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
            border: `1px solid ${url && !result ? '#ef4444' : 'var(--border)'}`,
            background: 'var(--surface)', color: 'var(--text)',
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
          {EXAMPLES.map(e => (
            <button key={e} onClick={() => setUrl(e)}
              style={{
                padding: '0.2rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer',
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontSize: '0.75rem',
              }}
            >
              Exemplo {EXAMPLES.indexOf(e) + 1}
            </button>
          ))}
        </div>
      </div>

      {url && !result && (
        <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>URL inválida — inclua o protocolo (https://).</p>
      )}

      {result && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {fields.map(({ label, value }) => (
              <div key={label} style={{
                display: 'grid', gridTemplateColumns: '9rem 1fr',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '0.5rem', overflow: 'hidden',
              }}>
                <span style={{ padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.05)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {label}
                </span>
                <span style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--accent)', wordBreak: 'break-all' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {result.params.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>Parâmetros ({result.params.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {result.params.map(({ key, value }, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr 2fr',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '0.5rem', overflow: 'hidden',
                  }}>
                    <span style={{ padding: '0.4rem 0.75rem', background: 'rgba(0,0,0,0.05)', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text)' }}>{key}</span>
                    <span style={{ padding: '0.4rem 0.75rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent)' }}>{decodeURIComponent(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
