// Utilitários compartilhados do bloco de ferramentas SEO (#15–#18).

/* ---------------------------------------------------------------- UTM (#17) */

export interface UtmParams {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

/**
 * Monta uma URL com parâmetros UTM, preservando query string e fragmento já
 * existentes. Retorna `null` quando a URL base é inválida.
 */
export function buildUtmUrl(p: UtmParams): string | null {
  const base = p.url.trim();
  if (!base) return null;

  let parsed: URL;
  try {
    parsed = new URL(base);
  } catch {
    // Tenta novamente assumindo https quando o usuário omite o protocolo.
    try {
      parsed = new URL("https://" + base);
    } catch {
      return null;
    }
  }

  const map: Array<[string, string | undefined]> = [
    ["utm_source", p.source],
    ["utm_medium", p.medium],
    ["utm_campaign", p.campaign],
    ["utm_term", p.term],
    ["utm_content", p.content],
  ];

  for (const [key, value] of map) {
    const v = value?.trim();
    if (v) parsed.searchParams.set(key, v);
    else parsed.searchParams.delete(key);
  }

  return parsed.toString();
}

/* ------------------------------------------------------------- Robots (#16) */

export interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export interface RobotsInput {
  rules: RobotsRule[];
  sitemap?: string;
  crawlDelay?: number;
}

/** Gera o conteúdo de um arquivo robots.txt a partir das regras informadas. */
export function buildRobotsTxt({ rules, sitemap, crawlDelay }: RobotsInput): string {
  const blocks: string[] = [];

  for (const rule of rules) {
    const lines: string[] = [`User-agent: ${rule.userAgent.trim() || "*"}`];
    for (const path of rule.disallow) {
      const p = path.trim();
      if (p) lines.push(`Disallow: ${p}`);
    }
    for (const path of rule.allow) {
      const p = path.trim();
      if (p) lines.push(`Allow: ${p}`);
    }
    // Bloco sem regras = libera tudo explicitamente.
    if (lines.length === 1) lines.push("Disallow:");
    if (crawlDelay && crawlDelay > 0) lines.push(`Crawl-delay: ${crawlDelay}`);
    blocks.push(lines.join("\n"));
  }

  let out = blocks.join("\n\n");
  const sm = sitemap?.trim();
  if (sm) out += `\n\nSitemap: ${sm}`;
  return out + "\n";
}

/* --------------------------------------------------- SERP / pixels (#18, #15) */

// Larguras médias (px) por caractere para a fonte do Google Desktop (Arial ~18px
// título, ~14px descrição). É uma aproximação suficiente para orientar o limite.
const TITLE_CHAR_PX: Record<string, number> = { default: 10 };
const DESC_CHAR_PX: Record<string, number> = { default: 7.5 };

function estimatePx(text: string, table: Record<string, number>): number {
  // Caracteres estreitos e largos ajustam a média para um valor mais realista.
  const narrow = "iljt.,;:'!|()[]{} ";
  const wide = "mwMW@%";
  let px = 0;
  for (const ch of text) {
    if (narrow.includes(ch)) px += table.default * 0.5;
    else if (wide.includes(ch)) px += table.default * 1.4;
    else px += table.default;
  }
  return Math.round(px);
}

/** Largura estimada (px) de um título na SERP do Google (limite ~580px). */
export function titlePx(text: string): number {
  return estimatePx(text, TITLE_CHAR_PX);
}

/** Largura estimada (px) de uma descrição na SERP do Google (limite ~920px). */
export function descPx(text: string): number {
  return estimatePx(text, DESC_CHAR_PX);
}

export const SERP_TITLE_LIMIT_PX = 580;
export const SERP_DESC_LIMIT_PX = 920;
