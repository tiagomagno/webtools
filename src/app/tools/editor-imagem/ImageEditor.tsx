"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUUpLeft, ArrowCounterClockwise, Binary, Crop, DownloadSimple, Lock, LockOpen } from "@phosphor-icons/react";
import Breadcrumbs from "../../components/Breadcrumbs";
import ImageDrop from "../../components/ImageDrop";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import {
  encodeImage, fitsCanvas, fmtBytes, loadImageDataUrl, loadImageFile, scaleCrop, upscaleImage, type CropRect, type EncodedImage, type LoadedImage,
} from "../../lib/image-tools";
import CropPreview from "./CropPreview";
import ExportPanel, { type ExportFormat } from "./ExportPanel";

const ASPECTS: { label: string; value: number | null }[] = [
  { label: "Livre", value: null }, { label: "1:1", value: 1 }, { label: "16:9", value: 16 / 9 }, { label: "4:3", value: 4 / 3 }, { label: "3:2", value: 3 / 2 },
];
const SCALES = [2, 4, 8] as const;
const PERCENTS = [0.25, 0.5, 0.75, 2];
const FORMAT_PARAM: Record<string, ExportFormat> = { png: "image/png", jpg: "image/jpeg", webp: "image/webp", base64: "base64" };

const mono = "var(--font-kode), ui-monospace, monospace";
const title: React.CSSProperties = { fontFamily: mono, fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 12px" };
const chip = (active: boolean): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8,
  border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`, background: active ? "var(--accent-strong)" : "var(--surface)", color: active ? "#fff" : "var(--text)",
});
const small = (active: boolean): React.CSSProperties => ({ ...chip(active), minHeight: 32, padding: "6px 10px" });
const numberInput: React.CSSProperties = { width: "100%", height: 38, padding: "0 10px", fontSize: 13, fontFamily: mono, background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8 };
const primary: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 18px", minHeight: 40, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", borderRadius: 8, background: "var(--accent-strong)", color: "#fff" };
const apply: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", minHeight: 36, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", borderRadius: 8, background: "var(--accent-strong)", color: "#fff", whiteSpace: "nowrap" };
const linkButton: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: 0, fontSize: 12, fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: "var(--accent-text)" };
const fieldLabel: React.CSSProperties = { fontSize: 12, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 6 };
const checker = "repeating-conic-gradient(#d4d4d8 0% 25%, #fff 0% 50%)";

type Panel = "exportar" | "base64";

/** Caixa de uma ferramenta de edição. */
function Box({ heading, action, children }: { heading: string; action?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="cut-box" style={{ padding: 16, minWidth: 0 }} aria-label={heading}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, margin: children ? "0 0 12px" : 0 }}>
        <h2 style={{ ...title, margin: 0 }}>{heading}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Redimensionar: largura e altura de um lado, atalhos em porcentagem do outro. */
function ResizeBox({ image, disabled, onApply }: { image: LoadedImage | null; disabled: boolean; onApply: (w: number, h: number) => void }) {
  const [width, setWidth] = useState(image?.width ?? 0);
  const [height, setHeight] = useState(image?.height ?? 0);
  const [lock, setLock] = useState(true);
  const ratio = image ? image.width / image.height : 1;

  const setW = (v: number) => { setWidth(v); if (lock && v > 0) setHeight(Math.round(v / ratio)); };
  const setH = (v: number) => { setHeight(v); if (lock && v > 0) setWidth(Math.round(v * ratio)); };
  const percent = (p: number) => { if (image) { setWidth(Math.round(image.width * p)); setHeight(Math.round(image.height * p)); } };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 16, alignItems: "end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={fieldLabel}>Largura (px)<input type="number" min={1} value={width || ""} disabled={disabled} onChange={(e) => setW(Number(e.target.value))} style={numberInput} /></label>
          <label style={fieldLabel}>Altura (px)<input type="number" min={1} value={height || ""} disabled={disabled} onChange={(e) => setH(Number(e.target.value))} style={numberInput} /></label>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 6 }}>
            {PERCENTS.map((p) => <button key={p} type="button" disabled={disabled} onClick={() => percent(p)} style={{ ...small(false), justifyContent: "center" }}>{p * 100}%</button>)}
          </div>
          <button type="button" aria-pressed={lock} onClick={() => setLock(!lock)} style={{ ...small(false), justifyContent: "center" }} title="Manter a proporção">
            {lock ? <Lock size={14} /> : <LockOpen size={14} />} Proporção
          </button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="button" disabled={disabled} onClick={() => onApply(width, height)} style={{ ...apply, opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>Redimensionar</button>
      </div>
    </div>
  );
}

/** Aumentar: escolhe 2×, 4× ou 8× e mostra o tamanho final. */
function UpscaleBox({ image, disabled, onApply }: { image: LoadedImage | null; disabled: boolean; onApply: (scale: 2 | 4 | 8) => void }) {
  const [scale, setScale] = useState<2 | 4 | 8>(2);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <div role="group" aria-label="Escala" style={{ display: "flex", gap: 6 }}>
        {SCALES.map((s) => <button key={s} type="button" aria-pressed={scale === s} onClick={() => setScale(s)} style={small(scale === s)}>{s}×</button>)}
      </div>
      {image && <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: mono }}>{image.width * scale}×{image.height * scale}px</span>}
      <button type="button" disabled={disabled} onClick={() => onApply(scale)} style={{ ...apply, marginLeft: "auto", opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>Aumentar</button>
    </div>
  );
}

export default function ImageEditor() {
  /** Histórico de edições: o último item é a imagem de trabalho; o primeiro é o original. */
  const [history, setHistory] = useState<LoadedImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [panel, setPanel] = useState<Panel | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("image/png");
  // Cortar
  const [cropping, setCropping] = useState(false);
  const [aspect, setAspect] = useState<number | null>(null);
  const [crop, setCrop] = useState<{ sel: CropRect; displayWidth: number } | null>(null);
  // Colar Base64
  const [b64Text, setB64Text] = useState("");

  const image = history[history.length - 1] ?? null;

  // Links antigos: ?acao=exportar|colar e ?formato=png|jpg|webp|base64.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const formato = FORMAT_PARAM[params.get("formato") ?? ""];
    if (formato) setExportFormat(formato);
    const acao = params.get("acao");
    if (acao === "exportar") setPanel("exportar");
    if (acao === "colar") setPanel("base64");
  }, []);

  const dropHistory = (items: LoadedImage[]) => items.forEach((i) => { if (i.src.startsWith("blob:")) URL.revokeObjectURL(i.src); });

  const open = useCallback((img: LoadedImage) => {
    setHistory((old) => { dropHistory(old); return [img]; });
    setCropping(false);
    setCrop(null);
    setError("");
  }, []);

  const load = useCallback(async (file: File) => {
    setError("");
    try { open(await loadImageFile(file)); } catch (e) { setError(e instanceof Error ? e.message : "Erro ao carregar a imagem."); }
  }, [open]);

  /** Aplica uma edição: o resultado vira a imagem de trabalho (PNG, sem perda) e o anterior fica para desfazer. */
  const commit = (enc: EncodedImage) => {
    if (!image) return;
    setHistory((h) => [...h, { name: image.name, width: enc.width, height: enc.height, size: enc.size, src: enc.url }]);
    setCropping(false);
    setCrop(null);
  };

  const run = async (op: () => Promise<EncodedImage>) => {
    setBusy(true);
    setError("");
    try { commit(await op()); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível aplicar a edição."); } finally { setBusy(false); }
  };

  const resize = (w: number, h: number) => {
    if (!image) return;
    if (w < 1 || h < 1) return setError("Informe largura e altura maiores que zero.");
    if (!fitsCanvas(w, h)) return setError("Esse tamanho é grande demais para o navegador.");
    void run(() => encodeImage({ src: image.src, type: "image/png", width: w, height: h }));
  };

  const applyCrop = () => {
    if (!image || !crop) return setError("Selecione a área a recortar.");
    void run(() => encodeImage({ src: image.src, type: "image/png", crop: scaleCrop(crop.sel, crop.displayWidth, image.width) }));
  };

  const upscale = (scale: 2 | 4 | 8) => {
    if (!image) return;
    if (!fitsCanvas(image.width * scale, image.height * scale)) return setError("O resultado seria grande demais para o navegador. Tente uma escala menor.");
    void run(() => upscaleImage({ src: image.src, scale, type: "image/png" }));
  };

  const undo = () => setHistory((h) => { if (h.length < 2) return h; dropHistory([h[h.length - 1]]); return h.slice(0, -1); });
  const restore = () => setHistory((h) => { if (h.length < 2) return h; dropHistory(h.slice(1)); return [h[0]]; });

  const pastedSrc = (() => {
    const t = b64Text.trim();
    if (t.startsWith("data:image/")) return t;
    return /^[A-Za-z0-9+/=\s]{16,}$/.test(t) ? `data:image/png;base64,${t.replace(/\s/g, "")}` : "";
  })();

  const openPasted = async () => {
    setError("");
    try {
      open(await loadImageDataUrl(pastedSrc, "base64"));
      setB64Text("");
      setPanel(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Código inválido.");
    }
  };

  const headerActions = (
    <>
      <button type="button" onClick={() => setPanel("base64")} title="Abrir uma imagem a partir de um código Base64" aria-label="Colar Base64" style={chip(false)}>
        <Binary size={16} /> <span className="ed-action-label">Colar Base64</span>
      </button>
      <button type="button" onClick={() => setPanel("exportar")} title="Baixar em PNG, JPG ou WebP, ou gerar Base64" aria-label="Exportar" style={{ ...chip(false), background: "var(--accent-strong)", borderColor: "var(--accent-strong)", color: "#fff" }}>
        <DownloadSimple size={16} /> <span className="ed-action-label">Exportar</span>
      </button>
    </>
  );

  return (
    <div className="ed-root">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Design", href: "/categoria/design" }, { label: "Editor de Imagem" }]} />
      <PageHeader title="Editor de Imagem" actions={headerActions}>
        Redimensione, corte e aumente a imagem; depois exporte em PNG, JPG, WebP ou Base64.
      </PageHeader>

      <div className="ed-grid">
        {/* Imagem de trabalho */}
        <div className="cut-box ed-sticky" style={{ padding: 16, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {!image ? (
            <ImageDrop onFile={load} />
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12, color: "var(--text-muted)" }}>
                <span style={{ flex: 1, minWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)", fontWeight: 600 }}>{image.name}</span>
                <span style={{ fontFamily: mono, whiteSpace: "nowrap" }}>{image.width}×{image.height} · {fmtBytes(image.size)}</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button type="button" onClick={undo} disabled={history.length < 2} style={{ ...small(false), opacity: history.length < 2 ? 0.5 : 1 }}><ArrowUUpLeft size={14} /> Desfazer</button>
                <button type="button" onClick={restore} disabled={history.length < 2} style={{ ...small(false), opacity: history.length < 2 ? 0.5 : 1 }}><ArrowCounterClockwise size={14} /> Original</button>
                <label style={{ ...small(false), marginLeft: "auto" }}>
                  Trocar imagem
                  <input type="file" accept="image/*,.heic,.heif" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void load(f); e.target.value = ""; }} />
                </label>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {cropping ? (
                  <CropPreview key={image.src} image={image} aspect={aspect} onChange={(sel, displayWidth) => setCrop({ sel, displayWidth })} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.src} alt="Imagem em edição" style={{ maxWidth: "100%", maxHeight: 460, display: "block", outline: "1px solid var(--border)", background: checker, backgroundSize: "16px 16px" }} />
                )}
              </div>
            </>
          )}
          {error && <p role="alert" style={{ margin: 0, fontSize: 12, color: "#ef4444" }}>{error}</p>}
        </div>

        {/* Ferramentas, uma caixa para cada */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <Box heading="Redimensionar">
            <ResizeBox key={image?.src ?? "vazio"} image={image} disabled={!image || busy} onApply={resize} />
          </Box>

          <Box
            heading="Cortar"
            action={
              <button type="button" disabled={!image || busy} onClick={() => setCropping(!cropping)} style={{ ...linkButton, opacity: !image || busy ? 0.5 : 1, cursor: !image || busy ? "not-allowed" : "pointer" }}>
                <Crop size={14} /> {cropping ? "Cancelar" : "Selecionar área"}
              </button>
            }
          >
            {cropping && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div role="group" aria-label="Proporção do recorte" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ASPECTS.map((a) => <button key={a.label} type="button" aria-pressed={aspect === a.value} onClick={() => setAspect(a.value)} style={small(aspect === a.value)}>{a.label}</button>)}
                </div>
                {crop && image && (() => { const r = scaleCrop(crop.sel, crop.displayWidth, image.width); return <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: mono }}>{r.w}×{r.h}px</span>; })()}
                <button type="button" disabled={busy} onClick={applyCrop} style={{ ...apply, marginLeft: "auto" }}>Recortar</button>
              </div>
            )}
          </Box>

          <Box heading="Aumentar">
            <UpscaleBox image={image} disabled={!image || busy} onApply={upscale} />
          </Box>
        </div>
      </div>

      <Modal open={panel === "exportar"} title="Exportar" onClose={() => setPanel(null)} width={560}>
        <ExportPanel image={image} initialFormat={exportFormat} onFile={load} />
      </Modal>

      <Modal open={panel === "base64"} title="Colar Base64" onClose={() => setPanel(null)} width={560}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea value={b64Text} onChange={(e) => setB64Text(e.target.value)} rows={5} placeholder="Cole o código Base64 ou o data URI (data:image/png;base64,…)" aria-label="Código Base64"
            style={{ width: "100%", padding: 10, fontSize: 12, fontFamily: mono, background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, resize: "vertical" }} />
          {pastedSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pastedSrc} alt="Imagem do código colado" onError={() => setError("Esse código não é uma imagem válida.")} onLoad={() => setError("")} style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain", alignSelf: "flex-start", background: checker, backgroundSize: "16px 16px", border: "1px solid var(--border)", borderRadius: 8 }} />
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="button" disabled={!pastedSrc} onClick={() => void openPasted()} style={{ ...primary, opacity: pastedSrc ? 1 : 0.55, cursor: pastedSrc ? "pointer" : "not-allowed" }}>Abrir no editor</button>
          </div>
        </div>
      </Modal>

      <style>{`
        .ed-root { container-type: inline-size; }
        .ed-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; align-items: start; }
        @container (min-width: 760px) { .ed-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .ed-sticky { position: sticky; top: 16px; } }
        @media (max-width: 767px) { .ed-action-label { display: none; } }
      `}</style>
    </div>
  );
}
