import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import FormatConverter from "../../components/FormatConverter";

const DESCRIPTION =
  "Converta imagens JPG (JPEG) para PNG no navegador, mantendo a qualidade. Sem upload, sem marca d'água e sem cadastro.";

export const metadata = toolMetadata({
  slug: "jpg-para-png",
  title: "Converter JPG para PNG Online — Grátis e Sem Upload",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Por que converter JPG para PNG?", a: "O PNG usa compressão sem perdas e suporta transparência. É ideal quando você precisa editar a imagem sem acumular perdas ou colocá-la sobre fundos variados." },
  { q: "A conversão melhora a qualidade?", a: "Não cria detalhes que não existem: o PNG preserva exatamente o que o JPG já tinha, sem adicionar nova perda de qualidade a partir daqui." },
  { q: "O arquivo PNG fica maior?", a: "Geralmente sim. Por ser sem perdas, o PNG costuma ocupar mais espaço que o JPG equivalente, especialmente em fotos." },
  { q: "A imagem é enviada para servidores?", a: "Não. A conversão é feita inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="jpg-para-png"
      emoji="🖼️"
      title="JPG para PNG"
      heroDescription={
        <>
          Converta imagens <strong style={{ color: "var(--text)" }}>JPG para PNG</strong> mantendo a qualidade, direto
          no navegador. Sem upload e sem marca d&apos;água.
        </>
      }
      schemaName="Conversor JPG para PNG"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter JPG para PNG",
        body: <p>Arraste seu arquivo JPG, clique em converter e baixe o PNG. O processamento é local e instantâneo, sem limite de arquivos e sem enviar nada para a internet.</p>,
      }}
      faq={FAQ}
      related={["png-para-jpg", "webp-converter", "compressor-imagem"]}
      ctaText="Precisa de mais ferramentas de imagem?"
    >
      <FormatConverter to="image/png" accept="image/jpeg" hint="Saída: PNG (sem perdas)" />
    </ToolPage>
  );
}
