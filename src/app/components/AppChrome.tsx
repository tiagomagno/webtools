"use client";

import { usePathname } from "next/navigation";
import AppShell from "./AppShell";
import AuthGate from "./AuthGate";
import MobileLayout from "./MobileLayout";

// Login/callback ficam fora da casca do app: não faz sentido mostrar o catálogo
// de ferramentas (sidebar, categorias) em cima do formulário de entrada.
const PUBLIC_PATHS = ["/login", "/auth/callback"];

// Telas que só fazem sentido com conta. Todo o resto (home, categorias e
// ferramentas) é aberto e renderiza o conteúdo no servidor, inclusive para buscadores.
const PROTECTED_PREFIXES = ["/conta", "/admin"];

function requiresAccount(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  const content = requiresAccount(pathname) ? <AuthGate>{children}</AuthGate> : children;

  return (
    <>
      {/* Desktop: 3-col AppShell */}
      <div className="desktop-only">
        <AppShell>{content}</AppShell>
      </div>

      {/* Mobile: header + bottom nav */}
      <div className="mobile-only">
        <MobileLayout />
        <main className="main-content" style={{ padding: "52px 24px 80px" }}>
          {content}
        </main>
      </div>
    </>
  );
}
