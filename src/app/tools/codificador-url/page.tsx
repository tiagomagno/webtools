import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import UrlEncoder from "./UrlEncoder";

const DESCRIPTION =
  "Codifique e decodifique URLs e parâmetros (percent-encoding), com suporte a encodeURIComponent e encodeURI. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "codificador-url",
  title: "Codificador de URL Online — Encode e Decode de URL Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é codificação de URL?", a: "É a substituição de caracteres especiais por sequências percent-encoded (como espaço → %20), garantindo que a URL seja transmitida corretamente." },
  { q: "Qual a diferença entre encodeURI e encodeURIComponent?", a: "encodeURIComponent codifica também caracteres como / ? & = (ideal para valores de parâmetros). encodeURI preserva a estrutura da URL inteira. Use a opção 'Componente' conforme o caso." },
  { q: "Quando usar cada um?", a: "Use 'Componente' para codificar um valor que vai dentro de um parâmetro de query. Desmarque para codificar uma URL completa preservando : / ? #." },
  { q: "Por que a decodificação dá erro?", a: "Sequências percent malformadas (ex.: % sem dois dígitos hexadecimais) não podem ser decodificadas e geram erro." },
  { q: "Os dados são enviados para servidores?", a: "Não. Tudo é processado no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="codificador-url"
      emoji="🔗"
      title="Codificador de URL"
      heroDescription={
        <>
          <strong style={{ color: "var(--text)" }}>Codifique e decodifique URLs</strong> e parâmetros (percent-encoding),
          com suporte a encodeURIComponent e encodeURI.
        </>
      }
      schemaName="Codificador de URL"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como codificar e decodificar URLs",
        body: <p>Escolha entre codificar ou decodificar, cole o texto e veja o resultado na hora. Marque 'Componente' para tratar valores de parâmetros (codifica / ? &amp; =) ou desmarque para preservar a estrutura de uma URL completa.</p>,
      }}
      faq={FAQ}
      related={["base64-encode", "gerador-utm", "jwt-decoder"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <UrlEncoder />
    </ToolPage>
  );
}
