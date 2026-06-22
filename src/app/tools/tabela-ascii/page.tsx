import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import AsciiTable from "./AsciiTable";

const DESCRIPTION = "Tabela ASCII completa (0–127) e ASCII estendido (128–255) com decimal, hexadecimal, binário e caractere. Filtre e copie qualquer valor. Grátis.";

export const metadata = toolMetadata({
  slug: "tabela-ascii",
  title: "Tabela ASCII Completa Online — Decimal, Hex, Binário e Caractere",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é ASCII?", a: "ASCII (American Standard Code for Information Interchange) é um padrão de codificação de caracteres que mapeia letras, números e símbolos a valores numéricos de 0 a 127." },
  { q: "Qual a diferença entre ASCII e ASCII estendido?", a: "ASCII padrão vai de 0 a 127. ASCII estendido (128–255) adiciona caracteres especiais, acentuados e símbolos, mas pode variar conforme o sistema." },
  { q: "Como usar a tabela?", a: "Use o campo de busca para filtrar por caractere, decimal ou hexadecimal. Clique em qualquer linha para copiar o caractere." },
];

export default function Page() {
  return (
    <ToolPage
      slug="tabela-ascii"
      emoji="🔣"
      title="Tabela ASCII"
      heroDescription={<>Consulte a <strong style={{ color: "var(--text)" }}>tabela ASCII completa</strong> com decimal, hex, binário e caractere — filtre e copie com um clique.</>}
      schemaName="Tabela ASCII"
      schemaDescription={DESCRIPTION}
      content={{ heading: "O que é a tabela ASCII?", body: <p>ASCII é o padrão que define a representação numérica de 128 caracteres (0–127): letras, números, pontuação e caracteres de controle. É a base da maioria das codificações de texto modernas, incluindo UTF-8.</p> }}
      faq={FAQ}
      related={["conversor-bases", "base64-encode", "hash-generator"]}
      ctaText="Precisa de mais ferramentas de Dev?"
    >
      <AsciiTable />
    </ToolPage>
  );
}
