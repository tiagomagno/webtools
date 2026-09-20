"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "./config";
import { getTokenStorage, isElectron, type TokenPair } from "./tokenStorage";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  hasPassword: boolean;
  providers: string[];
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string, name?: string): Promise<void>;
  loginWithGoogle(): void;
  logout(): Promise<void>;
  authorizedFetch(path: string, init?: RequestInit): Promise<Response>;
  completeOAuthCallback(fragment: string): Promise<void>;
  refreshUser(): Promise<void>;
  setPassword(newPassword: string, currentPassword?: string): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? `Erro ${res.status}`;
  } catch {
    return `Erro ${res.status}`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const tokenStorage = useMemo(() => getTokenStorage(), []);

  async function applySession(tokens: TokenPair) {
    accessTokenRef.current = tokens.accessToken;
    await tokenStorage.set(tokens);
  }

  async function refreshSession(): Promise<boolean> {
    const stored = await tokenStorage.get();
    if (!stored) return false;
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: stored.refreshToken }),
      });
      if (!res.ok) return false;
      const tokens = (await res.json()) as TokenPair;
      await applySession(tokens);
      return true;
    } catch {
      return false;
    }
  }

  async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const withAuth = (): RequestInit => ({
      ...init,
      headers: {
        ...init.headers,
        ...(accessTokenRef.current ? { Authorization: `Bearer ${accessTokenRef.current}` } : {}),
      },
    });

    let res = await fetch(`${API_URL}${path}`, withAuth());
    if (res.status === 401) {
      const refreshed = await refreshSession();
      if (refreshed) {
        res = await fetch(`${API_URL}${path}`, withAuth());
      }
    }
    return res;
  }

  async function loadUser(): Promise<AuthUser | null> {
    const res = await authorizedFetch("/me");
    if (!res.ok) return null;
    return (await res.json()) as AuthUser;
  }

  async function completeOAuthCallback(fragment: string) {
    const params = new URLSearchParams(fragment);
    const accessToken = params.get("access");
    const refreshToken = params.get("refresh");
    if (!accessToken || !refreshToken) {
      setStatus("unauthenticated");
      return;
    }
    await applySession({ accessToken, refreshToken });
    const me = await loadUser();
    if (me) {
      setUser(me);
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const ok = await refreshSession();
      if (!ok) {
        if (!cancelled) setStatus("unauthenticated");
        return;
      }
      const me = await loadUser();
      if (cancelled) return;
      if (me) {
        setUser(me);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    })();

    // No Electron, o retorno do login Google chega via protocolo customizado
    // (webtools://auth#...), capturado no processo principal e repassado aqui.
    const unsubscribe = window.electronAPI?.onAuthCallback((fragment) => {
      void completeOAuthCallback(fragment);
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await parseErrorMessage(res));
    const tokens = (await res.json()) as TokenPair;
    await applySession(tokens);
    const me = await loadUser();
    setUser(me);
    setStatus(me ? "authenticated" : "unauthenticated");
  }

  async function register(email: string, password: string, name?: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error(await parseErrorMessage(res));
    const tokens = (await res.json()) as TokenPair;
    await applySession(tokens);
    const me = await loadUser();
    setUser(me);
    setStatus(me ? "authenticated" : "unauthenticated");
  }

  function loginWithGoogle() {
    const client = isElectron() ? "electron" : "web";
    const url = `${API_URL}/auth/google/start?client=${client}`;
    if (isElectron() && window.electronAPI) {
      void window.electronAPI.openExternal(url);
    } else {
      window.location.href = url;
    }
  }

  async function logout() {
    const stored = await tokenStorage.get();
    if (stored) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: stored.refreshToken }),
        });
      } catch {
        // best-effort: mesmo se a API estiver fora, limpa a sessão local.
      }
    }
    await tokenStorage.clear();
    accessTokenRef.current = null;
    setUser(null);
    setStatus("unauthenticated");
  }

  async function refreshUser() {
    const me = await loadUser();
    if (me) setUser(me);
  }

  async function setPassword(newPassword: string, currentPassword?: string) {
    const res = await authorizedFetch("/me/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword, currentPassword }),
    });
    if (!res.ok) throw new Error(await parseErrorMessage(res));
    await refreshUser();
  }

  const value: AuthContextValue = {
    status,
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    authorizedFetch,
    completeOAuthCallback,
    refreshUser,
    setPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}

export { type AuthContextValue };
