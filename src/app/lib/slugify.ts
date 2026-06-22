// Geração de slugs amigáveis para URL (#34).

export interface SlugOptions {
  separator?: string;
  lowercase?: boolean;
  /** Mantém apenas [a-z0-9] + separador. */
  strict?: boolean;
}

// Faixa de marcas de combinação (diacríticos) no Unicode.
const DIACRITICS = /[̀-ͯ]/g;

/**
 * Converte um texto em slug: remove acentos, troca espaços por separador e
 * limpa caracteres especiais. Ideal para URLs, IDs e nomes de arquivo.
 */
export function slugify(text: string, opts: SlugOptions = {}): string {
  const { separator = "-", lowercase = true, strict = true } = opts;
  let s = text.trim();

  // Remove acentos (NFD + remoção de diacríticos).
  s = s.normalize("NFD").replace(DIACRITICS, "");

  if (lowercase) s = s.toLowerCase();

  if (strict) {
    // Substitui qualquer coisa que não seja alfanumérico por espaço.
    s = s.replace(/[^a-zA-Z0-9]+/g, " ");
  } else {
    // Mantém letras/números unicode, troca pontuação por espaço.
    s = s.replace(/[^\p{L}\p{N}]+/gu, " ");
  }

  s = s.trim().replace(/\s+/g, separator);
  // Remove separadores duplicados ou nas pontas.
  const sepEsc = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  s = s.replace(new RegExp(`${sepEsc}{2,}`, "g"), separator).replace(new RegExp(`^${sepEsc}|${sepEsc}$`, "g"), "");
  return s;
}
