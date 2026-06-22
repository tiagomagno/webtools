import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import JsonFormatter from "./JsonFormatter";

const DESCRIPTION =
  "Formate e indente JSON online com 2 ou 4 espaços, tab ou minificação. Validação com mensagem de erro. Grátis, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "json-formatter",
  title: "JSON Formatter Online — Formatar e Identar JSON Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como formatar JSON?", a: "Cole o JSON, escolha a indentação (2 espaços, 4 espaços ou tab) e clique em Formatar. O resultado fica pronto para copiar." },
  { q: "Posso minificar o JSON?", a: "Sim. Escolha a opção 'Minificar' para remover todos os espaços e quebras de linha, gerando a versão mais compacta." },
  { q: "E se o JSON estiver inválido?", a: "Mostramos uma mensagem de erro com a linha e a coluna aproximadas do problema, ajudando a localizar a falha rapidamente." },
  { q: "Meu JSON é enviado para servidores?", a: "Não. Tudo é processado localmente no navegador — seguro para dados sensíveis." },
];

export default function Page() {
  return (
    <ToolPage
      slug="json-formatter"
      emoji="🧩"
      title="JSON Formatter"
      heroDescription={
        <>
          Formate, idente e <strong style={{ color: "var(--text)" }}>minifique JSON</strong> com indentação
          ajustável. Validação automática com mensagem de erro.
        </>
      }
      schemaName="JSON Formatter"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como formatar JSON online",
        body: <p>Cole seu JSON, escolha a indentação e clique em Formatar. Útil para deixar respostas de API, arquivos de configuração e logs legíveis, ou para minificar antes de transmitir.</p>,
      }}
      faq={FAQ}
      related={["json-validator", "json-diff", "base64-encode"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <JsonFormatter />
    </ToolPage>
  );
}
