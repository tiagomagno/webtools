import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import UuidGenerator from "./UuidGenerator";

const DESCRIPTION =
  "Gere UUIDs v4 únicos online, um ou vários de uma vez, em maiúsculas ou minúsculas. Usa o gerador criptográfico do navegador. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "uuid-generator",
  title: "Gerador de UUID v4 Online — Criar UUIDs Únicos Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é um UUID v4?", a: "É um identificador único universal de 128 bits gerado de forma aleatória. É amplamente usado como chave primária, ID de sessão e identificador de recursos." },
  { q: "Os UUIDs são realmente únicos?", a: "A probabilidade de colisão é praticamente nula. Usamos o gerador criptográfico do navegador (crypto.randomUUID) quando disponível." },
  { q: "Posso gerar vários de uma vez?", a: "Sim. Informe a quantidade (até 1000) e clique em Gerar. Você pode copiar um por um ou todos de uma vez." },
  { q: "Os UUIDs são gerados no servidor?", a: "Não. A geração é feita inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="uuid-generator"
      emoji="🆔"
      title="Gerador de UUID"
      heroDescription={
        <>
          Gere <strong style={{ color: "var(--text)" }}>UUIDs v4 únicos</strong>, um ou vários de uma vez, em
          maiúsculas ou minúsculas. Clique em qualquer UUID para copiar.
        </>
      }
      schemaName="Gerador de UUID v4"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Para que serve um gerador de UUID",
        body: <p>UUIDs são ideais como identificadores únicos em bancos de dados, APIs, filas e arquivos, sem precisar de um contador central. Gere quantos precisar e copie com um clique.</p>,
      }}
      faq={FAQ}
      related={["hash-generator", "json-formatter", "base64-encode"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <UuidGenerator />
    </ToolPage>
  );
}
