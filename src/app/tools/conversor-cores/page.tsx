import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import ColorConverter from "./ColorConverter";

const DESCRIPTION =
  "Converta cores entre HEX, RGB e HSL com prévia ao vivo e sliders. Copie o valor em qualquer formato. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "conversor-cores",
  title: "Conversor de Cores Online — HEX, RGB e HSL Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quais formatos são suportados?", a: "HEX (#rrggbb e #rgb), RGB e HSL. Ao mudar qualquer um, os demais são recalculados automaticamente." },
  { q: "O que é HSL?", a: "É um modelo de cor baseado em Matiz (Hue), Saturação e Luminosidade. É mais intuitivo para criar variações e ajustar tons que o RGB." },
  { q: "Posso usar o seletor de cor?", a: "Sim. Use o seletor nativo ou os sliders de RGB e HSL para ajustar a cor com precisão e ver o resultado na hora." },
  { q: "Como copio o valor?", a: "Clique em qualquer linha do painel de resultados para copiar a cor naquele formato." },
  { q: "Os dados são enviados para servidores?", a: "Não. A conversão é feita inteiramente no seu navegador." },
];

export default function Page() {
  return (
    <ToolPage
      slug="conversor-cores"
      emoji="🎨"
      title="Conversor de Cores"
      heroDescription={
        <>
          Converta cores entre <strong style={{ color: "var(--text)" }}>HEX, RGB e HSL</strong> com prévia ao vivo e
          sliders. Copie o valor em qualquer formato com um clique.
        </>
      }
      schemaName="Conversor de Cores"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como converter cores",
        body: <p>Escolha uma cor pelo seletor, digite um HEX ou ajuste os sliders de RGB e HSL. Todos os formatos são atualizados em tempo real. Clique no formato desejado para copiar e usar no seu CSS ou design.</p>,
      }}
      faq={FAQ}
      related={["color-palette", "gradients", "css-units"]}
      ctaText="Precisa de mais ferramentas de design?"
    >
      <ColorConverter />
    </ToolPage>
  );
}
