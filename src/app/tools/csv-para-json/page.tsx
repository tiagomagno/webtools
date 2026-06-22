import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CsvJsonTool from "../../components/CsvJsonTool";

const DESCRIPTION =
  "Converta CSV em JSON online, com escolha de delimitador e cabeçalho, inferindo números e booleanos. Copie ou baixe. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "csv-para-json",
  title: "Converter CSV para JSON Online — Grátis e Sem Upload",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como o CSV é transformado em JSON?", a: "Com a opção de cabeçalho ativa, cada linha vira um objeto cujas chaves são as colunas do cabeçalho. Sem cabeçalho, cada linha vira um array de valores." },
  { q: "Números e true/false são convertidos?", a: "Sim. Valores numéricos viram números e 'true'/'false' viram booleanos automaticamente. Strings com zeros à esquerda são mantidas como texto." },
  { q: "Posso usar ponto e vírgula como separador?", a: "Sim. Escolha o delimitador (vírgula, ponto e vírgula, tabulação ou pipe) conforme o seu arquivo — útil para CSVs em português exportados do Excel." },
  { q: "Lida com vírgulas dentro de aspas?", a: "Sim. O parser segue o padrão RFC 4180, respeitando campos entre aspas, aspas escapadas e quebras de linha internas." },
  { q: "Os dados são enviados para servidores?", a: "Não. A conversão acontece inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="csv-para-json"
      emoji="🔄"
      title="CSV para JSON"
      heroDescription={
        <>
          Converta <strong style={{ color: "var(--text)" }}>CSV em JSON</strong> com escolha de delimitador e
          cabeçalho, inferindo números e booleanos automaticamente.
        </>
      }
      schemaName="Conversor CSV para JSON"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter CSV em JSON",
        body: <p>Cole ou edite o CSV no campo da esquerda, ajuste o delimitador e se a primeira linha é cabeçalho. O JSON aparece na hora à direita, pronto para copiar ou baixar. Tudo é processado localmente.</p>,
      }}
      faq={FAQ}
      related={["json-para-csv", "json-formatter", "json-validator"]}
      ctaText="Precisa de mais ferramentas de dados?"
    >
      <CsvJsonTool mode="csv2json" />
    </ToolPage>
  );
}
