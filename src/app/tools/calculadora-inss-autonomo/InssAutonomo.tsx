'use client';
import { useState, useMemo } from 'react';
import { calcInssAutonomo } from '@/app/lib/finance2';
import { brl } from '@/app/lib/format';

type Plan = 'autonomo' | 'facultativo-baixo' | 'plano-simplificado';

const PLANS: { key: Plan; label: string; desc: string }[] = [
  { key: 'autonomo', label: 'Autônomo / Individual (20%)', desc: 'Direito a todos os benefícios previdenciários.' },
  { key: 'plano-simplificado', label: 'Plano Simplificado (11%)', desc: 'Sem aposentadoria por tempo de contribuição.' },
  { key: 'facultativo-baixo', label: 'Facultativo Básico (20%)', desc: 'Para quem não trabalha com vínculo ou CNPJ.' },
];

export default function InssAutonomo() {
  const [plan, setPlan] = useState<Plan>('autonomo');
  const [salary, setSalary] = useState('3000');

  const result = useMemo(() => {
    const v = parseFloat(salary.replace(',', '.')) || 0;
    return calcInssAutonomo(v, plan);
  }, [plan, salary]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {PLANS.map(p => (
          <label key={p.key} style={{
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer',
            background: plan === p.key ? 'rgba(59,130,246,0.08)' : 'var(--surface)',
            border: `2px solid ${plan === p.key ? 'var(--accent)' : 'var(--border)'}`,
          }}>
            <input type="radio" name="plan" value={p.key} checked={plan === p.key} onChange={() => setPlan(p.key)} style={{ marginTop: '0.2rem' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text)' }}>{p.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.desc}</div>
            </div>
          </label>
        ))}
      </div>

      {plan === 'autonomo' && (
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Remuneração bruta mensal (R$)</span>
          <input
            value={salary}
            onChange={e => setSalary(e.target.value)}
            style={{
              padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
            }}
          />
        </label>
      )}

      <div style={{ padding: '1.25rem', borderRadius: '0.75rem', background: 'var(--surface)', border: '2px solid var(--accent)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Base de Cálculo</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{brl(result.base)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Alíquota</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{result.aliquota}%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contribuição</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{brl(result.contrib)}</div>
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          {result.note}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Custo anual (INSS)</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{brl(result.contrib * 12)}</div>
        </div>
        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>13ª + 14ª contribuição</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{brl(result.contrib * 14)}</div>
        </div>
      </div>
    </div>
  );
}
