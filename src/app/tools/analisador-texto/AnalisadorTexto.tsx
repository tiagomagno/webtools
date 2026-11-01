"use client";

import { ChartBar, ListNumbers, TextAa } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import WordCounter from "./WordCounter";
import LineCounter from "./LineCounter";
import LetterFrequency from "./LetterFrequency";

export default function AnalisadorTexto() {
  return (
    <ToolTabs
      label="Analisador de Texto"
      tabs={[
        { id: "palavras", label: "Palavras e caracteres", icon: TextAa, content: <WordCounter /> },
        { id: "linhas", label: "Linhas", icon: ListNumbers, content: <LineCounter /> },
        { id: "frequencia", label: "Frequência de letras", icon: ChartBar, content: <LetterFrequency /> },
      ]}
    />
  );
}
