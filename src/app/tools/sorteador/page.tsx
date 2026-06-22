import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import Sorteador from "./Sorteador";

const DESCRIPTION =
  "Sorteie nomes, itens ou números aleatórios com ou sem repetição, usando geração criptográfica imparcial. Ideal para rifas e sorteios. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "sorteador",
  title: "Sorteador Online — Sortear Nomes e Números Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Como sortear nomes?", a: "No modo 'Nomes / itens', cole a lista (um por linha), defina quantos sortear e clique em Sortear. Os escolhidos aparecem destacados." },
  { q: "Posso sortear números?", a: "Sim. No modo 'Números', informe o intervalo mínimo e máximo e quantos números deseja sortear." },
  { q: "O que significa 'sem repetição'?", a: "Garante que nenhum item ou número seja sorteado mais de uma vez. Desmarque para permitir repetições." },
  { q: "O sorteio é justo?", a: "Sim. Usamos o gerador criptográfico do navegador com embaralhamento de Fisher-Yates e seleção sem viés, garantindo probabilidade uniforme." },
  { q: "Serve para rifas e lives?", a: "Sim. É ideal para sorteios de prêmios, rifas, escolha de ganhadores e dinâmicas. Tudo roda localmente, de forma transparente." },
];

export default function Page() {
  return (
    <ToolPage
      slug="sorteador"
      emoji="🎲"
      title="Sorteador"
      heroDescription={
        <>
          Sorteie <strong style={{ color: "var(--text)" }}>nomes, itens ou números</strong> aleatórios, com ou sem
          repetição, usando geração criptográfica imparcial.
        </>
      }
      schemaName="Sorteador Online"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como fazer um sorteio justo",
        body: <p>Escolha entre sortear nomes/itens de uma lista ou números de um intervalo. Defina a quantidade e se permite repetição. O resultado usa embaralhamento criptográfico, garantindo um sorteio imparcial — perfeito para rifas, lives e dinâmicas de grupo.</p>,
      }}
      faq={FAQ}
      related={["gerador-senha", "uuid-massa", "gerador-qr"]}
      ctaText="Precisa de mais utilidades?"
    >
      <Sorteador />
    </ToolPage>
  );
}
