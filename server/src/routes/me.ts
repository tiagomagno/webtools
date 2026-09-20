import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../lib/authGuard.js";
import { hashPassword, verifyPassword } from "../lib/password.js";

const setPasswordSchema = z.object({
  currentPassword: z.string().min(1).optional(),
  newPassword: z.string().min(8),
});

export async function meRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: requireAuth }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.userId! },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        passwordHash: true,
        oauthAccounts: { select: { provider: true } },
      },
    });
    if (!user) return reply.code(404).send({ error: "Usuário não encontrado" });
    const { passwordHash, oauthAccounts, ...rest } = user;
    return reply.send({
      ...rest,
      hasPassword: passwordHash !== null,
      providers: oauthAccounts.map((a) => a.provider),
    });
  });

  // Define uma senha local (conta só-Google) ou troca a existente. Quem já
  // tem senha precisa confirmar a atual; quem só entrou via Google, não.
  app.patch("/me/password", { preHandler: requireAuth }, async (request, reply) => {
    const body = setPasswordSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { id: request.userId! } });
    if (!user) return reply.code(404).send({ error: "Usuário não encontrado" });

    if (user.passwordHash) {
      if (!body.currentPassword) {
        return reply.code(400).send({ error: "Informe a senha atual" });
      }
      const valid = await verifyPassword(body.currentPassword, user.passwordHash);
      if (!valid) {
        return reply.code(401).send({ error: "Senha atual incorreta" });
      }
    }

    const passwordHash = await hashPassword(body.newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    return reply.code(204).send();
  });
}
