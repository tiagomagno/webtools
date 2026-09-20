import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../lib/authGuard.js";

const listQuerySchema = z.object({
  tool: z.string().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

const createSchema = z.object({
  tool: z.string().min(1),
  payload: z.unknown(),
});

export async function historyRoutes(app: FastifyInstance) {
  app.get("/history", { preHandler: requireAuth }, async (request, reply) => {
    const query = listQuerySchema.parse(request.query);
    const entries = await prisma.toolHistoryEntry.findMany({
      where: { userId: request.userId!, tool: query.tool },
      orderBy: { createdAt: "desc" },
      take: query.limit,
      ...(query.cursor ? { skip: 1, cursor: { id: query.cursor } } : {}),
    });
    return reply.send({ entries });
  });

  app.post("/history", { preHandler: requireAuth }, async (request, reply) => {
    const body = createSchema.parse(request.body);
    const entry = await prisma.toolHistoryEntry.create({
      data: { userId: request.userId!, tool: body.tool, payload: body.payload as object },
    });
    return reply.code(201).send(entry);
  });

  app.delete("/history/:id", { preHandler: requireAuth }, async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    const entry = await prisma.toolHistoryEntry.findUnique({ where: { id: params.id } });
    if (!entry || entry.userId !== request.userId) {
      return reply.code(404).send({ error: "Registro não encontrado" });
    }
    await prisma.toolHistoryEntry.delete({ where: { id: params.id } });
    return reply.code(204).send();
  });
}
