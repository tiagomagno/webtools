"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface PageResult {
  page: number;
  text: string;
}

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PdfExtractorPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [pages, setPages] = useState<PageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activePage, setActivePage] = useState<number | "all">("all");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractText = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setPages([]);
    setActivePage("all");
    setFileName(file.name);
    setFileSize(file.size);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const results: PageResult[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        results.push({ page: i, text });
      }

      setPages(results);
    } catch (e) {
      setError("Não foi possível processar o PDF. Certifique-se de que não é um PDF protegido por senha.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") extractText(file);
  };

  const activeText = activePage === "all"
    ? pages.map((p) => `--- Página ${p.page} ---\n${p.text}`).join("\n\n")
    : pages.find((p) => p.page === activePage)?.text ?? "";

  const totalChars = pages.reduce((acc, p) => acc + p.text.length, 0);
  const totalWords = pages.reduce((acc, p) => acc + p.text.split(/\s+/).filter(Boolean).length, 0);

  const copy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadTxt = () => {
    const blob = new Blob([activeText], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(fileName ?? "documento").replace(".pdf", "")}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>
          ← Ferramentas
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          📄 Extrator de Texto de PDF
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Extrai todo o texto de PDFs diretamente no browser. Sem upload para servidores, sem limites.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 16,
          padding: "48px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "var(--accent)0a" : "var(--surface)",
          marginBottom: 24,
          transition: "all 0.15s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) extractText(f); }}
        />
        <div style={{ fontSize: 36, marginBottom: 12 }}>📑</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
          {loading ? "Extraindo texto..." : fileName ?? "Arraste um PDF ou clique para selecionar"}
        </div>
        {fileName && !loading && (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {fmtSize(fileSize)} · {pages.length} páginas · {totalWords.toLocaleString()} palavras · {totalChars.toLocaleString()} caracteres
          </div>
        )}
        {loading && (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Aguarde...</div>
        )}
      </div>

      {error && (
        <div style={{ background: "#ef444420", border: "1px solid #ef444440", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {pages.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
          {/* Page list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              onClick={() => setActivePage("all")}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: activePage === "all" ? "var(--accent)" : "var(--border)",
                background: activePage === "all" ? "var(--accent)" : "var(--surface)",
                color: activePage === "all" ? "#fff" : "var(--text)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Todas as páginas
            </button>
            <div style={{ maxHeight: 480, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
              {pages.map((p) => (
                <button
                  key={p.page}
                  onClick={() => setActivePage(p.page)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: activePage === p.page ? "var(--accent)" : "var(--border)",
                    background: activePage === p.page ? "var(--accent)20" : "var(--surface)",
                    color: activePage === p.page ? "var(--accent)" : "var(--text-muted)",
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Página {p.page}</span>
                  <span style={{ fontSize: 11, opacity: 0.6 }}>{p.text.split(/\s+/).filter(Boolean).length}p</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text output */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={copy}
                style={{ background: copied ? "#10b981" : "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 500, color: copied ? "#fff" : "var(--text-muted)", cursor: "pointer", transition: "all 0.2s" }}
              >
                {copied ? "✓ Copiado!" : "Copiar texto"}
              </button>
              <button
                onClick={downloadTxt}
                style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}
              >
                ↓ Baixar .txt
              </button>
            </div>
            <textarea
              readOnly
              value={activeText}
              style={{
                width: "100%",
                height: 520,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
                color: "var(--text)",
                fontSize: 13,
                lineHeight: 1.8,
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
