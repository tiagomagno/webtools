import { describe, expect, it } from "vitest";
import { loginHref, safeNextPath } from "../auth/next";

describe("safeNextPath", () => {
  it("aceita caminhos internos, com query e hash", () => {
    expect(safeNextPath("/tools/contador-palavras")).toBe("/tools/contador-palavras");
    expect(safeNextPath("/tools/calculadoras?tipo=juros-simples")).toBe("/tools/calculadoras?tipo=juros-simples");
    expect(safeNextPath("/")).toBe("/");
  });

  it("recusa endereços externos e formas que o navegador trata como externas", () => {
    expect(safeNextPath("https://evil.com")).toBeNull();
    expect(safeNextPath("http://evil.com/x")).toBeNull();
    expect(safeNextPath("//evil.com")).toBeNull();
    expect(safeNextPath("/\\evil.com")).toBeNull();
    expect(safeNextPath("javascript:alert(1)")).toBeNull();
    expect(safeNextPath("evil.com")).toBeNull();
  });

  it("recusa caracteres de controle e quebras de linha", () => {
    expect(safeNextPath("/ok\r\nSet-Cookie: x=1")).toBeNull();
    expect(safeNextPath("/ok\u0000")).toBeNull();
  });

  it("não volta para as telas de login", () => {
    expect(safeNextPath("/login")).toBeNull();
    expect(safeNextPath("/login?next=/x")).toBeNull();
    expect(safeNextPath("/auth/callback")).toBeNull();
  });

  it("vazio e nulo viram null", () => {
    expect(safeNextPath("")).toBeNull();
    expect(safeNextPath(null)).toBeNull();
    expect(safeNextPath(undefined)).toBeNull();
  });
});

describe("loginHref", () => {
  it("leva o destino codificado", () => {
    expect(loginHref("/tools/contador-palavras")).toBe("/login?next=%2Ftools%2Fcontador-palavras");
    expect(loginHref("/tools/calculadoras?tipo=a&b=1")).toBe("/login?next=%2Ftools%2Fcalculadoras%3Ftipo%3Da%26b%3D1");
  });

  it("na home ou com destino inválido, vai ao login sem parâmetro", () => {
    expect(loginHref("/")).toBe("/login");
    expect(loginHref("//evil.com")).toBe("/login");
    expect(loginHref("/login")).toBe("/login");
  });
});
