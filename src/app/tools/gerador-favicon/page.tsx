import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import FaviconGenerator from "./FaviconGenerator";

const DESCRIPTION =
  "Gere favicons em todos os tamanhos (16 a 512px) a partir de uma imagem, com as tags HTML prontas. Tudo no navegador, sem upload e sem cadastro.";

export const metadata = toolMetadata({
  slug: "gerador-favicon",
  title: "Gerador de Favicon Online — Criar Ícone do Site Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é um favicon?", a: "É o pequeno ícone que aparece na aba do navegador, nos favoritos e na tela inicial de dispositivos móveis. Ajuda a identificar visualmente o seu site." },
  { q: "Quais tamanhos são gerados?", a: "16, 32, 48, 64, 128, 180 (Apple Touch), 192 e 512px (Android Chrome). Esses cobrem navegadores de desktop, iOS e Android." },
  { q: "Preciso de uma imagem quadrada?", a: "O ideal é usar uma imagem quadrada. Se não for, a ferramenta faz um recorte quadrado a partir do centro automaticamente." },
  { q: "Como instalar os favicons no site?", a: "Coloque os arquivos PNG na raiz do site e cole as tags <link> geradas dentro do <head> do seu HTML." },
  { q: "A imagem é enviada para servidores?", a: "Não. Todos os ícones são gerados localmente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="gerador-favicon"
      emoji="⭐"
      title="Gerador de Favicon"
      heroDescription={
        <>
          Gere <strong style={{ color: "var(--text)" }}>favicons em todos os tamanhos</strong> (16 a 512px) a partir
          de uma imagem, com as tags HTML prontas para colar no <code>&lt;head&gt;</code>.
        </>
      }
      schemaName="Gerador de Favicon"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como gerar um favicon",
        body: (
          <p>
            Envie uma imagem (de preferência quadrada e com bom contraste em tamanhos pequenos). A ferramenta gera
            automaticamente todos os tamanhos recomendados e exibe uma prévia de cada um. Baixe os arquivos, coloque-os
            na raiz do seu site e cole as tags <code>&lt;link&gt;</code> geradas no <code>&lt;head&gt;</code>.
          </p>
        ),
      }}
      faq={FAQ}
      related={["cortador-imagem", "redimensionador-imagem", "compressor-imagem"]}
      ctaText="Precisa de mais ferramentas de imagem?"
    >
      <FaviconGenerator />
    </ToolPage>
  );
}
