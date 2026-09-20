import { randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { env, isGoogleOAuthConfigured } from "../env.js";
import { buildGoogleAuthUrl, decodeState, encodeState, exchangeCodeForProfile } from "../lib/google.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import {
  REFRESH_TOKEN_TTL_MS,
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
} from "../lib/tokens.js";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

async function issueSession(userId: string, email: string, deviceInfo: string | undefined) {
  const accessToken = await signAccessToken({ sub: userId, email });
  const { token: refreshToken, tokenHash } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      deviceInfo,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
  return { accessToken, refreshToken };
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return reply.code(409).send({ error: "Já existe uma conta com esse e-mail" });
    }
    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: { email: body.email, passwordHash, name: body.name },
    });
    const session = await issueSession(user.id, user.email, request.headers["user-agent"]);
    return reply.code(201).send(session);
  });

  app.post("/auth/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !user.passwordHash) {
      return reply.code(401).send({ error: "E-mail ou senha inválidos" });
    }
    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      return reply.code(401).send({ error: "E-mail ou senha inválidos" });
    }
    const session = await issueSession(user.id, user.email, request.headers["user-agent"]);
    return reply.send(session);
  });

  app.post("/auth/refresh", async (request, reply) => {
    const body = refreshSchema.parse(request.body);
    const tokenHash = hashRefreshToken(body.refreshToken);
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } }).catch(() => {});
      return reply.code(401).send({ error: "Refresh token inválido ou expirado" });
    }
    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) {
      return reply.code(401).send({ error: "Usuário não encontrado" });
    }
    // Rotaciona: apaga o token usado e emite um novo par (evita replay).
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const session = await issueSession(user.id, user.email, stored.deviceInfo ?? undefined);
    return reply.send(session);
  });

  app.post("/auth/logout", async (request, reply) => {
    const body = refreshSchema.parse(request.body);
    const tokenHash = hashRefreshToken(body.refreshToken);
    await prisma.refreshToken.deleteMany({ where: { tokenHash } });
    return reply.code(204).send();
  });

  app.get("/auth/google/start", async (request, reply) => {
    if (!isGoogleOAuthConfigured) {
      return reply.code(503).send({ error: "Login com Google ainda não está configurado" });
    }
    const query = z.object({ client: z.enum(["web", "electron"]).default("web") }).parse(request.query);
    const nonce = randomBytes(16).toString("hex");
    const state = encodeState(query.client, nonce);
    return reply.redirect(buildGoogleAuthUrl(state));
  });

  app.get("/auth/google/callback", async (request, reply) => {
    if (!isGoogleOAuthConfigured) {
      return reply.code(503).send({ error: "Login com Google ainda não está configurado" });
    }
    const query = z.object({ code: z.string(), state: z.string() }).parse(request.query);
    const { client } = decodeState(query.state);
    const profile = await exchangeCodeForProfile(query.code);

    const account = await prisma.oAuthAccount.findUnique({
      where: { provider_providerAccountId: { provider: "google", providerAccountId: profile.sub } },
      include: { user: true },
    });

    let user = account?.user;
    if (!user) {
      // E-mail já tem conta local (senha)? Linka o Google a ela em vez de duplicar.
      user =
        (await prisma.user.findUnique({ where: { email: profile.email } })) ??
        (await prisma.user.create({
          data: { email: profile.email, name: profile.name, avatarUrl: profile.picture },
        }));
      await prisma.oAuthAccount.create({
        data: { provider: "google", providerAccountId: profile.sub, userId: user.id },
      });
    }

    const session = await issueSession(user.id, user.email, request.headers["user-agent"]);
    const fragment = new URLSearchParams({
      access: session.accessToken,
      refresh: session.refreshToken,
    }).toString();

    const destination =
      client === "electron"
        ? `${env.ELECTRON_CALLBACK_SCHEME}://auth#${fragment}`
        : `${env.FRONTEND_URL}/auth/callback#${fragment}`;

    return reply.redirect(destination);
  });
}
