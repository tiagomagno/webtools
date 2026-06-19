"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  Blend,
  Ruler,
  Scissors,
  Image,
  ZoomIn,
  FileText,
  FileDown,
} from "lucide-react";

const sections = [
  {
    label: null,
    items: [{ href: "/", icon: LayoutDashboard, label: "Início" }],
  },
  {
    label: "Design",
    items: [
      { href: "/tools/color-palette", icon: Palette, label: "Paleta de Cores" },
      { href: "/tools/gradients", icon: Blend, label: "Gradientes" },
    ],
  },
  {
    label: "CSS",
    items: [
      { href: "/tools/css-units", icon: Ruler, label: "Conversor CSS" },
    ],
  },
  {
    label: "Texto",
    items: [
      { href: "/tools/text-cleaner", icon: Scissors, label: "Limpeza de Texto" },
      { href: "/tools/pdf-extractor", icon: FileText, label: "Extrator de Documentos" },
      { href: "/tools/pdf-compressor", icon: FileDown, label: "Compressão de PDF" },
    ],
  },
  {
    label: "Imagens",
    items: [
      { href: "/tools/image-converter", icon: Image, label: "Conversor de Imagens" },
      { href: "/tools/image-upscaler", icon: ZoomIn, label: "Aumentar Resolução" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="var(--accent)" />
          <rect x="7" y="9" width="5" height="10" rx="1.5" fill="white" opacity="0.9" />
          <rect x="14" y="9" width="7" height="4.5" rx="1.5" fill="white" opacity="0.7" />
          <rect x="14" y="14.5" width="7" height="4.5" rx="1.5" fill="white" opacity="0.5" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
          webtools
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {sections.map((section, si) => (
          <div key={si} style={{ marginBottom: 4 }}>
            {section.label && (
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-subtle)", padding: "12px 8px 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: active ? "var(--accent)18" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-muted)",
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      transition: "all 0.1s",
                      cursor: "pointer",
                    }}
                    className="nav-item"
                  >
                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <style>{`
        .nav-item:hover {
          background: var(--surface-2) !important;
          color: var(--text) !important;
        }
      `}</style>
    </aside>
  );
}
