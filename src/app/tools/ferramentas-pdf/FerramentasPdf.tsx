"use client";

import { FileJpg, FilePdf, FileZip, Files, Scissors } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import MergePdf from "./MergePdf";
import SplitPdf from "./SplitPdf";
import PdfCompressor from "./PdfCompressor";
import JpgToPdf from "./JpgToPdf";
import PdfToJpg from "./PdfToJpg";

export default function FerramentasPdf() {
  return (
    <ToolTabs
      label="Ferramentas de PDF"
      tabs={[
        { id: "unir", label: "Unir", icon: Files, content: <MergePdf /> },
        { id: "dividir", label: "Dividir", icon: Scissors, content: <SplitPdf /> },
        { id: "comprimir", label: "Comprimir", icon: FileZip, content: <PdfCompressor /> },
        { id: "jpg-para-pdf", label: "JPG para PDF", icon: FilePdf, content: <JpgToPdf /> },
        { id: "pdf-para-jpg", label: "PDF para JPG", icon: FileJpg, content: <PdfToJpg /> },
      ]}
    />
  );
}
