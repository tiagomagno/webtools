import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";
import { requireAuth } from "../lib/authGuard.js";

export async function meRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: requireAuth }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.userId! },
      select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
    });
    if (!user) return reply.code(404).send({ error: "Usuário não encontrado" });
    return reply.send(user);
  });
}
