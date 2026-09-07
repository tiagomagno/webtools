import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import AppShell from "./components/AppShell";
import MobileLayout from "./components/MobileLayout";
import RecentTracker from "./components/RecentTracker";

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = JSON.parse(localStorage.getItem("wt-theme") || '"light"');
    var font = JSON.parse(localStorage.getItem("wt-font") || '"md"');
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    document.documentElement.setAttribute("data-font", font);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <RecentTracker />

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
