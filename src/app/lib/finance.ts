// Cálculos financeiros para as ferramentas #71–#75.

/** SAC: parcelas decrescentes */
export interface SacRow { month: number; payment: number; amortization: number; interest: number; balance: number; }
export function calcSac(principal: number, annualRate: number, months: number): SacRow[] {
  const r = annualRate / 100 / 12;
  const amort = principal / months;
  let balance = principal;
  return Array.from({ length: months }, (_, i) => {
    const interest = balance * r;
    const payment = amort + interest;
    balance -= amort;
    return { month: i + 1, payment, amortization: amort, interest, balance: Math.max(balance, 0) };
  });
}

/** PRICE: parcelas fixas */
export interface PriceRow { month: number; payment: number; amortization: number; interest: number; balance: number; }
export function calcPrice(principal: number, annualRate: number, months: number): PriceRow[] {
  const r = annualRate / 100 / 12;
  const payment = r === 0 ? principal / months : principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  let balance = principal;
  return Array.from({ length: months }, (_, i) => {
    const interest = balance * r;
    const amort = payment - interest;
    balance -= amort;
    return { month: i + 1, payment, amortization: amort, interest, balance: Math.max(balance, 0) };
  });
}

/** INSS 2026 (tabela progressiva) */
const INSS_TABLE = [
  { max: 1518.00, rate: 0.075 },
  { max: 2793.88, rate: 0.09 },
  { max: 4190.83, rate: 0.12 },
  { max: 8157.41, rate: 0.14 },
];
export function calcInss(gross: number): number {
  let prev = 0;
  let total = 0;
  for (const { max, rate } of INSS_TABLE) {
    if (gross <= prev) break;
    total += (Math.min(gross, max) - prev) * rate;
    if (gross <= max) break;
    prev = max;
  }
  return total;
}

/** IRPF 2026 */
const IRPF_TABLE = [
  { max: 2259.20, rate: 0,    deduct: 0 },
  { max: 2826.65, rate: 0.075, deduct: 169.44 },
  { max: 3751.05, rate: 0.15, deduct: 381.44 },
  { max: 4664.68, rate: 0.225, deduct: 662.77 },
  { max: Infinity, rate: 0.275, deduct: 896.00 },
];
export function calcIrpf(base: number): number {
  for (const { max, rate, deduct } of IRPF_TABLE) {
    if (base <= max) return base * rate - deduct;
  }
  return 0;
}

export interface SalaryResult {
  gross: number; inss: number; irpfBase: number; irpf: number; net: number;
  dependentDeduction: number; otherDeductions: number;
}
export function calcSalary(gross: number, dependents = 0, otherDeductions = 0): SalaryResult {
  const inss = calcInss(gross);
  const dependentDeduction = dependents * 189.59;
  const irpfBase = Math.max(0, gross - inss - dependentDeduction - otherDeductions);
  const irpf = Math.max(0, calcIrpf(irpfBase));
  const net = gross - inss - irpf;
  return { gross, inss, irpfBase, irpf, net, dependentDeduction, otherDeductions };
}

export interface RescisaoResult {
  saldoSalario: number; aviso: number; feriasProporcional: number; feriasVencidas: number;
  terco: number; decimoTerceiro: number; fgts: number; multaFgts: number; total: number;
}
export function calcRescisao(
  salary: number, daysWorked: number, monthsWorked: number,
  hasNotice: boolean, vacationBalance: number, fgtsBalance: number,
  type: 'sem-justa-causa' | 'pedido-demissao' | 'justa-causa',
): RescisaoResult {
  const saldoSalario = (salary / 30) * daysWorked;
  const aviso = (hasNotice && type === 'sem-justa-causa') ? salary : 0;
  const feriasProporcional = (salary / 12) * monthsWorked;
  const feriasVencidas = vacationBalance ? salary : 0;
  const terco = (feriasProporcional + feriasVencidas) / 3;
  const decimoTerceiro = type !== 'justa-causa' ? (salary / 12) * monthsWorked : 0;
  const fgts = type === 'sem-justa-causa' ? fgtsBalance : 0;
  const multaFgts = type === 'sem-justa-causa' ? fgtsBalance * 0.4 : 0;
  const total = saldoSalario + aviso + feriasProporcional + feriasVencidas + terco + decimoTerceiro + fgts + multaFgts;
  return { saldoSalario, aviso, feriasProporcional, feriasVencidas, terco, decimoTerceiro, fgts, multaFgts, total };
}

/** Reajuste de aluguel por índice percentual */
export function calcReajuste(rent: number, indexPct: number, months: number) {
  const rate = indexPct / 100;
  const newRent = rent * (1 + rate);
  const diff = newRent - rent;
  const totalOld = rent * months;
  const totalNew = newRent * months;
  return { newRent, diff, totalOld, totalNew, totalDiff: totalNew - totalOld };
}

/** Comparação de investimentos em renda fixa */
export function calcInvestment(principal: number, months: number, cdiPct: number, options: {
  cdb: number; lci: number; poupanca: number;
}) {
  const monthly = (annual: number) => Math.pow(1 + annual / 100, 1 / 12) - 1;
  const cdiMonthly = monthly(cdiPct);

  const calc = (ratePct: number, ir: boolean) => {
    const r = monthly(ratePct * cdiPct / 100);
    const gross = principal * Math.pow(1 + r, months) - principal;
    const irRate = months <= 6 ? 0.225 : months <= 12 ? 0.20 : months <= 24 ? 0.175 : 0.15;
    const tax = ir ? gross * irRate : 0;
    return { gross, tax, net: gross - tax, final: principal + gross - tax };
  };

  return {
    cdb: calc(options.cdb, true),
    lci: calc(options.lci, false),
    poupanca: { gross: principal * Math.pow(1 + cdiMonthly * 0.7, months) - principal, tax: 0, net: principal * Math.pow(1 + cdiMonthly * 0.7, months) - principal, final: principal * Math.pow(1 + cdiMonthly * 0.7, months) },
  };
}
