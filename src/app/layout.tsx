import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import MobileLayout from "./components/MobileLayout";

export const metadata: Metadata = {
  title: "Webtools",
  description: "Ferramentas web úteis",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
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
