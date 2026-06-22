import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import AccentRemover from "./AccentRemover";

const DESCRIPTION = "Remova acentos e caracteres especiais do português (ã, é, ç, õ, ü) de qualquer texto. Ideal para slugs, banco de dados e sistemas legados. Grátis.";

export const metadata = toolMetadata({
  slug: "removedor-acentos",
  title: "Removedor de Acentos Online — Limpe ã, é, ç, õ de Textos",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quais caracteres são removidos?", a: "Todos os diacríticos do Unicode: acentos agudos, graves, circunflexos, til, cedilha, trema e afins. Letras latinas básicas (a-z) permanecem." },
  { q: "Para que serve remover acentos?", a: "Sistemas legados e alguns bancos de dados não aceitam caracteres acentuados. Também é útil para gerar slugs de URL sem encode." },
  { q: "Posso usar para criar slugs?", a: "Sim, mas a ferramenta Texto para Slug faz esse processo completo: remove acentos, passa para minúsculas e substitui espaços por hífens." },
];

export default function Page() {
  return (
    <ToolPage
      slug="removedor-acentos"
      emoji="✂️"
      title="Removedor de Acentos"
      heroDescription={<>Remova <strong style={{ color: "var(--text)" }}>ã, é, ç, õ, ü</strong> e todos os diacríticos do seu texto instantaneamente.</>}
      schemaName="Removedor de Acentos"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como o removedor funciona", body: <p>O texto é normalizado via Unicode NFD, separando cada letra base de seus diacríticos. Os diacríticos são então removidos com expressão regular, retornando apenas os caracteres base ASCII.</p> }}
      faq={FAQ}
      related={["texto-para-slug", "formatador-texto", "contador-caracteres"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <AccentRemover />
    </ToolPage>
  );
}
