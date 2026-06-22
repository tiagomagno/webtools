import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import RegexTester from "./RegexTester";

const DESCRIPTION = "Teste expressões regulares em tempo real com highlight de correspondências, suporte a grupos de captura e flags g, i, m, s. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "regex-tester",
  title: "Testador de Regex Online — Teste Expressões Regulares em Tempo Real",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quais flags são suportadas?", a: "g (global), i (case-insensitive), m (multiline) e s (dotAll). Você pode combinar várias flags simultaneamente." },
  { q: "Mostra grupos de captura?", a: "Sim. A lista de correspondências exibe a posição de cada match encontrado no texto." },
  { q: "A regex é executada no servidor?", a: "Não. O motor de regex é o do próprio JavaScript rodando no navegador — os dados nunca saem do seu dispositivo." },
  { q: "O que é a flag 's' (dotAll)?", a: "Com a flag s, o ponto (.) também corresponde a quebras de linha (\\n), o que não ocorre por padrão." },
];

export default function Page() {
  return (
    <ToolPage
      slug="regex-tester"
      emoji="🔎"
      title="Testador de Regex"
      heroDescription={<>Teste <strong style={{ color: "var(--text)" }}>expressões regulares</strong> em tempo real com highlight de correspondências e suporte a grupos.</>}
      schemaName="Testador de Regex"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como usar o testador de regex", body: <p>Digite a expressão regular no campo superior (sem as barras /) e o texto de teste abaixo. As correspondências são destacadas em tempo real. Use os botões de flag para ativar comportamentos globais, insensíveis a maiúsculas, multilinha ou dotAll.</p> }}
      faq={FAQ}
      related={["html-formatter", "json-formatter", "texto-para-slug"]}
      ctaText="Precisa de mais ferramentas de Dev?"
    >
      <RegexTester />
    </ToolPage>
  );
}
