"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { bestTextColor, cssColor, formatColor, type ColorFormat } from "../../lib/palette";

const VALUE_ROWS: { format: Exclude<ColorFormat, "hex">; label: string }[] = [
  { format: "rgb", label: "RGB" },
  { format: "hsl", label: "HSL" },
];

/** As cores da paleta em tiras. O HEX fica dentro da tira; RGB e HSL, logo abaixo. Tudo copiável. */
export default function PaletteStrips({ colors }: { colors: string[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (key: string, value: string) => {
    void navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400);
  };

  return (
    <div style={{ display: "flex", gap: 0 }}>
      {colors.map((hex, i) => {
        const text = bestTextColor(hex);
        const hexKey = `${i}-hex`;
        return (
          <div key={`${hex}-${i}`} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <div className="cp-strip" style={{ background: hex, color: text, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 4, padding: 12 }}>
              <span style={{ fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: 12, fontWeight: 500 }}>{hex.toUpperCase()}</span>
              <button
                type="button"
                onClick={() => copy(hexKey, hex.toUpperCase())}
                aria-label={copied === hexKey ? `${hex.toUpperCase()} copiado` : `Copiar ${hex.toUpperCase()}`}
                title="Copiar HEX"
                style={{ width: 32, height: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: "inherit", cursor: "pointer" }}
              >
                {copied === hexKey ? <Check size={16} weight="bold" /> : <Copy size={16} />}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 6px 0" }}>
              {VALUE_ROWS.map(({ format, label }) => {
                const key = `${i}-${format}`;
                return (
                  <button
                    key={format} type="button" onClick={() => copy(key, cssColor(hex, format))}
                    aria-label={`Copiar ${label} ${formatColor(hex, format)}`} title={`Copiar ${cssColor(hex, format)}`}
                    style={{ textAlign: "left", padding: "4px 6px", background: "none", border: "none", borderRadius: 6, cursor: "pointer", color: "var(--text)" }}
                    className="cp-value"
                  >
                    <span style={{ display: "block", fontSize: 9, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                      {copied === key ? "COPIADO" : label}
                    </span>
                    <span style={{ display: "block", fontFamily: "var(--font-kode), ui-monospace, monospace", fontSize: 11, overflowWrap: "anywhere" }}>
                      {formatColor(hex, format)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
