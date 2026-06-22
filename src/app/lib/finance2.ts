// Cálculos financeiros para P3 (#89, #95–#98).

/** Juros Simples: M = P(1 + i·n) */
export function calcJurosSimples(principal: number, ratePct: number, periods: number, unit: 'month' | 'year') {
  const rate = ratePct / 100;
  const n = unit === 'year' ? periods * 12 : periods;
  const rateMonth = unit === 'year' ? rate / 12 : rate;
  const interest = principal * rateMonth * n;
  const total = principal + interest;
  return { interest, total, periods: n };
}

/** INSS Contribuinte Individual / Autônomo 2026 */
const SALARIO_MINIMO_2026 = 1518;
const TETO_INSS_2026 = 8157.41;

export function calcInssAutonomo(grossMonthly: number, type: 'autonomo' | 'facultativo-baixo' | 'plano-simplificado') {
  if (type === 'plano-simplificado') {
    const contrib = SALARIO_MINIMO_2026 * 0.11;
    return { contrib, aliquota: 11, base: SALARIO_MINIMO_2026, note: 'Sem direito a aposentadoria por tempo de contribuição.' };
  }
  if (type === 'facultativo-baixo') {
    const contrib = SALARIO_MINIMO_2026 * 0.20;
    return { contrib, aliquota: 20, base: SALARIO_MINIMO_2026, note: 'Facultativo com plano básico (20%).' };
  }
  const base = Math.min(Math.max(grossMonthly, SALARIO_MINIMO_2026), TETO_INSS_2026);
  const contrib = base * 0.20;
  return { contrib, aliquota: 20, base, note: 'Contribuinte individual (autônomo) — 20% sobre a remuneração.' };
}

/** DAS MEI 2026 */
const MEI_CATEGORIES: Record<string, { name: string; inss: number; icms: number; iss: number }> = {
  comercio: { name: 'Comércio / Indústria',         inss: 75.90, icms: 1,  iss: 0 },
  servico:  { name: 'Prestação de Serviços',        inss: 75.90, icms: 0,  iss: 5 },
  ambos:    { name: 'Comércio + Serviços',           inss: 75.90, icms: 1,  iss: 5 },
};

export function calcDasMei(category: keyof typeof MEI_CATEGORIES) {
  const c = MEI_CATEGORIES[category];
  const total = c.inss + c.icms + c.iss;
  return { ...c, total };
}

export const MEI_CATS = Object.entries(MEI_CATEGORIES).map(([k, v]) => ({ key: k, label: v.name }));

/** Simulação de Aposentadoria INSS (simplificada) */
export function calcAposentadoria(params: {
  age: number; yearsContributed: number; avgSalary: number; sex: 'M' | 'F';
}) {
  const { age, yearsContributed, avgSalary, sex } = params;
  const minAge = sex === 'M' ? 65 : 62;
  const minYears = sex === 'M' ? 20 : 15;

  const canRetire = age >= minAge && yearsContributed >= minYears;
  const yearsLeft = Math.max(0, minAge - age);
  const contribLeft = Math.max(0, minYears - yearsContributed);

  // Fator previdenciário simplificado: 60% + 2% por ano além do mínimo
  const extraYears = Math.max(0, yearsContributed - minYears);
  const pct = Math.min(1, 0.60 + extraYears * 0.02);
  const benefit = Math.max(SALARIO_MINIMO_2026, Math.min(avgSalary * pct, TETO_INSS_2026));

  return { canRetire, yearsLeft, contribLeft, pct: pct * 100, benefit, minAge, minYears };
}

/** IR sobre Ganho de Capital em Ações */
export function calcIrAcoes(saleValue: number, costBasis: number, isSwingTrade: boolean, exempt: boolean) {
  const gain = saleValue - costBasis;
  if (gain <= 0) return { gain, tax: 0, aliquota: 0, note: 'Sem ganho de capital — sem IR.' };
  if (exempt && saleValue <= 20000) return { gain, tax: 0, aliquota: 0, note: 'Isento: vendas ≤ R$20.000/mês no mercado à vista.' };
  const rate = isSwingTrade ? 0.20 : 0.15;
  const tax = gain * rate;
  return { gain, tax, aliquota: rate * 100, note: isSwingTrade ? 'Day trade/swing trade: alíquota 20%.' : 'Mercado à vista: alíquota 15%.' };
}
