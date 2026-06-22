import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import SplitPdf from "./SplitPdf";

const DESCRIPTION =
  "Divida um PDF extraindo intervalos de páginas ou separando cada página em um arquivo. Tudo no navegador, sem upload e sem cadastro.";

export const metadata = toolMetadata({
  slug: "dividir-pdf",
  title: "Dividir PDF Online — Extrair e Separar Páginas Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como extrair páginas específicas?", a: "No modo 'Extrair intervalo', informe as páginas no formato 1-3, 5, 8-10. As páginas escolhidas são reunidas em um único PDF na ordem indicada." },
  { q: "Posso separar cada página em um arquivo?", a: "Sim. No modo 'Cada página um PDF', a ferramenta gera um arquivo por página automaticamente." },
  { q: "Os números de página começam em 1?", a: "Sim. A primeira página é a 1. Intervalos fora do total disponível são marcados como inválidos." },
  { q: "A qualidade do PDF é mantida?", a: "Sim. As páginas são copiadas sem recompressão, preservando texto, fontes e imagens originais." },
  { q: "O PDF é enviado para servidores?", a: "Não. Toda a divisão acontece localmente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="dividir-pdf"
      emoji="✂️"
      title="Dividir PDF"
      heroDescription={
        <>
          Extraia <strong style={{ color: "var(--text)" }}>intervalos de páginas</strong> ou separe cada página em um
          arquivo. Tudo no navegador, sem upload e sem marca d&apos;água.
        </>
      }
      schemaName="Dividir PDF"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como dividir um PDF",
        body: (
          <p>
            Carregue o PDF e escolha o modo: <strong>Extrair intervalo</strong> para reunir páginas específicas (ex.:
            <code> 1-3, 5, 8-10</code>) em um novo arquivo, ou <strong>Cada página um PDF</strong> para separar todas as
            páginas individualmente. Clique no botão para gerar e baixar os arquivos, processados localmente.
          </p>
        ),
      }}
      faq={FAQ}
      related={["unir-pdf", "pdf-para-jpg", "pdf-extractor"]}
      ctaText="Precisa de mais ferramentas de PDF?"
    >
      <SplitPdf />
    </ToolPage>
  );
}
