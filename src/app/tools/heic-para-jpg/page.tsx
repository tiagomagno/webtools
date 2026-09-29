import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import FormatConverter from "../../components/FormatConverter";

const DESCRIPTION =
  "Converta fotos HEIC/HEIF (formato padrão do iPhone) para JPG (JPEG) no navegador, sem upload e sem cadastro.";

export const metadata = toolMetadata({
  slug: "heic-para-jpg",
  title: "Converter HEIC para JPG Online — Grátis e Sem Upload",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é HEIC?", a: "É o formato de imagem padrão usado pelo iPhone (iOS 11+) desde 2017. Ele comprime melhor que o JPG, mas tem suporte limitado fora do ecossistema Apple." },
  { q: "Por que minhas fotos do iPhone não abrem no Windows/Android?", a: "Muitos programas e sites ainda não leem HEIC nativamente. Converter para JPG resolve a compatibilidade." },
  { q: "A qualidade da imagem é mantida?", a: "Sim, a conversão preserva a resolução original. Você também pode ajustar a qualidade do JPG gerado." },
  { q: "A foto é enviada para algum servidor?", a: "Não. A decodificação e a conversão acontecem inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="heic-para-jpg"
      emoji="📱"
      title="HEIC para JPG"
      heroDescription={
        <>
          Converta fotos <strong style={{ color: "var(--text)" }}>HEIC/HEIF do iPhone para JPG</strong> com
          controle de qualidade. Tudo no navegador, sem upload.
        </>
      }
      schemaName="Conversor HEIC para JPG"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter HEIC para JPG",
        body: <p>Arraste sua foto HEIC ou HEIF, ajuste a qualidade desejada e baixe o JPG resultante. A conversão acontece localmente, sem enviar a imagem para nenhum servidor.</p>,
      }}
      faq={FAQ}
      related={["jpg-para-png", "compressor-imagem", "image-converter"]}
      ctaText="Precisa de mais ferramentas de imagem?"
    >
      <FormatConverter to="image/jpeg" accept="image/heic,image/heif,.heic,.heif" showQuality hint="Saída: JPG · Aceita HEIC e HEIF" />
    </ToolPage>
  );
}
