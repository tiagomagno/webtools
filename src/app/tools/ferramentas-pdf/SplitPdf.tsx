"use client";

import { useState, useRef, useCallback } from "react";
import { loadPdfLib, getPdfPageCount, downloadBytes, fmtBytes, stripExt, parsePageRanges } from "../../lib/pdf-tools";

type Mode = "ranges" | "each";

export default function SplitPdf() {
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("ranges");
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const bytesRef = useRef<ArrayBuffer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (file: File) => {
    setError("");
    if (file.type !== "application/pdf") { setError("Selecione um arquivo PDF."); return; }
    try {
      const bytes = await file.arrayBuffer();
      const count = await getPdfPageCount(bytes.slice(0));
      bytesRef.current = bytes;
      setFileName(file.name);
      setPageCount(count);
      setRanges(`1-${count}`);
    } catch {
      setError("Não foi possível ler o PDF (pode estar protegido por senha).");
    }
  }, []);

  const parsed = mode === "ranges" && pageCount ? parsePageRanges(ranges, pageCount) : null;
  const rangesValid = mode === "each" || (parsed !== null && parsed.length > 0);

  const run = async () => {
    if (!bytesRef.current || !pageCount) return;
    setBusy(true);
    setError("");
    try {
      const PDFDocument = await loadPdfLib();
      const base = stripExt(fileName);

      if (mode === "each") {
        for (let i = 0; i < pageCount; i++) {
          const src = await PDFDocument.load(bytesRef.current.slice(0), { ignoreEncryption: true });
          const out = await PDFDocument.create();
          const [pg] = await out.copyPages(src, [i]);
          out.addPage(pg);
          const bytes = await out.save();
          downloadBytes(bytes, `${base}-pagina-${i + 1}.pdf`, "application/pdf");
        }
      } else {
        const pages = parsePageRanges(ranges, pageCount);
        if (!pages || pages.length === 0) { setError("Intervalo inválido."); setBusy(false); return; }
        const src = await PDFDocument.load(bytesRef.current.slice(0), { ignoreEncryption: true });
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, pages.map((p) => p - 1));
        copied.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        downloadBytes(bytes, `${base}-extraido.pdf`, "application/pdf");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao dividir o PDF.");
    } finally {
      setBusy(false);
    }
  };

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
        <div style={{ fontSize: 34, marginBottom: 10 }}>✂️</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>{fileName || "Arraste um PDF ou clique para selecionar"}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{pageCount ? `${pageCount} páginas` : "Extraia páginas ou divida em arquivos"}</div>
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {pageCount > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, display: "grid", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>MODO</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setMode("ranges")} style={seg(mode === "ranges")}>Extrair intervalo</button>
              <button onClick={() => setMode("each")} style={seg(mode === "each")}>Cada página um PDF</button>
            </div>
          </div>

          {mode === "ranges" && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" }}>
                PÁGINAS (ex.: 1-3, 5, 8-10)
              </label>
              <input
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                style={{ width: "100%", background: "var(--surface-2)", border: `1px solid ${rangesValid ? "var(--border)" : "#ef4444"}`, borderRadius: 8, padding: "9px 12px", color: "var(--text)", fontSize: 14, fontFamily: "monospace" }}
              />
              <div style={{ fontSize: 12, color: rangesValid ? "var(--text-subtle)" : "#ef4444", marginTop: 6 }}>
                {rangesValid && parsed ? `${parsed.length} página(s) selecionada(s) de ${pageCount}.` : `Intervalo inválido (1 a ${pageCount}).`}
              </div>
            </div>
          )}

          {mode === "each" && (
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
              Serão gerados <strong>{pageCount}</strong> arquivos PDF, um por página. O navegador pode pedir permissão
              para baixar vários arquivos.
            </p>
          )}

          <button onClick={run} disabled={busy || !rangesValid} style={{ justifySelf: "start", background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: busy || !rangesValid ? "not-allowed" : "pointer", opacity: busy || !rangesValid ? 0.6 : 1 }}>
            {busy ? "Processando..." : mode === "each" ? "Dividir e baixar" : "Extrair e baixar"}
          </button>
        </div>
      )}
    </div>
  );
}

function seg(active: boolean): React.CSSProperties {
  return { padding: "7px 14px", borderRadius: 8, border: "1px solid", borderColor: active ? "var(--accent)" : "var(--border)", background: active ? "var(--accent)" : "var(--surface-2)", color: active ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" };
}
