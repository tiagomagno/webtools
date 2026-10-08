import { describe, expect, it } from "vitest";
import { historyHref, parseHistoryPayload, readHistoryHash, summarizeHistory } from "../historico";

const qr = { text: "https://exemplo.com/ação", size: 320, ec: "M", fg: "#000000", bg: "#ffffff" };

describe("parseHistoryPayload", () => {
  it("aceita payloads válidos", () => {
    expect(parseHistoryPayload("gerador-qr", qr)).toEqual(qr);
    expect(parseHistoryPayload("conversor-cores", { hex: "#6366F1" })).toEqual({ hex: "#6366f1" });
    expect(parseHistoryPayload("color-palette", { colors: ["#112233", "#AABBCC"] })).toEqual({ colors: ["#112233", "#aabbcc"] });
  });

  it.each([
    ["gerador-qr", null],
    ["gerador-qr", { ...qr, text: "" }],
    ["gerador-qr", { ...qr, size: 5000 }],
    ["gerador-qr", { ...qr, ec: "X" }],
    ["gerador-qr", { ...qr, fg: "red" }],
    ["conversor-cores", { hex: "#12345" }],
    ["conversor-cores", { hex: 123 }],
    ["color-palette", { colors: [] }],
    ["color-palette", { colors: ["#112233", "azul"] }],
    ["color-palette", { colors: Array(13).fill("#000000") }],
    ["ferramenta-inexistente", { hex: "#000000" }],
  ])("recusa %s com %j", (slug, payload) => {
    expect(parseHistoryPayload(slug, payload)).toBeNull();
  });
});

describe("summarizeHistory", () => {
  it("resume por ferramenta", () => {
    expect(summarizeHistory("conversor-cores", { hex: "#6366f1" })).toBe("#6366F1");
    expect(summarizeHistory("color-palette", { colors: ["#112233", "#aabbcc"] })).toBe("#112233 #AABBCC");
    expect(summarizeHistory("gerador-qr", { ...qr, text: "a".repeat(100) })).toBe(`${"a".repeat(57)}…`);
  });

  it("devolve vazio para payload inválido", () => {
    expect(summarizeHistory("gerador-qr", { text: 1 })).toBe("");
  });
});

describe("historyHref / readHistoryHash", () => {
  it("ida e volta preservando acentos e símbolos", () => {
    const href = historyHref("gerador-qr", qr);
    expect(href.startsWith("/tools/gerador-qr#h=")).toBe(true);
    expect(readHistoryHash(href.slice(href.indexOf("#")))).toEqual(qr);
  });

  it.each(["", "#", "#h=", "#x=abc", "#h=@@@", "#h=bm90LWpzb24"])("ignora fragmento inválido %j", (hash) => {
    expect(readHistoryHash(hash)).toBeNull();
  });
});
