"use client";

import { useEffect, useState } from "react";
import { Check, Copy, DownloadSimple } from "@phosphor-icons/react";
import ImageDrop from "../../components/ImageDrop";
import { downloadUrl, encodeImage, fmtBytes, sizeChangePercent, stripExt, TYPE_EXT, TYPE_LABEL, type ImageType, type LoadedImage } from "../../lib/image-tools";

export type ExportFormat = ImageType | "base64";

const IMAGE_TYPES = Object.keys(TYPE_LABEL) as ImageType[];
const mono = "var(--font-kode), ui-monospace, monospace";
const label: React.CSSProperties = { fontFamily: mono, fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 10 };
const chip = (active: boolean): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8,
  border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`, background: active ? "var(--accent-strong)" : "var(--surface)", color: active ? "#fff" : "var(--text)",
});
const primary: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", minHeight: 40, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", borderRadius: 8, background: "var(--accent-strong)", color: "#fff" };

interface Preview { url: string; size: number; width: number; height: number; dataUrl?: string }

interface ExportPanelProps {
  image: LoadedImage | null;
  initialFormat: ExportFormat;
  /** Quando ainda não há imagem, o painel pede uma. */
  onFile: (file: File) => void;
}

/** Exportar: escolhe o formato (PNG, JPG, WebP ou Base64), vê o tamanho do arquivo e baixa ou copia. */
export default function ExportPanel({ image, initialFormat, onFile }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>(initialFormat);
  const [b64Type, setB64Type] = useState<ImageType>("image/png");
  const [quality, setQuality] = useState(90);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const type: ImageType = format === "base64" ? b64Type : format;
  const lossy = type !== "image/png";

  // Gera o arquivo toda vez que a imagem ou as opções mudam, para mostrar o tamanho real.
  useEffect(() => {
    if (!image) return;
    let cancelled = false;
    let created: string | null = null;
    encodeImage({ src: image.src, type, quality: quality / 100 })
      .then(async (enc) => {
        created = enc.url;
        let dataUrl: string | undefined;
        if (format === "base64") {
          dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Falha ao gerar o Base64."));
            reader.readAsDataURL(enc.blob);
          });
        }
        if (cancelled) { URL.revokeObjectURL(enc.url); return; }
        setError("");
        setPreview({ url: enc.url, size: enc.size, width: enc.width, height: enc.height, dataUrl });
      })
      .catch((e: unknown) => { if (!cancelled) setError(e instanceof Error ? e.message : "Não foi possível exportar."); });
    return () => { cancelled = true; if (created) URL.revokeObjectURL(created); };
  }, [image, type, quality, format]);

  if (!image) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Envie uma imagem para exportar.</p>
        <ImageDrop onFile={onFile} />
      </div>
    );
  }

  const change = preview ? sizeChangePercent(image.size, preview.size) : null;
  const copy = () => {
    if (!preview?.dataUrl) return;
    void navigator.clipboard.writeText(preview.dataUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={label}>Formato</div>
        <div role="tablist" aria-label="Formato de exportação" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {IMAGE_TYPES.map((t) => (
            <button key={t} role="tab" aria-selected={format === t} type="button" onClick={() => setFormat(t)} style={chip(format === t)}>{TYPE_LABEL[t]}</button>
          ))}
          <button role="tab" aria-selected={format === "base64"} type="button" onClick={() => setFormat("base64")} style={chip(format === "base64")}>Base64</button>
        </div>
      </div>

      {format === "base64" && (
        <div>
          <div style={label}>Codificar como</div>
          <div role="group" aria-label="Formato dentro do Base64" style={{ display: "flex", gap: 6 }}>
            {IMAGE_TYPES.map((t) => (
              <button key={t} type="button" aria-pressed={b64Type === t} onClick={() => setB64Type(t)} style={{ ...chip(b64Type === t), minHeight: 32, padding: "6px 12px" }}>{TYPE_LABEL[t]}</button>
            ))}
          </div>
        </div>
      )}

      {lossy && (
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
          Qualidade
          <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ flex: 1, accentColor: "var(--accent-strong)" }} />
          <span style={{ width: 38, textAlign: "right", fontFamily: mono, color: "var(--text)" }}>{quality}%</span>
        </label>
      )}

      {error && <p role="alert" style={{ margin: 0, fontSize: 12, color: "#ef4444" }}>{error}</p>}

      {preview && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 12, fontFamily: mono, color: "var(--text-muted)" }}>
            <span>
              {preview.width}×{preview.height}px · <span style={{ color: "var(--text)" }}>{format === "base64" && preview.dataUrl ? `${fmtBytes(preview.dataUrl.length)} em texto` : fmtBytes(preview.size)}</span>
              {format !== "base64" && change !== null && change !== 0 && <span style={{ color: change < 0 ? "#16a34a" : "#d97706", marginLeft: 8 }}>{change > 0 ? "+" : ""}{change}%</span>}
            </span>
            {format === "base64" ? (
              <button type="button" onClick={copy} style={primary}>{copied ? <Check size={14} weight="bold" /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar Base64"}</button>
            ) : (
              <button type="button" onClick={() => downloadUrl(preview.url, `${stripExt(image.name)}.${TYPE_EXT[type]}`)} style={primary}><DownloadSimple size={14} /> Baixar {TYPE_LABEL[type]}</button>
            )}
          </div>
          {format === "base64" && preview.dataUrl && (
            <textarea readOnly value={preview.dataUrl} rows={5} aria-label="Base64 gerado"
              style={{ width: "100%", padding: 10, fontSize: 11, fontFamily: mono, background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, resize: "vertical", wordBreak: "break-all" }} />
          )}
        </div>
      )}
    </div>
  );
}
