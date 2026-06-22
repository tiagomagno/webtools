/**
 * Formatador de SQL leve, baseado em palavras-chave. Sem dependências.
 * Usado por: SQL Formatter (#9).
 *
 * Não é um parser SQL completo — cobre as cláusulas e padrões mais comuns
 * (SELECT/FROM/WHERE/JOIN/GROUP BY/ORDER BY/etc.) de forma legível.
 */

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN",
  "FULL JOIN", "CROSS JOIN", "JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING",
  "LIMIT", "OFFSET", "UNION ALL", "UNION", "INSERT INTO", "VALUES", "UPDATE",
  "SET", "DELETE FROM", "DELETE", "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
  "AS", "IN", "NOT IN", "LIKE", "BETWEEN", "IS NULL", "IS NOT NULL", "DISTINCT",
  "COUNT", "SUM", "AVG", "MIN", "MAX", "CASE", "WHEN", "THEN", "ELSE", "END",
  "ASC", "DESC", "LEFT OUTER JOIN", "RIGHT OUTER JOIN",
];

// Cláusulas que iniciam uma nova linha sem indentação.
const NEWLINE_BEFORE = [
  "SELECT", "FROM", "WHERE", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN",
  "CROSS JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "JOIN", "GROUP BY",
  "ORDER BY", "HAVING", "LIMIT", "OFFSET", "UNION ALL", "UNION", "INSERT INTO",
  "VALUES", "UPDATE", "SET", "DELETE FROM",
];

// Operadores lógicos que iniciam nova linha com indentação.
const NEWLINE_INDENT = ["AND", "OR"];

export function formatSql(input: string): string {
  if (input.trim() === "") return "";

  // Normaliza espaços, preservando strings simples.
  let sql = input.replace(/\s+/g, " ").trim();

  // Uppercase das keywords (palavras inteiras), processando as compostas primeiro.
  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    const re = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    sql = sql.replace(re, kw);
  }

  // Quebra antes de cláusulas principais.
  for (const kw of NEWLINE_BEFORE) {
    const re = new RegExp(`\\s*\\b${kw.replace(/ /g, "\\s+")}\\b`, "g");
    sql = sql.replace(re, `\n${kw}`);
  }
  for (const kw of NEWLINE_INDENT) {
    const re = new RegExp(`\\s*\\b${kw}\\b`, "g");
    sql = sql.replace(re, `\n  ${kw}`);
  }

  // Vírgulas na lista de SELECT em novas linhas indentadas.
  const lines = sql.split("\n").map((line) => {
    const trimmed = line.trim();
    if (/^SELECT\b/i.test(trimmed)) {
      const rest = trimmed.replace(/^SELECT\s*/i, "");
      if (rest === "") return "SELECT";
      const cols = splitTopLevel(rest);
      if (cols.length > 1) {
        return "SELECT\n" + cols.map((c) => `  ${c.trim()}`).join(",\n");
      }
      return `SELECT ${rest}`;
    }
    return trimmed;
  });

  const out = lines.join("\n").replace(/\n{2,}/g, "\n").trim();
  // Garante um único ponto e vírgula no final.
  return out.replace(/;+\s*$/, "") + ";";
}

/** Divide por vírgulas no nível superior, respeitando parênteses. */
function splitTopLevel(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim() !== "") parts.push(current);
  return parts;
}
