"use client";

import { useEffect, useRef, useState } from "react";
import type { CropRect, LoadedImage } from "../../lib/image-tools";

type Handle = "nw" | "ne" | "sw" | "se" | "move";

const HANDLE = 14;
const MIN = 16;

interface CropPreviewProps {
  image: LoadedImage;
  /** Proporção fixa (largura / altura) ou null para livre. */
  aspect: number | null;
  /** Informa a seleção (em px da imagem exibida) e a largura exibida, para converter para a original. */
  onChange: (sel: CropRect, displayWidth: number) => void;
}

const clamp = (r: CropRect, dw: number, dh: number): CropRect => {
  const w = Math.max(MIN, Math.min(r.w, dw));
  const h = Math.max(MIN, Math.min(r.h, dh));
  return { w, h, x: Math.max(0, Math.min(r.x, dw - w)), y: Math.max(0, Math.min(r.y, dh - h)) };
};

/** Imagem com a seleção de recorte arrastável (mover e redimensionar pelos cantos). */
export default function CropPreview({ image, aspect, onChange }: CropPreviewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [sel, setSel] = useState<CropRect | null>(null);
  const drag = useRef<{ handle: Handle; startX: number; startY: number; start: CropRect } | null>(null);
  const aspectRef = useRef(aspect);

  const publish = (next: CropRect) => {
    setSel(next);
    if (imgRef.current) onChange(next, imgRef.current.clientWidth);
  };

  // Seleção inicial: 60% central, respeitando a proporção.
  const init = () => {
    const el = imgRef.current;
    if (!el) return;
    const dw = el.clientWidth, dh = el.clientHeight;
    let w = dw * 0.6, h = dh * 0.6;
    if (aspect) { if (w / h > aspect) w = h * aspect; else h = w / aspect; }
    publish({ x: (dw - w) / 2, y: (dh - h) / 2, w, h });
  };

  // Troca de proporção: reaplica a altura da seleção atual.
  useEffect(() => {
    aspectRef.current = aspect;
    const el = imgRef.current;
    if (!aspect || !sel || !el) return;
    publish(clamp({ ...sel, h: sel.w / aspect }, el.clientWidth, el.clientHeight));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current, el = imgRef.current;
      if (!d || !el) return;
      const dx = e.clientX - d.startX, dy = e.clientY - d.startY;
      let r: CropRect;
      if (d.handle === "move") {
        r = { ...d.start, x: d.start.x + dx, y: d.start.y + dy };
      } else {
        r = { ...d.start };
        if (d.handle === "se") { r.w = d.start.w + dx; r.h = d.start.h + dy; }
        if (d.handle === "sw") { r.x = d.start.x + dx; r.w = d.start.w - dx; r.h = d.start.h + dy; }
        if (d.handle === "ne") { r.y = d.start.y + dy; r.w = d.start.w + dx; r.h = d.start.h - dy; }
        if (d.handle === "nw") { r.x = d.start.x + dx; r.y = d.start.y + dy; r.w = d.start.w - dx; r.h = d.start.h - dy; }
        const fixed = aspectRef.current;
        if (fixed) {
          r.h = r.w / fixed;
          if (d.handle === "nw" || d.handle === "ne") r.y = d.start.y + d.start.h - r.h;
        }
      }
      publish(clamp(r, el.clientWidth, el.clientHeight));
    };
    const up = () => { drag.current = null; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = (handle: Handle) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sel) return;
    drag.current = { handle, startX: e.clientX, startY: e.clientY, start: { ...sel } };
  };

  const handleStyle = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute", width: HANDLE, height: HANDLE, background: "var(--accent-strong)", border: "2px solid #fff", borderRadius: 3, touchAction: "none", ...pos,
  });

  return (
    <div style={{ position: "relative", display: "inline-block", maxWidth: "100%", userSelect: "none", lineHeight: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={image.src} alt="Imagem a recortar" draggable={false} onLoad={init} style={{ maxWidth: "100%", maxHeight: 460, display: "block", outline: "1px solid var(--border)", background: "repeating-conic-gradient(#d4d4d8 0% 25%, #fff 0% 50%)", backgroundSize: "16px 16px" }} />
      {sel && (
        <div
          onPointerDown={start("move")}
          style={{ position: "absolute", left: sel.x, top: sel.y, width: sel.w, height: sel.h, border: "1px solid #fff", boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)", cursor: "move", touchAction: "none" }}
        >
          <div onPointerDown={start("nw")} style={handleStyle({ left: -HANDLE / 2, top: -HANDLE / 2, cursor: "nwse-resize" })} />
          <div onPointerDown={start("ne")} style={handleStyle({ right: -HANDLE / 2, top: -HANDLE / 2, cursor: "nesw-resize" })} />
          <div onPointerDown={start("sw")} style={handleStyle({ left: -HANDLE / 2, bottom: -HANDLE / 2, cursor: "nesw-resize" })} />
          <div onPointerDown={start("se")} style={handleStyle({ right: -HANDLE / 2, bottom: -HANDLE / 2, cursor: "nwse-resize" })} />
        </div>
      )}
    </div>
  );
}
