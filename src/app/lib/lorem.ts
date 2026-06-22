// Gerador de texto Lorem Ipsum (#47).

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
];

function rand(max: number): number { return Math.floor(Math.random() * max); }

function capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }

function makeSentence(): string {
  const len = 6 + rand(10);
  const words = Array.from({ length: len }, () => WORDS[rand(WORDS.length)]);
  // Insere vírgulas ocasionais.
  let text = words.join(" ");
  if (len > 8) {
    const pos = 3 + rand(len - 5);
    const parts = text.split(" ");
    parts[pos] = parts[pos] + ",";
    text = parts.join(" ");
  }
  return capitalize(text) + ".";
}

function makeParagraph(): string {
  const sentences = 3 + rand(4);
  return Array.from({ length: sentences }, makeSentence).join(" ");
}

export type LoremUnit = "paragraphs" | "sentences" | "words";

/** Gera texto Lorem Ipsum. `startClassic` inicia com "Lorem ipsum dolor sit amet". */
export function generateLorem(count: number, unit: LoremUnit, startClassic = true): string {
  const n = Math.max(1, Math.min(100, count));

  if (unit === "words") {
    const words = Array.from({ length: n }, () => WORDS[rand(WORDS.length)]);
    if (startClassic) words.splice(0, Math.min(4, n), ...["lorem", "ipsum", "dolor", "sit"].slice(0, Math.min(4, n)));
    return capitalize(words.join(" ")) + ".";
  }

  if (unit === "sentences") {
    const arr = Array.from({ length: n }, makeSentence);
    if (startClassic) arr[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    return arr.join(" ");
  }

  const paras = Array.from({ length: n }, makeParagraph);
  if (startClassic) paras[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + paras[0];
  return paras.join("\n\n");
}
