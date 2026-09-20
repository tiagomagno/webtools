import cors from "@fastify/cors";
import Fastify from "fastify";
import { env } from "./env.js";
import { authRoutes } from "./routes/auth.js";
import { historyRoutes } from "./routes/history.js";
import { meRoutes } from "./routes/me.js";

export function buildApp() {
  const app = Fastify({ logger: true });

  const allowedOrigins = new Set([env.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"]);

  app.register(cors, {
    origin(origin, callback) {
      // Sem Origin (curl, apps nativos) ou origem "null" (páginas file:// do
      // Electron) são liberadas; no navegador só libera as origens conhecidas.
      if (!origin || origin === "null" || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origem não permitida"), false);
    },
  });

  app.get("/health", async () => ({ ok: true }));

  app.register(authRoutes);
  app.register(meRoutes);
  app.register(historyRoutes);

  return app;
}
