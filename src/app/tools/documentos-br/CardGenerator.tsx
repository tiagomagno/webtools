'use client';
import { useState } from 'react';
import { generateCard, formatCard, BRANDS, type CardBrand } from '@/app/lib/luhn';

export default function CardGenerator() {
  const [brand, setBrand] = useState<CardBrand>('visa');
  const [qty, setQty] = useState(5);
  const [cards, setCards] = useState<string[]>([]);
  const [formatted, setFormatted] = useState(true);

  function generate() {
    setCards(Array.from({ length: qty }, () => {
      const raw = generateCard(brand);
      return formatted ? formatCard(raw, brand) : raw;
    }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {BRANDS.map(b => (
          <button key={b.key} onClick={() => setBrand(b.key)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
              background: brand === b.key ? 'var(--accent)' : 'var(--surface)',
              color: brand === b.key ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)', fontWeight: brand === b.key ? 700 : 400,
            }}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
          Quantidade:
          <input
            type="number" value={qty} min={1} max={50}
            onChange={e => setQty(Math.min(50, Math.max(1, Number(e.target.value))))}
            style={{
              width: '4rem', padding: '0.4rem', borderRadius: '0.4rem',
              border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
            }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text)' }}>
          <input type="checkbox" checked={formatted} onChange={e => setFormatted(e.target.checked)} />
          Formatado (com espaços)
        </label>
        <button
          onClick={generate}
          style={{
            padding: '0.5rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer',
            background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700,
          }}
        >
          Gerar
        </button>
      </div>

      {cards.length > 0 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {cards.map((c, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--accent)', letterSpacing: '0.05em' }}>{c}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(c)}
                  style={{
                    padding: '0.2rem 0.5rem', borderRadius: '0.3rem', cursor: 'pointer',
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-muted)', fontSize: '0.75rem',
                  }}
                >
                  Copiar
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(cards.join('\n'))}
            style={{
              padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', alignSelf: 'flex-start',
              background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)',
            }}
          >
            Copiar todos
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ⚠️ Estes números são apenas para testes. Não representam cartões bancários reais.
          </p>
        </>
      )}
    </div>
  );
}
