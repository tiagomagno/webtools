"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface PageResult {
  page: number;
  text: string;
}

type FileType = "pdf" | "docx" | null;

const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function detectType(file: File): FileType {
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) return "pdf";
  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.endsWith(".docx")
  )
    return "docx";
  return null;
}

export default function PdfExtractorPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState<FileType>(null);
  const [pages, setPages] = useState<PageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activePage, setActivePage] = useState<number | "all">("all");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractText = useCallback(async (file: File) => {
    const type = detectType(file);
    if (!type) {
      setError("Formato não suportado. Use PDF ou DOCX.");
      return;
    }

    setLoading(true);
    setError(null);
    setPages([]);
    setActivePage("all");
    setFileName(file.name);
    setFileSize(file.size);
    setFileType(type);

    try {
      if (type === "pdf") {
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
      } else {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        // Split by paragraphs into logical "pages" of ~3000 chars each
        const paragraphs = result.value.split(/\n+/).filter((p) => p.trim());
        const chunks: PageResult[] = [];
        let current = "";
        let pageNum = 1;

        for (const para of paragraphs) {
          if ((current + para).length > 3000 && current.length > 0) {
            chunks.push({ page: pageNum++, text: current.trim() });
            current = para + "\n";
          } else {
            current += para + "\n";
          }
        }
        if (current.trim()) chunks.push({ page: pageNum, text: current.trim() });
        setPages(chunks.length > 0 ? chunks : [{ page: 1, text: result.value }]);
      }
    } catch (e) {
      setError(
        type === "pdf"
          ? "Não foi possível processar o PDF. Certifique-se de que não é protegido por senha."
          : "Não foi possível processar o DOCX. O arquivo pode estar corrompido."
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) extractText(file);
  };

  const isPdf = fileType === "pdf";
  const sectionLabel = isPdf ? "Página" : "Bloco";

  const activeText =
    activePage === "all"
      ? pages.map((p) => `--- ${sectionLabel} ${p.page} ---\n${p.text}`).join("\n\n")
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
    a.download = `${(fileName ?? "documento").replace(/\.(pdf|docx)$/i, "")}.txt`;
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
          📄 Extrator de Documentos
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Extrai texto de <strong style={{ color: "var(--text)" }}>PDF</strong> e <strong style={{ color: "var(--text)" }}>DOCX</strong> diretamente no browser. Sem upload para servidores.{" "}
          <span style={{ color: "var(--text-subtle)" }}>Formato .doc (Word antigo) não é suportado.</span>
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
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) extractText(f); }}
        />
        <div style={{ fontSize: 36, marginBottom: 12 }}>📑</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
          {loading ? "Extraindo texto..." : fileName ?? "Arraste um PDF ou DOCX, ou clique para selecionar"}
        </div>
        {fileName && !loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                background: fileType === "pdf" ? "#ef444420" : "#6366f120",
                color: fileType === "pdf" ? "#f87171" : "var(--accent)",
                letterSpacing: "0.04em",
              }}
            >
              {fileType?.toUpperCase()}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {fmtSize(fileSize)} · {pages.length} {isPdf ? "páginas" : "blocos"} · {totalWords.toLocaleString()} palavras · {totalChars.toLocaleString()} caracteres
            </span>
          </div>
        )}
        {loading && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Aguarde...</div>}
      </div>

      {error && (
        <div style={{ background: "#ef444420", border: "1px solid #ef444440", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {pages.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
          {/* Section list */}
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
              {isPdf ? "Todas as páginas" : "Documento completo"}
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
                  <span>{sectionLabel} {p.page}</span>
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
