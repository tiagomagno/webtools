// Lógica pura do Gerador de Gradientes: montagem do CSS (com espaço de cor, posição, cortes secos,
// transparência e animações), conversão para Tailwind e SVG, e mistura de cores em OKLab/OKLCH.

import { hexToRgb, hslToHex, rgbToHex } from "./palette";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Stop {
  id: number;
  color: string;
  /** Posição na linha do gradiente, 0–100. */
  position: number;
  /** Opacidade, 0–100. */
  alpha: number;
}

export type GradientType = "linear" | "radial" | "conic" | "repeating-linear" | "repeating-radial" | "repeating-conic";
export type ColorSpace = "srgb" | "oklab" | "oklch";
export type RadialShape = "circle" | "ellipse";
export type RadialSize = "closest-side" | "closest-corner" | "farthest-side" | "farthest-corner";
export type Animation = "none" | "rotate" | "shift" | "pulse" | "hue" | "breathe" | "shimmer";
export type AnimationDirection = "normal" | "alternate" | "reverse";
export type Easing = "linear" | "ease" | "ease-in-out";

export interface GradientConfig {
  type: GradientType;
  /** Ângulo do linear ou ângulo inicial do cônico, em graus. */
  angle: number;
  stops: Stop[];
  space: ColorSpace;
  /** Cortes secos: cada cor começa onde a anterior termina, sem transição. */
  hard: boolean;
  shape: RadialShape;
  size: RadialSize;
  /** Centro do radial e do cônico, em % da caixa. */
  x: number;
  y: number;
  /** Tamanho de uma repetição: px (linear e radial) ou graus (cônico). Só nos tipos repetidos. */
  period: number;
}

export interface AnimationSettings {
  animation: Animation;
  duration: number;
  direction: AnimationDirection;
  easing: Easing;
}

export const isRepeating = (type: GradientType): boolean => type.startsWith("repeating-");
export const baseKind = (type: GradientType): "linear" | "radial" | "conic" => type.replace("repeating-", "") as "linear" | "radial" | "conic";
export const usesAngle = (type: GradientType): boolean => baseKind(type) !== "radial";

const byPosition = (stops: Stop[]) => [...stops].sort((a, b) => a.position - b.position);

// ─── Cor: OKLab / OKLCH ───────────────────────────────────────────────────────

const toLinear = (v: number) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const toGamma = (v: number) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);

