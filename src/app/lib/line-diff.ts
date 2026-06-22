/**
 * Diff de linhas baseado em LCS (Longest Common Subsequence).
 * Usado pelo Comparador de Textos (#4).
 */

export type DiffOp = "equal" | "added" | "removed";

export interface DiffLine {
  op: DiffOp;
  text: string;
  /** Número da linha no texto original (A), quando aplicável. */
  aLine?: number;
  /** Número da linha no texto modificado (B), quando aplicável. */
  bLine?: number;
}

export interface DiffResult {
  lines: DiffLine[];
  added: number;
  removed: number;
  unchanged: number;
}

export function diffLines(a: string, b: string): DiffResult {
  const aLines = a === "" ? [] : a.split(/\r\n|\r|\n/);
  const bLines = b === "" ? [] : b.split(/\r\n|\r|\n/);
  const n = aLines.length;
  const m = bLines.length;

  // Tabela LCS
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = aLines[i] === bLines[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  while (i < n && j < m) {
    if (aLines[i] === bLines[j]) {
      lines.push({ op: "equal", text: aLines[i], aLine: i + 1, bLine: j + 1 });
      unchanged++;
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      lines.push({ op: "removed", text: aLines[i], aLine: i + 1 });
      removed++;
      i++;
    } else {
      lines.push({ op: "added", text: bLines[j], bLine: j + 1 });
      added++;
      j++;
    }
  }
  while (i < n) {
    lines.push({ op: "removed", text: aLines[i], aLine: i + 1 });
    removed++;
    i++;
  }
  while (j < m) {
    lines.push({ op: "added", text: bLines[j], bLine: j + 1 });
    added++;
    j++;
  }

  return { lines, added, removed, unchanged };
}
