import { describe, expect, it } from "vitest";
import { hashText } from "../hash";
import { base64UrlToBase64, decodeBase64, decodeBase64Url, encodeBase64 } from "../base64";

describe("hashText", () => {
  // Vetores de teste do RFC 1321 (MD5).
  it.each([
    ["", "d41d8cd98f00b204e9800998ecf8427e"],
    ["a", "0cc175b9c0f1b6a831c399e269772661"],
    ["abc", "900150983cd24fb0d6963f7d28e17f72"],
    ["message digest", "f96b697d7cb7938d525a2f31aaf161d0"],
    ["The quick brown fox jumps over the lazy dog", "9e107d9d372bb6826bd81d3542a419d6"],
  ])("MD5(%j)", async (texto, esperado) => {
    expect(await hashText(texto, "MD5")).toBe(esperado);
  });

  it("MD5 de texto com mais de 64 bytes (vários blocos)", async () => {
    const texto = "12345678901234567890123456789012345678901234567890123456789012345678901234567890";
    expect(await hashText(texto, "MD5")).toBe("57edf4a22be3c955ac49da2e2107b67a");
  });

  it("SHA-1 e SHA-256 de 'abc' (vetores FIPS 180)", async () => {
    expect(await hashText("abc", "SHA-1")).toBe("a9993e364706816aba3e25717850c26c9cd0d89d");
    expect(await hashText("abc", "SHA-256")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("SHA-512 devolve 128 caracteres hexadecimais", async () => {
    expect(await hashText("abc", "SHA-512")).toMatch(/^[0-9a-f]{128}$/);
  });
});

describe("base64", () => {
  it("codifica ASCII", () => {
    expect(encodeBase64("Hello")).toBe("SGVsbG8=");
    expect(decodeBase64("SGVsbG8=")).toBe("Hello");
  });

  it("codifica UTF-8 (acentos) corretamente", () => {
    expect(encodeBase64("ação")).toBe("YcOnw6Nv");
    expect(decodeBase64("YcOnw6Nv")).toBe("ação");
  });

  it("ida e volta preserva emojis e caracteres especiais", () => {
    const texto = "Olá, mundo! 🚀 çãõ — “aspas”";
    expect(decodeBase64(encodeBase64(texto))).toBe(texto);
  });

  it("ignora espaços nas pontas ao decodificar", () => {
    expect(decodeBase64("  SGVsbG8=\n")).toBe("Hello");
  });

  it("lança erro para Base64 inválido", () => {
    expect(() => decodeBase64("!!!")).toThrow();
  });
});

describe("Base64URL (JWT)", () => {
  it("converte -/_ e completa o padding", () => {
    expect(base64UrlToBase64("-_-_")).toBe("+/+/");
    expect(base64UrlToBase64("YQ")).toBe("YQ==");
  });

  it("decodifica o cabeçalho de um JWT", () => {
    expect(decodeBase64Url("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")).toBe('{"alg":"HS256","typ":"JWT"}');
  });
});
