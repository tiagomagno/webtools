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
} from "../lib/image-tools";

interface Props {
  /** Formato de saída fixo. */
  to: ImageType;
  /** Filtro do seletor de arquivos. */
  accept?: string;
  /** Mostra o controle de qualidade (JPG/WebP). */
  showQuality?: boolean;
  hint?: string;
}

export default function FormatConverter({ to, accept = "image/*", showQuality = false, hint }: Props) {
  const [original, setOriginal] = useState<LoadedImage | null>(null);
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (file: File) => {
    setError("");
    try {
      setOriginal(await loadImageFile(file));
      setResult(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar a imagem.");
    }
  }, []);

  const convert = async () => {
    if (!original) return;
    setBusy(true);
    setError("");
    try {
      const enc = await encodeImage({ src: original.src, type: to, quality: showQuality ? quality / 100 : undefined });
      setResult({ url: enc.url, size: enc.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao converter.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result || !original) return;
    downloadUrl(result.url, `${stripExt(original.name)}.${TYPE_EXT[to]}`);
  };

  const delta = result && original ? Math.round((1 - result.size / original.size) * 100) : 0;

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) load(f); }}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface)", marginBottom: 20, transition: "all .15s" }}
      >
        <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f); }} />
        <div style={{ fontSize: 34, marginBottom: 10 }}>📁</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
          {original ? original.name : "Arraste uma imagem ou clique para selecionar"}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {original ? `${original.width}×${original.height}px · ${fmtBytes(original.size)}` : hint || `Saída: ${TYPE_LABEL[to]}`}
        </div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {original && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
          {showQuality && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>QUALIDADE — {quality}%</div>
              <input type="range" min={10} max={100} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }} style={{ width: "100%" }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginLeft: "auto", alignItems: "center" }}>
            {result && (
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {TYPE_LABEL[to]} · {fmtBytes(result.size)}{" "}
                <span style={{ color: delta > 0 ? "#10b981" : "#f59e0b" }}>({delta > 0 ? "−" : "+"}{Math.abs(delta)}%)</span>
              </span>
            )}
            <button onClick={convert} disabled={busy} style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.7 : 1 }}>
              {busy ? "Convertendo..." : `Converter para ${TYPE_LABEL[to]}`}
            </button>
            {result && (
              <button onClick={download} style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                ↓ Baixar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
