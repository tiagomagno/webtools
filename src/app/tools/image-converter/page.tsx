"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type Format = "image/png" | "image/jpeg" | "image/webp" | "image/bmp";

const FORMAT_LABELS: Record<Format, string> = {
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/webp": "WebP",
  "image/bmp": "BMP",
};

const FORMAT_EXT: Record<Format, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/bmp": "bmp",
};

interface ImageInfo {
  name: string;
  width: number;
  height: number;
  size: number;
  src: string;
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageConverterPage() {
  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [format, setFormat] = useState<Format>("image/png");
  const [quality, setQuality] = useState(92);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOriginal({ name: file.name, width: img.width, height: img.height, size: file.size, src });
        setResult(null);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) loadImage(file);
  };

  const convert = () => {
    if (!original) return;
    setConverting(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      if (format === "image/jpeg" || format === "image/bmp") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const q = ["image/jpeg", "image/webp"].includes(format) ? quality / 100 : undefined;
      const url = canvas.toDataURL(format, q);
      const byteStr = atob(url.split(",")[1]);
      setResult({ url, size: byteStr.length });
      setConverting(false);
    };
    img.src = original.src;
  };

  const download = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    const base = original.name.replace(/\.[^.]+$/, "");
    a.href = result.url;
    a.download = `${base}.${FORMAT_EXT[format]}`;
    a.click();
  };

  const hasQuality = format === "image/jpeg" || format === "image/webp";

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>
          ← Ferramentas
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🖼️ Conversor de Imagens
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Converta entre PNG, JPG, WebP e BMP diretamente no browser. Sem upload para servidores.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 16,
          padding: "48px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "var(--accent)0a" : "var(--surface)",
          marginBottom: 24,
          transition: "all 0.15s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f); }}
        />
        <div style={{ fontSize: 36, marginBottom: 12 }}>📁</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
          {original ? original.name : "Arraste uma imagem ou clique para selecionar"}
        </div>
        {original ? (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {original.width}×{original.height}px · {fmtSize(original.size)}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>PNG, JPG, WebP, BMP, GIF</div>
        )}
      </div>

      {original && (
        <>
          {/* Preview original */}
          <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                ORIGINAL · {fmtSize(original.size)}
              </div>
              <div style={{ padding: 16, display: "flex", justifyContent: "center", background: "repeating-conic-gradient(#ffffff10 0% 25%, transparent 0% 50%) 0 0 / 16px 16px" }}>
                <img src={original.src} alt="original" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 6 }} />
              </div>
            </div>
            {result && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                  CONVERTIDA · {FORMAT_LABELS[format]} · {fmtSize(result.size)}
                  <span style={{ marginLeft: 8, color: result.size < original.size ? "#10b981" : "#f59e0b" }}>
                    ({result.size < original.size ? "-" : "+"}{Math.abs(Math.round((1 - result.size / original.size) * 100))}%)
                  </span>
                </div>
                <div style={{ padding: 16, display: "flex", justifyContent: "center", background: "repeating-conic-gradient(#ffffff10 0% 25%, transparent 0% 50%) 0 0 / 16px 16px" }}>
                  <img src={result.url} alt="result" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 6 }} />
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>FORMATO DE SAÍDA</div>
              <div style={{ display: "flex", gap: 6 }}>
                {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFormat(f); setResult(null); }}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: format === f ? "var(--accent)" : "var(--border)",
                      background: format === f ? "var(--accent)" : "var(--surface-2)",
                      color: format === f ? "#fff" : "var(--text-muted)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {FORMAT_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
            {hasQuality && (
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>
                  QUALIDADE — {quality}%
                </div>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }} style={{ width: "100%" }} />
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
              <button
                onClick={convert}
                disabled={converting}
                style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: converting ? "not-allowed" : "pointer", opacity: converting ? 0.7 : 1 }}
              >
                {converting ? "Convertendo..." : "Converter"}
              </button>
              {result && (
                <button
                  onClick={download}
                  style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}
                >
                  ↓ Download
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
