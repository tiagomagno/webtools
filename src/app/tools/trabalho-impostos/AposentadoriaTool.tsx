'use client';
import { useState, useMemo } from 'react';
import { calcAposentadoria } from '@/app/lib/finance2';
import { brl, num } from '@/app/lib/format';

export default function AposentadoriaTool() {
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [age, setAge] = useState('40');
  const [years, setYears] = useState('15');
  const [avgSalary, setAvgSalary] = useState('3000');

  const result = useMemo(() => {
    const a = parseInt(age) || 0;
    const y = parseInt(years) || 0;
    const s = parseFloat(avgSalary.replace(',', '.')) || 0;
    if (!a || !y || !s) return null;
    return calcAposentadoria({ age: a, yearsContributed: y, avgSalary: s, sex });
  }, [sex, age, years, avgSalary, sex]);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {([['M', '👨 Homem'], ['F', '👩 Mulher']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setSex(v)}
            style={{
              padding: '0.4rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer',
              background: sex === v ? 'var(--accent)' : 'var(--surface)',
              color: sex === v ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)', fontWeight: sex === v ? 700 : 400,
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Idade atual (anos)</span>
          <input style={inputStyle} value={age} onChange={e => setAge(e.target.value)} type="number" min="16" max="100" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Anos contribuídos</span>
          <input style={inputStyle} value={years} onChange={e => setYears(e.target.value)} type="number" min="0" max="50" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Média salarial (R$)</span>
          <input style={inputStyle} value={avgSalary} onChange={e => setAvgSalary(e.target.value)} />
        </label>
      </div>

      {result && (
        <>
          <div style={{
            padding: '1.25rem', borderRadius: '1rem',
            background: result.canRetire ? 'rgba(34,197,94,0.08)' : 'rgba(234,179,8,0.08)',
            border: `2px solid ${result.canRetire ? '#22c55e' : '#eab308'}`,
            textAlign: 'center',
          }}>
            {result.canRetire ? (
              <>
                <div style={{ fontSize: '2rem' }}>✅</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22c55e', marginTop: '0.25rem' }}>
                  Você pode se aposentar!
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Atingiu a idade mínima ({result.minAge} anos) e o tempo mínimo ({result.minYears} anos).
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '2rem' }}>⏳</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#eab308', marginTop: '0.25rem' }}>
                  Ainda não elegível para aposentadoria
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {result.yearsLeft > 0 && `Faltam ${result.yearsLeft} anos de idade. `}
                  {result.contribLeft > 0 && `Faltam ${result.contribLeft} anos de contribuição.`}
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
            {[
              { label: '% do benefício', value: `${num(result.pct, 0)}%` },
              { label: 'Benefício estimado', value: brl(result.benefit), accent: true, big: true },
              { label: 'Teto INSS 2026', value: 'R$ 8.157,41' },
            ].map(({ label, value, accent, big }) => (
              <div key={label} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: big ? '1.5rem' : '1.2rem', fontWeight: 700, color: accent || big ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.75rem' }}>
            ⚠️ Simulação simplificada. Para resultado oficial, acesse o <strong>Meu INSS</strong> (meu.inss.gov.br). Não considera períodos de carência, regras de transição ou outros benefícios.
          </p>
        </>
      )}
    </div>
  );
}
