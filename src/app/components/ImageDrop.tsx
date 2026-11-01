"use client";

import { useRef, useState } from "react";
import { UploadSimple } from "@phosphor-icons/react";

interface ImageDropProps {
  onFile: (file: File) => void;
}

/** Campo compacto para enviar uma imagem (arrastar ou clicar). Aceita HEIC do iPhone. */
export default function ImageDrop({ onFile }: ImageDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const isImage = (f: File) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f && isImage(f)) onFile(f); }}
      style={{
        border: `2px dashed ${over ? "var(--accent-strong)" : "var(--border)"}`, borderRadius: 8, padding: "28px 16px", textAlign: "center",
        cursor: "pointer", background: over ? "var(--surface-2)" : "var(--surface)", color: "var(--text-muted)", display: "flex",
        flexDirection: "column", alignItems: "center", gap: 8, fontSize: 13,
      }}
    >
      <UploadSimple size={26} />
      <span>Arraste uma imagem ou clique para selecionar</span>
      <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>JPG, PNG, WebP, GIF ou HEIC</span>
      <input ref={inputRef} type="file" accept="image/*,.heic,.heif" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
    </div>
  );
}
