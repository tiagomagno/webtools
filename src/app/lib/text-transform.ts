// Utilitários de transformação de texto para as ferramentas #46–#52.

export function toUpperCase(s: string) { return s.toUpperCase(); }
export function toLowerCase(s: string) { return s.toLowerCase(); }
export function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
export function toSentenceCase(s: string) {
  return s.replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()).replace(/(?<=[.!?]\s+)\w/g, c => c.toLowerCase());
}
export function toCamelCase(s: string) {
  return s.trim().replace(/[\s_\-]+(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, c => c.toLowerCase());
}
export function toPascalCase(s: string) {
  return s.trim().replace(/[\s_\-]+(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, c => c.toUpperCase());
}
export function toSnakeCase(s: string) {
  return s.trim().replace(/[\s\-]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}
export function toKebabCase(s: string) {
  return s.trim().replace(/[\s_]+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
export function toAlternatingCase(s: string) {
  return s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
}

export function reverseChars(s: string) { return s.split('').reverse().join(''); }
export function reverseWords(s: string) { return s.split(/\s+/).reverse().join(' '); }
export function reverseLines(s: string) { return s.split('\n').reverse().join('\n'); }

export function countLines(s: string) {
  const lines = s.split('\n');
  const nonEmpty = lines.filter(l => l.trim() !== '');
  const unique = new Set(lines.map(l => l.trim())).size;
  return { total: lines.length, nonEmpty: nonEmpty.length, empty: lines.length - nonEmpty.length, unique };
}

export function removeAccents(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export type SortMode = 'asc' | 'desc' | 'length-asc' | 'length-desc' | 'shuffle' | 'unique';
export function sortLines(s: string, mode: SortMode) {
  const lines = s.split('\n');
  switch (mode) {
    case 'asc': return [...lines].sort((a, b) => a.localeCompare(b, 'pt-BR')).join('\n');
    case 'desc': return [...lines].sort((a, b) => b.localeCompare(a, 'pt-BR')).join('\n');
    case 'length-asc': return [...lines].sort((a, b) => a.length - b.length).join('\n');
    case 'length-desc': return [...lines].sort((a, b) => b.length - a.length).join('\n');
    case 'shuffle': {
      const arr = [...lines];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join('\n');
    }
    case 'unique': return [...new Set(lines)].join('\n');
  }
}

export function caesarCipher(s: string, shift: number) {
  const n = ((shift % 26) + 26) % 26;
  return s.replace(/[a-zA-Z]/g, c => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + n) % 26) + base);
  });
}

const ONES = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
  'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const TENS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const HUNDREDS = ['', 'cem', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

function chunk(n: number): string {
  if (n === 0) return '';
  if (n === 100) return 'cem';
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  const rem = n % 100;
  const parts: string[] = [];
  if (h) parts.push(HUNDREDS[h]);
  if (rem < 20) { if (rem > 0) parts.push(ONES[rem]); }
  else { if (t) parts.push(TENS[t]); if (o) parts.push(ONES[o]); }
  return parts.join(' e ');
}

export function numberToWords(n: number): string {
  if (!Number.isFinite(n) || n > 999_999_999_999) return '(número fora do intervalo)';
  if (n === 0) return 'zero';
  const neg = n < 0;
  let abs = Math.abs(Math.floor(n));
  const groups: { value: number; singular: string; plural: string }[] = [
    { value: Math.floor(abs / 1_000_000_000), singular: 'bilhão', plural: 'bilhões' },
    { value: Math.floor((abs % 1_000_000_000) / 1_000_000), singular: 'milhão', plural: 'milhões' },
    { value: Math.floor((abs % 1_000_000) / 1_000), singular: 'mil', plural: 'mil' },
    { value: abs % 1_000, singular: '', plural: '' },
  ];
  const parts: string[] = [];
  for (const g of groups) {
    if (g.value === 0) continue;
    const word = chunk(g.value);
    if (g.singular === '') { parts.push(word); }
    else if (g.value === 1) { parts.push(g.singular === 'mil' ? 'mil' : `um ${g.singular}`); }
    else { parts.push(`${word} ${g.plural}`); }
  }
  return (neg ? 'menos ' : '') + parts.join(' e ');
}
