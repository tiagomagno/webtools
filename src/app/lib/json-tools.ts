/**
 * Utilitários de JSON: parse com posição de erro e diff estrutural.
 * Usado por: JSON Formatter (#6), JSON Validator (#7), JSON Diff (#8).
 */

export interface ParseError {
  message: string;
  line?: number;
  column?: number;
}

export interface ParseResult {
  ok: boolean;
  value?: unknown;
  error?: ParseError;
}

/** Faz JSON.parse e, em caso de erro, tenta extrair linha/coluna. */
export function parseJson(text: string): ParseResult {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    // Mensagens do V8 costumam trazer "position N"
    const posMatch = message.match(/position (\d+)/);
    if (posMatch) {
      const pos = Number(posMatch[1]);
      const before = text.slice(0, pos);
      const line = before.split("\n").length;
      const column = pos - before.lastIndexOf("\n");
      return { ok: false, error: { message, line, column } };
    }
    // Mensagens mais novas: "at line X column Y"
    const lcMatch = message.match(/line (\d+) column (\d+)/);
    if (lcMatch) {
      return { ok: false, error: { message, line: Number(lcMatch[1]), column: Number(lcMatch[2]) } };
    }
    return { ok: false, error: { message } };
  }
}

export type DiffKind = "added" | "removed" | "changed";

export interface JsonDiffEntry {
  path: string;
  kind: DiffKind;
  before?: unknown;
  after?: unknown;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Diff estrutural recursivo entre dois valores JSON. */
export function diffJson(a: unknown, b: unknown, path = ""): JsonDiffEntry[] {
  const entries: JsonDiffEntry[] = [];

  if (isObject(a) && isObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      const childPath = path ? `${path}.${key}` : key;
      if (!(key in a)) {
        entries.push({ path: childPath, kind: "added", after: b[key] });
      } else if (!(key in b)) {
        entries.push({ path: childPath, kind: "removed", before: a[key] });
      } else {
        entries.push(...diffJson(a[key], b[key], childPath));
      }
    }
    return entries;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const childPath = `${path}[${i}]`;
      if (i >= a.length) entries.push({ path: childPath, kind: "added", after: b[i] });
      else if (i >= b.length) entries.push({ path: childPath, kind: "removed", before: a[i] });
      else entries.push(...diffJson(a[i], b[i], childPath));
    }
    return entries;
  }

  if (JSON.stringify(a) !== JSON.stringify(b)) {
    entries.push({ path: path || "(raiz)", kind: "changed", before: a, after: b });
  }
  return entries;
}
