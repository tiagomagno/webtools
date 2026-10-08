# Convenções de API (`server/`)
Fastify 5 + zod + Prisma (MySQL). Uma função de rotas por domínio em `server/src/routes/`, registrada em `app.ts`.
- Entrada validada com schema zod (`.parse` em `request.query/body/params`).
- Rotas protegidas usam `preHandler: requireAuth`; sempre filtrar por `request.userId` (nunca confiar em id vindo do cliente).
- Erros: `reply.code(404).send({ error: "Mensagem em português" })`; criação responde `201`, exclusão `204`.
- Mudança de schema Prisma: `db:push` em dev; em produção, migration (`db:migrate:deploy`). Evitar migrations destrutivas e documentar em docs/ARQUITETURA.md.

## Assim sim (de `server/src/routes/history.ts`)
```ts
app.get("/history", { preHandler: requireAuth }, async (request, reply) => {
  const query = listQuerySchema.parse(request.query);
  const entries = await prisma.toolHistoryEntry.findMany({
    where: { userId: request.userId!, tool: query.tool },
    orderBy: { createdAt: "desc" },
    take: query.limit,
  });
  return reply.send({ entries });
});
```
