// Utilitários compartilhados da ferramenta "Documento para Markdown".
// Converte PDF, DOCX, XLS/XLSX e PPTX em Markdown, tudo no navegador.

export type DocFormat = "pdf" | "docx" | "xlsx" | "pptx";

/** Detecta o formato pelo MIME type ou extensão do arquivo. */
export function detectDocFormat(file: File): DocFormat | null {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return "xlsx";
  if (name.endsWith(".pptx")) return "pptx";
  return null;
}

/** Formatos antigos e binários que não têm parser client-side viável. */
export function isUnsupportedLegacyFormat(file: File): "doc" | "ppt" | null {
  const name = file.name.toLowerCase();
  if (name.endsWith(".doc")) return "doc";
  if (name.endsWith(".ppt")) return "ppt";
  return null;
}

// ---------------------------------------------------------------------------
// HTML -> Markdown (usado pela saída do mammoth para DOCX)
// ---------------------------------------------------------------------------

function escapeMd(text: string): string {
  return text.replace(/([*_`[\]])/g, "\\$1");
}

function collapseSpaces(text: string): string {
  return text.replace(/[ \t]+/g, " ");
}

function inlineToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return collapseSpaces(node.textContent ?? "");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const inner = Array.from(el.childNodes).map(inlineToMarkdown).join("");

  switch (tag) {
    case "strong":
    case "b":
      return inner.trim() ? `**${inner}**` : "";
    case "em":
    case "i":
      return inner.trim() ? `_${inner}_` : "";
    case "code":
      return inner.trim() ? `\`${inner}\`` : "";
    case "br":
      return "\n";
    case "a": {
      const href = el.getAttribute("href") ?? "";
      return inner.trim() ? `[${inner}](${href})` : "";
    }
    case "img": {
      const alt = el.getAttribute("alt") || "imagem";
      return `![${alt}](omitida)`;
    }
    default:
      return inner;
  }
}

function tableToMarkdown(table: Element): string {
  const rows = Array.from(table.querySelectorAll("tr"));
  if (rows.length === 0) return "";

  const cellsOf = (row: Element) =>
    Array.from(row.querySelectorAll("td, th")).map((c) => inlineToMarkdown(c).trim().replace(/\n+/g, " ") || " ");

  const header = cellsOf(rows[0]);
  const body = rows.slice(1).map(cellsOf);
  const colCount = Math.max(header.length, ...body.map((r) => r.length), 1);
  const pad = (r: string[]) => Array.from({ length: colCount }, (_, i) => r[i] ?? " ");

  const lines = [
    `| ${pad(header).join(" | ")} |`,
    `| ${pad(header).map(() => "---").join(" | ")} |`,
    ...body.map((r) => `| ${pad(r).join(" | ")} |`),
  ];
  return lines.join("\n");
}

function blockToMarkdown(node: Node, listDepth = 0): string[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = collapseSpaces(node.textContent ?? "").trim();
    return text ? [text] : [];
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return [];

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (/^h[1-6]$/.test(tag)) {
    const level = Number(tag[1]);
    const text = inlineToMarkdown(el).trim();
    return text ? [`${"#".repeat(level)} ${text}`] : [];
  }

  if (tag === "p") {
    const text = inlineToMarkdown(el).trim();
    return text ? [text] : [];
  }

  if (tag === "blockquote") {
    const inner = Array.from(el.childNodes).flatMap((c) => blockToMarkdown(c, listDepth));
    return inner.length ? inner.map((l) => `> ${l}`) : [];
  }

  if (tag === "pre") {
    const text = el.textContent ?? "";
    return [`\`\`\`\n${text.trim()}\n\`\`\``];
  }

  if (tag === "hr") {
    return ["---"];
  }

  if (tag === "table") {
    const md = tableToMarkdown(el);
    return md ? [md] : [];
  }

  if (tag === "ul" || tag === "ol") {
    const items = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === "li");
    const lines: string[] = [];
    items.forEach((li, i) => {
      const nested = Array.from(li.children).filter((c) => ["ul", "ol"].includes(c.tagName.toLowerCase()));
      const ownText = Array.from(li.childNodes)
        .filter((c) => !(c.nodeType === Node.ELEMENT_NODE && ["ul", "ol"].includes((c as Element).tagName.toLowerCase())))
        .map(inlineToMarkdown)
        .join("")
        .trim();
      const indent = "  ".repeat(listDepth);
      const marker = tag === "ul" ? "-" : `${i + 1}.`;
      if (ownText) lines.push(`${indent}${marker} ${ownText}`);
      for (const sub of nested) {
        lines.push(...blockToMarkdown(sub, listDepth + 1));
      }
    });
    return lines;
  }

  if (tag === "div" || tag === "section" || tag === "body") {
    return Array.from(el.childNodes).flatMap((c) => blockToMarkdown(c, listDepth));
  }

  // Elemento desconhecido: tenta extrair texto inline.
  const text = inlineToMarkdown(el).trim();
  return text ? [text] : [];
}

/** Converte um fragmento HTML (saída do mammoth) em Markdown. */
export function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks = Array.from(doc.body.childNodes).flatMap((n) => blockToMarkdown(n));
  return blocks.join("\n\n").trim();
}

// ---------------------------------------------------------------------------
// DOCX -> Markdown
// ---------------------------------------------------------------------------

export async function docxToMarkdown(arrayBuffer: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return htmlToMarkdown(result.value);
}

// ---------------------------------------------------------------------------
// PDF -> Markdown (heurística por tamanho de fonte)
// ---------------------------------------------------------------------------

interface PdfLine {
  y: number;
  size: number;
  text: string;
}

