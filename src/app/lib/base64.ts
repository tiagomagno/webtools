/**
 * Codificação/decodificação Base64 segura para UTF-8.
 * Usado por: Base64 Encode (#10), Base64 Decode (#11), JWT Decoder (#12).
 */

/** Codifica texto UTF-8 em Base64. */
export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/** Decodifica Base64 (padrão) em texto UTF-8. Lança erro se inválido. */
export function decodeBase64(b64: string): string {
  const binary = atob(b64.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

/** Converte Base64URL (usado em JWT) para Base64 padrão. */
export function base64UrlToBase64(input: string): string {
  let s = input.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4 !== 0) s += "=";
  return s;
}

/** Decodifica um segmento Base64URL em texto UTF-8. */
export function decodeBase64Url(input: string): string {
  return decodeBase64(base64UrlToBase64(input));
}
