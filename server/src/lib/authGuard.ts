import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../db.js";
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

// Roda depois de requireAuth. Confere a role no banco a cada request (em vez
// de confiar no JWT) porque o access token tem vida curta mas é reemitido
// via refresh sem checar a role de novo — promover/rebaixar alguém só faria
// efeito quando o token expirasse, se a gente confiasse nele.
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = await prisma.user.findUnique({ where: { id: request.userId! }, select: { role: true } });
  if (user?.role !== "ADMIN") {
    return reply.code(403).send({ error: "Acesso restrito a administradores" });
  }
}
