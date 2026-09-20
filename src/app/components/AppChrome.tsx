"use client";

import { usePathname } from "next/navigation";
import AppShell from "./AppShell";
import AuthGate from "./AuthGate";
import MobileLayout from "./MobileLayout";

// Login/callback ficam fora da casca do app — não faz sentido mostrar o
// catálogo de ferramentas (sidebar, categorias) pra quem ainda não pode
// acessar nenhuma delas.
const PUBLIC_PATHS = ["/login", "/auth/callback"];

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Desktop: 3-col AppShell */}
      <div className="desktop-only">
        <AppShell>
          <AuthGate>{children}</AuthGate>
        </AppShell>
      </div>

      {/* Mobile: header + bottom nav */}
      <div className="mobile-only">
        <MobileLayout />
        <main className="main-content" style={{ paddingTop: 52, paddingBottom: 80, padding: "52px 16px 80px" }}>
          <AuthGate>{children}</AuthGate>
        </main>
      </div>
    </>
  );
}
