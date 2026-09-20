"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../lib/auth/AuthProvider";

// Protege qualquer rota que não seja /login ou /auth/callback (essas já
// ficam fora da casca do app, ver AppChrome — nunca chegam aqui dentro).
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

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
