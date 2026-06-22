import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import LineSorter from "./LineSorter";

const DESCRIPTION = "Ordene linhas de texto em ordem alfabética (A→Z ou Z→A), por comprimento, de forma aleatória ou remova duplicatas. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "ordenador-linhas",
  title: "Ordenador de Linhas Online — Ordene Listas A→Z, Aleatório ou por Comprimento",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "A ordenação suporta português?", a: "Sim. Utilizamos localCompare com locale pt-BR, então ã, é e ç são ordenados corretamente." },
  { q: "Posso remover duplicatas ao mesmo tempo?", a: "Use o modo 'Remover duplicatas' — ele elimina linhas repetidas e mantém a primeira ocorrência de cada uma." },
  { q: "A ordenação aleatória é justa?", a: "Sim. Usamos o algoritmo Fisher-Yates com embaralhamento uniform." },
];

export default function Page() {
  return (
    <ToolPage
      slug="ordenador-linhas"
      emoji="↕️"
      title="Ordenador de Linhas"
      heroDescription={<>Ordene listas <strong style={{ color: "var(--text)" }}>A→Z, Z→A, por comprimento</strong> ou de forma aleatória em um clique.</>}
      schemaName="Ordenador de Linhas"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Quando usar o ordenador", body: <p>Ideal para organizar listas de nomes, palavras-chave, URLs ou qualquer conjunto de itens separados por linha. Também remove duplicatas com um clique.</p> }}
      faq={FAQ}
      related={["removedor-linhas", "contador-linhas", "inversor-texto"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <LineSorter />
    </ToolPage>
  );
}
