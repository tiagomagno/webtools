'use client';
import { useState } from 'react';

function shuffle(text: string): string {
  const words = text.split(' ');
  return words.map(w => {
    const arr = w.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }).join(' ');
}

export default function AnagramaTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<string[]>([]);

  function generate() {
    if (!input.trim()) return;
    const set = new Set<string>();
    let attempts = 0;
    while (set.size < 10 && attempts < 200) {
      const s = shuffle(input);
      if (s !== input) set.add(s);
      attempts++;
    }
    setResults(Array.from(set));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="Digite uma palavra ou frase…"
          style={{
            flex: 1, padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
            border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
          }}
        />
        <button
          onClick={generate}
          style={{
            padding: '0.6rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer',
            background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700,
          }}
        >
          Embaralhar
        </button>
      </div>

      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {results.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: 'var(--accent)' }}>{r}</span>
              <button
                onClick={() => navigator.clipboard.writeText(r)}
                style={{
                  padding: '0.2rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer',
                  background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem',
                }}
              >
                Copiar
              </button>
            </div>
          ))}
        </div>
      )}

      {input && results.length === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Clique em Embaralhar para gerar anagramas.</p>
      )}
    </div>
  );
}
