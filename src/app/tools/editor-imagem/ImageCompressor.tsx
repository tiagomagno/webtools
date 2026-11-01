"use client";

import { useState, useRef, useCallback } from "react";
import {
  loadImageFile,
  encodeImage,
  downloadUrl,
  fmtBytes,
  stripExt,
  TYPE_EXT,
  TYPE_LABEL,
  type LoadedImage,
  type ImageType,
} from "../../lib/image-tools";

const COMPRESS_TYPES: ImageType[] = ["image/jpeg", "image/webp"];

export default function ImageCompressor() {
  const [original, setOriginal] = useState<LoadedImage | null>(null);
  const [type, setType] = useState<ImageType>("image/jpeg");
  const [quality, setQuality] = useState(70);
  const [maxWidth, setMaxWidth] = useState("");
  const [result, setResult] = useState<{ url: string; size: number; width: number; height: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (file: File) => {
    setError("");
    try {
      const img = await loadImageFile(file);
      setOriginal(img);
      setResult(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar a imagem.");
    }
  }, []);

  const compress = async () => {
    if (!original) return;
    setBusy(true);
    setError("");
    try {
      let width = original.width;
      let height = original.height;
      const mw = Number(maxWidth);
      if (mw && mw > 0 && original.width > mw) {
        width = mw;
        height = Math.round((original.height / original.width) * mw);
      }
      const enc = await encodeImage({ src: original.src, type, quality: quality / 100, width, height });
      setResult({ url: enc.url, size: enc.size, width: enc.width, height: enc.height });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao comprimir.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result || !original) return;
    downloadUrl(result.url, `${stripExt(original.name)}-comprimido.${TYPE_EXT[type]}`);
  };

  const saved = result && original ? Math.round((1 - result.size / original.size) * 100) : 0;

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
        <div style={{ fontSize: 34, marginBottom: 10 }}>🗜️</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
          {original ? original.name : "Arraste uma imagem ou clique para selecionar"}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {original ? `${original.width}×${original.height}px · ${fmtBytes(original.size)}` : "JPG, PNG, WebP"}
        </div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {original && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 20 }}>
            <Panel label={`ORIGINAL · ${fmtBytes(original.size)}`} src={original.src} />
            {result && (
              <Panel
                label={
                  <>
                    {TYPE_LABEL[type]} · {fmtBytes(result.size)}{" "}
                    <span style={{ color: saved > 0 ? "#10b981" : "#f59e0b" }}>
                      ({saved > 0 ? "−" : "+"}{Math.abs(saved)}%)
                    </span>
                  </>
                }
                src={result.url}
              />
            )}
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>FORMATO</div>
              <div style={{ display: "flex", gap: 6 }}>
                {COMPRESS_TYPES.map((t) => (
                  <button key={t} onClick={() => { setType(t); setResult(null); }} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid", borderColor: type === t ? "var(--accent)" : "var(--border)", background: type === t ? "var(--accent)" : "var(--surface-2)", color: type === t ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {TYPE_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>QUALIDADE — {quality}%</div>
              <input type="range" min={10} max={100} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }} style={{ width: "100%" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>LARGURA MÁX. (px)</div>
              <input type="number" min={0} placeholder="original" value={maxWidth} onChange={(e) => { setMaxWidth(e.target.value); setResult(null); }} style={{ width: 110, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" }} />
            </div>
            <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
              <button onClick={compress} disabled={busy} style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.7 : 1 }}>
                {busy ? "Comprimindo..." : "Comprimir"}
              </button>
              {result && (
                <button onClick={download} style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                  ↓ Baixar
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Panel({ label, src }: { label: React.ReactNode; src: string }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{label}</div>
      <div style={{ padding: 16, display: "flex", justifyContent: "center", background: "repeating-conic-gradient(#ffffff10 0% 25%, transparent 0% 50%) 0 0 / 16px 16px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" style={{ maxWidth: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 6 }} />
      </div>
    </div>
  );
}
