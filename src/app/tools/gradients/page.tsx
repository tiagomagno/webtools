import { toolMetadata } from "../../lib/seo";
import GradientTool from "./GradientTool";

export const metadata = toolMetadata({
  slug: "gradients",
  title: "Gerador de Gradientes CSS Online — Linear, Radial, Cônico e Animado",
  description:
    "Crie gradientes CSS lineares, radiais e cônicos com mistura OKLCH, cortes secos, transparência e animações. Exporte em CSS, Tailwind, SVG ou PNG. Grátis e sem upload.",
  keywords: ["gerador de gradiente", "gradiente css", "gradiente animado", "oklch", "conic gradient", "gradiente tailwind"],
});

export default function Page() {
  return <GradientTool />;
}
