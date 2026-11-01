"use client";

import { DiceFive, Password, Shuffle, TextAlignLeft } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import PasswordGenerator from "./PasswordGenerator";
import LoremGenerator from "./LoremGenerator";
import AnagramaTool from "./AnagramaTool";
import Sorteador from "./Sorteador";

export default function Geradores() {
  return (
    <ToolTabs
      label="Geradores"
      tabs={[
        { id: "senha", label: "Senha", icon: Password, content: <PasswordGenerator /> },
        { id: "lorem", label: "Lorem Ipsum", icon: TextAlignLeft, content: <LoremGenerator /> },
        { id: "anagrama", label: "Anagrama", icon: Shuffle, content: <AnagramaTool /> },
        { id: "sorteio", label: "Sorteador", icon: DiceFive, content: <Sorteador /> },
      ]}
    />
  );
}
