'use client';
import { useState, useMemo } from 'react';

const VOWELS = new Set('aeiouàáâãäèéêëìíîïòóôõöùúûüAEIOUÀÁÂÃÄÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜ');

function normalize(c: string) {
  return c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function analyze(text: string) {
  const freq: Record<string, number> = {};
  let vowels = 0, consonants = 0, other = 0;
  for (const ch of text) {
    if (/[a-zA-ZÀ-ÖØ-öø-ÿ]/.test(ch)) {
      const base = normalize(ch);
      freq[base] = (freq[base] ?? 0) + 1;
      if (VOWELS.has(ch)) vowels++;
      else consonants++;
    } else if (ch !== ' ' && ch !== '\n') {
      other++;
    }
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return { freq, sorted, vowels, consonants, other, total: vowels + consonants };
}

export default function LetterFrequency() {
  const [text, setText] = useState('');
  const result = useMemo(() => text ? analyze(text) : null, [text]);
  const max = result ? (result.sorted[0]?.[1] ?? 1) : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Cole ou digite o texto para analisar…"
        rows={6}
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
          border: '1px solid var(--border)', background: 'var(--surface)',
          color: 'var(--text)', resize: 'vertical',
        }}
      />

      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
            {[
              { label: 'Letras totais', value: result.total },
              { label: 'Vogais', value: result.vowels },
              { label: 'Consoantes', value: result.consonants },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {result.sorted.map(([letter, count]) => (
              <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '1.5rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>{letter.toUpperCase()}</span>
                <div style={{ flex: 1, background: 'var(--border)', borderRadius: '999px', overflow: 'hidden', height: '1rem' }}>
                  <div style={{ width: `${(count / max) * 100}%`, background: 'var(--accent)', height: '100%', borderRadius: '999px' }} />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', width: '3rem', textAlign: 'right' }}>
                  {count} ({((count / result.total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
