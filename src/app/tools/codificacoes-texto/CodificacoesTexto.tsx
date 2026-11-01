"use client";

import { LockKey, Numpad, WaveSquare } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import NumberToWords from "./NumberToWords";
import MorseTool from "./MorseTool";
import CaesarCipher from "./CaesarCipher";

export default function CodificacoesTexto() {
  return (
    <ToolTabs
      label="Codificações de Texto"
      tabs={[
        { id: "extenso", label: "Número por extenso", icon: Numpad, content: <NumberToWords /> },
        { id: "morse", label: "Morse", icon: WaveSquare, content: <MorseTool /> },
        { id: "cesar", label: "Cifra de César", icon: LockKey, content: <CaesarCipher /> },
      ]}
    />
  );
}
