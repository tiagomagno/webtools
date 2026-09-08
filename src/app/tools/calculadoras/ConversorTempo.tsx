'use client';
import { useState, useMemo } from 'react';

const UNITS = [
  { key: 'seconds', label: 'Segundos', toSec: 1 },
  { key: 'minutes', label: 'Minutos', toSec: 60 },
  { key: 'hours',   label: 'Horas',    toSec: 3600 },
  { key: 'days',    label: 'Dias',     toSec: 86400 },
  { key: 'weeks',   label: 'Semanas',  toSec: 604800 },
  { key: 'months',  label: 'Meses',    toSec: 2629800 }, // 30.4375 dias
  { key: 'years',   label: 'Anos',     toSec: 31557600 }, // 365.25 dias
];

function fmt(n: number): string {
  if (n === 0) return '0';
  if (Math.abs(n) >= 1e9) return n.toExponential(4);
  if (Number.isInteger(n) || Math.abs(n) >= 100) return n.toLocaleString('pt-BR', { maximumFractionDigits: 4 });
  return n.toLocaleString('pt-BR', { maximumSignificantDigits: 6 });
}

export default function ConversorTempo() {
  const [from, setFrom] = useState('hours');
  const [value, setValue] = useState('1');

  const results = useMemo(() => {
    const v = parseFloat(value.replace(',', '.'));
    if (!v && v !== 0) return null;
    const fromUnit = UNITS.find(u => u.key === from)!;
    const inSeconds = v * fromUnit.toSec;
    return UNITS.map(u => ({ ...u, result: inSeconds / u.toSec }));
  }, [from, value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Valor</span>
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
            }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Unidade de origem</span>
          <select
            value={from}
            onChange={e => setFrom(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer',
            }}
          >
            {UNITS.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
        </label>
      </div>

      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {results.map(u => (
            <div
              key={u.key}
              style={{
                display: 'grid', gridTemplateColumns: '7rem 1fr auto',
                background: u.key === from ? 'rgba(var(--accent-rgb,59,130,246),0.08)' : 'var(--surface)',
                border: `1px solid ${u.key === from ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '0.5rem', overflow: 'hidden', alignItems: 'center',
              }}
            >
              <span style={{ padding: '0.6rem 0.75rem', fontWeight: u.key === from ? 700 : 400, color: u.key === from ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                {u.label}
              </span>
              <span style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text)', fontWeight: u.key === from ? 700 : 400 }}>
                {fmt(u.result)}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(String(u.result))}
                style={{
                  padding: '0.4rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.75rem', marginRight: '0.25rem',
                }}
              >
                Copiar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
