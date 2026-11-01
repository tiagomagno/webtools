import { describe, expect, it } from "vitest";
import {
  DEFAULT_ANIMATION, DEFAULT_CONFIG, applyPreset, buildCss, expandStops, gradientFunction, hexToOklab, hexWithAlpha, linearLine, mixColor,
  oklabToHex, PRESETS, radialRadii, randomGradient, stop, svgMarkup, tailwindClass, type GradientConfig,
} from "../gradient";
import { randomBase } from "../palette";

const cfg = (over: Partial<GradientConfig> = {}): GradientConfig => ({
  ...DEFAULT_CONFIG, space: "srgb", stops: [stop("#6366f1", 0), stop("#ec4899", 100)], ...over,
});

describe("OKLab", () => {
  it("branco e vermelho batem com os valores publicados (CSS Color 4)", () => {
    const [L, a, b] = hexToOklab("#ffffff");
    expect(L).toBeCloseTo(1, 3);
    expect(a).toBeCloseTo(0, 3);
    expect(b).toBeCloseTo(0, 3);
    const [Lr, ar, br] = hexToOklab("#ff0000");
    expect(Lr).toBeCloseTo(0.62796, 3);
    expect(ar).toBeCloseTo(0.22486, 3);
    expect(br).toBeCloseTo(0.12585, 3);
  });

  it("HEX → OKLab → HEX volta ao mesmo valor", () => {
    for (let i = 0; i < 40; i++) {
      const hex = randomBase();
      expect(oklabToHex(...hexToOklab(hex))).toBe(hex);
    }
  });
});

describe("mixColor", () => {
  it("meio entre preto e branco: #808080 em sRGB e #636363 em OKLab", () => {
    expect(mixColor("#000000", "#ffffff", 0.5, "srgb")).toBe("#808080");
    expect(mixColor("#000000", "#ffffff", 0.5, "oklab")).toBe("#636363");
  });

  it("extremos devolvem as cores originais em qualquer espaço", () => {
    for (const space of ["srgb", "oklab", "oklch"] as const) {
      expect(mixColor("#336699", "#ff8800", 0, space)).toBe("#336699");
      expect(mixColor("#336699", "#ff8800", 1, space)).toBe("#ff8800");
    }
  });
});

describe("gradientFunction", () => {
  it("linear em sRGB", () => {
    expect(gradientFunction(cfg())).toBe("linear-gradient(135deg, #6366f1 0%, #ec4899 100%)");
  });

  it("OKLCH entra antes do ângulo", () => {
    expect(gradientFunction(cfg({ space: "oklch" }))).toBe("linear-gradient(in oklch 135deg, #6366f1 0%, #ec4899 100%)");
  });

  it("radial com formato, tamanho e posição; cônico com ângulo inicial", () => {
    expect(gradientFunction(cfg({ type: "radial", shape: "ellipse", size: "closest-side", x: 20, y: 80 })))
      .toBe("radial-gradient(ellipse closest-side at 20% 80%, #6366f1 0%, #ec4899 100%)");
    expect(gradientFunction(cfg({ type: "conic", angle: 90, x: 50, y: 50 })))
      .toBe("conic-gradient(from 90deg at 50% 50%, #6366f1 0%, #ec4899 100%)");
  });

  it("cortes secos repetem a cor anterior na posição seguinte", () => {
    const g = cfg({ hard: true, stops: [stop("#111111", 0), stop("#222222", 50), stop("#333333", 100)] });
    expect(gradientFunction(g)).toBe("linear-gradient(135deg, #111111 0%, #111111 50%, #222222 50%, #222222 100%, #333333 100%)");
  });

  it("opacidade vira hex de 8 dígitos", () => {
    expect(hexWithAlpha("#6366f1", 50)).toBe("#6366f180");
    expect(hexWithAlpha("#6366f1", 100)).toBe("#6366f1");
    expect(gradientFunction(cfg({ stops: [stop("#000000", 0, 0), stop("#000000", 100)] }))).toBe("linear-gradient(135deg, #00000000 0%, #000000 100%)");
  });

  it("tipos repetidos usam px (linear, radial) e graus (cônico) pelo período", () => {
    const stops = [stop("#000000", 0), stop("#ffffff", 100)];
    expect(gradientFunction(cfg({ type: "repeating-linear", angle: 45, period: 60, stops }))).toBe("repeating-linear-gradient(45deg, #000000 0px, #ffffff 60px)");
    expect(gradientFunction(cfg({ type: "repeating-conic", angle: 0, period: 30, stops }))).toBe("repeating-conic-gradient(from 0deg at 50% 50%, #000000 0deg, #ffffff 30deg)");
  });

  it("Tailwind troca espaços por _", () => {
    expect(tailwindClass(cfg())).toBe("bg-[linear-gradient(135deg,#6366f1_0%,#ec4899_100%)]");
  });
});

