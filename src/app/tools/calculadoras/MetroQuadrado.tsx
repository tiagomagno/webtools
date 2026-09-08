'use client';
import { useState, useMemo } from 'react';
import { brl, num } from '@/app/lib/format';

type Mode = 'piso' | 'tinta';

export default function MetroQuadrado() {
  const [mode, setMode] = useState<Mode>('piso');
  const [area, setArea] = useState('20');
  const [price, setPrice] = useState('');
  const [waste, setWaste] = useState('10');
  const [boxArea, setBoxArea] = useState('2.16'); // m² por caixa
  const [yield_, setYield_] = useState('10'); // m² por litro

  const result = useMemo(() => {
    const a = parseFloat(area) || 0;
    const w = parseFloat(waste) / 100;
    const netArea = a * (1 + w);

    if (mode === 'piso') {
      const ba = parseFloat(boxArea) || 1;
      const boxes = Math.ceil(netArea / ba);
      const p = parseFloat(price) || 0;
      return { netArea, units: boxes, unitLabel: 'caixas', cost: boxes * p };
    } else {
      const y = parseFloat(yield_) || 10;
      const liters = netArea / y;
      const p = parseFloat(price) || 0;
      return { netArea, units: Math.ceil(liters), unitLabel: 'litros', cost: Math.ceil(liters) * p };
    }
  }, [mode, area, price, waste, boxArea, yield_]);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['piso', 'tinta'] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
              background: mode === m ? 'var(--accent)' : 'var(--surface)',
              color: mode === m ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)', fontWeight: mode === m ? 700 : 400,
            }}
          >
            {m === 'piso' ? '🪨 Piso / Azulejo' : '🖌️ Tinta'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Área total (m²)</span>
          <input style={inputStyle} value={area} onChange={e => setArea(e.target.value)} placeholder="20" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Desperdício (%)</span>
          <input style={inputStyle} value={waste} onChange={e => setWaste(e.target.value)} placeholder="10" />
        </label>
        {mode === 'piso' ? (
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Área por caixa (m²)</span>
            <input style={inputStyle} value={boxArea} onChange={e => setBoxArea(e.target.value)} placeholder="2.16" />
          </label>
        ) : (
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rendimento (m²/litro)</span>
            <input style={inputStyle} value={yield_} onChange={e => setYield_(e.target.value)} placeholder="10" />
          </label>
        )}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'piso' ? 'Preço por caixa (R$)' : 'Preço por litro (R$)'}
          </span>
          <input style={inputStyle} value={price} onChange={e => setPrice(e.target.value)} placeholder="0" />
        </label>
      </div>

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Área com desperdício', value: `${num(result.netArea, 2)} m²` },
            { label: result.unitLabel === 'caixas' ? 'Caixas necessárias' : 'Litros necessários', value: `${result.units} ${result.unitLabel}`, accent: true },
            { label: 'Custo total', value: price ? brl(result.cost) : '—', big: true },
          ].map(({ label, value, accent, big }) => (
            <div key={label} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: big ? '1.5rem' : '1.25rem', fontWeight: 700, color: accent || big ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
