import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import EditorTexto from "./EditorTexto";

const DESCRIPTION = "Transforme texto para MAIÚSCULAS, camelCase e snake_case, inverta, remova acentos, ordene linhas, limpe com regex e gere slugs amigáveis para URL.";

export const metadata = toolMetadata({
  slug: "editor-texto",
  title: "Editor de Texto Online — Maiúsculas, Acentos, Ordenar Linhas e Slug",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="editor-texto"
      title="Editor de Texto"
      heroDescription={<>Transforme texto: <strong style={{ color: "var(--text)" }}>caixa alta e baixa, inverter, remover acentos, ordenar linhas</strong>, limpar com regex e gerar slugs.</>}
      schemaName="Editor de Texto"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["analisador-texto", "codificacoes-texto"]}
    >
      <EditorTexto />
    </ToolPage>
  );
}
