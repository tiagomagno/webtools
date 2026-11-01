"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  loadImageFile,
  encodeImage,
  downloadUrl,
  fmtBytes,
  stripExt,
  TYPE_EXT,
  type LoadedImage,
  type ImageType,
} from "../../lib/image-tools";

const OUT_TYPES: ImageType[] = ["image/png", "image/jpeg", "image/webp"];
const TYPE_LABEL: Record<ImageType, string> = { "image/png": "PNG", "image/jpeg": "JPG", "image/webp": "WebP" };

export default function ImageResizer() {
  const [original, setOriginal] = useState<LoadedImage | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [type, setType] = useState<ImageType>("image/png");
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState<{ url: string; size: number; width: number; height: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ratio = useRef(1);

  const load = useCallback(async (file: File) => {
    setError("");
    try {
      const img = await loadImageFile(file);
      setOriginal(img);
      ratio.current = img.width / img.height;
      setWidth(img.width);
      setHeight(img.height);
      setResult(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar a imagem.");
    }
  }, []);

  const onWidth = (v: number) => {
    setWidth(v);
    if (lock && v > 0) setHeight(Math.round(v / ratio.current));
    setResult(null);
  };
  const onHeight = (v: number) => {
    setHeight(v);
    if (lock && v > 0) setWidth(Math.round(v * ratio.current));
    setResult(null);
  };

  const setScale = (pct: number) => {
    if (!original) return;
    setWidth(Math.round(original.width * pct));
    setHeight(Math.round(original.height * pct));
    setResult(null);
  };

  const resize = async () => {
    if (!original || width < 1 || height < 1) return;
    setBusy(true);
    setError("");
    try {
      const enc = await encodeImage({ src: original.src, type, quality: quality / 100, width, height });
      setResult({ url: enc.url, size: enc.size, width: enc.width, height: enc.height });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao redimensionar.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result || !original) return;
    downloadUrl(result.url, `${stripExt(original.name)}-${result.width}x${result.height}.${TYPE_EXT[type]}`);
  };

  // Revoga o objeto URL anterior ao trocar de resultado.
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  const inputStyle: React.CSSProperties = { width: 100, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" };
  const hasQuality = type !== "image/png";

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
        <div style={{ fontSize: 34, marginBottom: 10 }}>📐</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
          {original ? original.name : "Arraste uma imagem ou clique para selecionar"}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {original ? `Original: ${original.width}×${original.height}px · ${fmtBytes(original.size)}` : "JPG, PNG, WebP"}
        </div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {original && (
        <>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gap: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>LARGURA (px)</div>
                <input type="number" min={1} value={width} onChange={(e) => onWidth(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>ALTURA (px)</div>
                <input type="number" min={1} value={height} onChange={(e) => onHeight(Number(e.target.value))} style={inputStyle} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer", paddingBottom: 8 }}>
                <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} />
                Manter proporção
              </label>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[0.25, 0.5, 0.75].map((p) => (
                <button key={p} onClick={() => setScale(p)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  {p * 100}%
                </button>
              ))}
              <button onClick={() => setScale(1)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                100%
              </button>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>FORMATO</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {OUT_TYPES.map((t) => (
                    <button key={t} onClick={() => { setType(t); setResult(null); }} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid", borderColor: type === t ? "var(--accent)" : "var(--border)", background: type === t ? "var(--accent)" : "var(--surface-2)", color: type === t ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      {TYPE_LABEL[t]}
                    </button>
                  ))}
                </div>
              </div>
              {hasQuality && (
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>QUALIDADE — {quality}%</div>
                  <input type="range" min={10} max={100} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }} style={{ width: "100%" }} />
                </div>
              )}
              <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
                <button onClick={resize} disabled={busy} style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.7 : 1 }}>
                  {busy ? "Processando..." : "Redimensionar"}
                </button>
                {result && (
                  <button onClick={download} style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                    ↓ Baixar
                  </button>
                )}
              </div>
            </div>
          </div>

          {result && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                RESULTADO · {result.width}×{result.height}px · {fmtBytes(result.size)}
              </div>
              <div style={{ padding: 16, display: "flex", justifyContent: "center", background: "repeating-conic-gradient(#ffffff10 0% 25%, transparent 0% 50%) 0 0 / 16px 16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.url} alt="" style={{ maxWidth: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 6 }} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
