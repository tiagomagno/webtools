import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="var(--accent)" />
            <rect x="7" y="9" width="5" height="10" rx="1.5" fill="white" opacity="0.9" />
            <rect x="14" y="9" width="7" height="4.5" rx="1.5" fill="white" opacity="0.7" />
            <rect x="14" y="14.5" width="7" height="4.5" rx="1.5" fill="white" opacity="0.5" />
          </svg>
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            webtools
          </span>
        </Link>
      </div>
    </header>
  );
}
