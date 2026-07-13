import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "./components/AppShell";
import MobileLayout from "./components/MobileLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://webtools.local"),
  title: {
    default: "Webtools — Ferramentas web gratuitas",
    template: "%s · Webtools",
  },
  description: "Ferramentas web úteis e gratuitas, sem cadastro e sem upload.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0 }}>
        {/* Desktop: 3-col AppShell */}
        <div className="desktop-only">
          <AppShell>{children}</AppShell>
        </div>

        {/* Mobile: header + bottom nav */}
        <div className="mobile-only">
          <MobileLayout />
          <main className="main-content" style={{ paddingTop: 52, paddingBottom: 80, padding: "52px 16px 80px" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
