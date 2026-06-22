import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import LineCounter from "./LineCounter";

const DESCRIPTION = "Conte linhas de texto: total, não-vazias, vazias e únicas. Ideal para código, CSV, listas e logs. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "contador-linhas",
  title: "Contador de Linhas Online — Total, Vazias e Únicas",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Para que serve contar linhas únicas?", a: "Para descobrir quantas linhas se repetem no texto — útil para detectar duplicatas em listas, CSVs ou logs." },
  { q: "O que conta como linha vazia?", a: "Qualquer linha que contenha apenas espaços, tabulações ou que esteja completamente em branco." },
  { q: "Como remover as duplicatas depois?", a: "Use a ferramenta Removedor de Linhas para eliminar duplicatas, ordenar e filtrar o conteúdo." },
];

export default function Page() {
  return (
    <ToolPage
      slug="contador-linhas"
      emoji="📋"
      title="Contador de Linhas"
      heroDescription={<>Conte linhas de texto: <strong style={{ color: "var(--text)" }}>total, não-vazias, vazias e únicas</strong> em tempo real.</>}
      schemaName="Contador de Linhas"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Quando usar o contador de linhas", body: <p>Útil para validar a quantidade de registros em um CSV, contar itens de uma lista, verificar logs ou entender a estrutura de um arquivo de texto antes de processá-lo.</p> }}
      faq={FAQ}
      related={["removedor-linhas", "ordenador-linhas", "contador-palavras"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <LineCounter />
    </ToolPage>
  );
}
