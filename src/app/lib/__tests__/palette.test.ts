import { describe, expect, it } from "vitest";
import { buildExport, contrastRatio, cssColor, extractPalette, formatColor, harmonyColors, hexToHsl, hexToHsv, hslToHex, hsvToHex, parseColorInput, randomBase } from "../palette";

describe("conversões de cor", () => {
  it.each([
    [0, 100, 50, "#ff0000"],
    [120, 100, 50, "#00ff00"],
    [240, 100, 50, "#0000ff"],
    [0, 0, 100, "#ffffff"],
    [0, 0, 0, "#000000"],
  ])("hslToHex(%d, %d, %d)", (h, s, l, esperado) => {
    expect(hslToHex(h, s, l)).toBe(esperado);
  });

  it("hexToHsl de vermelho e cinza médio", () => {
    expect(hexToHsl("#ff0000")).toEqual([0, 100, 50]);
    expect(hexToHsl("#808080")).toEqual([0, 0, 50]);
  });

  it.each([
    ["#ff0000", [0, 100, 100]],
    ["#00ff00", [120, 100, 100]],
    ["#0000ff", [240, 100, 100]],
    ["#ffffff", [0, 0, 100]],
    ["#000000", [0, 0, 0]],
  ])("hexToHsv(%s)", (hex, esperado) => {
    expect(hexToHsv(hex)).toEqual(esperado);
  });

  it("hsvToHex nos cantos do espaço", () => {
    expect(hsvToHex(0, 100, 100)).toBe("#ff0000");
    expect(hsvToHex(60, 100, 100)).toBe("#ffff00");
    expect(hsvToHex(0, 0, 100)).toBe("#ffffff");
    expect(hsvToHex(200, 50, 0)).toBe("#000000");
  });

  it("HEX → HSV → HEX volta ao mesmo valor (sem perda perceptível)", () => {
    for (let i = 0; i < 50; i++) {
      const hex = randomBase();
      const [h, s, v] = hexToHsv(hex);
      const volta = hsvToHex(h, s, v);
      const diff = [1, 3, 5].reduce((m, p) => Math.max(m, Math.abs(parseInt(hex.slice(p, p + 2), 16) - parseInt(volta.slice(p, p + 2), 16))), 0);
      expect(diff).toBeLessThanOrEqual(3);
    }
  });
});

describe("contrastRatio (WCAG 2.1)", () => {
  it("preto sobre branco é 21 e cor igual é 1", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#336699", "#336699")).toBe(1);
  });
});

describe("harmonyColors", () => {
  it("sempre devolve 5 cores válidas e mantém a base exata", () => {
    for (const type of ["monochromatic", "analogous", "complementary", "split-complementary", "triadic", "tetradic"] as const) {
      const { colors, baseIndex } = harmonyColors("#3b82f6", type);
      expect(colors).toHaveLength(5);
      colors.forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/));
      expect(colors[baseIndex]).toBe("#3b82f6");
    }
  });

  it("complementar de vermelho puro gira o matiz 180° (ciano em 180°)", () => {
    expect(hslToHex(180, 100, 50)).toBe("#00ffff");
    expect(hexToHsl(harmonyColors("#ff0000", "complementary").colors[3])).toEqual([180, 100, 42]);
  });

  it("análoga de vermelho puro gira o matiz -40° (rosa #ff00aa em 320°)", () => {
    expect(hslToHex(320, 100, 50)).toBe("#ff00aa");
    expect(harmonyColors("#ff0000", "analogous").colors[0]).toBe("#ff00aa");
  });

  it("monocromática varia só a luminosidade", () => {
    const clara = harmonyColors("#ff0000", "monochromatic").colors[4];
    expect(hexToHsl(clara)).toEqual([0, 100, 80]);
  });

  it("base inválida não quebra", () => {
    expect(harmonyColors("azul", "triadic").colors).toHaveLength(5);
  });
});

describe("extractPalette", () => {
  const pixels = (rgb: [number, number, number], n: number) => Array.from({ length: n }, () => [...rgb, 255]).flat();

  it("devolve as cores dominantes, da mais frequente para a menos", () => {
    const data = new Uint8ClampedArray([...pixels([255, 0, 0], 200), ...pixels([0, 0, 255], 80)]);
    expect(extractPalette(data)).toEqual(["#ff0000", "#0000ff"]);
  });

  it("ignora pixels transparentes e cores quase iguais", () => {
    const data = new Uint8ClampedArray([...pixels([255, 0, 0], 100), ...pixels([250, 5, 5], 100), ...Array(400).fill(0)]);
    expect(extractPalette(data)).toEqual(["#ff0000"]);
  });

  it("respeita o limite de cores", () => {
    const data = new Uint8ClampedArray([...pixels([255, 0, 0], 50), ...pixels([0, 255, 0], 40), ...pixels([0, 0, 255], 30), ...pixels([255, 255, 0], 20)]);
    expect(extractPalette(data, 3)).toHaveLength(3);
  });
});

describe("buildExport", () => {
  const cores = ["#112233", "#445566"];
  it("CSS, Tailwind e JSON", () => {
    expect(buildExport("css", cores)).toBe(":root {\n  --color-1: #112233;\n  --color-2: #445566;\n}");
    expect(buildExport("tailwind", cores)).toContain('1: "#112233",');
    expect(JSON.parse(buildExport("json", cores))).toEqual({ colors: cores });
  });
});

describe("formatColor / cssColor / parseColorInput", () => {
  it("formata nos três formatos", () => {
    expect(formatColor("#426db3", "hex")).toBe("#426DB3");
    expect(formatColor("#426db3", "rgb")).toBe("66, 109, 179");
    expect(cssColor("#426db3", "rgb")).toBe("rgb(66, 109, 179)");
    expect(cssColor("#ff0000", "hsl")).toBe("hsl(0, 100%, 50%)");
  });

  it.each([
    ["hex", "#426DB3", "#426db3"],
    ["hex", "426db3", "#426db3"],
    ["rgb", "66, 109, 179", "#426db3"],
    ["rgb", "rgb(255, 0, 0)", "#ff0000"],
    ["hsl", "0, 100%, 50%", "#ff0000"],
    ["hsl", "hsl(240, 100%, 50%)", "#0000ff"],
  ] as const)("lê %s %j", (formato, texto, esperado) => {
    expect(parseColorInput(formato, texto)).toBe(esperado);
  });

  it.each([
    ["hex", "#12345"],
    ["hex", "azul"],
    ["rgb", "256, 0, 0"],
    ["rgb", "10, 20"],
    ["rgb", "a, b, c"],
    ["hsl", "361, 50%, 50%"],
    ["hsl", "10, 101%, 50%"],
  ] as const)("recusa %s %j", (formato, texto) => {
    expect(parseColorInput(formato, texto)).toBeNull();
  });

  it("ida e volta HEX → RGB → HEX", () => {
    for (let i = 0; i < 30; i++) {
      const hex = randomBase();
      expect(parseColorInput("rgb", formatColor(hex, "rgb"))).toBe(hex);
    }
  });
});
