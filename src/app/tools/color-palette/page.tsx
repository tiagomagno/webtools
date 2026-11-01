import { toolMetadata } from "../../lib/seo";
import ColorPaletteTool from "./ColorPaletteTool";

export const metadata = toolMetadata({
  slug: "color-palette",
  title: "Gerador de Paleta de Cores Online — Roda de Cores, Imagem e Harmonias",
  description:
    "Crie paletas de 5 cores a partir de uma cor base, de uma imagem ou da roda de cores, com harmonias prontas, exportação em CSS, Tailwind e JSON. Grátis e sem upload.",
  keywords: ["paleta de cores", "gerador de paleta", "roda de cores", "harmonia de cores", "extrair cores de imagem"],
});

export default function Page() {
  return <ColorPaletteTool />;
}
