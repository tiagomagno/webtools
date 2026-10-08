import { describe, expect, it } from "vitest";
import {
  formatCnpj,
  formatCpf,
  generateCnpj,
  generateCpf,
  validateCnpj,
  validateCpf,
} from "../cpf-cnpj";
import { detectBrand, formatCard, generateCard, validateLuhn, type CardBrand } from "../luhn";

describe("validateCpf", () => {
  it("aceita CPF válido, com ou sem máscara", () => {
    expect(validateCpf("529.982.247-25").valid).toBe(true);
    expect(validateCpf("52998224725").valid).toBe(true);
  });

  it("rejeita dígito verificador errado", () => {
    const r = validateCpf("529.982.247-26");
    expect(r.valid).toBe(false);
    expect(r.message).toMatch(/verificadores/);
  });

  it("rejeita tamanho errado e sequências repetidas", () => {
    expect(validateCpf("123").valid).toBe(false);
    expect(validateCpf("111.111.111-11").valid).toBe(false);
  });
});

describe("validateCnpj", () => {
  it("aceita CNPJ válido, com ou sem máscara", () => {
    expect(validateCnpj("11.222.333/0001-81").valid).toBe(true);
    expect(validateCnpj("11222333000181").valid).toBe(true);
  });

  it("rejeita dígito verificador errado, tamanho errado e repetidos", () => {
    expect(validateCnpj("11.222.333/0001-82").valid).toBe(false);
    expect(validateCnpj("123").valid).toBe(false);
    expect(validateCnpj("00.000.000/0000-00").valid).toBe(false);
  });
});

describe("geradores de CPF e CNPJ", () => {
  it("todo CPF gerado passa na validação (50 amostras)", () => {
    for (let i = 0; i < 50; i++) expect(validateCpf(generateCpf()).valid).toBe(true);
  });

  it("todo CNPJ gerado passa na validação (50 amostras)", () => {
    for (let i = 0; i < 50; i++) expect(validateCnpj(generateCnpj()).valid).toBe(true);
  });

  it("respeitam o formato com e sem máscara", () => {
    expect(generateCpf(true)).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    expect(generateCpf(false)).toMatch(/^\d{11}$/);
    expect(generateCnpj(true)).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
    expect(generateCnpj(false)).toMatch(/^\d{14}$/);
  });
});

describe("formatCpf / formatCnpj (máscara progressiva)", () => {
  it("formata enquanto o usuário digita", () => {
    expect(formatCpf("529")).toBe("529");
    expect(formatCpf("5299")).toBe("529.9");
    expect(formatCpf("52998224725")).toBe("529.982.247-25");
    expect(formatCnpj("11222333000181")).toBe("11.222.333/0001-81");
  });

  it("ignora o que não é dígito e corta o excesso", () => {
    expect(formatCpf("529.982.247-25999")).toBe("529.982.247-25");
    expect(formatCnpj("11.222.333/0001-81 extra")).toBe("11.222.333/0001-81");
  });
});

describe("validateLuhn", () => {
  it("aceita cartões de teste públicos", () => {
    expect(validateLuhn("4111 1111 1111 1111")).toBe(true); // Visa
    expect(validateLuhn("5555555555554444")).toBe(true); // Mastercard
    expect(validateLuhn("378282246310005")).toBe(true); // Amex
  });

  it("rejeita número alterado e número curto", () => {
    expect(validateLuhn("4111111111111112")).toBe(false);
    expect(validateLuhn("4111")).toBe(false);
  });
});

describe("generateCard", () => {
  const marcas: CardBrand[] = ["visa", "mastercard", "amex", "elo"];

  it.each(marcas)("%s: número gerado passa em Luhn e tem o tamanho certo", (marca) => {
    for (let i = 0; i < 20; i++) {
      const n = generateCard(marca);
      expect(validateLuhn(n)).toBe(true);
      expect(n).toHaveLength(marca === "amex" ? 15 : 16);
    }
  });
});

describe("detectBrand e formatCard", () => {
  it("detecta a bandeira pelo prefixo", () => {
    expect(detectBrand("4111111111111111")).toBe("Visa");
    expect(detectBrand("5555555555554444")).toBe("Mastercard");
    expect(detectBrand("378282246310005")).toBe("American Express");
    expect(detectBrand("6362970000457013")).toBe("Elo");
    expect(detectBrand("9999")).toBe("Desconhecida");
  });

  it("agrupa de 4 em 4 (Amex em 4-6-5)", () => {
    expect(formatCard("4111111111111111")).toBe("4111 1111 1111 1111");
    expect(formatCard("378282246310005", "amex")).toBe("3782 822463 10005");
  });
});
