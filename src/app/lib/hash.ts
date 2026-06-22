/**
 * Geração de hashes. SHA-* via Web Crypto; MD5 em JS puro (Web Crypto não suporta).
 * Usado por: Hash Generator (#14).
 */

export type HashAlgo = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Calcula o hash de um texto e retorna a string hexadecimal. */
export async function hashText(text: string, algo: HashAlgo): Promise<string> {
  if (algo === "MD5") return md5(text);
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algo, data);
  return bufferToHex(digest);
}

/* ---------- MD5 (implementação pura, RFC 1321) ---------- */

function md5(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return md5Bytes(bytes);
}

function md5Bytes(msg: Uint8Array): string {
  const rotateLeft = (x: number, c: number) => (x << c) | (x >>> (32 - c));
  const add = (a: number, b: number) => (a + b) >>> 0;

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K: number[] = [];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;

  const origLenBits = msg.length * 8;
  // padding
  const withOne = msg.length + 1;
  const padLen = ((withOne + 8 + 63) & ~63) - msg.length;
  const padded = new Uint8Array(msg.length + padLen);
  padded.set(msg);
  padded[msg.length] = 0x80;
  // append length (64-bit little-endian)
  const lenLo = origLenBits >>> 0;
  const lenHi = Math.floor(origLenBits / 4294967296) >>> 0;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, lenLo, true);
  dv.setUint32(padded.length - 4, lenHi, true);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let off = 0; off < padded.length; off += 64) {
    const M: number[] = [];
    for (let i = 0; i < 16; i++) M[i] = dv.getUint32(off + i * 4, true);

    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }

      F = add(add(add(F, A), K[i]), M[g]);
      A = D;
      D = C;
      C = B;
      B = add(B, rotateLeft(F, s[i]));
    }
    a0 = add(a0, A);
    b0 = add(b0, B);
    c0 = add(c0, C);
    d0 = add(d0, D);
  }

  const toHexLE = (n: number) =>
    Array.from({ length: 4 }, (_, i) => ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0")).join("");
  return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0);
}
