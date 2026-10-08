"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../lib/auth/AuthProvider";
import { loginHref } from "../lib/auth/next";

// Protege só as telas que dependem de uma conta (/conta e /admin; ver AppChrome).
// As ferramentas são abertas: quem não entra usa tudo, só não tem histórico salvo.
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(loginHref(pathname));
    }
  }, [status, router, pathname]);

  if (status !== "authenticated") {
    // "loading" (ainda checando sessão) ou "unauthenticated" (prestes a
    // redirecionar) — não renderiza a tela da conta pra não vazar conteúdo.
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "var(--text-muted)" }}>
        Carregando…
      </div>
    );
  }

  return <>{children}</>;
}
