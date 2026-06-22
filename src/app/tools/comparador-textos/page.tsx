import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import TextCompare from "./TextCompare";

const DESCRIPTION =
  "Compare dois textos lado a lado e veja as diferenças linha a linha: o que foi adicionado, removido ou mantido. Grátis, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "comparador-textos",
  title: "Comparador de Textos Online — Diferenças Linha a Linha",
  description: DESCRIPTION,
});

const FAQ = [
  {
    q: "Como a comparação funciona?",
    a: "Usamos o algoritmo LCS (maior subsequência comum) para alinhar as linhas dos dois textos e destacar adições (verde), remoções (vermelho) e linhas inalteradas.",
  },
  {
    q: "A comparação é por linha ou por palavra?",
    a: "A comparação é feita linha a linha, o formato mais usado para revisar versões de documentos, código ou listas.",
  },
  {
    q: "Posso comparar textos grandes?",
    a: "Sim. Como tudo roda no navegador, você pode comparar textos longos sem enviar nada para servidores.",
  },
  {
    q: "Serve para comparar código?",
    a: "Sim, funciona bem para trechos de código, configurações e qualquer texto em que a ordem das linhas importa.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="comparador-textos"
      emoji="🔀"
      title="Comparador de Textos"
      heroDescription={
        <>
          Compare dois textos e veja as <strong style={{ color: "var(--text)" }}>diferenças linha a linha</strong>,
          com destaque para o que foi adicionado, removido ou mantido.
        </>
      }
      schemaName="Comparador de Textos"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como comparar dois textos",
        body: (
          <p>
            Cole o texto original à esquerda e o modificado à direita. O resultado mostra cada linha marcada com
            + (adicionada), − (removida) ou sem marca (igual), junto com um resumo das contagens. É ideal para
            revisar versões de documentos, contratos, traduções ou código.
          </p>
        ),
      }}
      faq={FAQ}
      related={["text-cleaner", "json-diff", "removedor-linhas"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <TextCompare />
    </ToolPage>
  );
}
