import bcrypt from "bcryptjs";

// Mesmo custo usado no admin do portfolio-designer (src/lib/auth.ts) por consistência.
const SALT_ROUNDS = 10;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
