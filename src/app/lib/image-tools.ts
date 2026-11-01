// Utilitários compartilhados do bloco de ferramentas de Imagens (#19–#25).
// Tudo roda no navegador via <canvas>; nenhum upload é feito.

export interface LoadedImage {
  name: string;
  width: number;
  height: number;
  size: number;
  /** Data URL da imagem original. */
  src: string;
}

export type ImageType = "image/png" | "image/jpeg" | "image/webp";

export const TYPE_LABEL: Record<ImageType, string> = {
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/webp": "WebP",
};

export const TYPE_EXT: Record<ImageType, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

/** Formata um tamanho em bytes de forma legível. */
export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function isHeicFile(file: File): boolean {
  // No Windows/alguns navegadores o `type` vem vazio pra HEIC; a extensão é o fallback confiável.
  return file.type === "image/heic" || file.type === "image/heif" || /\.(heic|heif)$/i.test(file.name);
}

/** Decodifica HEIC/HEIF (não suportado nativamente por <img>/canvas) via WASM. */
async function heicToJpegBlob(file: File): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
  return Array.isArray(result) ? result[0] : result;
}

/** Lê um arquivo de imagem e resolve com suas dimensões e data URL. */
export async function loadImageFile(file: File): Promise<LoadedImage> {
  const source = isHeicFile(file) ? await heicToJpegBlob(file) : file;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () =>
        resolve({ name: file.name, width: img.width, height: img.height, size: file.size, src });
      img.src = src;
    };
    reader.readAsDataURL(source);
  });
}

export interface EncodeOptions {
  src: string;
  type: ImageType;
  /** 0–1; ignorado para PNG. */
  quality?: number;
  /** Dimensões de saída; padrão = dimensões da fonte (ou do recorte). */
  width?: number;
  height?: number;
  /** Região de recorte na imagem original, em pixels. */
  crop?: { x: number; y: number; w: number; h: number };
}

export interface EncodedImage {
  url: string;
  blob: Blob;
  size: number;
  width: number;
  height: number;
}

/**
 * Desenha a imagem em um canvas (com redimensionamento opcional) e a codifica
 * no formato/qualidade desejados. Formatos sem alfa recebem fundo branco.
 */
export function encodeImage(opts: EncodeOptions): Promise<EncodedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    img.onload = () => {
      const c = opts.crop;
      const srcW = c ? c.w : img.width;
      const srcH = c ? c.h : img.height;
      const w = Math.max(1, Math.round(opts.width ?? srcW));
      const h = Math.max(1, Math.round(opts.height ?? srcH));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas indisponível."));

      if (opts.type === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.imageSmoothingQuality = "high";
      if (c) ctx.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, w, h);
      else ctx.drawImage(img, 0, 0, w, h);

      const q = opts.type === "image/png" ? undefined : opts.quality;
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Falha ao codificar a imagem."));
          resolve({ url: URL.createObjectURL(blob), blob, size: blob.size, width: w, height: h });
        },
        opts.type,
        q,
      );
    };
    img.src = opts.src;
  });
}

/** Dispara o download de um blob/URL com o nome informado. */
export function downloadUrl(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

/** Remove a extensão de um nome de arquivo. */
export function stripExt(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

// ─── Cálculos do editor (puros) e operações extras ────────────────────────────

export interface CropRect { x: number; y: number; w: number; h: number }

/** Converte uma seleção feita sobre a imagem exibida (largura `displayWidth`) para pixels da imagem original. */
export function scaleCrop(sel: CropRect, displayWidth: number, imageWidth: number): CropRect {
  const k = imageWidth / displayWidth;
  return { x: Math.round(sel.x * k), y: Math.round(sel.y * k), w: Math.round(sel.w * k), h: Math.round(sel.h * k) };
}

/** Variação percentual do tamanho do arquivo (negativa = ficou menor). */
export function sizeChangePercent(before: number, after: number): number {
  return before === 0 ? 0 : Math.round(((after - before) / before) * 100);
}

/** Tamanho aproximado, em bytes, do conteúdo de um data URI em Base64. */
export function base64Bytes(dataUrl: string): number {
  const b64 = dataUrl.includes(",") ? dataUrl.slice(dataUrl.indexOf(",") + 1) : dataUrl;
  const clean = b64.replace(/\s/g, "");
  const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  return Math.floor((clean.length * 3) / 4) - padding;
}

/** Limite de lado e de área do canvas que os navegadores aceitam com segurança. */
export const MAX_CANVAS_SIDE = 16384;
export const MAX_CANVAS_AREA = 100_000_000;

/** Verifica se uma imagem w×h cabe num canvas. */
export function fitsCanvas(w: number, h: number): boolean {
  return w <= MAX_CANVAS_SIDE && h <= MAX_CANVAS_SIDE && w * h <= MAX_CANVAS_AREA;
}

/** Carrega uma imagem a partir de um data URI (por exemplo, colado em Base64). */
export function loadImageDataUrl(src: string, name = "imagem"): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Esse código não é uma imagem válida."));
    img.onload = () => resolve({ name, width: img.width, height: img.height, size: base64Bytes(src), src });
    img.src = src;
  });
}

/** Aumenta a imagem em etapas de 2× (qualidade melhor que um salto único) e codifica no formato escolhido. */
export function upscaleImage(opts: { src: string; scale: 2 | 4 | 8; type: ImageType; quality?: number }): Promise<EncodedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    img.onload = () => {
      let current = document.createElement("canvas");
      current.width = img.width;
      current.height = img.height;
      current.getContext("2d")?.drawImage(img, 0, 0);
      for (let i = 0; i < Math.log2(opts.scale); i++) {
        const next = document.createElement("canvas");
        next.width = current.width * 2;
        next.height = current.height * 2;
        const ctx = next.getContext("2d");
        if (!ctx) return reject(new Error("Canvas indisponível."));
        if (opts.type === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, next.width, next.height); }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(current, 0, 0, next.width, next.height);
        current = next;
      }
      const { width, height } = current;
      current.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Falha ao codificar a imagem."));
          resolve({ url: URL.createObjectURL(blob), blob, size: blob.size, width, height });
        },
        opts.type,
        opts.type === "image/png" ? undefined : opts.quality,
      );
    };
    img.src = opts.src;
  });
}