export function hexToOklab(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function oklabToHex(L: number, a: number, b: number): string {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return rgbToHex(
    toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  );
}

/** Mistura duas cores no espaço escolhido (t de 0 a 1). Em OKLCH o matiz segue o caminho mais curto. */
export function mixColor(c1: string, c2: string, t: number, space: ColorSpace): string {
  if (space === "srgb") {
    const [a, b] = [hexToRgb(c1), hexToRgb(c2)];
    return rgbToHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
  }
  const [L1, a1, b1] = hexToOklab(c1);
  const [L2, a2, b2] = hexToOklab(c2);
  if (space === "oklab") return oklabToHex(L1 + (L2 - L1) * t, a1 + (a2 - a1) * t, b1 + (b2 - b1) * t);
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2);
  const h1 = (Math.atan2(b1, a1) * 180) / Math.PI, h2 = (Math.atan2(b2, a2) * 180) / Math.PI;
  // Cinza não tem matiz: usa o da outra cor para não criar um giro falso.
  const eps = 1e-4;
  const from = C1 < eps ? h2 : h1, to = C2 < eps ? h1 : h2;
  let dh = to - from;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  const C = C1 + (C2 - C1) * t, h = ((from + dh * t) * Math.PI) / 180;
  return oklabToHex(L1 + (L2 - L1) * t, C * Math.cos(h), C * Math.sin(h));
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const num = (n: number) => String(Math.round(n * 100) / 100);

/** Cor com opacidade em hex de 8 dígitos (`#rrggbbaa`); sem opacidade devolve o hex normal. */
export function hexWithAlpha(color: string, alpha: number): string {
  if (alpha >= 100) return color;
  return color + Math.round((Math.max(0, alpha) / 100) * 255).toString(16).padStart(2, "0");
}

function stopList(cfg: GradientConfig): string {
  const unit = !isRepeating(cfg.type) ? "%" : baseKind(cfg.type) === "conic" ? "deg" : "px";
  const at = (p: number) => `${num(unit === "%" ? p : (p / 100) * cfg.period)}${unit}`;
  const sorted = byPosition(cfg.stops);
  const parts: string[] = [];
  sorted.forEach((s, i) => {
    const color = hexWithAlpha(s.color, s.alpha);
    if (cfg.hard && i > 0) parts.push(`${hexWithAlpha(sorted[i - 1].color, sorted[i - 1].alpha)} ${at(s.position)}`);
    parts.push(`${color} ${at(s.position)}`);
  });
  return parts.join(", ");
}

/** A função CSS do gradiente (`linear-gradient(...)` etc.). `angleVar` troca o ângulo por `var(--gradient-angle)`. */
export function gradientFunction(cfg: GradientConfig, angleVar = false): string {
  const interp = cfg.space === "srgb" ? "" : `in ${cfg.space}`;
  const angle = angleVar ? "var(--gradient-angle)" : `${num(cfg.angle)}deg`;
  const kind = baseKind(cfg.type);
  const name = `${isRepeating(cfg.type) ? "repeating-" : ""}${kind}-gradient`;
  const head =
    kind === "linear" ? [interp, angle]
    : kind === "radial" ? [`${cfg.shape} ${cfg.size}`, `at ${num(cfg.x)}% ${num(cfg.y)}%`, interp]
    : [`from ${angle}`, `at ${num(cfg.x)}% ${num(cfg.y)}%`, interp];
  return `${name}(${head.filter(Boolean).join(" ")}, ${stopList(cfg)})`;
}

/** Linhas `background:`; fora do sRGB vem antes uma versão de reserva para navegadores antigos. */
function backgroundLines(cfg: GradientConfig, angleVar = false): string[] {
  const lines = [];
  if (cfg.space !== "srgb") lines.push(`background: ${gradientFunction({ ...cfg, space: "srgb" }, angleVar)};`);
  lines.push(`background: ${gradientFunction(cfg, angleVar)};`);
  return lines;
}

const SHIMMER_LAYER = "linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.55) 50%, transparent 65%)";

/**
 * CSS completo do gradiente com a animação escolhida. Com `selector` nulo e sem animação,
 * devolve só as declarações; com animação usa `.element`.
 */
export function buildCss(cfg: GradientConfig, anim: AnimationSettings, selector: string | null): string {
  const { animation, duration, direction, easing } = anim;
  const sel = selector ?? ".element";
  const block = (lines: string[]) => `${sel} {\n${lines.map((l) => `  ${l}`).join("\n")}\n}`;
  const run = (name: string, ease: string = easing) => `animation: ${name} ${duration}s ${ease} infinite ${direction};`;
  const calm = `@media (prefers-reduced-motion: reduce) {\n  ${sel} { animation: none; }\n}`;
  const plain = () => (selector ? block(backgroundLines(cfg)) : backgroundLines(cfg).join("\n"));

  switch (animation) {
    case "none":
      return plain();
    case "rotate":
      if (baseKind(cfg.type) === "radial") return `/* Girar muda o ângulo e não se aplica ao radial: use Deslizar. */\n${plain()}`;
      return [
        `@property --gradient-angle {\n  syntax: "<angle>";\n  inherits: false;\n  initial-value: ${num(cfg.angle)}deg;\n}`,
        block([...backgroundLines(cfg, true), run("gradient-rotate", "linear")]),
        `@keyframes gradient-rotate {\n  from { --gradient-angle: ${num(cfg.angle)}deg; }\n  to { --gradient-angle: ${num(cfg.angle + 360)}deg; }\n}`,
        calm,
      ].join("\n\n");
    case "shift":
      return [
        block([...backgroundLines(cfg), "background-size: 300% 300%;", run("gradient-shift")]),
        "@keyframes gradient-shift {\n  0%   { background-position: 0% 50%; }\n  50%  { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}",
        calm,
      ].join("\n\n");
    case "pulse":
      return [
        block([...backgroundLines(cfg), run("gradient-pulse", "ease-in-out")]),
        "@keyframes gradient-pulse {\n  0%, 100% { opacity: 1; }\n  50%      { opacity: 0.5; }\n}",
        calm,
      ].join("\n\n");
    case "hue":
      return [
        block([...backgroundLines(cfg), run("gradient-hue", "linear")]),
        "@keyframes gradient-hue {\n  from { filter: hue-rotate(0deg); }\n  to   { filter: hue-rotate(360deg); }\n}",
        calm,
      ].join("\n\n");
    case "breathe":
      return [
        block([...backgroundLines(cfg), "background-position: center;", run("gradient-breathe", "ease-in-out")]),
        "@keyframes gradient-breathe {\n  0%, 100% { background-size: 100% 100%; }\n  50%      { background-size: 170% 170%; }\n}",
        calm,
      ].join("\n\n");
    case "shimmer":
      return [
        block([`background: ${SHIMMER_LAYER} 0 0 / 250% 100% no-repeat, ${gradientFunction(cfg)};`, run("gradient-shimmer", "linear")]),
        "@keyframes gradient-shimmer {\n  from { background-position: 150% 0, 0 0; }\n  to   { background-position: -50% 0, 0 0; }\n}",
        calm,
      ].join("\n\n");
  }
}

/** CSS do preview ao vivo: o mesmo da exportação, com seletor fixo. */
export const previewCss = (cfg: GradientConfig, anim: AnimationSettings): string => buildCss(cfg, anim, ".gr-demo");

/** Classe Tailwind com valor arbitrário (espaços viram `_`). A animação não entra. */
export function tailwindClass(cfg: GradientConfig): string {
  return `bg-[${gradientFunction(cfg).replace(/, /g, ",").replace(/ /g, "_")}]`;
}

// ─── Pontos expandidos (SVG e PNG) ────────────────────────────────────────────

export interface RenderStop { offset: number; color: string; alpha: number }

const SAMPLES = 8;

/** Paradas já prontas para SVG e canvas, que só interpolam em sRGB: no OKLab/OKLCH acrescenta pontos intermediários. */
export function expandStops(cfg: GradientConfig): RenderStop[] {
  const sorted = byPosition(cfg.stops);
  const out: RenderStop[] = [];
  sorted.forEach((s, i) => {
    const offset = Math.min(1, Math.max(0, s.position / 100));
    const prev = sorted[i - 1];
    if (prev) {
      const prevOffset = Math.min(1, Math.max(0, prev.position / 100));
      if (cfg.hard) {
        out.push({ offset, color: prev.color, alpha: prev.alpha });
      } else if (cfg.space !== "srgb") {
        for (let k = 1; k <= SAMPLES; k++) {
          const t = k / (SAMPLES + 1);
          out.push({ offset: prevOffset + (offset - prevOffset) * t, color: mixColor(prev.color, s.color, t, cfg.space), alpha: prev.alpha + (s.alpha - prev.alpha) * t });
        }
      }
    }
    out.push({ offset, color: s.color, alpha: s.alpha });
  });
  return out;
}

/** SVG (e PNG) só existem para linear e radial sem repetição. */
export const canRenderImage = (cfg: GradientConfig): boolean => !isRepeating(cfg.type) && baseKind(cfg.type) !== "conic";

/** Reta do gradiente linear em uma caixa W×H, como o CSS calcula (cantos tocam a reta). */
export function linearLine(angle: number, w: number, h: number): { x1: number; y1: number; x2: number; y2: number } {
  const a = (angle * Math.PI) / 180;
  const half = (Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a))) / 2;
  const [cx, cy] = [w / 2, h / 2];
  return { x1: cx - half * Math.sin(a), y1: cy + half * Math.cos(a), x2: cx + half * Math.sin(a), y2: cy - half * Math.cos(a) };
}

