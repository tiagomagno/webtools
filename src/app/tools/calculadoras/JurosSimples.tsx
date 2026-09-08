'use client';
import { useState, useMemo } from 'react';
import { calcJurosSimples } from '@/app/lib/finance2';
import { brl } from '@/app/lib/format';

export default function JurosSimples() {
  const [principal, setPrincipal] = useState('1000');
  const [rate, setRate] = useState('2');
  const [periods, setPeriods] = useState('12');
  const [unit, setUnit] = useState<'month' | 'year'>('month');

  const result = useMemo(() => {
    const p = parseFloat(principal.replace(',', '.'));
    const r = parseFloat(rate.replace(',', '.'));
    const n = parseInt(periods);
    if (!p || !r || !n || p <= 0 || r <= 0 || n <= 0) return null;
    return calcJurosSimples(p, r, n, unit);
  }, [principal, rate, periods, unit]);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Capital inicial (R$)</span>
          <input style={inputStyle} value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="1000" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Taxa de juros (%)</span>
          <input style={inputStyle} value={rate} onChange={e => setRate(e.target.value)} placeholder="2" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Número de períodos</span>
          <input style={inputStyle} value={periods} onChange={e => setPeriods(e.target.value)} placeholder="12" type="number" min="1" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Período</span>
          <select value={unit} onChange={e => setUnit(e.target.value as 'month' | 'year')}
            style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="month">Mensal</option>
            <option value="year">Anual</option>
          </select>
        </label>
      </div>

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Capital inicial', value: brl(parseFloat(principal.replace(',','.'))) },
            { label: 'Juros totais', value: brl(result.interest), accent: true },
            { label: 'Montante final', value: brl(result.total), big: true },
          ].map(({ label, value, accent, big }) => (
            <div key={label} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: big ? '1.75rem' : '1.4rem', fontWeight: 700, color: accent || big ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Fórmula: M = {brl(parseFloat(principal.replace(',','.')))} × (1 + {rate}% × {result.periods}) = {brl(result.total)}
        </div>
      )}
    </div>
  );
}
