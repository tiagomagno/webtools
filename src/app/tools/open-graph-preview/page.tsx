import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import OpenGraphPreview from "./OpenGraphPreview";

const DESCRIPTION =
  "Visualize como seu link aparece no Facebook, LinkedIn e X (Twitter) e gere as meta tags Open Graph e Twitter Card prontas para copiar. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "open-graph-preview",
  title: "Open Graph Preview — Visualizar Card e Gerar Meta Tags",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é Open Graph?", a: "É um protocolo criado pelo Facebook que usa meta tags (og:title, og:description, og:image, etc.) para definir como um link aparece ao ser compartilhado em redes sociais e aplicativos de mensagem." },
  { q: "Qual o tamanho ideal da imagem og:image?", a: "1200×630 pixels (proporção 1.91:1) é o tamanho recomendado para a maioria das redes. Use uma imagem com no máximo ~5 MB e formato JPG ou PNG." },
  { q: "Preciso das tags do Twitter separadas?", a: "O X (Twitter) lê as tags og: como fallback, mas as tags twitter:card e twitter:image dão controle preciso sobre o formato do card. Geramos as duas." },
  { q: "Por que minha imagem não aparece no preview?", a: "A URL da imagem precisa ser pública e acessível por HTTPS. Imagens locais, atrás de login ou que bloqueiam hotlink não carregam." },
  { q: "Os dados são enviados para algum servidor?", a: "Não. O preview e as meta tags são gerados inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="open-graph-preview"
      emoji="🔗"
      title="Open Graph Preview"
      heroDescription={
        <>
          Veja como seu link aparece no <strong style={{ color: "var(--text)" }}>Facebook, LinkedIn e X</strong> e
          copie as meta tags Open Graph e Twitter Card prontas para colar no <code>&lt;head&gt;</code>.
        </>
      }
      schemaName="Open Graph Preview"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como usar o Open Graph Preview",
        body: (
          <p>
            Preencha título, descrição, URL e a imagem de capa. O preview é atualizado em tempo real simulando os
            principais cards de redes sociais. Ao final, copie o bloco de meta tags e cole dentro da tag{" "}
            <code>&lt;head&gt;</code> da sua página. Cada rede tem seu próprio cache — use o depurador oficial (como o
            Sharing Debugger do Facebook) para forçar a atualização após publicar.
          </p>
        ),
      }}
      faq={FAQ}
      related={["serp-preview", "gerador-utm", "robots-generator"]}
      ctaText="Precisa de mais ferramentas de SEO?"
    >
      <OpenGraphPreview />
    </ToolPage>
  );
}
