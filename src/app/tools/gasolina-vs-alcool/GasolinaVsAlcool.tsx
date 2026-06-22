'use client';
import { useState, useMemo } from 'react';
import { num } from '@/app/lib/format';

export default function GasolinaVsAlcool() {
  const [gas, setGas] = useState('6.50');
  const [eth, setEth] = useState('4.20');
  const [ratio, setRatio] = useState('70');
  const [liters, setLiters] = useState('50');

  const result = useMemo(() => {
    const g = parseFloat(gas) || 0;
    const e = parseFloat(eth) || 0;
    const r = parseFloat(ratio) / 100;
    if (!g || !e) return null;
    const threshold = g * r;
    const useAlcohol = e <= threshold;
    const best = useAlcohol ? 'alcool' : 'gasolina';
    const l = parseFloat(liters) || 0;
    const costGas = l * g;
    const costEth = l * e;
    const savings = Math.abs(costGas - costEth);
    return { threshold, useAlcohol, best, costGas, costEth, savings, ratio: (e / g * 100).toFixed(1) };
  }, [gas, eth, ratio, liters]);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          { label: 'Preço da Gasolina (R$/L)', val: gas, set: setGas },
          { label: 'Preço do Álcool (R$/L)', val: eth, set: setEth },
          { label: 'Regra (%)', val: ratio, set: setRatio },
          { label: 'Litros a abastecer', val: liters, set: setLiters },
        ].map(({ label, val, set }) => (
          <label key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
            <input style={inputStyle} value={val} onChange={e => set(e.target.value)} />
          </label>
        ))}
      </div>

      {result && (
        <>
          <div style={{
            padding: '1.5rem', borderRadius: '1rem', textAlign: 'center',
            background: result.useAlcohol ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
            border: `3px solid ${result.useAlcohol ? '#22c55e' : '#3b82f6'}`,
          }}>
            <div style={{ fontSize: '3rem' }}>{result.useAlcohol ? '🌿' : '⛽'}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: result.useAlcohol ? '#22c55e' : '#3b82f6', marginTop: '0.5rem' }}>
              {result.useAlcohol ? 'Álcool compensa!' : 'Gasolina compensa!'}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Álcool está a {result.ratio}% do preço da gasolina (limite: {ratio}%)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: `Custo Gasolina (${liters}L)`, value: `R$ ${num(result.costGas, 2)}` },
              { label: `Custo Álcool (${liters}L)`, value: `R$ ${num(result.costEth, 2)}` },
              { label: 'Economia com o melhor', value: `R$ ${num(result.savings, 2)}`, accent: true },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Limite de compensação: álcool a R$ {num(result.threshold, 3)}/L ou menos.
          </p>
        </>
      )}
    </div>
  );
}
