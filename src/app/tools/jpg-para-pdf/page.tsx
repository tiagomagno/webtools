import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import JpgToPdf from "./JpgToPdf";

const DESCRIPTION =
  "Converta imagens JPG e PNG em um único PDF, ordenando as páginas e escolhendo tamanho A4 ou ajuste à imagem. Tudo no navegador, sem upload.";

export const metadata = toolMetadata({
  slug: "jpg-para-pdf",
  title: "JPG para PDF Online — Converter Imagens em PDF Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Posso juntar várias imagens em um PDF?", a: "Sim. Adicione quantas imagens quiser; cada uma vira uma página do PDF, na ordem que você definir com as setas." },
  { q: "Posso reordenar as imagens?", a: "Sim. Use as setas ↑ e ↓ em cada miniatura para mudar a ordem antes de gerar o PDF." },
  { q: "Qual a diferença entre 'Ajustar à imagem' e 'A4'?", a: "'Ajustar à imagem' cria cada página com o tamanho exato da imagem. 'A4' usa páginas A4 (retrato ou paisagem) e centraliza a imagem, ideal para impressão." },
  { q: "Aceita PNG além de JPG?", a: "Sim. JPG e PNG são suportados; a transparência do PNG é preservada quando possível." },
  { q: "As imagens são enviadas para servidores?", a: "Não. O PDF é montado inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="jpg-para-pdf"
      emoji="📄"
      title="JPG para PDF"
      heroDescription={
        <>
          Junte imagens <strong style={{ color: "var(--text)" }}>JPG e PNG em um único PDF</strong>, reordene as
          páginas e escolha A4 ou ajuste à imagem. Tudo no navegador, sem upload.
        </>
      }
      schemaName="Conversor JPG para PDF"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter imagens em PDF",
        body: (
          <p>
            Arraste suas imagens (pode selecionar várias de uma vez), reordene-as com as setas e escolha o tamanho da
            página. Cada imagem se torna uma página do PDF. Clique em <strong>Gerar PDF</strong> para baixar o arquivo
            final, montado localmente sem enviar nada para a internet.
          </p>
        ),
      }}
      faq={FAQ}
      related={["pdf-para-jpg", "unir-pdf", "compressor-imagem"]}
      ctaText="Precisa de mais ferramentas de PDF?"
    >
      <JpgToPdf />
    </ToolPage>
  );
}
