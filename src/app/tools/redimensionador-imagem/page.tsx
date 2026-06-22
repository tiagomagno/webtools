import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import ImageResizer from "./ImageResizer";

const DESCRIPTION =
  "Redimensione imagens por pixels ou porcentagem, mantendo a proporção, e exporte em PNG, JPG ou WebP. Tudo no navegador, sem upload.";

export const metadata = toolMetadata({
  slug: "redimensionador-imagem",
  title: "Redimensionar Imagem Online — Alterar Largura e Altura Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como manter a proporção da imagem?", a: "Deixe a opção 'Manter proporção' marcada. Ao alterar a largura, a altura é ajustada automaticamente (e vice-versa) para a imagem não distorcer." },
  { q: "Posso aumentar a imagem?", a: "Sim, mas ampliar acima do tamanho original reduz a nitidez, pois não há mais informação a ser exibida. Para ampliações, considere o aumentador de resolução." },
  { q: "Quais formatos posso exportar?", a: "PNG (sem perdas), JPG e WebP (com controle de qualidade). Escolha conforme o uso: PNG para qualidade, JPG/WebP para arquivos menores." },
  { q: "Há limite de tamanho de arquivo?", a: "O limite é a memória do seu navegador, já que tudo é processado localmente. Não há upload nem limite imposto por servidor." },
  { q: "A imagem é enviada para algum servidor?", a: "Não. O redimensionamento acontece inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="redimensionador-imagem"
      emoji="📐"
      title="Redimensionador de Imagem"
      heroDescription={
        <>
          Altere a <strong style={{ color: "var(--text)" }}>largura e altura</strong> de imagens por pixels ou
          porcentagem, com trava de proporção, e exporte em PNG, JPG ou WebP.
        </>
      }
      schemaName="Redimensionador de Imagem"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como redimensionar uma imagem",
        body: (
          <p>
            Arraste a imagem, informe a nova largura ou altura — ou use os atalhos de porcentagem (25%, 50%, 75%) —
            mantendo a proporção travada para evitar distorção. Escolha o formato de saída e clique em{" "}
            <strong>Redimensionar</strong> para visualizar e baixar. Todo o processamento é feito localmente.
          </p>
        ),
      }}
      faq={FAQ}
      related={["compressor-imagem", "image-upscaler", "image-converter"]}
      ctaText="Precisa de mais ferramentas de imagem?"
    >
      <ImageResizer />
    </ToolPage>
  );
}
