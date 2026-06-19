"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface Preset {
  label: string;
  quality: number;
  scale: number;
  description: string;
}

const PRESETS: Preset[] = [
  { label: "Alta", quality: 0.85, scale: 1.5, description: "Boa qualidade visual, compressão moderada" },
  { label: "Média", quality: 0.65, scale: 1.2, description: "Equilíbrio entre qualidade e tamanho" },
  { label: "Baixa", quality: 0.40, scale: 1.0, description: "Máxima compressão, qualidade reduzida" },
];

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function reduction(original: number, compressed: number) {
  const pct = Math.round((1 - compressed / original) * 100);
  return pct > 0 ? `-${pct}%` : `+${Math.abs(pct)}%`;
}

export default function PdfCompressorPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [originalBytes, setOriginalBytes] = useState<ArrayBuffer | null>(null);
  const [preset, setPreset] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [result, setResult] = useState<{ bytes: Uint8Array; size: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (file.type !== "application/pdf") return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalBytes(e.target?.result as ArrayBuffer);
      setOriginalSize(file.size);
      setFileName(file.name);
      setResult(null);
      setError(null);
      setProgress(0);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  };

  const compress = async () => {
    if (!originalBytes) return;
    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const [pdfjsLib, { PDFDocument }] = await Promise.all([
        import("pdfjs-dist"),
        import("pdf-lib"),
      ]);

      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const { quality, scale } = PRESETS[preset];

      const pdfDoc = await pdfjsLib.getDocument({ data: originalBytes.slice(0) }).promise;
      const numPages = pdfDoc.numPages;
      setTotalPages(numPages);

      const outputPdf = await PDFDocument.create();

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d")!;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
        const base64 = jpegDataUrl.split(",")[1];
        const jpegBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

        const jpegImage = await outputPdf.embedJpg(jpegBytes);
        const pdfPage = outputPdf.addPage([viewport.width, viewport.height]);
        pdfPage.drawImage(jpegImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });

        setProgress(Math.round((i / numPages) * 100));
      }

      const outputBytes = await outputPdf.save();
      setResult({ bytes: outputBytes, size: outputBytes.byteLength });
    } catch (e) {
      console.error(e);
      setError("Erro ao comprimir o PDF. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!result || !fileName) return;
    const blob = new Blob([result.bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(".pdf", "_comprimido.pdf");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>
          ← Ferramentas
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          🗜️ Compressão de PDF
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Reduz o tamanho do PDF renderizando as páginas em JPEG. 100% no browser, sem upload.{" "}
          <span style={{ color: "var(--text-subtle)" }}>O texto deixa de ser selecionável após a compressão.</span>
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !processing && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 16,
          padding: "40px 24px",
          textAlign: "center",
          cursor: processing ? "default" : "pointer",
          background: dragging ? "var(--accent)0a" : "var(--surface)",
          marginBottom: 20,
          transition: "all 0.15s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
        />
        <div style={{ fontSize: 36, marginBottom: 12 }}>📑</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
          {fileName ?? "Arraste um PDF ou clique para selecionar"}
        </div>
        {originalSize > 0 && (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {fmtSize(originalSize)}
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: "#ef444420", border: "1px solid #ef444440", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {originalBytes && (
        <>
          {/* Preset selector */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 12 }}>NÍVEL DE COMPRESSÃO</div>
            <div style={{ display: "flex", gap: 10 }}>
              {PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => { setPreset(i); setResult(null); }}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor: preset === i ? "var(--accent)" : "var(--border)",
                    background: preset === i ? "var(--accent)15" : "var(--surface-2)",
                    color: preset === i ? "var(--accent)" : "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.1s",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 11, lineHeight: 1.4, opacity: 0.8 }}>{p.description}</div>
                </button>
              ))}
            </div>

            {/* Observação do preset selecionado */}
            <div
              style={{
                marginTop: 14,
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "12px 14px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 2 }}>QUALIDADE JPEG</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{Math.round(PRESETS[preset].quality * 100)}%</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 2 }}>ESCALA DE RENDERIZAÇÃO</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{PRESETS[preset].scale}× (DPI simulado)</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 2 }}>FORMATO DAS PÁGINAS</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>JPEG por página</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 2 }}>TEXTO SELECIONÁVEL</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>Não (rasterizado)</div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 2 }}>MELHOR PARA</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {preset === 0 && "PDFs com imagens de alta qualidade, apresentações e relatórios visuais."}
                  {preset === 1 && "Uso geral: documentos mistos com texto e imagens."}
                  {preset === 2 && "Compartilhamento rápido por e-mail ou WhatsApp onde qualidade visual é secundária."}
                </div>
              </div>
            </div>
          </div>

          {/* Action + Result */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
            {processing ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, color: "var(--text-muted)" }}>
                  <span>Comprimindo páginas...</span>
                  <span>{progress}% {totalPages > 0 && `(${Math.ceil(progress * totalPages / 100)}/${totalPages})`}</span>
                </div>
                <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "var(--accent)",
                      borderRadius: 3,
                      transition: "width 0.2s",
                    }}
                  />
                </div>
              </div>
            ) : result ? (
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>ORIGINAL</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{fmtSize(originalSize)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", color: "var(--text-subtle)", fontSize: 18 }}>→</div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>COMPRIMIDO</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{fmtSize(result.size)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>REDUÇÃO</div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: result.size < originalSize ? "#10b981" : "#f59e0b",
                      }}
                    >
                      {reduction(originalSize, result.size)}
                    </div>
                  </div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                  <button
                    onClick={() => { setResult(null); }}
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 16px", fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}
                  >
                    Refazer
                  </button>
                  <button
                    onClick={download}
                    style={{ background: "#10b981", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}
                  >
                    ↓ Download PDF
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Qualidade JPEG: <strong style={{ color: "var(--text)" }}>{Math.round(PRESETS[preset].quality * 100)}%</strong>
                  {" · "}Escala: <strong style={{ color: "var(--text)" }}>{PRESETS[preset].scale}×</strong>
                </div>
                <button
                  onClick={compress}
                  style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}
                >
                  Comprimir PDF
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
