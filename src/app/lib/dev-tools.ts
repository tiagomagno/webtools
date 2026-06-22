// Utilitários dev para ferramentas #54–#56.

export function formatHtml(html: string): string {
  const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  let indent = 0;
  const result: string[] = [];
  const tokens = html.replace(/>\s+</g, '><').split(/(<[^>]+>)/);

  for (const token of tokens) {
    if (!token.trim()) continue;
    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      result.push('  '.repeat(indent) + token);
    } else if (token.startsWith('<') && !token.startsWith('<!--')) {
      result.push('  '.repeat(indent) + token);
      const tag = (token.match(/<([a-zA-Z][a-zA-Z0-9]*)/)?.[1] ?? '').toLowerCase();
      if (!VOID.has(tag) && !token.endsWith('/>')) indent++;
    } else {
      result.push('  '.repeat(indent) + token.trim());
    }
  }
  return result.filter(Boolean).join('\n');
}

export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

export function convertBase(value: string, from: number, to: number): string {
  try {
    const decimal = parseInt(value.replace(/\s/g, ''), from);
    if (isNaN(decimal)) return '';
    return decimal.toString(to).toUpperCase();
  } catch {
    return '';
  }
}

export function allBases(value: string, from: number) {
  try {
    const dec = parseInt(value.replace(/\s/g, ''), from);
    if (isNaN(dec) || dec < 0) return null;
    return {
      bin: dec.toString(2),
      oct: dec.toString(8),
      dec: dec.toString(10),
      hex: dec.toString(16).toUpperCase(),
    };
  } catch { return null; }
}
