// Geração e formatação de UUID v4 (#13, #39).

/** Gera um UUID v4 usando o RNG criptográfico quando disponível. */
export function generateUuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface UuidFormat {
  uppercase?: boolean;
  hyphens?: boolean;
  braces?: boolean;
}

/** Aplica opções de formatação a um UUID. */
export function formatUuid(uuid: string, fmt: UuidFormat = {}): string {
  let s = uuid;
  if (fmt.hyphens === false) s = s.replace(/-/g, "");
  if (fmt.uppercase) s = s.toUpperCase();
  if (fmt.braces) s = `{${s}}`;
  return s;
}

/** Gera `count` UUIDs já formatados. */
export function generateUuids(count: number, fmt: UuidFormat = {}): string[] {
  return Array.from({ length: count }, () => formatUuid(generateUuid(), fmt));
}
