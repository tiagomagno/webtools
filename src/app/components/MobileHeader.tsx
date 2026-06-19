"use client";

import Link from "next/link";

export default function MobileHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        height: 52,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="var(--accent)" />
          <rect x="7" y="9" width="5" height="10" rx="1.5" fill="white" opacity="0.9" />
          <rect x="14" y="9" width="7" height="4.5" rx="1.5" fill="white" opacity="0.7" />
          <rect x="14" y="14.5" width="7" height="4.5" rx="1.5" fill="white" opacity="0.5" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
          webtools
        </span>
      </Link>
    </header>
  );
}
