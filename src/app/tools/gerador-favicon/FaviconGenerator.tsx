"use client";

import { useState, useRef, useCallback } from "react";
import { loadImageFile, encodeImage, downloadUrl, type LoadedImage } from "../../lib/image-tools";

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512];

const SNIPPET = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />`;

interface Generated { size: number; url: string }

export default function FaviconGenerator() {
  const [original, setOriginal] = useState<LoadedImage | null>(null);
  const [icons, setIcons] = useState<Generated[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const generate = useCallback(async (img: LoadedImage) => {
    setBusy(true);
    setError("");
    // Recorte quadrado central da imagem original.
    const side = Math.min(img.width, img.height);
    const cx = (img.width - side) / 2;
    const cy = (img.height - side) / 2;
    try {
      const out: Generated[] = [];
      for (const size of SIZES) {
        const enc = await encodeImage({
          src: img.src,
          type: "image/png",
          width: size,
          height: size,
          crop: { x: cx, y: cy, w: side, h: side },
        });
        out.push({ size, url: enc.url });
      }
      setIcons(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao gerar os favicons.");
    } finally {
      setBusy(false);
    }
  }, []);

  const load = useCallback(async (file: File) => {
    setError("");
    setIcons([]);
    try {
      const img = await loadImageFile(file);
      setOriginal(img);
      await generate(img);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar a imagem.");
    }
  }, [generate]);

  const nameFor = (size: number) =>
    size === 180 ? "apple-touch-icon.png" : size >= 192 ? `android-chrome-${size}x${size}.png` : `favicon-${size}x${size}.png`;

  const downloadAll = () => icons.forEach((i) => downloadUrl(i.url, nameFor(i.size)));

  const copySnippet = () => {
    navigator.clipboard.writeText(SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) load(f); }}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface)", marginBottom: 20, transition: "all .15s" }}
      >
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f); }} />
        <div style={{ fontSize: 34, marginBottom: 10 }}>⭐</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
          {original ? original.name : "Arraste uma imagem ou clique para selecionar"}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {original ? `${original.width}×${original.height}px — recortada no centro` : "Use uma imagem quadrada (PNG recomendado)"}
        </div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}
      {busy && <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>Gerando tamanhos…</div>}

      {icons.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Tamanhos gerados</div>
            <button onClick={downloadAll} style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>↓ Baixar todos</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12, marginBottom: 28 }}>
            {icons.map((i) => (
              <div key={i.size} onClick={() => downloadUrl(i.url, nameFor(i.size))} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, textAlign: "center", cursor: "pointer" }}>
                <div style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, background: "repeating-conic-gradient(#ffffff10 0% 25%, transparent 0% 50%) 0 0 / 12px 12px", borderRadius: 6 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.url} alt={`${i.size}px`} width={Math.min(i.size, 64)} height={Math.min(i.size, 64)} style={{ imageRendering: i.size <= 32 ? "pixelated" : "auto" }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{i.size}×{i.size}</div>
                <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>baixar</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Tags HTML para o &lt;head&gt;</div>
              <button onClick={copySnippet} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {copied ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
            <pre style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, fontSize: 12.5, lineHeight: 1.6, overflowX: "auto", color: "var(--text)", whiteSpace: "pre-wrap" }}>{SNIPPET}</pre>
          </div>
        </>
      )}
    </div>
  );
}
