import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import RobotsGenerator from "./RobotsGenerator";

const DESCRIPTION =
  "Crie um arquivo robots.txt válido com regras de User-agent, Allow, Disallow, Crawl-delay e Sitemap. Copie ou baixe pronto. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "robots-generator",
  title: "Gerador de robots.txt Online — Criar Arquivo Robots Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Para que serve o robots.txt?", a: "É um arquivo na raiz do site que orienta os robôs de busca sobre quais áreas podem ou não ser rastreadas. Ele controla o rastreamento, não a indexação — para impedir indexação use a meta tag noindex." },
  { q: "Onde devo colocar o arquivo?", a: "Na raiz do domínio, acessível em https://seusite.com/robots.txt. Ele precisa estar nesse caminho exato para ser reconhecido pelos buscadores." },
  { q: "Qual a diferença entre Allow e Disallow?", a: "Disallow bloqueia o rastreamento de um caminho; Allow libera explicitamente um subcaminho dentro de uma área bloqueada. A regra mais específica prevalece." },
  { q: "Posso ter regras diferentes por robô?", a: "Sim. Adicione um bloco por User-agent (por exemplo Googlebot, Bingbot) com suas próprias regras Allow e Disallow." },
  { q: "Devo incluir o Sitemap?", a: "Sim, é recomendado. A diretiva Sitemap ajuda os buscadores a encontrarem todas as URLs do seu site mais rápido." },
];

export default function Page() {
  return (
    <ToolPage
      slug="robots-generator"
      emoji="🤖"
      title="Gerador de robots.txt"
      heroDescription={
        <>
          Monte um <strong style={{ color: "var(--text)" }}>robots.txt</strong> válido com regras por robô, Allow,
          Disallow e Sitemap. Visualize o resultado em tempo real e baixe o arquivo pronto.
        </>
      }
      schemaName="Gerador de robots.txt"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como criar seu robots.txt",
        body: (
          <p>
            Defina o User-agent (use <code>*</code> para todos os robôs), liste os caminhos em Disallow para bloquear e
            em Allow para liberar exceções, e informe a URL do seu sitemap. Adicione blocos extras para regras
            específicas por buscador. Por fim, copie ou baixe o arquivo e publique na raiz do seu domínio.
          </p>
        ),
      }}
      faq={FAQ}
      related={["open-graph-preview", "serp-preview", "gerador-utm"]}
      ctaText="Precisa de mais ferramentas de SEO?"
    >
      <RobotsGenerator />
    </ToolPage>
  );
}
