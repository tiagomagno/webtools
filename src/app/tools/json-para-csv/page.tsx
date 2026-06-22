import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CsvJsonTool from "../../components/CsvJsonTool";

const DESCRIPTION =
  "Converta JSON em CSV online, a partir de um array de objetos, com escolha de delimitador. Copie ou baixe o arquivo. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "json-para-csv",
  title: "Converter JSON para CSV Online — Grátis e Sem Upload",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Que formato de JSON é aceito?", a: "Um array de objetos (cada objeto vira uma linha) ou um array de arrays. As colunas são a união de todas as chaves encontradas, na ordem de primeira ocorrência." },
  { q: "O que acontece com valores aninhados?", a: "Objetos e arrays dentro de uma célula são serializados como texto JSON e escapados entre aspas, preservando o conteúdo." },
  { q: "Posso escolher o separador?", a: "Sim. Selecione vírgula, ponto e vírgula, tabulação ou pipe — útil para abrir o CSV no Excel em português." },
  { q: "Campos com vírgulas ou aspas são tratados?", a: "Sim. Valores com delimitador, aspas ou quebra de linha são automaticamente colocados entre aspas e escapados conforme o padrão CSV." },
  { q: "Os dados são enviados para servidores?", a: "Não. A conversão é feita inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="json-para-csv"
      emoji="🔄"
      title="JSON para CSV"
      heroDescription={
        <>
          Converta <strong style={{ color: "var(--text)" }}>JSON em CSV</strong> a partir de um array de objetos, com
          escolha de delimitador. Pronto para abrir no Excel ou Google Sheets.
        </>
      }
      schemaName="Conversor JSON para CSV"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter JSON em CSV",
        body: <p>Cole um array de objetos JSON no campo da esquerda e escolha o delimitador. O CSV é gerado instantaneamente à direita, com cabeçalho montado a partir das chaves. Copie ou baixe o resultado — tudo processado localmente.</p>,
      }}
      faq={FAQ}
      related={["csv-para-json", "json-formatter", "json-validator"]}
      ctaText="Precisa de mais ferramentas de dados?"
    >
      <CsvJsonTool mode="json2csv" />
    </ToolPage>
  );
}
