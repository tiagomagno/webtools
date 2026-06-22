// Conversão CSV ↔ JSON (#31, #32). Parser de CSV com suporte a aspas (RFC 4180).

/** Faz o parse de um CSV em matriz de células, respeitando aspas e quebras internas. */
export function parseCsv(text: string, delimiter = ","): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // ignora; \r\n tratado pelo \n
    } else {
      field += ch;
    }
  }
  // Última célula/linha (se houver conteúdo pendente)
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export interface CsvToJsonOptions {
  delimiter?: string;
  header?: boolean;
}

/**
 * Converte CSV em JSON. Com cabeçalho, gera um array de objetos; sem cabeçalho,
 * um array de arrays. Valores numéricos e booleanos são inferidos.
 */
export function csvToJson(text: string, opts: CsvToJsonOptions = {}): unknown {
  const { delimiter = ",", header = true } = opts;
  const rows = parseCsv(text.trim(), delimiter);
  if (rows.length === 0) return [];

  if (!header) return rows.map((r) => r.map(coerce));

  const [head, ...body] = rows;
  return body.map((r) => {
    const obj: Record<string, unknown> = {};
    head.forEach((key, i) => { obj[key] = coerce(r[i] ?? ""); });
    return obj;
  });
}

function coerce(v: string): unknown {
  if (v === "") return "";
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null") return null;
  // Número (evita interpretar strings com zeros à esquerda como número)
  if (/^-?\d+(\.\d+)?$/.test(v) && !/^0\d/.test(v)) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return v;
}

export interface JsonToCsvOptions {
  delimiter?: string;
}

/**
 * Converte um array de objetos (ou de arrays) em CSV. As colunas são a união
 * de todas as chaves encontradas, na ordem de primeira ocorrência.
 */
export function jsonToCsv(value: unknown, opts: JsonToCsvOptions = {}): string {
  const { delimiter = "," } = opts;
  if (!Array.isArray(value)) throw new Error("O JSON deve ser um array de objetos ou de arrays.");
  if (value.length === 0) return "";

  // Caso array de arrays.
  if (Array.isArray(value[0])) {
    return (value as unknown[][]).map((row) => row.map((c) => escapeCell(c, delimiter)).join(delimiter)).join("\n");
  }

  const keys: string[] = [];
  for (const item of value) {
    if (item && typeof item === "object") {
      for (const k of Object.keys(item as object)) if (!keys.includes(k)) keys.push(k);
    }
  }

  const lines = [keys.map((k) => escapeCell(k, delimiter)).join(delimiter)];
  for (const item of value as Record<string, unknown>[]) {
    lines.push(keys.map((k) => escapeCell(item?.[k], delimiter)).join(delimiter));
  }
  return lines.join("\n");
}

function escapeCell(v: unknown, delimiter: string): string {
  if (v === null || v === undefined) return "";
  let s = typeof v === "object" ? JSON.stringify(v) : String(v);
  if (s.includes('"') || s.includes(delimiter) || s.includes("\n") || s.includes("\r")) {
    s = '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}
