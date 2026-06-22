import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import ImageCompressor from "./ImageCompressor";

const DESCRIPTION =
  "Comprima imagens JPG, PNG e WebP no navegador, ajustando qualidade e largura máxima. Veja o tamanho antes e depois e baixe. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "compressor-imagem",
  title: "Compressor de Imagem Online — Reduzir Tamanho JPG, PNG e WebP",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como a compressão funciona?", a: "A imagem é redesenhada e recodificada no formato escolhido com o nível de qualidade definido. Reduzir a qualidade ou a largura máxima diminui o tamanho do arquivo." },
  { q: "Qual formato comprime melhor?", a: "O WebP costuma gerar arquivos menores que o JPG com qualidade equivalente. Use JPG quando precisar de compatibilidade máxima e WebP para a web moderna." },
  { q: "A compressão perde qualidade?", a: "JPG e WebP são formatos com perdas. Em torno de 70–80% de qualidade o resultado costuma ser visualmente idêntico ao original com bem menos bytes." },
  { q: "Posso reduzir as dimensões da imagem?", a: "Sim. Informe a largura máxima em pixels; a altura é ajustada proporcionalmente. Imagens menores que o limite não são ampliadas." },
  { q: "Minhas imagens são enviadas para algum servidor?", a: "Não. Todo o processamento acontece no seu navegador, sem upload." },
];

export default function Page() {
  return (
    <ToolPage
      slug="compressor-imagem"
      emoji="🗜️"
      title="Compressor de Imagem"
      heroDescription={
        <>
          Reduza o tamanho de imagens <strong style={{ color: "var(--text)" }}>JPG, PNG e WebP</strong> ajustando
          qualidade e largura máxima. Compare antes e depois e baixe o arquivo otimizado.
        </>
      }
      schemaName="Compressor de Imagem"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como comprimir uma imagem",
        body: (
          <p>
            Arraste a imagem, escolha o formato de saída (JPG ou WebP), ajuste o controle de qualidade e, se quiser,
            defina uma largura máxima para reduzir as dimensões. Clique em <strong>Comprimir</strong> para ver o novo
            tamanho e a economia percentual, então baixe o resultado. Tudo acontece localmente, sem enviar a imagem
            para nenhum servidor.
          </p>
        ),
      }}
      faq={FAQ}
      related={["image-converter", "image-upscaler", "open-graph-preview"]}
      ctaText="Precisa de mais ferramentas de imagem?"
    >
      <ImageCompressor />
    </ToolPage>
  );
}
