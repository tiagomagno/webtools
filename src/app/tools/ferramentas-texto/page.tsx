import { toolMetadata } from "@/app/lib/seo";
import TextToolsHub from "./TextToolsHub";

export const metadata = toolMetadata({
  slug: "ferramentas-texto",
  title: "Ferramentas de Texto Online — Análise, Formatação e Geração",
  description: "14 ferramentas de texto reunidas: contador de palavras, comparador, formatador, inversor, removedor de acentos, ordenador de linhas, lorem ipsum, cifra de César, código Morse e muito mais.",
});

export default function Page() {
  return <TextToolsHub />;
}
