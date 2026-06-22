import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import TimestampTool from "./TimestampTool";

const DESCRIPTION =
  "Converta timestamp Unix em data e data em timestamp, em segundos ou milissegundos, com fuso local, UTC e ISO 8601. Grátis e instantâneo.";

export const metadata = toolMetadata({
  slug: "unix-timestamp",
  title: "Conversor de Timestamp Unix Online — Timestamp para Data",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é um timestamp Unix?", a: "É o número de segundos decorridos desde 1º de janeiro de 1970 (UTC), chamado de época Unix. É amplamente usado em programação e bancos de dados para representar datas." },
  { q: "Qual a diferença entre segundos e milissegundos?", a: "O timestamp Unix tradicional é em segundos. JavaScript e muitas APIs usam milissegundos (1000× maior). Selecione a unidade correta na conversão." },
  { q: "Mostra em qual fuso horário?", a: "Sim. A data é exibida no seu fuso local, em UTC e no formato ISO 8601, além de uma estimativa relativa (ex.: 'há 3 dias')." },
  { q: "Posso converter uma data em timestamp?", a: "Sim. Use o campo de data e hora para obter o timestamp Unix em segundos e milissegundos correspondentes." },
  { q: "Os dados são enviados para servidores?", a: "Não. Tudo é calculado no seu navegador, em tempo real." },
];

export default function Page() {
  return (
    <ToolPage
      slug="unix-timestamp"
      emoji="⏰"
      title="Conversor de Timestamp Unix"
      heroDescription={
        <>
          Converta <strong style={{ color: "var(--text)" }}>timestamp Unix em data</strong> e vice-versa, em segundos
          ou milissegundos, com fuso local, UTC e ISO 8601.
        </>
      }
      schemaName="Conversor de Timestamp Unix"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter timestamp Unix",
        body: <p>Veja o timestamp atual no topo (atualizado a cada segundo). Informe um timestamp para ver a data correspondente em vários formatos, ou escolha uma data e hora para obter o timestamp Unix. Clique em qualquer valor para copiar.</p>,
      }}
      faq={FAQ}
      related={["uuid-generator", "hash-generator", "json-formatter"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <TimestampTool />
    </ToolPage>
  );
}
