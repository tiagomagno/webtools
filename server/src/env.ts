import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),
  FRONTEND_URL: z.string().url(),
  ELECTRON_CALLBACK_SCHEME: z.string().min(1).default("webtools"),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
