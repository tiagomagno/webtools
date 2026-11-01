"use client";

import { FileHtml, FileText } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import PdfExtractor from "./PdfExtractor";
import DocumentoParaMarkdown from "./DocumentoParaMarkdown";

export default function ExtratorDocumentos() {
  return (
    <ToolTabs
      label="Extrator de Documentos"
      tabs={[
        { id: "texto", label: "Extrair texto", icon: FileText, content: <PdfExtractor /> },
        { id: "markdown", label: "Converter para Markdown", icon: FileHtml, content: <DocumentoParaMarkdown /> },
      ]}
    />
  );
}
