import { describe, expect, it } from "vitest";
import { base64Bytes, fitsCanvas, scaleCrop, sizeChangePercent } from "../image-tools";

describe("scaleCrop", () => {
  it("converte a seleção da imagem exibida para pixels da original", () => {
    // exibida com 300 px de largura, original com 1200 px: fator 4
    expect(scaleCrop({ x: 30, y: 15, w: 120, h: 60 }, 300, 1200)).toEqual({ x: 120, y: 60, w: 480, h: 240 });
  });

  it("arredonda para pixels inteiros", () => {
    expect(scaleCrop({ x: 10.4, y: 0, w: 99.9, h: 50 }, 400, 600)).toEqual({ x: 16, y: 0, w: 150, h: 75 });
  });
});

describe("sizeChangePercent", () => {
  it.each([
    [1000, 250, -75],
    [200, 300, 50],
    [500, 500, 0],
    [0, 100, 0],
  ])("de %d para %d bytes", (antes, depois, esperado) => {
    expect(sizeChangePercent(antes, depois)).toBe(esperado);
  });
});

describe("base64Bytes", () => {
  it.each([
    ["data:image/png;base64,QUJD", 3], // "ABC"
    ["data:image/png;base64,QUI=", 2], // "AB"
    ["data:image/png;base64,QQ==", 1], // "A"
    ["QUJD", 3],
    ["data:text/plain;base64,QU\nJD", 3],
  ])("%s", (entrada, esperado) => {
    expect(base64Bytes(entrada)).toBe(esperado);
  });
});

describe("fitsCanvas", () => {
  it("aceita imagens grandes dentro do limite e recusa as que passam", () => {
    expect(fitsCanvas(8000, 8000)).toBe(true);
    expect(fitsCanvas(16385, 100)).toBe(false);
    expect(fitsCanvas(12000, 12000)).toBe(false);
  });
});
