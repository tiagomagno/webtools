"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon } from "@phosphor-icons/react";
import { extractPalette } from "../../lib/palette";

interface ImageSourceProps {
  /** Recebe as cores extraídas da imagem (até 5). */
  onExtract: (colors: string[]) => void;
}

/** Modo Imagem: envia uma imagem e extrai as 5 cores dominantes. */
export default function ImageSource({ onExtract }: ImageSourceProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  function handleFile(file: File) {
    setError("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const size = 100;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) { setError("Não foi possível ler a imagem."); URL.revokeObjectURL(url); return; }
      ctx.drawImage(img, 0, 0, size, size);
      const colors = extractPalette(ctx.getImageData(0, 0, size, size).data, 5);
      setPreview(url);
      if (colors.length > 0) onExtract(colors);
      else setError("Não encontrei cores nessa imagem.");
    };
    img.onerror = () => { setError("Esse arquivo não parece ser uma imagem válida."); URL.revokeObjectURL(url); };
    img.src = url;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleFile(f); }}
        style={{ border: "2px dashed var(--border)", padding: "28px 16px", textAlign: "center", cursor: "pointer", background: "var(--surface-2)", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontSize: 13 }}
      >
        <ImageIcon size={28} />
        Arraste uma imagem ou clique para selecionar
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
      {error && <p role="alert" style={{ margin: 0, fontSize: 12, color: "#ef4444" }}>{error}</p>}
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Imagem usada para extrair as cores" style={{ width: "100%", maxHeight: 160, objectFit: "cover", border: "1px solid var(--border)" }} />
      )}
      <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
        A imagem fica no seu navegador. Extraímos as 5 cores mais presentes e distintas.
      </p>
    </div>
  );
}
