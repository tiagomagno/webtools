import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  // Opcionais: login por e-mail/senha funciona sem o Google configurado.
  // As rotas /auth/google/* retornam 503 enquanto estas três não existirem.
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  FRONTEND_URL: z.string().url(),
  ELECTRON_CALLBACK_SCHEME: z.string().min(1).default("webtools"),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);

export const isGoogleOAuthConfigured = Boolean(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REDIRECT_URI,
);
