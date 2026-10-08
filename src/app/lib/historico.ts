// Histórico de uso: quais ferramentas guardam entradas, como validar o que volta do
// servidor, como resumir para a lista e como reabrir a ferramenta com os dados.
// Puro (sem React) para poder ser testado.

export interface QrPayload { text: string; size: number; ec: "L" | "M" | "Q" | "H"; fg: string; bg: string }
export interface ColorPayload { hex: string }
export interface PalettePayload { colors: string[] }

export type HistoryToolSlug = "gerador-qr" | "conversor-cores" | "color-palette";

const HEX = /^#[0-9a-f]{6}$/i;
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function parseQr(raw: unknown): QrPayload | null {
  if (!isRecord(raw)) return null;
  const { text, size, ec, fg, bg } = raw;
  if (typeof text !== "string" || text.length === 0 || text.length > 4000) return null;
  if (typeof size !== "number" || !Number.isFinite(size) || size < 128 || size > 1024) return null;
  if (ec !== "L" && ec !== "M" && ec !== "Q" && ec !== "H") return null;
  if (typeof fg !== "string" || !HEX.test(fg) || typeof bg !== "string" || !HEX.test(bg)) return null;
  return { text, size, ec, fg, bg };
}

function parseColor(raw: unknown): ColorPayload | null {
  if (!isRecord(raw) || typeof raw.hex !== "string" || !HEX.test(raw.hex)) return null;
  return { hex: raw.hex.toLowerCase() };
}

function parsePalette(raw: unknown): PalettePayload | null {
  if (!isRecord(raw) || !Array.isArray(raw.colors)) return null;
  if (raw.colors.length < 1 || raw.colors.length > 12) return null;
  if (!raw.colors.every((c) => typeof c === "string" && HEX.test(c))) return null;
  return { colors: (raw.colors as string[]).map((c) => c.toLowerCase()) };
}

interface HistoryToolConfig {
  label: string;
  parse: (raw: unknown) => unknown;
  summarize: (payload: never) => string;
}

export const HISTORY_TOOLS: Record<HistoryToolSlug, HistoryToolConfig> = {
  "gerador-qr": {
    label: "Gerador de QR Code",
    parse: parseQr,
    summarize: ((p: QrPayload) => (p.text.length > 60 ? `${p.text.slice(0, 57)}…` : p.text)) as (payload: never) => string,
  },
  "conversor-cores": {
    label: "Conversor de Cores",
    parse: parseColor,
    summarize: ((p: ColorPayload) => p.hex.toUpperCase()) as (payload: never) => string,
  },
  "color-palette": {
    label: "Paleta de Cores",
    parse: parsePalette,
    summarize: ((p: PalettePayload) => p.colors.map((c) => c.toUpperCase()).join(" ")) as (payload: never) => string,
  },
};

export function isHistoryTool(slug: string): slug is HistoryToolSlug {
  return Object.prototype.hasOwnProperty.call(HISTORY_TOOLS, slug);
}

/** Valida o payload de uma ferramenta; null se estiver malformado. */
export function parseHistoryPayload(slug: "gerador-qr", raw: unknown): QrPayload | null;
export function parseHistoryPayload(slug: "conversor-cores", raw: unknown): ColorPayload | null;
export function parseHistoryPayload(slug: "color-palette", raw: unknown): PalettePayload | null;
export function parseHistoryPayload(slug: string, raw: unknown): unknown;
export function parseHistoryPayload(slug: string, raw: unknown): unknown {
  return isHistoryTool(slug) ? HISTORY_TOOLS[slug].parse(raw) : null;
}

/** Texto curto de uma entrada para a lista; vazio se o payload não for válido. */
export function summarizeHistory(slug: string, raw: unknown): string {
  if (!isHistoryTool(slug)) return "";
  const parsed = HISTORY_TOOLS[slug].parse(raw);
  return parsed ? HISTORY_TOOLS[slug].summarize(parsed as never) : "";
}

const toBase64Url = (bytes: Uint8Array) => {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (text: string) => {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

/** Endereço que reabre a ferramenta com os dados no fragmento (`#h=`), que nunca vai ao servidor. */
export function historyHref(slug: string, payload: unknown): string {
  const json = new TextEncoder().encode(JSON.stringify(payload));
  return `/tools/${slug}#h=${toBase64Url(json)}`;
}

/** Lê o payload de um fragmento `#h=...`; null se ausente ou ilegível. */
export function readHistoryHash(hash: string): unknown {
  const match = /^#h=([A-Za-z0-9_-]+)$/.exec(hash);
  if (!match) return null;
  try {
    return JSON.parse(new TextDecoder().decode(fromBase64Url(match[1])));
  } catch {
    return null;
  }
}