describe("buildCss", () => {
  const anim = (animation: typeof DEFAULT_ANIMATION.animation) => ({ ...DEFAULT_ANIMATION, animation });

  it("sem animação e sem seletor: só as declarações; fora do sRGB vem a versão de reserva antes", () => {
    expect(buildCss(cfg(), anim("none"), null)).toBe("background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);");
    const css = buildCss(cfg({ space: "oklch" }), anim("none"), null).split("\n");
    expect(css).toEqual([
      "background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);",
      "background: linear-gradient(in oklch 135deg, #6366f1 0%, #ec4899 100%);",
    ]);
  });

  it("girar usa @property, keyframes e respeita prefers-reduced-motion", () => {
    const css = buildCss(cfg(), anim("rotate"), null);
    expect(css).toContain('@property --gradient-angle');
    expect(css).toContain("initial-value: 135deg;");
    expect(css).toContain("linear-gradient(var(--gradient-angle), #6366f1 0%, #ec4899 100%)");
    expect(css).toContain("to { --gradient-angle: 495deg; }");
    expect(css).toContain("animation: gradient-rotate 4s linear infinite normal;");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("girar no radial explica que não se aplica", () => {
    expect(buildCss(cfg({ type: "radial" }), anim("rotate"), null)).toContain("não se aplica ao radial");
  });

  it("cada animação nova gera seus keyframes", () => {
    expect(buildCss(cfg(), anim("hue"), null)).toContain("hue-rotate(360deg)");
    expect(buildCss(cfg(), anim("breathe"), null)).toContain("background-size: 170% 170%;");
    expect(buildCss(cfg(), anim("shimmer"), null)).toContain("@keyframes gradient-shimmer");
    expect(buildCss(cfg(), anim("shift"), null)).toContain("background-size: 300% 300%;");
  });

  it("direção e curva entram na linha animation", () => {
    const css = buildCss(cfg(), { ...DEFAULT_ANIMATION, animation: "pulse", duration: 7, direction: "alternate" }, ".card");
    expect(css).toContain(".card {");
    expect(css).toContain("animation: gradient-pulse 7s ease-in-out infinite alternate;");
  });
});

describe("expandStops", () => {
  it("sRGB mantém as paradas; OKLCH acrescenta 8 pontos por trecho; corte seco duplica", () => {
    expect(expandStops(cfg())).toHaveLength(2);
    expect(expandStops(cfg({ space: "oklch" }))).toHaveLength(10);
    expect(expandStops(cfg({ hard: true }))).toHaveLength(3);
  });

  it("os pontos intermediários ficam entre as duas posições", () => {
    const mid = expandStops(cfg({ space: "oklab" })).slice(1, -1);
    mid.forEach((s) => { expect(s.offset).toBeGreaterThan(0); expect(s.offset).toBeLessThan(1); });
  });
});

describe("geometria do SVG", () => {
  it("linha do linear em caixa 1200×800", () => {
    const l90 = linearLine(90, 1200, 800);
    expect([l90.x1, l90.x2]).toEqual([0, 1200]);
    expect(l90.y1).toBeCloseTo(400, 5);
    const l180 = linearLine(180, 1200, 800);
    expect(l180.x1).toBeCloseTo(600, 5);
    expect(l180.y1).toBeCloseTo(0, 5);
    expect(l180.y2).toBeCloseTo(800, 5);
  });

  it("raios do radial centrado: círculo e elipse", () => {
    expect(radialRadii(cfg({ type: "radial", shape: "circle", size: "farthest-corner" }), 1200, 800).rx).toBeCloseTo(Math.hypot(600, 400), 5);
    expect(radialRadii(cfg({ type: "radial", shape: "circle", size: "closest-side" }), 1200, 800).rx).toBe(400);
    const e = radialRadii(cfg({ type: "radial", shape: "ellipse", size: "farthest-corner" }), 1200, 800);
    expect(e.rx).toBeCloseTo(600 * Math.SQRT2, 5);
    expect(e.ry).toBeCloseTo(400 * Math.SQRT2, 5);
  });

  it("SVG só para linear e radial sem repetição", () => {
    expect(svgMarkup(cfg())).toContain("<linearGradient");
    expect(svgMarkup(cfg({ type: "radial" }))).toContain("<radialGradient");
    expect(svgMarkup(cfg({ type: "conic" }))).toBeNull();
    expect(svgMarkup(cfg({ type: "repeating-linear" }))).toBeNull();
  });

  it("opacidade vira stop-opacity", () => {
    expect(svgMarkup(cfg({ stops: [stop("#000000", 0, 50), stop("#ffffff", 100)] }))).toContain('stop-opacity="0.5"');
  });
});

describe("presets e aleatório", () => {
  it("applyPreset distribui as paradas de 0 a 100", () => {
    const g = applyPreset(cfg(), PRESETS.find((p) => p.id === "sunset")!);
    expect(g.stops.map((s) => s.position)).toEqual([0, 50, 100]);
    expect(g.type).toBe("linear");
  });

  it("preset com cortes secos liga a opção", () => {
    expect(applyPreset(cfg(), PRESETS.find((p) => p.id === "stripes")!).hard).toBe(true);
  });

  it("randomGradient devolve de 2 a 4 cores válidas, em ordem", () => {
    for (let i = 0; i < 30; i++) {
      const g = randomGradient(cfg());
      expect(g.stops.length).toBeGreaterThanOrEqual(2);
      expect(g.stops.length).toBeLessThanOrEqual(4);
      g.stops.forEach((s) => expect(s.color).toMatch(/^#[0-9a-f]{6}$/));
      expect(g.stops[0].position).toBe(0);
      expect(g.stops[g.stops.length - 1].position).toBe(100);
    }
  });
});
