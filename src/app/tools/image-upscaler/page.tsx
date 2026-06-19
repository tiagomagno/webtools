"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type Scale = 2 | 4 | 8;

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

export default function ImageUpscalerPage() {
  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [scale, setScale] = useState<Scale>(2);
  const [result, setResult] = useState<{ url: string; width: number; height: number; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
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
    if (file) loadImage(file);
  };

  const upscale = () => {
    if (!original) return;
    setProcessing(true);

    setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        const w = img.width * scale;
        const h = img.height * scale;

        // Step-up upscaling: double iteratively for better quality than single jump
        const steps = Math.log2(scale);
        let currentCanvas = document.createElement("canvas");
        currentCanvas.width = img.width;
        currentCanvas.height = img.height;
        const initCtx = currentCanvas.getContext("2d")!;
        initCtx.drawImage(img, 0, 0);

        for (let i = 0; i < steps; i++) {
          const next = document.createElement("canvas");
          next.width = currentCanvas.width * 2;
          next.height = currentCanvas.height * 2;
          const ctx = next.getContext("2d")!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(currentCanvas, 0, 0, next.width, next.height);
          currentCanvas = next;
        }

        const url = currentCanvas.toDataURL("image/png");
        const byteStr = atob(url.split(",")[1]);
        setResult({ url, width: w, height: h, size: byteStr.length });
        setProcessing(false);
      };
      img.src = original.src;
    }, 50);
  };

  const download = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    const base = original.name.replace(/\.[^.]+$/, "");
    a.href = result.url;
    a.download = `${base}@${scale}x.png`;
    a.click();
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>
          ← Ferramentas
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🔍 Aumentar Resolução
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Aumenta a resolução por interpolação bicúbica em etapas (step-up), preservando bordas. 100% no browser, sem upload.
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
        <div style={{ fontSize: 36, marginBottom: 12 }}>🖼️</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
          {original ? original.name : "Arraste uma imagem ou clique para selecionar"}
        </div>
        {original ? (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {original.width}×{original.height}px · {fmtSize(original.size)}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>PNG, JPG, WebP</div>
        )}
      </div>

      {original && (
        <>
          {/* Previews */}
          <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                ORIGINAL · {original.width}×{original.height}px · {fmtSize(original.size)}
              </div>
              <div style={{ padding: 16, display: "flex", justifyContent: "center", background: "repeating-conic-gradient(#ffffff10 0% 25%, transparent 0% 50%) 0 0 / 16px 16px" }}>
                <img src={original.src} alt="original" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 6 }} />
              </div>
            </div>
            {result && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                  {scale}× · {result.width}×{result.height}px · {fmtSize(result.size)}
                </div>
                <div style={{ padding: 16, display: "flex", justifyContent: "center", background: "repeating-conic-gradient(#ffffff10 0% 25%, transparent 0% 50%) 0 0 / 16px 16px" }}>
                  <img src={result.url} alt="upscaled" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 6 }} />
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>ESCALA</div>
              <div style={{ display: "flex", gap: 6 }}>
                {([2, 4, 8] as Scale[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setScale(s); setResult(null); }}
                    style={{
                      padding: "7px 18px",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: scale === s ? "var(--accent)" : "var(--border)",
                      background: scale === s ? "var(--accent)" : "var(--surface-2)",
                      color: scale === s ? "#fff" : "var(--text-muted)",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {s}×
                  </button>
                ))}
              </div>
              {original && (
                <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 8 }}>
                  {original.width}×{original.height} → {original.width * scale}×{original.height * scale}px
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
              <button
                onClick={upscale}
                disabled={processing}
                style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: processing ? "not-allowed" : "pointer", opacity: processing ? 0.7 : 1 }}
              >
                {processing ? "Processando..." : `Aumentar ${scale}×`}
              </button>
              {result && (
                <button
                  onClick={download}
                  style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}
                >
                  ↓ Download PNG
                </button>
              )}
            </div>
          </div>

          <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 12 }}>
            Usa interpolação bicúbica em etapas (step-up doubling). Ideal para pixel art, ícones e imagens com bordas definidas.
          </p>
        </>
      )}
    </div>
  );
}
