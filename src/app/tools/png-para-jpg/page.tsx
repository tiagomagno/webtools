import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import FormatConverter from "../../components/FormatConverter";

const DESCRIPTION =
  "Converta imagens PNG para JPG (JPEG) no navegador, com controle de qualidade. Áreas transparentes recebem fundo branco. Sem upload e sem cadastro.";

export const metadata = toolMetadata({
  slug: "png-para-jpg",
  title: "Converter PNG para JPG Online — Grátis e Sem Upload",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Por que converter PNG para JPG?", a: "O JPG gera arquivos bem menores, ideais para fotos e para acelerar o carregamento de páginas. É a melhor escolha quando transparência não é necessária." },
  { q: "O que acontece com a transparência?", a: "O JPG não suporta canal alfa. As áreas transparentes do PNG são preenchidas com fundo branco na conversão." },
  { q: "Posso controlar a qualidade?", a: "Sim. Use o controle deslizante para equilibrar tamanho e nitidez. Em torno de 80–90% costuma ser indistinguível do original." },
  { q: "A imagem é enviada para servidores?", a: "Não. Tudo é convertido localmente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="png-para-jpg"
      emoji="🖼️"
      title="PNG para JPG"
      heroDescription={
        <>
          Converta imagens <strong style={{ color: "var(--text)" }}>PNG para JPG</strong> com controle de qualidade.
          Transparências viram fundo branco. Tudo no navegador, sem upload.
        </>
      }
      schemaName="Conversor PNG para JPG"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter PNG para JPG",
        body: <p>Arraste seu PNG, ajuste a qualidade desejada e baixe o JPG resultante. A conversão acontece localmente, sem enviar a imagem para nenhum servidor.</p>,
      }}
      faq={FAQ}
      related={["jpg-para-png", "webp-converter", "compressor-imagem"]}
      ctaText="Precisa de mais ferramentas de imagem?"
    >
      <FormatConverter to="image/jpeg" accept="image/png" showQuality hint="Saída: JPG (fundo branco)" />
    </ToolPage>
  );
}
