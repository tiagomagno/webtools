import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import JsonDiff from "./JsonDiff";

const DESCRIPTION =
  "Compare dois JSON e veja as chaves adicionadas, removidas e os valores alterados, com o caminho de cada diferença. Grátis, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "json-diff",
  title: "JSON Diff Online — Comparar Dois JSON Estruturalmente",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como o JSON Diff compara os dados?", a: "A comparação é estrutural e recursiva: percorremos objetos e arrays e listamos cada chave adicionada, removida ou com valor alterado, mostrando o caminho completo (ex: usuario.endereco.cidade)." },
  { q: "A ordem das chaves importa?", a: "Não. Comparamos por chave em objetos, então a ordem não gera diferenças. Em arrays, a comparação é por posição (índice)." },
  { q: "Funciona com JSON aninhado?", a: "Sim. O diff entra em objetos e arrays aninhados em qualquer profundidade." },
  { q: "Os dados saem do meu navegador?", a: "Não. Toda a comparação é feita localmente." },
];

export default function Page() {
  return (
    <ToolPage
      slug="json-diff"
      emoji="🔍"
      title="JSON Diff"
      heroDescription={
        <>
          Compare dois JSON e veja <strong style={{ color: "var(--text)" }}>chaves adicionadas, removidas e valores alterados</strong>,
          com o caminho de cada diferença.
        </>
      }
      schemaName="JSON Diff"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como comparar dois JSON",
        body: <p>Cole o JSON original e o modificado e clique em Comparar. Útil para revisar mudanças em respostas de API, configurações e snapshots de dados entre versões.</p>,
      }}
      faq={FAQ}
      related={["json-formatter", "json-validator", "comparador-textos"]}
      ctaText="Precisa de mais ferramentas de desenvolvedor?"
    >
      <JsonDiff />
    </ToolPage>
  );
}
