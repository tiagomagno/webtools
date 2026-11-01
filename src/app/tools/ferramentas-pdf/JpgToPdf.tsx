"use client";

import { useState, useRef, useCallback } from "react";
import { loadPdfLib, downloadBytes, fmtBytes } from "../../lib/pdf-tools";

interface Item { id: number; name: string; src: string; type: string; size: number }

type PageSize = "fit" | "a4";
type Orientation = "portrait" | "landscape";

let uid = 0;

export default function JpgToPdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    imgs.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setItems((prev) => [...prev, { id: uid++, name: file.name, src: e.target?.result as string, type: file.type, size: file.size }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  const move = (id: number, dir: -1 | 1) =>
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      const j = idx + dir;
      if (idx < 0 || j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[j]] = [copy[j], copy[idx]];
      return copy;
    });

  const generate = async () => {
    if (items.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const PDFDocument = await loadPdfLib();
      const pdf = await PDFDocument.create();
      const A4 = orientation === "portrait" ? [595.28, 841.89] : [841.89, 595.28];

      for (const item of items) {
        const bytes = Uint8Array.from(atob(item.src.split(",")[1]), (c) => c.charCodeAt(0));
        const img = item.type.includes("png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);

        if (pageSize === "fit") {
          const page = pdf.addPage([img.width + margin * 2, img.height + margin * 2]);
          page.drawImage(img, { x: margin, y: margin, width: img.width, height: img.height });
        } else {
          const [pw, ph] = A4;
          const page = pdf.addPage([pw, ph]);
          const availW = pw - margin * 2;
          const availH = ph - margin * 2;
          const scale = Math.min(availW / img.width, availH / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
        }
      }

      const out = await pdf.save();
      downloadBytes(out, "imagens.pdf", "application/pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao gerar o PDF.");
    } finally {
      setBusy(false);
    }
  };

  const segBtn = (active: boolean): React.CSSProperties => ({
    padding: "7px 14px", borderRadius: 8, border: "1px solid", borderColor: active ? "var(--accent)" : "var(--border)",
    background: active ? "var(--accent)" : "var(--surface-2)", color: active ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer",
  });

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface)", marginBottom: 20, transition: "all .15s" }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
        <div style={{ fontSize: 34, marginBottom: 10 }}>📄</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>Arraste imagens ou clique para selecionar</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>JPG ou PNG · várias de uma vez · uma por página</div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {items.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
            {items.map((item, i) => (
              <div key={item.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", position: "relative" }}>
                <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", background: "repeating-conic-gradient(#ffffff10 0% 25%, transparent 0% 50%) 0 0 / 12px 12px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt="" style={{ maxWidth: "100%", maxHeight: 110, objectFit: "contain" }} />
                </div>
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: 11, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i + 1}. {item.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text-subtle)", marginBottom: 6 }}>{fmtBytes(item.size)}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => move(item.id, -1)} disabled={i === 0} style={{ flex: 1, padding: "3px 0", borderRadius: 5, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => move(item.id, 1)} disabled={i === items.length - 1} style={{ flex: 1, padding: "3px 0", borderRadius: 5, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 12, cursor: i === items.length - 1 ? "default" : "pointer", opacity: i === items.length - 1 ? 0.4 : 1 }}>↓</button>
                    <button onClick={() => remove(item.id)} style={{ flex: 1, padding: "3px 0", borderRadius: 5, border: "1px solid var(--border)", background: "var(--surface-2)", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>TAMANHO DA PÁGINA</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPageSize("fit")} style={segBtn(pageSize === "fit")}>Ajustar à imagem</button>
                <button onClick={() => setPageSize("a4")} style={segBtn(pageSize === "a4")}>A4</button>
              </div>
            </div>
            {pageSize === "a4" && (
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>ORIENTAÇÃO</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setOrientation("portrait")} style={segBtn(orientation === "portrait")}>Retrato</button>
                  <button onClick={() => setOrientation("landscape")} style={segBtn(orientation === "landscape")}>Paisagem</button>
                </div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>MARGEM (pt)</div>
              <input type="number" min={0} value={margin} onChange={(e) => setMargin(Math.max(0, Number(e.target.value)))} style={{ width: 90, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" }} />
            </div>
            <button onClick={generate} disabled={busy} style={{ marginLeft: "auto", background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.7 : 1 }}>
              {busy ? "Gerando..." : `Gerar PDF (${items.length})`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
