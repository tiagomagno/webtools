import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import LineRemover from "./LineRemover";

const DESCRIPTION =
  "Remova linhas duplicadas e vazias, apare espaços e ordene listas de texto em A→Z ou Z→A. Tudo em tempo real, no navegador e sem upload.";

export const metadata = toolMetadata({
  slug: "removedor-linhas",
  title: "Removedor de Linhas Duplicadas e Vazias — Online e Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  {
    q: "Como remover linhas duplicadas?",
    a: "Cole sua lista e mantenha a opção 'Remover duplicadas' ativa. Cada linha repetida é eliminada, preservando a primeira ocorrência. Ative 'Ignorar maiúsc./minúsc.' para tratar 'Casa' e 'casa' como iguais.",
  },
  {
    q: "Consigo ordenar a lista?",
    a: "Sim. Use os botões de ordenação para A→Z ou Z→A. A ordenação respeita acentos e números do português.",
  },
  {
    q: "O que faz 'remover espaços nas pontas'?",
    a: "Apara espaços e tabulações no início e no fim de cada linha (trim), útil para limpar listas copiadas de planilhas ou e-mails.",
  },
  {
    q: "Os dados são enviados para algum servidor?",
    a: "Não. Todo o processamento ocorre no seu navegador; nada é enviado para fora do seu dispositivo.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="removedor-linhas"
      emoji="📋"
      title="Removedor de Linhas"
      heroDescription={
        <>
          Limpe listas de texto: remova <strong style={{ color: "var(--text)" }}>linhas duplicadas e vazias</strong>,
          apare espaços e ordene em A→Z ou Z→A — tudo em tempo real.
        </>
      }
      schemaName="Removedor de Linhas Duplicadas"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Para que serve o removedor de linhas",
        body: (
          <p>
            Ótimo para limpar listas de e-mails, URLs, palavras-chave ou qualquer dado em linhas. Combine as
            opções para remover duplicadas, eliminar linhas em branco, aparar espaços e ordenar — vendo o
            resultado e a contagem de linhas instantaneamente.
          </p>
        ),
      }}
      faq={FAQ}
      related={["text-cleaner", "comparador-textos", "contador-palavras"]}
      ctaText="Precisa de mais ferramentas de texto?"
    >
      <LineRemover />
    </ToolPage>
  );
}
