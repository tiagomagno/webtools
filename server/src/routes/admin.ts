import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";
import { requireAdmin, requireAuth } from "../lib/authGuard.js";

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
}
