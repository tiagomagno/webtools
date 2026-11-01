import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../lib/authGuard.js";

const createSchema = z.object({
  type: z.enum(["SUGGESTION", "BUG"]),
  message: z.string().trim().min(5, "Escreva pelo menos 5 caracteres").max(2000, "Máximo de 2000 caracteres"),
  page: z.string().trim().max(190).optional(),
});

// Limite simples contra spam: poucas mensagens por hora para cada pessoa.
const MAX_PER_HOUR = 5;

export async function feedbackRoutes(app: FastifyInstance) {
  app.post("/feedback", { preHandler: requireAuth }, async (request, reply) => {
    const body = createSchema.parse(request.body);

    const recent = await prisma.feedback.count({
      where: { userId: request.userId!, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
    });
    if (recent >= MAX_PER_HOUR) {
      return reply.code(429).send({ error: "Você enviou várias mensagens seguidas. Tente de novo daqui a pouco." });
    }

    const feedback = await prisma.feedback.create({
      data: { userId: request.userId!, type: body.type, message: body.message, page: body.page || null },
      select: { id: true },
    });
    return reply.code(201).send(feedback);
  });
}
