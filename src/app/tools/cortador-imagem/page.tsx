import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import ImageCropper from "./ImageCropper";

const DESCRIPTION =
  "Recorte imagens online com seleção interativa e proporções fixas (1:1, 16:9, 4:3). Exporte em PNG, JPG ou WebP. Tudo no navegador, sem upload.";

export const metadata = toolMetadata({
  slug: "cortador-imagem",
  title: "Cortar Imagem Online — Recorte com Proporção Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como recortar a imagem?", a: "Arraste a caixa de seleção sobre a imagem e ajuste o tamanho pelas alças nos cantos. Depois clique em Recortar para gerar e baixar o resultado." },
  { q: "Posso fixar uma proporção?", a: "Sim. Escolha entre Livre, 1:1, 16:9, 4:3 ou 3:2. Com uma proporção fixa, a altura acompanha a largura automaticamente ao redimensionar a seleção." },
  { q: "O recorte perde qualidade?", a: "Não. O recorte usa os pixels originais na resolução real da imagem — a área selecionada é exportada sem reescala, exportando em PNG sem perdas se preferir." },
  { q: "Funciona no celular?", a: "Sim. A seleção responde a toque, então você pode mover e redimensionar o recorte com o dedo." },
  { q: "A imagem é enviada para servidores?", a: "Não. Todo o recorte é feito localmente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="cortador-imagem"
      emoji="✂️"
      title="Cortador de Imagem"
      heroDescription={
        <>
          Recorte imagens com <strong style={{ color: "var(--text)" }}>seleção interativa</strong> e proporções fixas
          (1:1, 16:9, 4:3). Arraste, ajuste e baixe em PNG, JPG ou WebP.
        </>
      }
      schemaName="Cortador de Imagem"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como cortar uma imagem",
        body: (
          <p>
            Carregue a imagem e posicione a caixa de recorte arrastando-a; use as alças dos cantos para redimensionar.
            Selecione uma proporção fixa quando precisar de um formato específico (por exemplo 1:1 para avatares ou 16:9
            para capas). Clique em <strong>Recortar</strong> e baixe o resultado, processado localmente.
          </p>
        ),
      }}
      faq={FAQ}
      related={["redimensionador-imagem", "compressor-imagem", "gerador-favicon"]}
      ctaText="Precisa de mais ferramentas de imagem?"
    >
      <ImageCropper />
    </ToolPage>
  );
}
