"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../lib/auth/AuthProvider";

// Login é obrigatório em todo o app — só estas rotas ficam de fora do gate,
// senão ninguém consegue nem chegar na tela de login.
const PUBLIC_PATHS = ["/login", "/auth/callback"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (status === "unauthenticated" && !isPublicPath) {
      router.replace("/login");
    }
  }, [status, isPublicPath, router]);

  if (isPublicPath) return <>{children}</>;

  if (status !== "authenticated") {
    // "loading" (ainda checando sessão) ou "unauthenticated" (prestes a
    // redirecionar) — não renderiza a ferramenta pra não vazar conteúdo.
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "var(--text-muted)" }}>
        Carregando…
      </div>
    );
  }

  return <>{children}</>;
}
