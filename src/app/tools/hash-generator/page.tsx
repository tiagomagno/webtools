import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import HashGenerator from "./HashGenerator";

const DESCRIPTION =
  "Gere hashes MD5, SHA-1, SHA-256, SHA-384 e SHA-512 de qualquer texto, em tempo real. Tudo no navegador, sem upload e sem enviar dados a servidores.";

export const metadata = toolMetadata({
  slug: "hash-generator",
  title: "Gerador de Hash Online — MD5, SHA-1, SHA-256, SHA-512",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quais algoritmos são suportados?", a: "MD5, SHA-1, SHA-256, SHA-384 e SHA-512. Os SHA usam a API criptográfica nativa do navegador (Web Crypto); o MD5 é calculado em JavaScript puro." },
  { q: "Qual hash devo usar?", a: "Para integridade e segurança, prefira SHA-256 ou superior. MD5 e SHA-1 são considerados inseguros para fins criptográficos, mas ainda úteis para checksums simples." },
  { q: "É possível reverter um hash?", a: "Não. Hashes são funções de mão única — não há como obter o texto original a partir do hash. Por isso são usados para verificar integridade e armazenar senhas (com salt)." },
  { q: "Meu texto é enviado a algum servidor?", a: "Não. Todos os hashes são calculados localmente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="hash-generator"
      emoji="#️⃣"
      title="Gerador de Hash"
      heroDescription={
        <>
          Gere hashes <strong style={{ color: "var(--text)" }}>MD5, SHA-1, SHA-256, SHA-384 e SHA-512</strong> de
          qualquer texto, em tempo real e direto no navegador.
        </>
      }
      schemaName="Gerador de Hash"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como gerar hashes de um texto",
        body: <p>Digite o texto e todos os hashes são calculados ao mesmo tempo. Útil para gerar checksums, comparar integridade de dados e estudar funções criptográficas.</p>,
      }}
      faq={FAQ}
      related={["uuid-generator", "base64-encode", "jwt-decoder"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <HashGenerator />
    </ToolPage>
  );
}
