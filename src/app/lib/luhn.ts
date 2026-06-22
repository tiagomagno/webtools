// Algoritmo de Luhn para geração e validação de cartões (#86, #87).

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'elo';

const PREFIXES: Record<CardBrand, { prefix: string; length: number; label: string }> = {
  visa:       { prefix: '4',    length: 16, label: 'Visa' },
  mastercard: { prefix: '5',    length: 16, label: 'Mastercard' },
  amex:       { prefix: '37',   length: 15, label: 'American Express' },
  elo:        { prefix: '6362', length: 16, label: 'Elo' },
};

function luhnCheckDigit(partial: string): number {
  let sum = 0;
  const digits = partial.split('').map(Number);
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if ((digits.length - i) % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return (10 - (sum % 10)) % 10;
}

function rndDigits(n: number): string {
  const arr = new Uint8Array(n);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => v % 10).join('');
}

export function generateCard(brand: CardBrand = 'visa'): string {
  const { prefix, length } = PREFIXES[brand];
  const fillLen = length - prefix.length - 1;
  const partial = prefix + rndDigits(fillLen);
  const check = luhnCheckDigit(partial);
  return partial + check;
}

export function validateLuhn(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 12) return false;
  let sum = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if ((digits.length - 1 - i) % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function detectBrand(digits: string): string {
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'American Express';
  if (/^6(011|22|4[4-9]|5)/.test(digits)) return 'Discover / Elo';
  if (/^63(6[0-9]|7[0-8])/.test(digits)) return 'Elo';
  return 'Desconhecida';
}

export function formatCard(raw: string, brand: CardBrand = 'visa'): string {
  const d = raw.replace(/\D/g, '');
  if (brand === 'amex') return d.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  return d.replace(/(\d{4})/g, '$1 ').trim();
}

export const BRANDS = Object.entries(PREFIXES).map(([k, v]) => ({ key: k as CardBrand, label: v.label }));
