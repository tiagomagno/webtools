import { describe, expect, it } from "vitest";
import { slugify } from "../slugify";
import {
  computeStats,
  countLines,
  countParagraphs,
  countSentences,
  countWords,
  formatReadingTime,
} from "../text-stats";
import { csvToJson, jsonToCsv, parseCsv } from "../csv-json";

describe("slugify", () => {
  it("remove acentos, pontuação e usa hífen", () => {
    expect(slugify("Olá Mundo!")).toBe("ola-mundo");
    expect(slugify("  Ação & Reação  ")).toBe("acao-reacao");
  });

  it("colapsa separadores repetidos e tira das pontas", () => {
    expect(slugify("--a   b--c--")).toBe("a-b-c");
  });

  it("respeita separador e caixa informados", () => {
    expect(slugify("Olá Mundo", { separator: "_" })).toBe("ola_mundo");
    expect(slugify("Olá Mundo", { lowercase: false })).toBe("Ola-Mundo");
  });

  it("strict remove letras não latinas; sem strict as mantém", () => {
    expect(slugify("日本語 test")).toBe("test");
    expect(slugify("日本語 test", { strict: false })).toBe("日本語-test");
  });

  it("texto vazio gera slug vazio", () => {
    expect(slugify("   ")).toBe("");
  });
});

describe("text-stats", () => {
  it("conta palavras ignorando espaços extras", () => {
    expect(countWords("  olá   mundo  ")).toBe(2);
    expect(countWords("")).toBe(0);
    expect(countWords("   \n  ")).toBe(0);
  });

  it("conta frases por terminador", () => {
    expect(countSentences("Oi. Tudo bem? Sim!")).toBe(3);
    expect(countSentences("sem ponto final")).toBe(1);
    expect(countSentences("")).toBe(0);
  });

  it("conta parágrafos separados por linha em branco", () => {
    expect(countParagraphs("a\n\nb\n\n\nc")).toBe(3);
    expect(countParagraphs("uma linha\noutra linha")).toBe(1);
  });

  it("conta linhas em LF, CRLF e CR", () => {
    expect(countLines("a\nb\r\nc")).toBe(3);
    expect(countLines("")).toBe(0);
  });

  it("formata o tempo de leitura", () => {
    expect(formatReadingTime(0)).toBe("0s");
    expect(formatReadingTime(45)).toBe("45s");
    expect(formatReadingTime(60)).toBe("1min");
    expect(formatReadingTime(90)).toBe("1min 30s");
  });

  it("200 palavras a 200 ppm levam 60 segundos; ppm inválido usa o padrão", () => {
    const texto = Array(200).fill("palavra").join(" ");
    expect(computeStats(texto, 200).readingSeconds).toBeCloseTo(60, 6);
    expect(computeStats(texto, 0).readingSeconds).toBeCloseTo(60, 6);
  });

  it("separa caracteres com e sem espaços", () => {
    const s = computeStats("a b\nc");
    expect(s.charactersWithSpaces).toBe(5);
    expect(s.charactersNoSpaces).toBe(3);
  });
});

describe("parseCsv", () => {
  it("respeita vírgula, aspas escapadas e quebra de linha dentro do campo", () => {
    const rows = parseCsv('a,"b,c","d ""x"""\n1,"linha1\nlinha2",3');
    expect(rows).toEqual([
      ["a", "b,c", 'd "x"'],
      ["1", "linha1\nlinha2", "3"],
    ]);
  });

  it("aceita CRLF e outro delimitador", () => {
    expect(parseCsv("a;b\r\n1;2", ";")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("csvToJson", () => {
  it("infere número, booleano e preserva zeros à esquerda", () => {
    expect(csvToJson("nome,idade,ativo\nAna,30,true\nBia,007,false")).toEqual([
      { nome: "Ana", idade: 30, ativo: true },
      { nome: "Bia", idade: "007", ativo: false },
    ]);
  });

  it("sem cabeçalho devolve matriz", () => {
    expect(csvToJson("1,2\n3,4", { header: false })).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("célula ausente vira string vazia", () => {
    expect(csvToJson("a,b\n1")).toEqual([{ a: 1, b: "" }]);
  });

  it("texto vazio devolve lista vazia", () => {
    expect(csvToJson("")).toEqual([]);
  });
});

describe("jsonToCsv", () => {
  it("escapa vírgula e aspas, e une as chaves de todos os objetos", () => {
    const csv = jsonToCsv([{ a: 1, b: "x,y" }, { a: 2, c: 'diz "oi"' }]);
    expect(csv).toBe('a,b,c\n1,"x,y",\n2,,"diz ""oi"""');
  });

  it("ida e volta mantém os dados", () => {
    const dados = [
      { nome: "Ana", idade: 30 },
      { nome: "Bia, a Grande", idade: 41 },
    ];
    expect(csvToJson(jsonToCsv(dados))).toEqual(dados);
  });

  it("aceita array de arrays e lista vazia", () => {
    expect(jsonToCsv([[1, "a"], [2, "b"]])).toBe("1,a\n2,b");
    expect(jsonToCsv([])).toBe("");
  });

  it("recusa entrada que não seja array", () => {
    expect(() => jsonToCsv({ a: 1 })).toThrow(/array/);
  });
});
