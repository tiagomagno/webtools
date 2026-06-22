// Utilitários compartilhados do bloco de ferramentas PDF (#26–#30).
// Carrega pdfjs-dist (rasterização) e pdf-lib (manipulação) sob demanda.
// O worker do pdfjs vive em /pdf.worker.min.mjs (public).

export const PDF_WORKER_SRC = "/pdf.worker.min.mjs";

/** Formata um tamanho em bytes de forma legível. */
export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Carrega o pdfjs-dist com o worker configurado. */
export async function loadPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
  return pdfjsLib;
}

/** Carrega o pdf-lib (PDFDocument). */
export async function loadPdfLib() {
  const { PDFDocument } = await import("pdf-lib");
  return PDFDocument;
}

export interface RenderedPage {
  index: number; // 1-based
  /** Canvas renderizado da página. */
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

/**
 * Rasteriza todas as páginas de um PDF em canvases.
 * `scale` controla a resolução (1.5 ≈ boa qualidade para download).
 */
export async function renderPdfPages(
  data: ArrayBuffer,
  scale = 1.5,
  onProgress?: (done: number, total: number) => void,
): Promise<RenderedPage[]> {
  const pdfjsLib = await loadPdfjs();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages: RenderedPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponível.");
    await page.render({ canvasContext: ctx, viewport }).promise;
    pages.push({ index: i, canvas, width: canvas.width, height: canvas.height });
    onProgress?.(i, pdf.numPages);
  }
  return pages;
}

/** Lê o número de páginas de um PDF sem rasterizar. */
export async function getPdfPageCount(data: ArrayBuffer): Promise<number> {
  const PDFDocument = await loadPdfLib();
  const doc = await PDFDocument.load(data, { ignoreEncryption: true });
  return doc.getPageCount();
}

/** Converte um canvas em Blob no tipo/qualidade informados. */
export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/jpeg", quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Falha ao exportar a imagem."))), type, quality);
  });
}

/** Dispara o download de bytes como arquivo. */
export function downloadBytes(bytes: BlobPart, filename: string, mime = "application/octet-stream"): void {
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Remove a extensão de um nome de arquivo. */
export function stripExt(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

/**
 * Interpreta uma expressão de intervalos de páginas (ex.: "1-3, 5, 8-10")
 * e retorna a lista de páginas 1-based, sem duplicar, dentro de [1, max].
 * Retorna `null` se a expressão for inválida.
 */
export function parsePageRanges(expr: string, max: number): number[] | null {
  const out = new Set<number>();
  const parts = expr.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  for (const part of parts) {
    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    const single = part.match(/^(\d+)$/);
    if (range) {
      let a = Number(range[1]);
      let b = Number(range[2]);
      if (a > b) [a, b] = [b, a];
      if (a < 1 || b > max) return null;
      for (let i = a; i <= b; i++) out.add(i);
    } else if (single) {
      const n = Number(single[1]);
      if (n < 1 || n > max) return null;
      out.add(n);
    } else {
      return null;
    }
  }
  return [...out].sort((a, b) => a - b);
}
