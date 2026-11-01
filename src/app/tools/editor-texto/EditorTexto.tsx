"use client";

import { ArrowsLeftRight, Broom, LinkSimple, SortAscending, TextAUnderline, TextAa } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import TextFormatter from "./TextFormatter";
import TextInverter from "./TextInverter";
import AccentRemover from "./AccentRemover";
import LineSorter from "./LineSorter";
import TextCleaner from "./TextCleaner";
import SlugTool from "./SlugTool";

export default function EditorTexto() {
  return (
    <ToolTabs
      label="Editor de Texto"
      tabs={[
        { id: "caixa", label: "Caixa e formato", icon: TextAa, content: <TextFormatter /> },
        { id: "inverter", label: "Inverter", icon: ArrowsLeftRight, content: <TextInverter /> },
        { id: "acentos", label: "Remover acentos", icon: TextAUnderline, content: <AccentRemover /> },
        { id: "ordenar", label: "Ordenar linhas", icon: SortAscending, content: <LineSorter /> },
        { id: "limpeza", label: "Limpeza e regex", icon: Broom, content: <TextCleaner /> },
        { id: "slug", label: "Slug", icon: LinkSimple, content: <SlugTool /> },
      ]}
    />
  );
}
