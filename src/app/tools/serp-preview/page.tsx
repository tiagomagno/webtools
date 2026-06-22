import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import SerpPreview from "./SerpPreview";

const DESCRIPTION =
  "Visualize como sua página aparece nos resultados do Google e ajuste título e meta descrição dentro dos limites de pixels recomendados. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "serp-preview",
  title: "SERP Preview — Simular Resultado do Google (Title e Description)",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é a SERP?", a: "SERP (Search Engine Results Page) é a página de resultados do buscador. O preview simula como o título, a URL e a meta descrição da sua página aparecem para quem pesquisa no Google." },
  { q: "Qual o tamanho ideal do título?", a: "Até cerca de 580 pixels (aproximadamente 50–60 caracteres). Acima disso o Google corta o texto com reticências." },
  { q: "Qual o tamanho ideal da meta descrição?", a: "Até cerca de 920 pixels (aproximadamente 150–160 caracteres no desktop). O ideal é resumir a página e incluir um chamado à ação." },
  { q: "Por que medir em pixels e não em caracteres?", a: "O Google trunca pela largura visual, não pela contagem de letras. Um 'W' ocupa muito mais espaço que um 'i', então o limite em pixels é mais preciso." },
  { q: "O Google sempre usa o meu título e descrição?", a: "Nem sempre. O buscador pode reescrever o título ou gerar uma descrição a partir do conteúdo da página quando julga mais relevante para a consulta." },
];

export default function Page() {
  return (
    <ToolPage
      slug="serp-preview"
      emoji="🔎"
      title="SERP Preview"
      heroDescription={
        <>
          Veja como sua página aparece nos <strong style={{ color: "var(--text)" }}>resultados do Google</strong> e
          ajuste título e meta descrição dentro dos limites de pixels antes de publicar.
        </>
      }
      schemaName="SERP Preview"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como otimizar para a SERP",
        body: (
          <p>
            Digite o título, a URL e a meta descrição da sua página. As barras de medida mostram o quanto você está
            usando do espaço disponível em pixels — fique no verde para evitar cortes. Escreva títulos descritivos com a
            palavra-chave no início e descrições que despertem o clique. Lembre-se de que o Google pode reescrever esses
            elementos conforme a busca do usuário.
          </p>
        ),
      }}
      faq={FAQ}
      related={["open-graph-preview", "gerador-utm", "robots-generator"]}
      ctaText="Precisa de mais ferramentas de SEO?"
    >
      <SerpPreview />
    </ToolPage>
  );
}
