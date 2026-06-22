import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import FormatConverter from "../../components/FormatConverter";

const DESCRIPTION =
  "Converta imagens JPG e PNG para WebP no navegador, com controle de qualidade. WebP gera arquivos menores para a web. Sem upload e sem cadastro.";

export const metadata = toolMetadata({
  slug: "webp-converter",
  title: "Converter para WebP Online — JPG e PNG para WebP Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é WebP?", a: "É um formato de imagem do Google que oferece compressão superior ao JPG e ao PNG, gerando arquivos menores com qualidade equivalente. É amplamente suportado por navegadores modernos." },
  { q: "Quanto o WebP reduz o tamanho?", a: "Em média, o WebP gera arquivos 25–35% menores que o JPG e bem menores que o PNG, mantendo a qualidade visual." },
  { q: "WebP suporta transparência?", a: "Sim. Diferente do JPG, o WebP suporta canal alfa, então transparências do PNG são preservadas." },
  { q: "Todos os navegadores abrem WebP?", a: "Os navegadores modernos (Chrome, Edge, Firefox, Safari recentes) suportam WebP nativamente. Para compatibilidade total com sistemas antigos, mantenha um fallback em JPG/PNG." },
  { q: "A imagem é enviada para servidores?", a: "Não. A conversão é feita inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="webp-converter"
      emoji="🖼️"
      title="Conversor WebP"
      heroDescription={
        <>
          Converta imagens <strong style={{ color: "var(--text)" }}>JPG e PNG para WebP</strong> com controle de
          qualidade e arquivos bem menores para a web. Tudo no navegador, sem upload.
        </>
      }
      schemaName="Conversor para WebP"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter para WebP",
        body: <p>Arraste uma imagem JPG ou PNG, ajuste a qualidade e baixe o WebP. O formato reduz bastante o peso das imagens, melhorando o desempenho de sites sem perda perceptível de qualidade.</p>,
      }}
      faq={FAQ}
      related={["jpg-para-png", "png-para-jpg", "compressor-imagem"]}
      ctaText="Precisa de mais ferramentas de imagem?"
    >
      <FormatConverter to="image/webp" accept="image/*" showQuality hint="Saída: WebP (menor peso)" />
    </ToolPage>
  );
}
