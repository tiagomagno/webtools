"use client";

import { useState, useRef, useCallback } from "react";
import { convertToMarkdown, detectDocFormat, isLowTextDensity, isUnsupportedLegacyFormat, type DocFormat } from "@/app/lib/markdown-tools";

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const FORMAT_LABEL: Record<DocFormat, string> = {
  pdf: "PDF",
  docx: "DOCX",
  xlsx: "XLSX",
  pptx: "PPTX",
};

const FORMAT_COLOR: Record<DocFormat, string> = {
  pdf: "#ef4444",
  docx: "#0ea5e9",
  xlsx: "#22c55e",
  pptx: "#f97316",
};

export default function DocumentoParaMarkdownPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [format, setFormat] = useState<DocFormat | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lowTextWarning, setLowTextWarning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = useCallback(async (file: File) => {
    const legacy = isUnsupportedLegacyFormat(file);
    if (legacy) {
      setError(
        legacy === "doc"
          ? "Formato .doc (Word antigo) não é suportado. Salve como .docx e tente novamente."
          : "Formato .ppt (PowerPoint antigo) não é suportado. Salve como .pptx e tente novamente."
      );
      return;
    }

    const detected = detectDocFormat(file);
    if (!detected) {
      setError("Formato não suportado. Use PDF, DOCX, XLS/XLSX ou PPTX.");
      return;
    }

    setLoading(true);
    setError(null);
    setLowTextWarning(false);
    setMarkdown("");
    setProgress(null);
    setFileName(file.name);
    setFileSize(file.size);
    setFormat(detected);

    try {
      const result = await convertToMarkdown(file, (done, total) => setProgress({ done, total }));
      setMarkdown(result || "_Nenhum texto encontrado no documento._");
      setLowTextWarning(isLowTextDensity(detected, result.length, file.size));
    } catch (e) {
      setError(`Não foi possível converter o arquivo. Verifique se ele não está corrompido ou protegido por senha.`);
      console.error(e);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) convert(file);
  };

  const totalChars = markdown.length;
  const totalWords = markdown.split(/\s+/).filter(Boolean).length;

  const copy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(fileName ?? "documento").replace(/\.[^.]+$/, "")}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
          📝 Documento para Markdown
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Converte <strong style={{ color: "var(--text)" }}>PDF</strong>, <strong style={{ color: "var(--text)" }}>DOCX</strong>,{" "}
          <strong style={{ color: "var(--text)" }}>XLS/XLSX</strong> e <strong style={{ color: "var(--text)" }}>PPTX</strong> em Markdown, direto no navegador. Sem upload para servidores.{" "}
          <span style={{ color: "var(--text-subtle)" }}>Formatos antigos .doc e .ppt não são suportados.</span>
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
          accept=".pdf,.docx,.doc,.xls,.xlsx,.pptx,.ppt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) convert(f); }}
        />
        <div style={{ fontSize: 36, marginBottom: 12 }}>📑</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
          {loading ? "Convertendo..." : fileName ?? "Arraste um PDF, DOCX, XLS/XLSX ou PPTX, ou clique para selecionar"}
        </div>
        {fileName && !loading && format && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                background: `${FORMAT_COLOR[format]}20`,
                color: FORMAT_COLOR[format],
                letterSpacing: "0.04em",
              }}
            >
              {FORMAT_LABEL[format]}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {fmtSize(fileSize)} · {totalWords.toLocaleString()} palavras · {totalChars.toLocaleString()} caracteres
            </span>
          </div>
        )}
        {loading && (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {progress ? `Processando ${progress.done}/${progress.total}...` : "Aguarde..."}
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: "#ef444420", border: "1px solid #ef444440", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {lowTextWarning && (
        <div style={{ background: "#f59e0b1a", border: "1px solid #f59e0b40", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#d97706", marginBottom: 20, lineHeight: 1.6 }}>
          ⚠️ Pouco texto foi encontrado para o tamanho deste PDF. Isso costuma acontecer quando o documento tem texto convertido em contorno vetorial ou é feito de imagens (comum em exportações do Canva/Figma) — nesses casos não há texto selecionável para extrair. Confira se dá para selecionar o texto no seu leitor de PDF normal.
        </div>
      )}

      {markdown && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              onClick={copy}
              style={{ background: copied ? "#10b981" : "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 500, color: copied ? "#fff" : "var(--text-muted)", cursor: "pointer", transition: "all 0.2s" }}
            >
              {copied ? "✓ Copiado!" : "Copiar Markdown"}
            </button>
            <button
              onClick={downloadMd}
              style={{ background: "var(--accent)", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}
            >
              ↓ Baixar .md
            </button>
          </div>
          <textarea
            readOnly
            value={markdown}
            style={{
              width: "100%",
              height: 560,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 16,
              color: "var(--text)",
              fontSize: 13,
              lineHeight: 1.8,
              resize: "vertical",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          />
        </div>
      )}
    </div>
  );
}
