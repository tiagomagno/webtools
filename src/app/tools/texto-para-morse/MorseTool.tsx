'use client';
import { useState } from 'react';
import { textToMorse, morseToText } from '@/app/lib/morse';

type Mode = 'encode' | 'decode';

export default function MorseTool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');

  const output = input
    ? mode === 'encode' ? textToMorse(input) : morseToText(input)
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['encode', 'decode'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput(''); }}
            style={{
              padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
              background: mode === m ? 'var(--accent)' : 'var(--surface)',
              color: mode === m ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)', fontWeight: mode === m ? 700 : 400,
            }}
          >
            {m === 'encode' ? 'Texto → Morse' : 'Morse → Texto'}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Digite o texto aqui…' : 'Cole o código Morse aqui (use / entre palavras)…'}
        rows={5}
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
          border: '1px solid var(--border)', background: 'var(--surface)',
          color: 'var(--text)', resize: 'vertical', fontFamily: 'monospace',
        }}
      />

      {output && (
        <div style={{ position: 'relative' }}>
          <textarea
            readOnly value={output} rows={5}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border)', background: 'var(--surface)',
              color: 'var(--accent)', resize: 'vertical', fontFamily: 'monospace',
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
