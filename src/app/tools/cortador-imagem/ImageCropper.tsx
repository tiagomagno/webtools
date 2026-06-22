"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  loadImageFile,
  encodeImage,
  downloadUrl,
  fmtBytes,
  stripExt,
  type LoadedImage,
  type ImageType,
} from "../../lib/image-tools";

interface Rect { x: number; y: number; w: number; h: number }
type Handle = "nw" | "ne" | "sw" | "se" | "move";

const ASPECTS: Array<{ label: string; value: number | null }> = [
  { label: "Livre", value: null },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
];

const HANDLE = 12;

export default function ImageCropper() {
  const [original, setOriginal] = useState<LoadedImage | null>(null);
  const [sel, setSel] = useState<Rect | null>(null); // coords em px da imagem exibida
  const [aspect, setAspect] = useState<number | null>(null);
  const [type, setType] = useState<ImageType>("image/png");
  const [result, setResult] = useState<{ url: string; size: number; width: number; height: number } | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ handle: Handle; startX: number; startY: number; start: Rect } | null>(null);

  const load = useCallback(async (file: File) => {
    setError("");
    try {
      const img = await loadImageFile(file);
      setOriginal(img);
      setResult(null);
      setSel(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar a imagem.");
    }
  }, []);

  // Inicializa a seleção (50% central) quando a imagem renderiza.
  const initSel = () => {
    const el = imgRef.current;
    if (!el) return;
    const dw = el.clientWidth;
    const dh = el.clientHeight;
    let w = dw * 0.6;
    let h = dh * 0.6;
    if (aspect) {
      if (w / h > aspect) w = h * aspect;
      else h = w / aspect;
    }
    setSel({ x: (dw - w) / 2, y: (dh - h) / 2, w, h });
  };

  // Reaplica a proporção quando o usuário muda o aspecto.
  useEffect(() => {
    if (!sel || aspect == null) return;
    setSel((s) => {
      if (!s) return s;
      const h = s.w / aspect;
      return { ...s, h };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect]);

  const clamp = (r: Rect, dw: number, dh: number): Rect => {
    let { x, y, w, h } = r;
    w = Math.max(16, Math.min(w, dw));
    h = Math.max(16, Math.min(h, dh));
    x = Math.max(0, Math.min(x, dw - w));
    y = Math.max(0, Math.min(y, dh - h));
    return { x, y, w, h };
  };

  const onPointerDown = (handle: Handle) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sel) return;
    drag.current = { handle, startX: e.clientX, startY: e.clientY, start: { ...sel } };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      const el = imgRef.current;
      if (!d || !el) return;
      const dw = el.clientWidth;
      const dh = el.clientHeight;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      let r: Rect;
      if (d.handle === "move") {
        r = { ...d.start, x: d.start.x + dx, y: d.start.y + dy };
      } else {
        r = { ...d.start };
        if (d.handle === "se") { r.w = d.start.w + dx; r.h = d.start.h + dy; }
        if (d.handle === "sw") { r.x = d.start.x + dx; r.w = d.start.w - dx; r.h = d.start.h + dy; }
        if (d.handle === "ne") { r.y = d.start.y + dy; r.w = d.start.w + dx; r.h = d.start.h - dy; }
        if (d.handle === "nw") { r.x = d.start.x + dx; r.y = d.start.y + dy; r.w = d.start.w - dx; r.h = d.start.h - dy; }
        if (aspect && d.handle !== "move") {
          r.h = r.w / aspect;
          if (d.handle === "nw" || d.handle === "ne") r.y = d.start.y + d.start.h - r.h;
        }
      }
      setSel(clamp(r, dw, dh));
      setResult(null);
    };
    const up = () => { drag.current = null; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [aspect]);

  const apply = async () => {
    const el = imgRef.current;
    if (!original || !sel || !el) return;
    setError("");
    const scale = original.width / el.clientWidth;
    try {
      const enc = await encodeImage({
        src: original.src,
        type,
        quality: 0.92,
        crop: {
          x: Math.round(sel.x * scale),
          y: Math.round(sel.y * scale),
          w: Math.round(sel.w * scale),
          h: Math.round(sel.h * scale),
        },
      });
      setResult({ url: enc.url, size: enc.size, width: enc.width, height: enc.height });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao recortar.");
    }
  };

  const download = () => {
    if (!result || !original) return;
    const ext = type === "image/jpeg" ? "jpg" : type === "image/webp" ? "webp" : "png";
    downloadUrl(result.url, `${stripExt(original.name)}-recorte.${ext}`);
  };

  const scale = original && imgRef.current ? original.width / imgRef.current.clientWidth : 1;
  const handleStyle = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute", width: HANDLE, height: HANDLE, background: "var(--accent)", border: "2px solid #fff", borderRadius: 3, ...pos,
  });

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) load(f); }}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, padding: original ? "16px" : "40px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface)", marginBottom: 20, transition: "all .15s" }}
      >
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f); }} />
        {!original ? (
          <>
            <div style={{ fontSize: 34, marginBottom: 10 }}>✂️</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>Arraste uma imagem ou clique para selecionar</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>JPG, PNG, WebP</div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{original.name} · {original.width}×{original.height}px</div>
        )}
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {original && (
        <>
          {/* Área de recorte */}
          <div style={{ position: "relative", display: "inline-block", maxWidth: "100%", marginBottom: 20, userSelect: "none", lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={original.src}
              alt=""
              onLoad={() => { if (!sel) initSel(); }}
              draggable={false}
              style={{ maxWidth: "100%", maxHeight: 420, display: "block", borderRadius: 8 }}
            />
            {sel && (
              <div
                onPointerDown={onPointerDown("move")}
                style={{ position: "absolute", left: sel.x, top: sel.y, width: sel.w, height: sel.h, border: "1px solid var(--accent)", boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)", cursor: "move", touchAction: "none" }}
              >
                <div onPointerDown={onPointerDown("nw")} style={handleStyle({ left: -HANDLE / 2, top: -HANDLE / 2, cursor: "nwse-resize" })} />
                <div onPointerDown={onPointerDown("ne")} style={handleStyle({ right: -HANDLE / 2, top: -HANDLE / 2, cursor: "nesw-resize" })} />
                <div onPointerDown={onPointerDown("sw")} style={handleStyle({ left: -HANDLE / 2, bottom: -HANDLE / 2, cursor: "nesw-resize" })} />
                <div onPointerDown={onPointerDown("se")} style={handleStyle({ right: -HANDLE / 2, bottom: -HANDLE / 2, cursor: "nwse-resize" })} />
              </div>
            )}
          </div>

          {/* Controles */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>PROPORÇÃO</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ASPECTS.map((a) => (
                  <button key={a.label} onClick={() => setAspect(a.value)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid", borderColor: aspect === a.value ? "var(--accent)" : "var(--border)", background: aspect === a.value ? "var(--accent)" : "var(--surface-2)", color: aspect === a.value ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>FORMATO</div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["image/png", "image/jpeg", "image/webp"] as ImageType[]).map((t) => (
                  <button key={t} onClick={() => { setType(t); setResult(null); }} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid", borderColor: type === t ? "var(--accent)" : "var(--border)", background: type === t ? "var(--accent)" : "var(--surface-2)", color: type === t ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {t === "image/png" ? "PNG" : t === "image/jpeg" ? "JPG" : "WebP"}
                  </button>
                ))}
              </div>
            </div>
            {sel && (
              <div style={{ fontSize: 12, color: "var(--text-muted)", paddingBottom: 8 }}>
                Recorte: {Math.round(sel.w * scale)}×{Math.round(sel.h * scale)}px
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
              <button onClick={apply} style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Recortar</button>
              {result && (
                <button onClick={download} style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>↓ Baixar</button>
              )}
            </div>
          </div>

          {result && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginTop: 20 }}>
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
