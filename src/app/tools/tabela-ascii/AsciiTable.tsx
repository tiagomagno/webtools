"use client";

import { useState, useMemo } from "react";

const CTRL = ["NUL","SOH","STX","ETX","EOT","ENQ","ACK","BEL","BS","HT","LF","VT","FF","CR","SO","SI",
  "DLE","DC1","DC2","DC3","DC4","NAK","SYN","ETB","CAN","EM","SUB","ESC","FS","GS","RS","US"];

function charDisplay(code: number): string {
  if (code < 32) return CTRL[code];
  if (code === 127) return "DEL";
  return String.fromCharCode(code);
}

const ROWS = Array.from({ length: 256 }, (_, i) => ({
  dec: i, hex: i.toString(16).toUpperCase().padStart(2, "0"),
  bin: i.toString(2).padStart(8, "0"), char: charDisplay(i),
  isCtrl: i < 32 || i === 127,
}));

export default function AsciiTable() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<"all" | "standard" | "extended">("all");
  const [copied, setCopied] = useState<number | null>(null);

  const rows = useMemo(() => {
    return ROWS.filter(r => {
      if (range === "standard" && r.dec > 127) return false;
      if (range === "extended" && r.dec <= 127) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return r.dec.toString().includes(s) || r.hex.toLowerCase().includes(s) || r.char.toLowerCase().includes(s);
    });
  }, [search, range]);

  function copy(row: typeof ROWS[0]) {
    if (!row.isCtrl) navigator.clipboard.writeText(row.char);
    setCopied(row.dec);
    setTimeout(() => setCopied(null), 1000);
  }

  const th: React.CSSProperties = { padding: "8px 10px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };
  const td: React.CSSProperties = { padding: "6px 10px", fontSize: 13, fontFamily: "monospace", borderBottom: "1px solid var(--border)" };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por char, dec ou hex..."
          style={{ flex: 1, minWidth: 180, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", color: "var(--text)", fontSize: 13 }} />
        {(["all", "standard", "extended"] as const).map(r => (
          <button key={r} onClick={() => setRange(r)}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, background: range === r ? "var(--accent)" : "var(--surface)", color: range === r ? "#fff" : "var(--text)" }}>
            {r === "all" ? "Todos (0–255)" : r === "standard" ? "ASCII (0–127)" : "Estendido (128–255)"}
          </button>
        ))}
      </div>

      <div style={{ maxHeight: 480, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ position: "sticky", top: 0, background: "var(--surface-2)" }}>
            <tr>
              <th style={th}>Dec</th>
              <th style={th}>Hex</th>
              <th style={th}>Bin</th>
              <th style={th}>Char</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.dec} onClick={() => copy(row)}
                style={{ cursor: row.isCtrl ? "default" : "pointer", background: copied === row.dec ? "var(--accent)15" : "transparent" }}
                title={row.isCtrl ? row.char : `Copiar '${row.char}'`}>
                <td style={{ ...td, color: "var(--text-muted)" }}>{row.dec}</td>
                <td style={{ ...td, color: "var(--accent)" }}>{row.hex}</td>
                <td style={{ ...td, color: "var(--text-muted)", fontSize: 11 }}>{row.bin}</td>
                <td style={{ ...td, color: row.isCtrl ? "var(--text-subtle)" : "var(--text)", fontWeight: row.isCtrl ? 400 : 600 }}>
                  {copied === row.dec ? "✓" : row.char}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p style={{ textAlign: "center", padding: 20, fontSize: 14, color: "var(--text-subtle)" }}>Nenhum resultado para "{search}".</p>}
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Clique em qualquer linha para copiar o caractere.</p>
    </div>
  );
}
