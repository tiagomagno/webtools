// Helpers de formatação numérica para as calculadoras (#41–#50).

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const NUM = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

/** Formata um valor como moeda BRL (R$). */
export function brl(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return BRL.format(value);
}

/** Formata um número no padrão pt-BR, com até `digits` casas decimais. */
export function num(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits }).format(value);
}

/** Formata uma porcentagem (recebe o valor já em %, ex.: 12.5 → "12,5%"). */
export function pct(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return NUM.format(Number(value.toFixed(digits))) + "%";
}