/** Raios do radial em uma caixa W×H, seguindo a palavra de tamanho do CSS. */
export function radialRadii(cfg: GradientConfig, w: number, h: number): { rx: number; ry: number } {
  const cx = (cfg.x / 100) * w, cy = (cfg.y / 100) * h;
  const dx = [cx, w - cx], dy = [cy, h - cy];
  const corners = [Math.hypot(dx[0], dy[0]), Math.hypot(dx[1], dy[0]), Math.hypot(dx[0], dy[1]), Math.hypot(dx[1], dy[1])];
  if (cfg.shape === "circle") {
    const r = cfg.size === "closest-side" ? Math.min(...dx, ...dy)
      : cfg.size === "farthest-side" ? Math.max(...dx, ...dy)
      : cfg.size === "closest-corner" ? Math.min(...corners)
      : Math.max(...corners);
    return { rx: r, ry: r };
  }
  const k = cfg.size.endsWith("corner") ? Math.SQRT2 : 1;
  const pick = cfg.size.startsWith("closest") ? Math.min : Math.max;
  return { rx: pick(...dx) * k, ry: pick(...dy) * k };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/** SVG do gradiente (1200×800 por padrão) ou null quando o tipo não existe em SVG. */
export function svgMarkup(cfg: GradientConfig, w = 1200, h = 800): string | null {
  if (!canRenderImage(cfg)) return null;
  const stops = expandStops(cfg)
    .map((s) => `      <stop offset="${r2(s.offset * 100)}%" stop-color="${s.color}"${s.alpha < 100 ? ` stop-opacity="${r2(s.alpha / 100)}"` : ""}/>`)
    .join("\n");
  let def: string;
  if (baseKind(cfg.type) === "linear") {
    const l = linearLine(cfg.angle, w, h);
    def = `    <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${r2(l.x1)}" y1="${r2(l.y1)}" x2="${r2(l.x2)}" y2="${r2(l.y2)}">\n${stops}\n    </linearGradient>`;
  } else {
    const { rx, ry } = radialRadii(cfg, w, h);
    const cx = r2((cfg.x / 100) * w), cy = r2((cfg.y / 100) * h);
    def = `    <radialGradient id="g" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(${cx} ${cy}) scale(${r2(rx)} ${r2(ry)})">\n${stops}\n    </radialGradient>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n  <defs>\n${def}\n  </defs>\n  <rect width="${w}" height="${h}" fill="url(#g)"/>\n</svg>`;
}

// ─── Padrão inicial, presets e aleatório ──────────────────────────────────────

let nextStopId = 100;
export const newStopId = (): number => nextStopId++;

export const stop = (color: string, position: number, alpha = 100): Stop => ({ id: newStopId(), color, position, alpha });

export const DEFAULT_CONFIG: Omit<GradientConfig, "stops"> = {
  type: "linear", angle: 135, space: "oklch", hard: false, shape: "circle", size: "farthest-corner", x: 50, y: 50, period: 60,
};

export const DEFAULT_ANIMATION: AnimationSettings = { animation: "none", duration: 4, direction: "normal", easing: "ease" };

export interface Preset {
  id: string;
  name: string;
  type: GradientType;
  angle: number;
  colors: string[];
  hard?: boolean;
}

export const PRESETS: Preset[] = [
  { id: "sunset", name: "Pôr do sol", type: "linear", angle: 160, colors: ["#ff7e5f", "#feb47b", "#ffd89b"] },
  { id: "ocean", name: "Oceano", type: "linear", angle: 135, colors: ["#2193b0", "#6dd5ed"] },
  { id: "aurora", name: "Aurora", type: "linear", angle: 120, colors: ["#00c9ff", "#92fe9d", "#c471f5"] },
  { id: "forest", name: "Floresta", type: "linear", angle: 180, colors: ["#134e5e", "#71b280"] },
  { id: "peach", name: "Pêssego", type: "linear", angle: 45, colors: ["#ffecd2", "#fcb69f"] },
  { id: "neon", name: "Neon", type: "linear", angle: 90, colors: ["#f72585", "#7209b7", "#3a0ca3", "#4cc9f0"] },
  { id: "midnight", name: "Meia-noite", type: "linear", angle: 200, colors: ["#0f2027", "#203a43", "#2c5364"] },
  { id: "candy", name: "Algodão-doce", type: "linear", angle: 135, colors: ["#a8edea", "#fed6e3"] },
  { id: "fire", name: "Fogo", type: "radial", angle: 0, colors: ["#fff200", "#ff7300", "#c70039", "#3d0000"] },
  { id: "spot", name: "Holofote", type: "radial", angle: 0, colors: ["#ffffff", "#6366f1", "#0b0b1e"] },
  { id: "rainbow", name: "Arco-íris", type: "conic", angle: 0, colors: ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ff0000"] },
  { id: "stripes", name: "Listras", type: "repeating-linear", angle: 45, colors: ["#111111", "#fcd34d"], hard: true },
];

/** Monta a configuração (e as paradas) de um preset, mantendo o restante como está. */
export function applyPreset(base: GradientConfig, preset: Preset): GradientConfig {
  const n = preset.colors.length;
  return {
    ...base,
    type: preset.type,
    angle: preset.angle,
    hard: preset.hard ?? false,
    stops: preset.colors.map((c, i) => stop(c, n === 1 ? 0 : Math.round((i / (n - 1)) * 100))),
  };
}

/** Gradiente aleatório com cores vizinhas na roda, para sair sempre algo harmônico. */
export function randomGradient(base: GradientConfig, random: () => number = Math.random): GradientConfig {
  const hue = Math.floor(random() * 360);
  const count = 2 + Math.floor(random() * 3);
  const spread = 30 + Math.floor(random() * 50);
  const types: GradientType[] = ["linear", "linear", "radial", "conic"];
  return {
    ...base,
    type: types[Math.floor(random() * types.length)],
    angle: Math.floor(random() * 360),
    hard: false,
    stops: Array.from({ length: count }, (_, i) =>
      stop(hslToHex(hue + i * spread, 65 + Math.floor(random() * 25), 48 + Math.floor(random() * 17)), Math.round((i / (count - 1)) * 100))),
  };
}
