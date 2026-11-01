"use client";

import { useCallback, useState } from "react";
import { Check, Copy, DownloadSimple } from "@phosphor-icons/react";
import ImageDrop from "../../components/ImageDrop";
import { downloadUrl, encodeImage, loadImageFile, type LoadedImage } from "../../lib/image-tools";

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512];

const SNIPPET = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />`;

const mono = "var(--font-kode), ui-monospace, monospace";
const checker = "repeating-conic-gradient(#d4d4d8 0% 25%, #fff 0% 50%)";
const title: React.CSSProperties = { fontFamily: mono, fontSize: 14, fontWeight: 600, color: "var(--text)", margin: 0 };
const button: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer",
  borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)",
};

interface Generated { size: number; url: string }

const nameFor = (size: number) =>
  size === 180 ? "apple-touch-icon.png" : size >= 192 ? `android-chrome-${size}x${size}.png` : `favicon-${size}x${size}.png`;

export default function FaviconGenerator() {
  const [original, setOriginal] = useState<LoadedImage | null>(null);
  const [icons, setIcons] = useState<Generated[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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
        const enc = await encodeImage({ src: img.src, type: "image/png", width: size, height: size, crop: { x: cx, y: cy, w: side, h: side } });
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

  const copySnippet = () => {
    void navigator.clipboard.writeText(SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="fv-root">
      <div className="fv-grid">
        {/* Imagem de origem */}
        <div className="cut-box" style={{ padding: 16, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={title}>Imagem</h2>
          {!original ? (
            <ImageDrop onFile={load} />
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)", fontWeight: 600 }}>{original.name}</span>
                <span style={{ fontFamily: mono, whiteSpace: "nowrap" }}>{original.width}×{original.height}px</span>
                <label style={{ ...button, minHeight: 32, padding: "6px 10px" }}>
                  Trocar
                  <input type="file" accept="image/*,.heic,.heif" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void load(f); e.target.value = ""; }} />
                </label>
              </div>
              <div style={{ display: "flex", justifyContent: "center", padding: 12, border: "1px solid var(--border)", borderRadius: 8, background: checker, backgroundSize: "16px 16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={original.src} alt="Imagem enviada" style={{ maxWidth: "100%", maxHeight: 260, objectFit: "cover", aspectRatio: "1 / 1", width: 260, display: "block" }} />
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Os favicons usam o recorte quadrado central da imagem.</p>
            </>
          )}
          {error && <p role="alert" style={{ margin: 0, fontSize: 12, color: "#ef4444" }}>{error}</p>}
        </div>

        {/* Tamanhos gerados */}
        <div className="cut-box" style={{ padding: 16, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <h2 style={title}>Tamanhos gerados</h2>
            {icons.length > 0 && (
              <button type="button" onClick={() => icons.forEach((i) => downloadUrl(i.url, nameFor(i.size)))} style={{ ...button, background: "var(--accent-strong)", borderColor: "var(--accent-strong)", color: "#fff" }}>
                <DownloadSimple size={14} /> Baixar todos
              </button>
            )}
          </div>
          {busy && <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Gerando tamanhos…</p>}
          {icons.length === 0 && !busy && <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>Envie uma imagem (quadrada, de preferência) para gerar os {SIZES.length} tamanhos de favicon.</p>}
          {icons.length > 0 && (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))", gap: 10 }}>
              {icons.map((i) => (
                <li key={i.size}>
                  <button type="button" onClick={() => downloadUrl(i.url, nameFor(i.size))} aria-label={`Baixar ${i.size} por ${i.size}`}
                    style={{ width: "100%", padding: 10, textAlign: "center", cursor: "pointer", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}>
                    <span style={{ height: 68, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, background: checker, backgroundSize: "12px 12px", borderRadius: 6 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={i.url} alt="" width={Math.min(i.size, 64)} height={Math.min(i.size, 64)} style={{ imageRendering: i.size <= 32 ? "pixelated" : "auto" }} />
                    </span>
                    <span style={{ display: "block", fontSize: 12, fontWeight: 600, fontFamily: mono }}>{i.size}×{i.size}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {icons.length > 0 && (
        <div className="cut-box" style={{ marginTop: 16, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
            <h2 style={title}>Tags HTML para o &lt;head&gt;</h2>
            <button type="button" onClick={copySnippet} style={{ ...button, background: copied ? "#16a34a" : "var(--accent-strong)", borderColor: copied ? "#16a34a" : "var(--accent-strong)", color: "#fff" }}>
              {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
          <pre style={{ margin: 0, padding: 16, fontSize: 12, lineHeight: 1.7, fontFamily: mono, color: "var(--text)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, overflowX: "auto" }}>{SNIPPET}</pre>
        </div>
      )}

      <style>{`
        .fv-root { container-type: inline-size; }
        .fv-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; align-items: start; }
        @container (min-width: 760px) { .fv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      `}</style>
    </div>
  );
}
