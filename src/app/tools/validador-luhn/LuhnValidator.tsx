'use client';
import { useState, useMemo } from 'react';
import { validateLuhn, detectBrand } from '@/app/lib/luhn';

function maskCard(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export default function LuhnValidator() {
  const [raw, setRaw] = useState('');

  const digits = raw.replace(/\D/g, '');
  const result = useMemo(() => {
    if (digits.length < 12) return null;
    return {
      valid: validateLuhn(digits),
      brand: detectBrand(digits),
      length: digits.length,
    };
  }, [digits]);

  const borderColor = result ? (result.valid ? '#22c55e' : '#ef4444') : 'var(--border)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
      <input
        value={raw}
        onChange={e => setRaw(maskCard(e.target.value))}
        placeholder="4111 1111 1111 1111"
        maxLength={23}
        style={{
          width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem',
          border: `2px solid ${borderColor}`, background: 'var(--surface)',
          color: 'var(--text)', fontFamily: 'monospace', fontSize: '1.2rem',
          letterSpacing: '0.1em', transition: 'border-color 0.2s',
        }}
      />

      {result && (
        <div style={{
          padding: '1rem', borderRadius: '0.75rem',
          background: result.valid ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
          border: `2px solid ${result.valid ? '#22c55e' : '#ef4444'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{result.valid ? '✅' : '❌'}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: result.valid ? '#22c55e' : '#ef4444' }}>
                {result.valid ? 'Número válido (Luhn ✓)' : 'Número inválido (Luhn ✗)'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{result.brand} — {result.length} dígitos</div>
            </div>
          </div>
        </div>
      )}

      {digits.length > 0 && digits.length < 12 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Digite pelo menos 12 dígitos ({digits.length}/12)
        </p>
      )}
    </div>
  );
}
