import { describe, expect, it } from "vitest";
import {
  calcInss,
  calcInvestment,
  calcIrpf,
  calcPrice,
  calcRescisao,
  calcSac,
  calcSalary,
} from "../finance";

describe("calcInss (tabela progressiva 2026)", () => {
  it("aplica só a primeira faixa até 1.518,00", () => {
    expect(calcInss(1518)).toBeCloseTo(113.85, 2);
  });

  it("soma as faixas para um salário intermediário", () => {
    // 113,85 + 1275,88 * 9% + 206,12 * 12%
    expect(calcInss(3000)).toBeCloseTo(253.4136, 4);
  });

  it("limita no teto acima de 8.157,41", () => {
    expect(calcInss(10000)).toBeCloseTo(951.6344, 4);
    expect(calcInss(50000)).toBeCloseTo(951.6344, 4);
  });

  it("retorna 0 para salário 0", () => {
    expect(calcInss(0)).toBe(0);
  });
});

describe("calcIrpf (tabela 2026)", () => {
  it("é isento até 2.259,20", () => {
    expect(calcIrpf(2259.2)).toBe(0);
    expect(calcIrpf(1000)).toBe(0);
  });

  it("aplica alíquota e parcela a deduzir da faixa", () => {
    expect(calcIrpf(3000)).toBeCloseTo(68.56, 2); // 15% - 381,44
    expect(calcIrpf(5000)).toBeCloseTo(479, 2); // 27,5% - 896,00
  });
});

describe("calcSalary", () => {
  it("calcula líquido = bruto - INSS - IRPF", () => {
    const r = calcSalary(3000);
    expect(r.inss).toBeCloseTo(253.4136, 4);
    expect(r.irpfBase).toBeCloseTo(2746.5864, 4);
    expect(r.irpf).toBeCloseTo(36.554, 2);
    expect(r.net).toBeCloseTo(2710.0324, 3);
  });

  it("dependentes reduzem a base do IRPF (189,59 cada)", () => {
    const semDep = calcSalary(4000);
    const comDep = calcSalary(4000, 2);
    expect(comDep.dependentDeduction).toBeCloseTo(379.18, 2);
    expect(comDep.irpf).toBeLessThan(semDep.irpf);
  });

  it("nunca devolve IRPF negativo", () => {
    expect(calcSalary(1500).irpf).toBe(0);
  });
});

describe("calcSac", () => {
  it("sem juros, todas as parcelas são iguais", () => {
    const rows = calcSac(1200, 0, 12);
    expect(rows).toHaveLength(12);
    rows.forEach((r) => expect(r.payment).toBeCloseTo(100, 6));
  });

  it("com juros, a 1ª parcela é amortização + juros e a última só 1% de 100", () => {
    const rows = calcSac(1200, 12, 12); // 1% ao mês
    expect(rows[0].payment).toBeCloseTo(112, 6);
    expect(rows[11].payment).toBeCloseTo(101, 6);
    expect(rows[11].balance).toBeCloseTo(0, 6);
  });
});

describe("calcPrice", () => {
  it("parcela fixa de R$ 1.000 a 1% a.m. em 12 meses ≈ 88,85", () => {
    const rows = calcPrice(1000, 12, 12);
    expect(rows[0].payment).toBeCloseTo(88.85, 2);
    expect(rows[11].payment).toBeCloseTo(rows[0].payment, 8);
  });

  it("zera o saldo no fim e amortiza exatamente o principal", () => {
    const rows = calcPrice(1000, 12, 12);
    expect(rows[11].balance).toBeCloseTo(0, 6);
    const amortizado = rows.reduce((s, r) => s + r.amortization, 0);
    expect(amortizado).toBeCloseTo(1000, 6);
  });

  it("sem juros divide o principal igualmente", () => {
    const rows = calcPrice(1200, 0, 12);
    expect(rows[0].payment).toBeCloseTo(100, 8);
  });
});

describe("calcRescisao", () => {
  const base = { salary: 3000, days: 10, months: 6, fgts: 10000 };

  it("sem justa causa: todas as verbas, aviso e multa de 40% do FGTS", () => {
    const r = calcRescisao(base.salary, base.days, base.months, true, true, base.fgts, "sem-justa-causa");
    expect(r.saldoSalario).toBeCloseTo(1000, 6);
    expect(r.aviso).toBe(3000);
    expect(r.feriasProporcional).toBeCloseTo(1500, 6);
    expect(r.feriasVencidas).toBe(3000);
    expect(r.terco).toBeCloseTo(1500, 6);
    expect(r.decimoTerceiro).toBeCloseTo(1500, 6);
    expect(r.multaFgts).toBeCloseTo(4000, 6);
    expect(r.total).toBeCloseTo(25500, 6);
  });

  it("pedido de demissão: sem aviso indenizado, FGTS nem multa", () => {
    const r = calcRescisao(base.salary, base.days, base.months, true, true, base.fgts, "pedido-demissao");
    expect(r.aviso).toBe(0);
    expect(r.fgts).toBe(0);
    expect(r.multaFgts).toBe(0);
    expect(r.total).toBeCloseTo(8500, 6);
  });

  it("justa causa: sem 13º proporcional", () => {
    const r = calcRescisao(base.salary, base.days, base.months, true, true, base.fgts, "justa-causa");
    expect(r.decimoTerceiro).toBe(0);
    expect(r.total).toBeCloseTo(7000, 6);
  });

  it("sem férias vencidas, o terço incide só sobre as proporcionais", () => {
    const r = calcRescisao(base.salary, 0, base.months, false, false, 0, "sem-justa-causa");
    expect(r.feriasVencidas).toBe(0);
    expect(r.terco).toBeCloseTo(500, 6);
  });
});

describe("calcInvestment", () => {
  it("CDB a 100% do CDI (10% a.a.) por 12 meses rende 1.000 brutos, 20% de IR", () => {
    const r = calcInvestment(10000, 12, 10, { cdb: 100, lci: 90, poupanca: 70 });
    expect(r.cdb.gross).toBeCloseTo(1000, 4);
    expect(r.cdb.tax).toBeCloseTo(200, 4);
    expect(r.cdb.net).toBeCloseTo(800, 4);
  });

  it("LCI é isenta de IR", () => {
    const r = calcInvestment(10000, 12, 10, { cdb: 100, lci: 90, poupanca: 70 });
    expect(r.lci.tax).toBe(0);
    expect(r.lci.net).toBeCloseTo(r.lci.gross, 8);
  });

  it("alíquota de IR cai com o prazo: 22,5% até 6 meses e 15% acima de 24", () => {
    const curto = calcInvestment(10000, 6, 10, { cdb: 100, lci: 100, poupanca: 70 });
    const longo = calcInvestment(10000, 36, 10, { cdb: 100, lci: 100, poupanca: 70 });
    expect(curto.cdb.tax / curto.cdb.gross).toBeCloseTo(0.225, 6);
    expect(longo.cdb.tax / longo.cdb.gross).toBeCloseTo(0.15, 6);
  });
});
