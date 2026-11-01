import { toolMetadata } from "../../lib/seo";
import ImageEditor from "./ImageEditor";

const DESCRIPTION =
  "Redimensione, corte, aumente a resolução, comprima e converta imagens (PNG, JPG, WebP, HEIC e Base64) em um só lugar. Tudo no navegador, sem upload e sem cadastro.";

export const metadata = toolMetadata({
  slug: "editor-imagem",
  title: "Editor e Conversor de Imagens Online — Redimensionar, Cortar, Comprimir e Converter",
  description: DESCRIPTION,
  keywords: ["editor de imagem", "conversor de imagens", "redimensionar imagem", "cortar imagem", "comprimir imagem", "jpg para png", "heic para jpg", "imagem para base64"],
});

export default function Page() {
  return <ImageEditor />;
}
