import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "./tokens.js";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    userEmail?: string;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    return reply.code(401).send({ error: "Token de acesso ausente" });
  }
  try {
    const payload = await verifyAccessToken(token);
    request.userId = payload.sub;
    request.userEmail = payload.email;
  } catch {
    return reply.code(401).send({ error: "Token de acesso inválido ou expirado" });
  }
}
