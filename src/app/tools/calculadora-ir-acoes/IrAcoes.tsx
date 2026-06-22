'use client';
import { useState, useMemo } from 'react';
import { calcIrAcoes } from '@/app/lib/finance2';
import { brl, num } from '@/app/lib/format';

export default function IrAcoes() {
  const [saleValue, setSaleValue] = useState('25000');
  const [costBasis, setCostBasis] = useState('20000');
  const [isSwing, setIsSwing] = useState(false);
  const [exempt, setExempt] = useState(true);

  const result = useMemo(() => {
    const s = parseFloat(saleValue.replace(',', '.')) || 0;
    const c = parseFloat(costBasis.replace(',', '.')) || 0;
    if (!s || !c) return null;
    return calcIrAcoes(s, c, isSwing, exempt);
  }, [saleValue, costBasis, isSwing, exempt]);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Valor total de venda (R$)</span>
          <input style={inputStyle} value={saleValue} onChange={e => setSaleValue(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Custo de aquisição (R$)</span>
          <input style={inputStyle} value={costBasis} onChange={e => setCostBasis(e.target.value)} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', color: 'var(--text)' }}>
          <input type="checkbox" checked={isSwing} onChange={e => setIsSwing(e.target.checked)} />
          Day trade / Swing trade (alíquota 20%)
        </label>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', color: 'var(--text)' }}>
          <input type="checkbox" checked={exempt} onChange={e => setExempt(e.target.checked)} />
          Verificar isenção de R$20.000
        </label>
      </div>

      {result && (
        <>
          <div style={{
            padding: '1.25rem', borderRadius: '1rem',
            background: result.tax === 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
            border: `2px solid ${result.tax === 0 ? '#22c55e' : '#ef4444'}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: result.tax === 0 ? '#22c55e' : '#ef4444' }}>
              {result.tax === 0 ? '🟢 Isento' : brl(result.tax)}
            </div>
            {result.aliquota > 0 && (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Alíquota: {result.aliquota}% sobre lucro de {brl(result.gain)}
              </div>
            )}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {result.note}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
            {[
              { label: 'Valor de venda', value: brl(parseFloat(saleValue.replace(',','.')) || 0) },
              { label: 'Custo de aquisição', value: brl(parseFloat(costBasis.replace(',','.')) || 0) },
              { label: result.gain >= 0 ? 'Lucro bruto' : 'Prejuízo', value: brl(Math.abs(result.gain)), accent: result.gain > 0 },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
