// Geração e validação de CPF e CNPJ para testes (#58–#61).

function rnd(n: number) {
  const arr = new Uint32Array(n);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => v % 10);
}

function cpfDigit(digits: number[]) {
  let sum = 0;
  const len = digits.length + 1;
  digits.forEach((d, i) => { sum += d * (len - i); });
  const rem = (sum * 10) % 11;
  return rem >= 10 ? 0 : rem;
}

export function generateCpf(formatted = true): string {
  const d = rnd(9);
  d.push(cpfDigit(d));
  d.push(cpfDigit(d));
  const s = d.join('');
  return formatted ? `${s.slice(0,3)}.${s.slice(3,6)}.${s.slice(6,9)}-${s.slice(9)}` : s;
}

export function validateCpf(raw: string): { valid: boolean; message: string } {
  const d = raw.replace(/\D/g, '');
  if (d.length !== 11) return { valid: false, message: 'CPF deve ter 11 dígitos.' };
  if (/^(\d)\1+$/.test(d)) return { valid: false, message: 'CPF com todos os dígitos iguais é inválido.' };
  const nums = d.split('').map(Number);
  const calc = (n: number) => {
    let s = 0;
    for (let i = 0; i < n - 1; i++) s += nums[i] * (n - i);
    const r = (s * 10) % 11;
    return r >= 10 ? 0 : r;
  };
  if (calc(10) !== nums[9] || calc(11) !== nums[10])
    return { valid: false, message: 'Dígitos verificadores inválidos.' };
  return { valid: true, message: 'CPF válido.' };
}

function cnpjDigit(digits: number[], weights: number[]) {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  const rem = sum % 11;
  return rem < 2 ? 0 : 11 - rem;
}

export function generateCnpj(formatted = true): string {
  const d = rnd(12);
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  d.push(cnpjDigit(d, w1));
  d.push(cnpjDigit(d, w2));
  const s = d.join('');
  return formatted
    ? `${s.slice(0,2)}.${s.slice(2,5)}.${s.slice(5,8)}/${s.slice(8,12)}-${s.slice(12)}`
    : s;
}

export function validateCnpj(raw: string): { valid: boolean; message: string } {
  const d = raw.replace(/\D/g, '');
  if (d.length !== 14) return { valid: false, message: 'CNPJ deve ter 14 dígitos.' };
  if (/^(\d)\1+$/.test(d)) return { valid: false, message: 'CNPJ com todos os dígitos iguais é inválido.' };
  const nums = d.split('').map(Number);
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d1 = cnpjDigit(nums.slice(0, 12), w1);
  const d2 = cnpjDigit(nums.slice(0, 13), w2);
  if (d1 !== nums[12] || d2 !== nums[13])
    return { valid: false, message: 'Dígitos verificadores inválidos.' };
  return { valid: true, message: 'CNPJ válido.' };
}

export function formatCpf(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
}

export function formatCnpj(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0,2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`;
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`;
}
