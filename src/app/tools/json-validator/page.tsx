import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import JsonValidator from "./JsonValidator";

const DESCRIPTION =
  "Valide JSON online em tempo real e veja o erro com linha e coluna. Mostra o tipo e a contagem de chaves quando válido. Grátis, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "json-validator",
  title: "JSON Validator Online — Validar JSON com Erro e Linha",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como validar um JSON?", a: "Cole o conteúdo na caixa de texto. A validação acontece automaticamente: você vê 'JSON válido' ou a mensagem de erro com a posição aproximada." },
  { q: "O validador mostra onde está o erro?", a: "Sim. Quando o JSON é inválido, exibimos a mensagem do parser com a linha e a coluna estimadas para você corrigir rapidamente." },
  { q: "Qual a diferença para o JSON Formatter?", a: "O validador foca em apontar se o JSON é válido e onde está o erro. O Formatter reorganiza a indentação de um JSON já válido." },
  { q: "É seguro colar dados sensíveis?", a: "Sim. Nada sai do seu navegador — a validação é 100% local." },
];

export default function Page() {
  return (
    <ToolPage
      slug="json-validator"
      emoji="✅"
      title="JSON Validator"
      heroDescription={
        <>
          Valide <strong style={{ color: "var(--text)" }}>JSON em tempo real</strong> e veja o erro com linha e
          coluna. Quando válido, mostra o tipo e a contagem de chaves.
        </>
      }
      schemaName="JSON Validator"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como validar JSON online",
        body: <p>Cole o JSON e a validação roda automaticamente. Ideal para conferir respostas de API, payloads e arquivos de configuração antes de usá-los no código.</p>,
      }}
      faq={FAQ}
      related={["json-formatter", "json-diff", "jwt-decoder"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <JsonValidator />
    </ToolPage>
  );
}
