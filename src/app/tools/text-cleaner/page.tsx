import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import TextCleaner from "./TextCleaner";

export const metadata = toolMetadata({
  slug: "text-cleaner",
  title: "Limpeza de Texto e Removedor de Linhas — Regex e Operações Rápidas",
  description: "Limpe textos com regras Regex, substituições em massa, remova linhas vazias, duplicadas e ordene o resultado.",
});

export default function TextCleanerPage() {
  return (
    <ToolPage
      slug="text-cleaner"
      emoji="✂️"
      title="Limpeza de Texto"
      heroDescription={
        <>
          Cole um texto, defina regras de substituição, <strong style={{ color: "var(--text)" }}>remova linhas duplicadas/vazias</strong> e veja o resultado em tempo real.
        </>
      }
      schemaName="Limpeza de Texto"
      schemaDescription="Limpe textos com regras Regex, substituições em massa, remova linhas vazias, duplicadas e ordene o resultado."
      faq={[]}
    >
      <TextCleaner />
    </ToolPage>
  );
}
