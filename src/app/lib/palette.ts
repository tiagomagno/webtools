// Lógica pura da Paleta de Cores: conversões, harmonias (sempre 5 cores), extração de uma imagem e exportação.

export const isValidHex = (hex: string): boolean => /^#[0-9a-fA-F]{6}$/.test(hex);

export function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r8, g8, b8] = hexToRgb(hex);
  const r = r8 / 255, g = g8 / 255, b = b8 / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h: number, s: number, l: number): string {
  const hh = ((h % 360) + 360) % 360;
  const ss = s / 100, ll = l / 100;
  const a = ss * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + hh / 30) % 12;
    return Math.round(255 * (ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  return rgbToHex(f(0), f(8), f(4));
}

/** HEX → HSV (h 0–360, s e v 0–100). A roda de cores usa HSV: o raio é a saturação. */
export function hexToHsv(hex: string): [number, number, number] {
  const [r8, g8, b8] = hexToRgb(hex);
  const r = r8 / 255, g = g8 / 255, b = b8 / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return [Math.round(h) % 360, max === 0 ? 0 : Math.round((d / max) * 100), Math.round(max * 100)];
}

export function hsvToHex(h: number, s: number, v: number): string {
  const hh = ((h % 360) + 360) % 360;
  const ss = s / 100, vv = v / 100;
  const f = (n: number) => {
    const k = (n + hh / 60) % 6;
    return Math.round(255 * (vv - vv * ss * Math.max(Math.min(k, 4 - k, 1), 0)));
  };
  return rgbToHex(f(5), f(3), f(1));
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1), l2 = relativeLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function bestTextColor(bg: string): "#ffffff" | "#0a0a0a" {
  return contrastRatio(bg, "#ffffff") >= contrastRatio(bg, "#0a0a0a") ? "#ffffff" : "#0a0a0a";
}

export function wcagLevel(ratio: number): { level: string; color: string } {
  if (ratio >= 7) return { level: "AAA", color: "#22c55e" };
  if (ratio >= 4.5) return { level: "AA", color: "#84cc16" };
  if (ratio >= 3) return { level: "AA Large", color: "#eab308" };
  return { level: "Falha", color: "#ef4444" };
}

// ─── Harmonias ────────────────────────────────────────────────────────────────

export type HarmonyType = "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "monochromatic";

interface HarmonyDef {
  id: HarmonyType;
  label: string;
  /** Frase de instrução mostrada ao escolher a harmonia. */
  instruction: string;
  /** Matizes (graus em relação à base) usados no ícone da harmonia. */
  anchors: number[];
  /** As 5 cores: [giro de matiz, variação de luminosidade] em relação à base. */
  steps: [number, number][];
  /** Posição da cor base dentro das 5. */
  baseIndex: number;
}

export const HARMONIES: HarmonyDef[] = [
  { id: "monochromatic", label: "Monocromática", instruction: "Cinco tons da mesma cor, do mais escuro ao mais claro. Combinação segura e elegante.", anchors: [0], steps: [[0, -30], [0, -15], [0, 0], [0, 15], [0, 30]], baseIndex: 2 },
  { id: "analogous", label: "Análoga", instruction: "Cores vizinhas na roda. Transmitem harmonia natural e calma.", anchors: [-30, 0, 30], steps: [[-40, 0], [-20, 0], [0, 0], [20, 0], [40, 0]], baseIndex: 2 },
  { id: "complementary", label: "Complementar", instruction: "Cores opostas na roda. Geram o maior contraste: use uma como destaque.", anchors: [0, 180], steps: [[0, -20], [0, 0], [0, 22], [180, -8], [180, 14]], baseIndex: 1 },
  { id: "split-complementary", label: "Complementar dividida", instruction: "A base com as duas cores vizinhas da oposta. Contraste forte, mais suave que a complementar.", anchors: [0, 150, 210], steps: [[0, 0], [0, 20], [150, 0], [210, 0], [210, -15]], baseIndex: 0 },
  { id: "triadic", label: "Tríade", instruction: "Três cores igualmente espaçadas na roda. Visual vibrante e equilibrado.", anchors: [0, 120, 240], steps: [[0, 0], [0, 20], [120, 0], [240, 0], [240, 20]], baseIndex: 0 },
  { id: "tetradic", label: "Tetrádica", instruction: "Quatro cores em retângulo na roda. Rica em variedade: deixe uma dominar.", anchors: [0, 90, 180, 270], steps: [[0, 0], [90, 0], [180, 0], [270, 0], [0, 20]], baseIndex: 0 },
];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** As 5 cores da harmonia. A cor base volta exatamente como foi informada. */
export function harmonyColors(baseHex: string, type: HarmonyType): { colors: string[]; baseIndex: number } {
  const def = HARMONIES.find((h) => h.id === type) ?? HARMONIES[0];
  if (!isValidHex(baseHex)) return { colors: Array(5).fill("#000000"), baseIndex: def.baseIndex };
  const [h, s, l] = hexToHsl(baseHex);
  const colors = def.steps.map(([turn, dl], i) => (i === def.baseIndex ? baseHex.toLowerCase() : hslToHex(h + turn, s, clamp(l + dl, 8, 95))));
  return { colors, baseIndex: def.baseIndex };
}

export function randomBase(random: () => number = Math.random): string {
  return hslToHex(Math.floor(random() * 360), 50 + Math.floor(random() * 40), 35 + Math.floor(random() * 30));
}

// ─── Extração de imagem ───────────────────────────────────────────────────────

/** Até `count` cores dominantes e distintas de pixels RGBA (como em ImageData.data). */
export function extractPalette(data: Uint8ClampedArray, count = 5): string[] {
  const buckets = new Map<string, number>();
  for (let i = 0; i < data.length; i += 16) {
    if (data[i + 3] < 128) continue;
    const key = [data[i], data[i + 1], data[i + 2]].map((v) => Math.min(255, Math.round(v / 32) * 32)).join(",");
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const sorted = [...buckets.entries()].sort((a, b) => b[1] - a[1]).map(([key]) => key.split(",").map(Number));
  const picked: number[][] = [];
  for (const rgb of sorted) {
    const distinct = picked.every((p) => Math.hypot(p[0] - rgb[0], p[1] - rgb[1], p[2] - rgb[2]) > 64);
    if (distinct) picked.push(rgb);
    if (picked.length === count) break;
  }
  return picked.map(([r, g, b]) => rgbToHex(r, g, b));
}

// ─── Exportação ───────────────────────────────────────────────────────────────

export type ExportFormat = "css" | "tailwind" | "json";

export function buildExport(format: ExportFormat, colors: string[]): string {
  switch (format) {
    case "css":
      return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")}\n}`;
    case "tailwind":
      return `// tailwind.config.js\ncolors: {\n  palette: {\n${colors.map((c, i) => `    ${i + 1}: "${c}",`).join("\n")}\n  },\n}`;
    case "json":
      return JSON.stringify({ colors }, null, 2);
  }
}

// ─── Formatos de exibição e leitura ───────────────────────────────────────────

export type ColorFormat = "hex" | "rgb" | "hsl";

/** Texto de uma cor no formato pedido (HEX em maiúsculas; RGB e HSL só com os números). */
export function formatColor(hex: string, format: ColorFormat): string {
  if (format === "hex") return hex.toUpperCase();
  if (format === "rgb") return hexToRgb(hex).join(", ");
  const [h, s, l] = hexToHsl(hex);
  return `${h}, ${s}%, ${l}%`;
}

/** Valor CSS pronto para copiar: `#426DB3`, `rgb(66, 109, 179)` ou `hsl(223, 46%, 47%)`. */
export function cssColor(hex: string, format: ColorFormat): string {
  return format === "hex" ? hex.toUpperCase() : `${format}(${formatColor(hex, format)})`;
}

/** Lê o que a pessoa digitou no formato escolhido; null se estiver incompleto ou fora dos limites. */
export function parseColorInput(format: ColorFormat, text: string): string | null {
  const value = text.trim();
  if (format === "hex") {
    const hex = value.startsWith("#") ? value : `#${value}`;
    return isValidHex(hex) ? hex.toLowerCase() : null;
  }
  const nums = value.match(/-?\d+(\.\d+)?/g)?.map(Number);
  if (!nums || nums.length !== 3 || /[a-df-gi-qs-z]/i.test(value.replace(/rgb|hsl/gi, ""))) return null;
  const [a, b, c] = nums;
  if (format === "rgb") return [a, b, c].every((n) => n >= 0 && n <= 255) ? rgbToHex(a, b, c) : null;
  return a >= 0 && a <= 360 && b >= 0 && b <= 100 && c >= 0 && c <= 100 ? hslToHex(a, b, c) : null;
}