export async function pdfToMarkdown(
  arrayBuffer: ArrayBuffer,
  onProgress?: (done: number, total: number) => void,
): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pagesLines: PdfLine[][] = [];
  const allSizes: number[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines: PdfLine[] = [];

    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const size = Math.abs(item.transform[3]) || Math.abs(item.transform[0]) || 10;
      const y = Math.round(item.transform[5]);
      allSizes.push(size);

      const last = lines[lines.length - 1];
      if (last && Math.abs(last.y - y) < size * 0.4) {
        last.text += item.str;
        last.size = Math.max(last.size, size);
      } else {
        lines.push({ y, size, text: item.str });
      }
    }
    pagesLines.push(lines);
    onProgress?.(i, pdf.numPages);
  }

  const sorted = [...allSizes].sort((a, b) => a - b);
  const bodySize = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 10;

  const pageBlocks: string[] = [];
  for (const lines of pagesLines) {
    const blocks: string[] = [];
    for (const line of lines) {
      const text = collapseSpaces(line.text).trim();
      if (!text) continue;
      if (line.size >= bodySize * 1.5) {
        blocks.push(`# ${text}`);
      } else if (line.size >= bodySize * 1.2) {
        blocks.push(`## ${text}`);
      } else {
        blocks.push(text);
      }
    }
    pageBlocks.push(blocks.join("\n\n"));
  }

  return pageBlocks.join("\n\n---\n\n").trim();
}

// ---------------------------------------------------------------------------
// XLSX/XLS -> Markdown (tabela por planilha)
// ---------------------------------------------------------------------------

export async function xlsxToMarkdown(arrayBuffer: ArrayBuffer): Promise<string> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const sections: string[] = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" });
    const nonEmpty = rows.filter((r) => r.some((c) => String(c).trim() !== ""));
    if (nonEmpty.length === 0) continue;

    const colCount = Math.max(...nonEmpty.map((r) => r.length));
    const cell = (v: unknown) => escapeMd(String(v ?? "").trim()).replace(/\n+/g, " ") || " ";
    const pad = (r: string[]) => Array.from({ length: colCount }, (_, i) => cell(r[i]));

    const [header, ...body] = nonEmpty;
    const lines = [
      `| ${pad(header).join(" | ")} |`,
      `| ${pad(header).map(() => "---").join(" | ")} |`,
      ...body.map((r) => `| ${pad(r).join(" | ")} |`),
    ];
    sections.push(`## ${sheetName}\n\n${lines.join("\n")}`);
  }

  return sections.join("\n\n").trim();
}

// ---------------------------------------------------------------------------
// PPTX -> Markdown (texto por slide, via JSZip + parsing do XML)
// ---------------------------------------------------------------------------

function slideNumberFromPath(path: string): number {
  const m = path.match(/slide(\d+)\.xml$/);
  return m ? Number(m[1]) : 0;
}

export async function pptxToMarkdown(arrayBuffer: ArrayBuffer): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(arrayBuffer);

  const slidePaths = Object.keys(zip.files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
    .sort((a, b) => slideNumberFromPath(a) - slideNumberFromPath(b));

  const parser = new DOMParser();
  const sections: string[] = [];

  for (let i = 0; i < slidePaths.length; i++) {
    const xml = await zip.files[slidePaths[i]].async("text");
    const doc = parser.parseFromString(xml, "application/xml");

    const shapes = Array.from(doc.getElementsByTagName("p:sp"));
    const lines: string[] = [];
    let title: string | null = null;

    for (const shape of shapes) {
      const ph = shape.getElementsByTagName("p:ph")[0];
      const phType = ph?.getAttribute("type");
      const isTitleShape = phType === "title" || phType === "ctrTitle";

      for (const p of Array.from(shape.getElementsByTagName("a:p"))) {
        const runs = Array.from(p.getElementsByTagName("a:t"));
        const text = runs.map((r) => r.textContent ?? "").join("").trim();
        if (!text) continue;

        if (isTitleShape && title === null) {
          title = text;
        } else {
          const isBullet = p.getElementsByTagName("a:buChar").length > 0 || p.getElementsByTagName("a:buAutoNum").length > 0;
          lines.push(isBullet ? `- ${text}` : text);
        }
      }
    }

    const heading = title ? `## Slide ${i + 1}: ${title}` : `## Slide ${i + 1}`;
    const body = lines.join("\n\n");
    sections.push(body ? `${heading}\n\n${body}` : heading);
  }

  return sections.join("\n\n---\n\n").trim();
}

// ---------------------------------------------------------------------------

/**
 * Heurística para detectar PDFs com pouquíssimo texto extraível em relação
 * ao tamanho do arquivo — sinal de texto vetorizado (contornos) ou imagens,
 * comum em exportações do Canva/Figma. Não se aplica a DOCX/XLSX/PPTX, que
 * sempre expõem o texto real do documento.
 */
export function isLowTextDensity(format: DocFormat, markdownLength: number, fileSizeBytes: number): boolean {
  if (format !== "pdf") return false;
  const fileSizeKB = fileSizeBytes / 1024;
  if (fileSizeKB < 300) return false;
  return markdownLength / fileSizeKB < 1;
}

export async function convertToMarkdown(
  file: File,
  onProgress?: (done: number, total: number) => void,
): Promise<string> {
  const format = detectDocFormat(file);
  if (!format) throw new Error("Formato não suportado.");

  const arrayBuffer = await file.arrayBuffer();
  switch (format) {
    case "pdf":
      return pdfToMarkdown(arrayBuffer, onProgress);
    case "docx":
      return docxToMarkdown(arrayBuffer);
    case "xlsx":
      return xlsxToMarkdown(arrayBuffer);
    case "pptx":
      return pptxToMarkdown(arrayBuffer);
  }
}
