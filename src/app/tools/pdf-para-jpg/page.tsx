import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import PdfToJpg from "./PdfToJpg";

const DESCRIPTION =
  "Converta cada página de um PDF em imagem JPG ou PNG, escolhendo resolução e qualidade. Baixe uma a uma ou todas. Tudo no navegador, sem upload.";

export const metadata = toolMetadata({
  slug: "pdf-para-jpg",
  title: "PDF para JPG Online — Converter Páginas de PDF em Imagem",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como o PDF vira imagem?", a: "Cada página do PDF é renderizada em alta resolução e exportada como JPG ou PNG. Você baixa cada página individualmente ou todas de uma vez." },
  { q: "Posso escolher a resolução?", a: "Sim. Os multiplicadores (1×, 1,5×, 2×, 3×) aumentam a nitidez da imagem gerada — quanto maior, mais detalhada e mais pesada." },
  { q: "JPG ou PNG: qual escolher?", a: "JPG gera arquivos menores, ideal para documentos e fotos. PNG é sem perdas e preserva nitidez em textos e linhas, mas resulta em arquivos maiores." },
  { q: "Funciona com PDFs de muitas páginas?", a: "Sim, mas PDFs muito grandes consomem mais memória do navegador, já que tudo é processado localmente. Para PDFs enormes, reduza a resolução." },
  { q: "O PDF é enviado para servidores?", a: "Não. A conversão acontece inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="pdf-para-jpg"
      emoji="🖼️"
      title="PDF para JPG"
      heroDescription={
        <>
          Converta cada página de um <strong style={{ color: "var(--text)" }}>PDF em imagem JPG ou PNG</strong>, com
          escolha de resolução e qualidade. Tudo no navegador, sem upload.
        </>
      }
      schemaName="Conversor PDF para JPG"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter PDF para imagem",
        body: (
          <p>
            Arraste o PDF, escolha o formato (JPG ou PNG), a resolução e a qualidade. Cada página é renderizada e exibida
            como miniatura — clique para baixar uma página ou use <strong>Baixar todas</strong>. Ajuste as opções e use{" "}
            <strong>Reprocessar</strong> para gerar novamente sem recarregar o arquivo.
          </p>
        ),
      }}
      faq={FAQ}
      related={["jpg-para-pdf", "dividir-pdf", "compressor-imagem"]}
      ctaText="Precisa de mais ferramentas de PDF?"
    >
      <PdfToJpg />
    </ToolPage>
  );
}
