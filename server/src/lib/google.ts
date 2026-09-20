import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../env.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUER = "https://accounts.google.com";

const googleJwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL));

// As rotas checam `isGoogleOAuthConfigured` antes de chamar qualquer função
// daqui; isto só existe pra satisfazer o TS (os três campos são opcionais no
// env) e como defesa extra caso alguém esqueça o guard.
function requireGoogleEnv() {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REDIRECT_URI) {
    throw new Error("Login com Google não está configurado (faltam variáveis de ambiente)");
  }
  return {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI,
  };
}

export type OAuthClientKind = "web" | "electron";

// `state` carrega o tipo de cliente (web/electron) + um nonce anti-CSRF,
// codificados juntos porque o Google só devolve `state` como string opaca.
export function encodeState(client: OAuthClientKind, nonce: string): string {
  return Buffer.from(JSON.stringify({ client, nonce })).toString("base64url");
}

export function decodeState(state: string): { client: OAuthClientKind; nonce: string } {
  const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
  if (parsed.client !== "web" && parsed.client !== "electron") {
    throw new Error("Estado do OAuth com client inválido");
  }
  return parsed;
}

export function buildGoogleAuthUrl(state: string): string {
  const { clientId, redirectUri } = requireGoogleEnv();
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

interface GoogleProfile {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export async function exchangeCodeForProfile(code: string): Promise<GoogleProfile> {
  const { clientId, clientSecret, redirectUri } = requireGoogleEnv();
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Falha ao trocar code por token no Google: ${tokenRes.status}`);
  }

  const { id_token: idToken } = (await tokenRes.json()) as { id_token?: string };
  if (!idToken) {
    throw new Error("Resposta do Google sem id_token");
  }

  const { payload } = await jwtVerify(idToken, googleJwks, {
    issuer: GOOGLE_ISSUER,
    audience: clientId,
  });

  if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
    throw new Error("id_token do Google sem sub/email");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: typeof payload.name === "string" ? payload.name : undefined,
    picture: typeof payload.picture === "string" ? payload.picture : undefined,
  };
}
