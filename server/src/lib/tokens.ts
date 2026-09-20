import { randomBytes, createHash } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { env } from "../env.js";

const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

const secretKey = new TextEncoder().encode(env.SESSION_SECRET);

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(secretKey);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, secretKey);
  if (!payload.sub || typeof payload.email !== "string") {
    throw new Error("Token de acesso com payload inválido");
  }
  return { sub: payload.sub, email: payload.email };
}

// Refresh tokens são opacos (não JWT): o valor bruto vai pro cliente, só o hash
// fica no banco. Isso permite revogar sessões individualmente sem precisar de
// uma denylist de JWTs.
export function generateRefreshToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("hex");
  return { token, tokenHash: hashRefreshToken(token) };
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
