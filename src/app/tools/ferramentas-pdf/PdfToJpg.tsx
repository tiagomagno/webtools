"use client";

import { useState, useRef, useCallback } from "react";
import { renderPdfPages, canvasToBlob, downloadBytes, fmtBytes, stripExt, type RenderedPage } from "../../lib/pdf-tools";

interface PageImg { index: number; url: string; blob: Blob }

export default function PdfToJpg() {
  const [fileName, setFileName] = useState("");
  const [pages, setPages] = useState<PageImg[]>([]);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [quality, setQuality] = useState(92);
  const [scale, setScale] = useState(1.5);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const lastBytes = useRef<ArrayBuffer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ext = format === "image/png" ? "png" : "jpg";

  const process = useCallback(async (bytes: ArrayBuffer, name: string) => {
    setBusy(true);
    setError("");
    setPages([]);
    setProgress({ done: 0, total: 0 });
    try {
      const rendered: RenderedPage[] = await renderPdfPages(bytes.slice(0), scale, (done, total) => setProgress({ done, total }));
      const out: PageImg[] = [];
      for (const p of rendered) {
        const blob = await canvasToBlob(p.canvas, format, quality / 100);
        out.push({ index: p.index, url: URL.createObjectURL(blob), blob });
      }
      setPages(out);
      setFileName(name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao processar o PDF.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [scale, format, quality]);

  const load = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") { setError("Selecione um arquivo PDF."); return; }
    const bytes = await file.arrayBuffer();
    lastBytes.current = bytes;
    await process(bytes, file.name);
  }, [process]);

  const reprocess = () => { if (lastBytes.current) process(lastBytes.current, fileName); };

  const downloadOne = (p: PageImg) => downloadBytes(p.blob, `${stripExt(fileName)}-pagina-${p.index}.${ext}`, format);
  const downloadAll = () => pages.forEach(downloadOne);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) load(f); }}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface)", marginBottom: 20, transition: "all .15s" }}
      >
        <input ref={inputRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f); }} />
        <div style={{ fontSize: 34, marginBottom: 10 }}>🖼️</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>{fileName || "Arraste um PDF ou clique para selecionar"}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Cada página vira uma imagem</div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}
      {busy && <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>Renderizando{progress && progress.total ? ` página ${progress.done}/${progress.total}` : "…"}</div>}

      {(pages.length > 0 || lastBytes.current) && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>FORMATO</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["image/jpeg", "image/png"] as const).map((f) => (
                <button key={f} onClick={() => setFormat(f)} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid", borderColor: format === f ? "var(--accent)" : "var(--border)", background: format === f ? "var(--accent)" : "var(--surface-2)", color: format === f ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {f === "image/jpeg" ? "JPG" : "PNG"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>RESOLUÇÃO</div>
            <div style={{ display: "flex", gap: 6 }}>
              {([["1×", 1], ["1,5×", 1.5], ["2×", 2], ["3×", 3]] as const).map(([lbl, s]) => (
                <button key={s} onClick={() => setScale(s)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid", borderColor: scale === s ? "var(--accent)" : "var(--border)", background: scale === s ? "var(--accent)" : "var(--surface-2)", color: scale === s ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          {format === "image/jpeg" && (
            <div style={{ flex: 1, minWidth: 150 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>QUALIDADE — {quality}%</div>
              <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
            <button onClick={reprocess} disabled={busy} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, background: "var(--surface-2)", color: "var(--text-muted)", cursor: busy ? "not-allowed" : "pointer" }}>Reprocessar</button>
            {pages.length > 0 && (
              <button onClick={downloadAll} style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>↓ Baixar todas</button>
            )}
          </div>
        </div>
      )}

      {pages.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {pages.map((p) => (
            <div key={p.index} onClick={() => downloadOne(p)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 120 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Página ${p.index}`} style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain", display: "block" }} />
              </div>
              <div style={{ padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Página {p.index}</span>
                <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{fmtBytes(p.blob.size)} ↓</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
