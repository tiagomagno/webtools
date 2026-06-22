'use client';
import { useState, useMemo } from 'react';

const MONTHS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DAYS = ['dom','seg','ter','qua','qui','sex','sáb'];

const PRESETS = [
  { label: 'A cada minuto', expr: '* * * * *' },
  { label: 'Todo dia às 00:00', expr: '0 0 * * *' },
  { label: 'Todo dia às 09:00', expr: '0 9 * * *' },
  { label: 'Segunda a sexta às 08:00', expr: '0 8 * * 1-5' },
  { label: 'Todo sábado às 10:00', expr: '0 10 * * 6' },
  { label: 'Dia 1 de cada mês', expr: '0 0 1 * *' },
  { label: 'A cada hora', expr: '0 * * * *' },
  { label: 'A cada 15 minutos', expr: '*/15 * * * *' },
];

function describeField(val: string, singular: string, plural: string, names?: string[], max?: number): string {
  if (val === '*') return `todo ${singular}`;
  if (val.startsWith('*/')) {
    const step = val.slice(2);
    return `a cada ${step} ${plural}`;
  }
  if (val.includes('-')) {
    const [a, b] = val.split('-');
    const na = names ? (names[Number(a)] ?? a) : a;
    const nb = names ? (names[Number(b)] ?? b) : b;
    return `de ${na} a ${nb}`;
  }
  if (val.includes(',')) {
    const parts = val.split(',').map(v => names ? (names[Number(v)] ?? v) : v);
    return parts.join(', ');
  }
  return names ? (names[Number(val)] ?? val) : val;
}

function parseCron(expr: string): { ok: boolean; desc: string; nexts: string[] } {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return { ok: false, desc: 'Expressão inválida — insira 5 campos.', nexts: [] };

  const [min, hour, dom, month, dow] = parts;

  const minuteDesc = describeField(min, 'minuto', 'minutos');
  const hourDesc = describeField(hour, 'hora', 'horas');
  const domDesc = dom === '*' ? null : `no dia ${dom}`;
  const monthDesc = month === '*' ? null : `em ${describeField(month, 'mês', 'meses', MONTHS)}`;
  const dowDesc = dow === '*' ? null : `${describeField(dow, 'dia', 'dias', DAYS)}`;

  let desc = `Executa `;
  if (min.startsWith('*/')) {
    desc += minuteDesc;
  } else if (hour === '*') {
    desc += `às ${min.padStart(2,'0')} minutos de ${hourDesc}`;
  } else {
    const h = hour.includes(',') || hour.includes('-') ? hour : hour.padStart(2,'0');
    const m = min.padStart(2,'0');
    desc += `às ${h}:${m}`;
  }

  if (dowDesc) desc += `, ${dowDesc}`;
  else if (domDesc) desc += `, ${domDesc}`;
  if (monthDesc) desc += ` ${monthDesc}`;
  desc += '.';

  // Próximas 5 execuções (aproximação)
  const nexts: string[] = [];
  const now = new Date();
  let check = new Date(now);
  check.setSeconds(0, 0);
  check.setMinutes(check.getMinutes() + 1);

  const validMin = (v: number) => {
    if (min === '*') return true;
    if (min.startsWith('*/')) return v % Number(min.slice(2)) === 0;
    return min.split(',').map(Number).includes(v);
  };
  const validHour = (v: number) => {
    if (hour === '*') return true;
    if (hour.startsWith('*/')) return v % Number(hour.slice(2)) === 0;
    return hour.split(',').map(Number).includes(v);
  };
  const validDow = (v: number) => {
    if (dow === '*') return true;
    if (dow.includes('-')) { const [a,b]=dow.split('-').map(Number); return v>=a && v<=b; }
    return dow.split(',').map(Number).includes(v);
  };

  let iters = 0;
  while (nexts.length < 5 && iters++ < 100000) {
    if (validMin(check.getMinutes()) && validHour(check.getHours()) && validDow(check.getDay())) {
      nexts.push(check.toLocaleString('pt-BR'));
    }
    check.setMinutes(check.getMinutes() + 1);
  }

  return { ok: true, desc, nexts };
}

export default function CronHelper() {
  const [expr, setExpr] = useState('0 9 * * 1-5');
  const result = useMemo(() => parseCron(expr), [expr]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <input
          value={expr}
          onChange={e => setExpr(e.target.value)}
          placeholder="0 9 * * 1-5"
          style={{
            width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
            border: '1px solid var(--border)', background: 'var(--surface)',
            color: 'var(--text)', fontFamily: 'monospace', fontSize: '1.1rem',
          }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.25rem', marginTop: '0.25rem' }}>
          {['Minuto','Hora','Dia','Mês','Dia da semana'].map(l => (
            <span key={l} style={{ textAlign:'center', fontSize:'0.7rem', color:'var(--text-muted)' }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {PRESETS.map(p => (
          <button key={p.expr} onClick={() => setExpr(p.expr)}
            style={{
              padding: '0.3rem 0.7rem', borderRadius: '0.5rem', cursor: 'pointer',
              background: expr === p.expr ? 'var(--accent)' : 'var(--surface)',
              color: expr === p.expr ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)', fontSize: '0.8rem',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--surface)', border: `2px solid ${result.ok ? 'var(--accent)' : '#ef4444'}` }}>
        <p style={{ fontWeight: 700, fontSize: '1rem', color: result.ok ? 'var(--text)' : '#ef4444', margin: 0 }}>{result.desc}</p>
      </div>

      {result.nexts.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Próximas execuções</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {result.nexts.map((n, i) => (
              <div key={i} style={{
                padding: '0.4rem 0.75rem', borderRadius: '0.4rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--accent)',
              }}>
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
