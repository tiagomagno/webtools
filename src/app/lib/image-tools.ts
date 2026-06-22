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

/** Lê um arquivo de imagem e resolve com suas dimensões e data URL. */
export function loadImageFile(file: File): Promise<LoadedImage> {
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
    reader.readAsDataURL(file);
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
