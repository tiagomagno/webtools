import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import TextInverter from "./TextInverter";

const DESCRIPTION = "Inverta texto por caracteres, palavras ou linhas instantaneamente. Útil para espelhar texto, inverter ordem de palavras e embaralhar linhas. Grátis.";

export const metadata = toolMetadata({
  slug: "inversor-texto",
  title: "Inversor de Texto Online — Inverta Caracteres, Palavras ou Linhas",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Qual a diferença entre inverter caracteres e palavras?", a: "Inverter caracteres espelha cada letra do texto (ex: 'abc' → 'cba'). Inverter palavras mantém as letras, mas inverte a ordem das palavras na frase." },
  { q: "Para que serve inverter linhas?", a: "É útil para inverter a ordem de uma lista, colocando o último item primeiro — sem precisar copiar e colar manualmente." },
  { q: "O processamento é feito no servidor?", a: "Não. Tudo ocorre no seu navegador, sem envio de dados." },
];

export default function Page() {
  return (
    <ToolPage
      slug="inversor-texto"
      emoji="🔄"
      title="Inversor de Texto"
      heroDescription={<>Inverta texto por <strong style={{ color: "var(--text)" }}>caracteres, palavras ou linhas</strong> com um clique.</>}
      schemaName="Inversor de Texto"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como o inversor funciona", body: <p>Selecione o modo desejado: <em>caracteres</em> espelha cada letra do texto; <em>palavras</em> inverte a sequência das palavras; <em>linhas</em> reverte a ordem de cada linha — útil para listas e logs.</p> }}
      faq={FAQ}
      related={["formatador-texto", "ordenador-linhas", "removedor-linhas"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <TextInverter />
    </ToolPage>
  );
}
