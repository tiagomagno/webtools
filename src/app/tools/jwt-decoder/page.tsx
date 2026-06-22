import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import JwtDecoder from "./JwtDecoder";

const DESCRIPTION =
  "Decodifique o header e o payload de um token JWT online, com datas de emissão e expiração. Tudo no navegador, sem upload e sem enviar o token a servidores.";

export const metadata = toolMetadata({
  slug: "jwt-decoder",
  title: "JWT Decoder Online — Decodificar Token JWT com Segurança",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que o JWT Decoder mostra?", a: "Ele separa o token em header e payload e decodifica o Base64URL de cada parte, exibindo o JSON formatado, além de converter as datas iat (emissão) e exp (expiração) para um formato legível." },
  { q: "A assinatura do token é verificada?", a: "Não. A verificação da assinatura exige a chave secreta do servidor. Esta ferramenta apenas decodifica o conteúdo, que não é criptografado." },
  { q: "É seguro colar um token real?", a: "A decodificação é feita 100% no seu navegador, sem envio. Ainda assim, evite compartilhar tokens válidos publicamente, pois eles concedem acesso." },
  { q: "Por que o token está 'expirado'?", a: "Comparamos o campo exp com a data atual. Se a data de expiração já passou, marcamos como expirado." },
];

export default function Page() {
  return (
    <ToolPage
      slug="jwt-decoder"
      emoji="🔐"
      title="JWT Decoder"
      heroDescription={
        <>
          Decodifique o <strong style={{ color: "var(--text)" }}>header e o payload</strong> de um token JWT, com
          as datas de emissão e expiração. Sem enviar o token a servidores.
        </>
      }
      schemaName="JWT Decoder"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como decodificar um JWT",
        body: <p>Cole o token (no formato header.payload.signature). Mostramos o conteúdo de cada parte e indicamos se o token já expirou — ideal para depurar autenticação durante o desenvolvimento.</p>,
      }}
      faq={FAQ}
      related={["base64-decode", "json-formatter", "hash-generator"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <JwtDecoder />
    </ToolPage>
  );
}
