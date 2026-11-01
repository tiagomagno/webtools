"use client";

import { QrCode, Scan } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import QrGenerator from "./QrGenerator";
import QrReader from "./QrReader";

export default function QrCodeTool() {
  return (
    <ToolTabs
      label="QR Code"
      tabs={[
        { id: "gerar", label: "Gerar", icon: QrCode, content: <QrGenerator /> },
        { id: "ler", label: "Ler", icon: Scan, content: <QrReader /> },
      ]}
    />
  );
}
