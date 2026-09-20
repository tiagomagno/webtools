"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "../../lib/auth/AuthProvider";

export default function AuthCallbackPage() {
  const { completeOAuthCallback } = useAuth();
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    // O token vem no fragment (#access=...&refresh=...), nunca em query string,
    // pra não acabar em log de servidor nem em histórico de navegação com o token exposto.
    const fragment = window.location.hash.replace(/^#/, "");
    completeOAuthCallback(fragment).finally(() => {
      window.history.replaceState(null, "", window.location.pathname);
      router.replace("/");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", color: "var(--text-muted)" }}>
      Concluindo login…
    </div>
  );
}
