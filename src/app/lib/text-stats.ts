/**
 * Estatísticas de texto — utilitário puro e reaproveitável.
 * Usado por: Contador de Palavras (#1), Contador de Caracteres (#2),
 * Tempo de Leitura (#3).
 */

/** Velocidade média de leitura em palavras por minuto (adulto, pt-BR). */
export const DEFAULT_WPM = 200;

export interface TextStats {
  words: number;
  charactersWithSpaces: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  /** Tempo de leitura em segundos (com base no WPM informado). */
  readingSeconds: number;
}

/** Conta palavras: sequências separadas por espaços em branco. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\s+/).length;
}

/** Conta frases por terminadores . ! ? … (agrupando repetições). */
export function countSentences(text: string): number {
  const matches = text.match(/[^.!?…]+[.!?…]+/g);
  if (matches) return matches.length;
  // sem pontuação terminal, mas com conteúdo => 1 frase
  return text.trim() === "" ? 0 : 1;
}

/** Conta parágrafos: blocos separados por uma ou mais linhas em branco. */
export function countParagraphs(text: string): number {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b !== "");
  return blocks.length;
}

/** Conta linhas (quebras de linha + 1, ou 0 se vazio). */
export function countLines(text: string): number {
  if (text === "") return 0;
  return text.split(/\r\n|\r|\n/).length;
}

/** Formata segundos como "Xs", "Ymin" ou "Ymin Zs". */
export function formatReadingTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds === 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return rem === 0 ? `${min}min` : `${min}min ${rem}s`;
}

/** Calcula todas as estatísticas de uma vez. */
export function computeStats(text: string, wpm: number = DEFAULT_WPM): TextStats {
  const words = countWords(text);
  const charactersWithSpaces = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const safeWpm = wpm > 0 ? wpm : DEFAULT_WPM;
  return {
    words,
    charactersWithSpaces,
    charactersNoSpaces,
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    lines: countLines(text),
    readingSeconds: (words / safeWpm) * 60,
  };
}
