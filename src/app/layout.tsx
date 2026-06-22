import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ display: "flex", minHeight: "100vh" }}>
        {/* Desktop sidebar */}
        <div className="desktop-only">
          <Sidebar />
        </div>

        {/* Mobile header + bottom nav (shared modal state) */}
        <div className="mobile-only">
          <MobileLayout />
        </div>

        {/* Content */}
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
