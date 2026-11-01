'use client';
import { useState, useMemo } from 'react';
import { calcDasMei, MEI_CATS } from '@/app/lib/finance2';
import { brl } from '@/app/lib/format';

export default function MeiTool() {
  const [category, setCategory] = useState('comercio');

  const result = useMemo(() => calcDasMei(category), [category]);

  const breakdown = [
    { label: 'INSS (previdência)', value: result.inss },
    ...(result.icms > 0 ? [{ label: 'ICMS (comércio/indústria)', value: result.icms }] : []),
    ...(result.iss > 0 ? [{ label: 'ISS (serviços)', value: result.iss }] : []),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {MEI_CATS.map(c => (
          <label key={c.key} style={{
            display: 'flex', gap: '0.75rem', alignItems: 'center',
            padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer',
            background: category === c.key ? 'rgba(59,130,246,0.08)' : 'var(--surface)',
            border: `2px solid ${category === c.key ? 'var(--accent)' : 'var(--border)'}`,
          }}>
            <input type="radio" name="cat" value={c.key} checked={category === c.key} onChange={() => setCategory(c.key)} />
            <span style={{ fontWeight: category === c.key ? 700 : 400, color: 'var(--text)' }}>{c.label}</span>
          </label>
        ))}
      </div>

      <div style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--surface)', border: '2px solid var(--accent)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>DAS mensal total</div>
        <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent)', margin: '0.5rem 0' }}>{brl(result.total)}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{result.name}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {breakdown.map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.75rem',
            borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)',
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{brl(value)}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Custo anual (DAS)</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{brl(result.total * 12)}</div>
        </div>
        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Faturamento máximo anual</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>R$ 169.200</div>
        </div>
      </div>
    </div>
  );
}
