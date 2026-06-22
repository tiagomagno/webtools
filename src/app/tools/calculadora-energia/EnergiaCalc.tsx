'use client';
import { useState } from 'react';
import { brl, num } from '@/app/lib/format';

type Appliance = { id: number; name: string; watts: number; hoursDay: number; daysMonth: number };

const DEFAULTS: Omit<Appliance, 'id'>[] = [
  { name: 'Geladeira', watts: 150, hoursDay: 24, daysMonth: 30 },
  { name: 'Ar-condicionado 9000 BTU', watts: 900, hoursDay: 8, daysMonth: 22 },
  { name: 'Televisão 40"', watts: 80, hoursDay: 5, daysMonth: 30 },
];

let nextId = 10;

function calcKwh(a: Appliance) {
  return (a.watts / 1000) * a.hoursDay * a.daysMonth;
}

export default function EnergiaCalc() {
  const [tariff, setTariff] = useState('0.85');
  const [items, setItems] = useState<Appliance[]>(DEFAULTS.map((d, i) => ({ ...d, id: i })));

  function addItem() {
    setItems(p => [...p, { id: nextId++, name: 'Novo aparelho', watts: 100, hoursDay: 4, daysMonth: 30 }]);
  }
  function removeItem(id: number) { setItems(p => p.filter(i => i.id !== id)); }
  function update(id: number, key: keyof Appliance, val: string | number) {
    setItems(p => p.map(i => i.id === id ? { ...i, [key]: val } : i));
  }

  const rate = parseFloat(tariff) || 0;
  const totalKwh = items.reduce((s, a) => s + calcKwh(a), 0);
  const totalCost = totalKwh * rate;

  const inputStyle: React.CSSProperties = {
    padding: '0.4rem 0.5rem', borderRadius: '0.4rem',
    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
    width: '100%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
        <span style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>Tarifa (R$/kWh):</span>
        <input style={{ ...inputStyle, width: '6rem' }} value={tariff} onChange={e => setTariff(e.target.value)} />
      </label>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              {['Aparelho', 'Potência (W)', 'Horas/dia', 'Dias/mês', 'kWh/mês', 'Custo/mês', ''].map(h => (
                <th key={h} style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(a => {
              const kwh = calcKwh(a);
              return (
                <tr key={a.id}>
                  <td style={{ padding: '0.4rem' }}><input style={inputStyle} value={a.name} onChange={e => update(a.id, 'name', e.target.value)} /></td>
                  <td style={{ padding: '0.4rem' }}><input style={{ ...inputStyle, width: '5rem' }} type="number" value={a.watts} min={1} onChange={e => update(a.id, 'watts', Number(e.target.value))} /></td>
                  <td style={{ padding: '0.4rem' }}><input style={{ ...inputStyle, width: '4rem' }} type="number" value={a.hoursDay} min={0} max={24} step={0.5} onChange={e => update(a.id, 'hoursDay', Number(e.target.value))} /></td>
                  <td style={{ padding: '0.4rem' }}><input style={{ ...inputStyle, width: '4rem' }} type="number" value={a.daysMonth} min={1} max={31} onChange={e => update(a.id, 'daysMonth', Number(e.target.value))} /></td>
                  <td style={{ padding: '0.4rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{num(kwh, 2)} kWh</td>
                  <td style={{ padding: '0.4rem', color: 'var(--accent)', fontWeight: 600, whiteSpace: 'nowrap' }}>{brl(kwh * rate)}</td>
                  <td style={{ padding: '0.4rem' }}>
                    <button onClick={() => removeItem(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1rem' }}>✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button onClick={addItem} style={{
        padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
        background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)',
        alignSelf: 'flex-start',
      }}>
        + Adicionar aparelho
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Total kWh/mês', value: `${num(totalKwh, 1)} kWh` },
          { label: 'Custo mensal', value: brl(totalCost), accent: true },
          { label: 'Custo anual', value: brl(totalCost * 12), big: true },
        ].map(({ label, value, accent, big }) => (
          <div key={label} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: big ? '1.5rem' : '1.25rem', fontWeight: 700, color: accent || big ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
