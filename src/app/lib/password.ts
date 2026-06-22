// Geração de senhas seguras (#38). Usa o RNG criptográfico do navegador.

export interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  /** Evita caracteres ambíguos (O, 0, l, 1, I). */
  avoidAmbiguous: boolean;
}

const SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

const AMBIGUOUS = /[O0lI1|]/g;

/** Inteiro aleatório uniforme em [0, max) usando crypto. */
function randInt(max: number): number {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let x: number;
  do {
    crypto.getRandomValues(arr);
    x = arr[0];
  } while (x >= limit);
  return x % max;
}

/** Gera uma senha conforme as opções. Lança erro se nenhum conjunto for escolhido. */
export function generatePassword(opts: PasswordOptions): string {
  let pool = "";
  if (opts.lowercase) pool += SETS.lowercase;
  if (opts.uppercase) pool += SETS.uppercase;
  if (opts.numbers) pool += SETS.numbers;
  if (opts.symbols) pool += SETS.symbols;
  if (opts.avoidAmbiguous) pool = pool.replace(AMBIGUOUS, "");

  if (!pool) throw new Error("Selecione ao menos um conjunto de caracteres.");

  let out = "";
  for (let i = 0; i < opts.length; i++) out += pool[randInt(pool.length)];
  return out;
}

export interface Strength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  /** Entropia estimada em bits. */
  bits: number;
}

/** Estima a força da senha a partir do tamanho e variedade de caracteres. */
export function estimateStrength(opts: PasswordOptions): Strength {
  let poolSize = 0;
  if (opts.lowercase) poolSize += 26;
  if (opts.uppercase) poolSize += 26;
  if (opts.numbers) poolSize += 10;
  if (opts.symbols) poolSize += 24;
  if (opts.avoidAmbiguous) poolSize = Math.max(1, poolSize - 6);

  const bits = poolSize > 1 ? Math.round(opts.length * Math.log2(poolSize)) : 0;

  let score: Strength["score"];
  if (bits < 40) score = 1;
  else if (bits < 60) score = 2;
  else if (bits < 80) score = 3;
  else score = 4;
  if (bits === 0) score = 0;

  const labels = ["—", "Fraca", "Razoável", "Forte", "Muito forte"];
  return { score, label: labels[score], bits };
}
