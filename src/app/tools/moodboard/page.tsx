import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import MoodboardBuilder from "./MoodboardBuilder";

const DESCRIPTION =
  "Crie moodboards de branding, app mobile ou website com imagens, paletas de cor e tipografia. Monte o board arrastando os elementos e baixe como PNG. Tudo no navegador, sem upload.";

export const metadata = toolMetadata({
  slug: "moodboard",
  title: "Criador de Moodboard Online — Branding, App e Website",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como funciona o criador de moodboard?", a: "Escolha o tipo de projeto (Branding, App Mobile ou Website), depois adicione imagens de referência, blocos de cor e textos ao board. Arraste para posicionar e use o canto inferior direito de cada item para redimensionar." },
  { q: "Posso usar minhas próprias imagens?", a: "Sim. Clique em 'Imagem' e selecione uma ou mais fotos do seu computador — elas são carregadas direto no navegador, sem upload para nenhum servidor." },
  { q: "Dá para exportar o moodboard?", a: "Sim. O botão 'Baixar PNG' gera uma imagem única com todos os elementos do board, na resolução do tipo de projeto escolhido." },
  { q: "Qual a diferença entre os tipos Branding, App Mobile e Website?", a: "Cada tipo usa uma proporção de board diferente (branding é mais quadrado, mobile é vertical como uma tela de celular, website é widescreen), pensada para o formato de referência mais comum daquele contexto." },
  { q: "As imagens são enviadas para algum servidor?", a: "Não. Todo o processamento — upload de imagens e geração do PNG final — acontece localmente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="moodboard"
      emoji="📌"
      title="Criador de Moodboard"
      heroDescription={
        <>
          Monte moodboards de <strong style={{ color: "var(--text)" }}>branding</strong>,{" "}
          <strong style={{ color: "var(--text)" }}>app mobile</strong> ou{" "}
          <strong style={{ color: "var(--text)" }}>website</strong> arrastando imagens, cores e textos, e baixe o resultado em PNG.
        </>
      }
      schemaName="Criador de Moodboard"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como montar um moodboard",
        body: (
          <p>
            Escolha o tipo de projeto no topo da página — isso define a proporção do board. Use os botões
            <strong> Imagem</strong>, <strong>Cor</strong> e <strong>Texto</strong> para adicionar elementos, depois arraste-os
            para organizar a composição. Selecione um item para ajustar suas propriedades no painel lateral (fonte, cor,
            camadas) e clique em <strong>Baixar PNG</strong> quando o moodboard estiver pronto.
          </p>
        ),
      }}
      faq={FAQ}
      related={["color-palette", "extrator-cores", "gradients"]}
      ctaText="Precisa de mais ferramentas de design?"
    >
      <MoodboardBuilder />
    </ToolPage>
  );
}
