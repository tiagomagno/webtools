import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAdmin, requireAuth } from "../lib/authGuard.js";

const paramsSchema = z.object({ id: z.string().min(1) });

export async function adminRoutes(app: FastifyInstance) {
  app.get("/admin/users", { preHandler: [requireAuth, requireAdmin] }, async () => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        oauthAccounts: { select: { provider: true } },
        _count: { select: { historyEntries: true } },
      },
    });

    return users.map(({ oauthAccounts, _count, ...user }) => ({
      ...user,
      providers: oauthAccounts.map((a) => a.provider),
      toolUsageCount: _count.historyEntries,
    }));
  });

  app.delete("/admin/users/:id", { preHandler: [requireAuth, requireAdmin] }, async (request, reply) => {
    const { id } = paramsSchema.parse(request.params);
    if (id === request.userId) {
      return reply.code(400).send({ error: "Você não pode excluir a própria conta" });
    }
    try {
      await prisma.user.delete({ where: { id } });
    } catch {
      return reply.code(404).send({ error: "Usuário não encontrado" });
    }
    return reply.code(204).send();
  });
}
