import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import SqlFormatter from "./SqlFormatter";

const DESCRIPTION =
  "Formate consultas SQL online: quebra de cláusulas, indentação e palavras-chave em maiúsculas. Grátis, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "sql-formatter",
  title: "SQL Formatter Online — Formatar e Identar Consultas SQL",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como o SQL Formatter funciona?", a: "Ele coloca em maiúsculas as palavras-chave (SELECT, FROM, WHERE, JOIN...), quebra as cláusulas principais em novas linhas e indenta a lista de colunas e os operadores AND/OR." },
  { q: "Suporta qualquer dialeto SQL?", a: "É um formatador leve focado nas cláusulas mais comuns (MySQL, PostgreSQL, SQL Server). Consultas muito complexas podem precisar de ajustes manuais." },
  { q: "Ele altera o resultado da minha query?", a: "Não. Apenas reorganiza espaços e capitalização das palavras-chave; a lógica da consulta permanece a mesma." },
  { q: "Minha query é enviada para servidores?", a: "Não. Todo o processamento é feito localmente no navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="sql-formatter"
      emoji="🗄️"
      title="SQL Formatter"
      heroDescription={
        <>
          Formate consultas SQL com <strong style={{ color: "var(--text)" }}>quebra de cláusulas, indentação e
          palavras-chave em maiúsculas</strong> para deixar suas queries legíveis.
        </>
      }
      schemaName="SQL Formatter"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como formatar SQL online",
        body: <p>Cole sua consulta e clique em Formatar. Útil para revisar queries copiadas de logs ou de uma linha só, deixando SELECT, FROM, WHERE e JOIN organizados e fáceis de ler.</p>,
      }}
      faq={FAQ}
      related={["json-formatter", "base64-encode", "hash-generator"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <SqlFormatter />
    </ToolPage>
  );
}
