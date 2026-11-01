"use client";

import { useState, useRef, useCallback } from "react";
import { loadPdfLib, getPdfPageCount, downloadBytes, fmtBytes } from "../../lib/pdf-tools";

interface PdfItem { id: number; name: string; bytes: ArrayBuffer; size: number; pages: number }

let uid = 0;

export default function MergePdf() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError("");
    const pdfs = Array.from(files).filter((f) => f.type === "application/pdf");
    if (pdfs.length === 0) { setError("Selecione arquivos PDF."); return; }
    for (const file of pdfs) {
      try {
        const bytes = await file.arrayBuffer();
        const pages = await getPdfPageCount(bytes.slice(0));
        setItems((prev) => [...prev, { id: uid++, name: file.name, bytes, size: file.size, pages }]);
      } catch {
        setError(`Não foi possível ler "${file.name}" (pode estar protegido).`);
      }
    }
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

  const totalPages = items.reduce((s, i) => s + i.pages, 0);

  const merge = async () => {
    if (items.length < 2) return;
    setBusy(true);
    setError("");
    try {
      const PDFDocument = await loadPdfLib();
      const out = await PDFDocument.create();
      for (const item of items) {
        const src = await PDFDocument.load(item.bytes.slice(0), { ignoreEncryption: true });
        const copied = await out.copyPages(src, src.getPageIndices());
        copied.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      downloadBytes(bytes, "pdf-unido.pdf", "application/pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao unir os PDFs.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface)", marginBottom: 20, transition: "all .15s" }}
      >
        <input ref={inputRef} type="file" accept="application/pdf" multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
        <div style={{ fontSize: 34, marginBottom: 10 }}>🔗</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>Arraste PDFs ou clique para selecionar</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Adicione 2 ou mais arquivos · ordene antes de unir</div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {items.length > 0 && (
        <>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
            {items.map((item, i) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: 13, color: "var(--text-subtle)", width: 22 }}>{i + 1}.</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-subtle)" }}>{item.pages} página{item.pages > 1 ? "s" : ""} · {fmtBytes(item.size)}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => move(item.id, -1)} disabled={i === 0} style={{ padding: "5px 9px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 13, cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                  <button onClick={() => move(item.id, 1)} disabled={i === items.length - 1} style={{ padding: "5px 9px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 13, cursor: i === items.length - 1 ? "default" : "pointer", opacity: i === items.length - 1 ? 0.4 : 1 }}>↓</button>
                  <button onClick={() => remove(item.id)} style={{ padding: "5px 9px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-2)", color: "#ef4444", fontSize: 13, cursor: "pointer" }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {items.length} arquivo{items.length > 1 ? "s" : ""} · {totalPages} página{totalPages > 1 ? "s" : ""} no total
            </span>
            <button onClick={merge} disabled={busy || items.length < 2} style={{ marginLeft: "auto", background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: busy || items.length < 2 ? "not-allowed" : "pointer", opacity: busy || items.length < 2 ? 0.6 : 1 }}>
              {busy ? "Unindo..." : "Unir PDFs"}
            </button>
          </div>
          {items.length < 2 && <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 10 }}>Adicione pelo menos 2 PDFs para unir.</p>}
        </>
      )}
    </div>
  );
}
