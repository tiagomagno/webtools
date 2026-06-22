import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import UuidBulk from "./UuidBulk";

const DESCRIPTION =
  "Gere até 10.000 UUIDs v4 de uma vez, com opções de maiúsculas, hífens e chaves. Copie tudo ou baixe em .txt. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "uuid-massa",
  title: "Gerar UUID em Massa Online — Milhares de UUIDs de Uma Vez",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Quantos UUIDs posso gerar?", a: "Até 10.000 de uma só vez. Informe a quantidade e clique em Gerar; todos aparecem prontos para copiar ou baixar." },
  { q: "Posso formatar os UUIDs?", a: "Sim. Escolha maiúsculas, com ou sem hífens e com chaves {} — útil para diferentes bancos de dados e linguagens." },
  { q: "Os UUIDs são únicos?", a: "São UUIDs v4 gerados pelo RNG criptográfico do navegador. A probabilidade de colisão é praticamente nula." },
  { q: "Consigo exportar para arquivo?", a: "Sim. O botão 'Baixar .txt' salva todos os UUIDs, um por linha, pronto para importar onde precisar." },
  { q: "São gerados no servidor?", a: "Não. Tudo acontece no seu navegador, sem envio de dados." },
];

export default function Page() {
  return (
    <ToolPage
      slug="uuid-massa"
      emoji="🆔"
      title="UUID em Massa"
      heroDescription={
        <>
          Gere <strong style={{ color: "var(--text)" }}>até 10.000 UUIDs v4</strong> de uma vez, com opções de
          formatação. Copie tudo ou baixe em arquivo .txt.
        </>
      }
      schemaName="Gerador de UUID em Massa"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Para que serve gerar UUIDs em massa",
        body: <p>Ideal para popular bancos de dados de teste, gerar chaves para importação em lote ou criar identificadores para muitos registros de uma vez. Ajuste o formato conforme o destino e exporte com um clique.</p>,
      }}
      faq={FAQ}
      related={["uuid-generator", "gerador-senha", "hash-generator"]}
      ctaText="Precisa de mais utilidades?"
    >
      <UuidBulk />
    </ToolPage>
  );
}
