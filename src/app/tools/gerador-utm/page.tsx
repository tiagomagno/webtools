import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import UtmBuilder from "./UtmBuilder";

const DESCRIPTION =
  "Monte URLs com parâmetros UTM (source, medium, campaign, term, content) para rastrear campanhas no Google Analytics. Copie o link pronto. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "gerador-utm",
  title: "Gerador de UTM Online — Criar URLs de Campanha Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que são parâmetros UTM?", a: "São marcadores adicionados à URL (utm_source, utm_medium, utm_campaign, utm_term e utm_content) que permitem ao Google Analytics identificar de onde vem cada visita e qual campanha gerou o acesso." },
  { q: "Quais parâmetros são obrigatórios?", a: "Na prática, utm_source, utm_medium e utm_campaign são os essenciais. utm_term e utm_content são opcionais, usados para palavras-chave e teste A/B de criativos." },
  { q: "Posso usar maiúsculas nos valores?", a: "Os parâmetros diferenciam maiúsculas de minúsculas no relatório. Padronize tudo em minúsculas para evitar 'Facebook' e 'facebook' como fontes separadas." },
  { q: "Os parâmetros UTM afetam o SEO?", a: "Não prejudicam diretamente, mas geram URLs duplicadas. Use UTMs apenas em links de campanha (anúncios, e-mail, social), nunca em links internos do site." },
  { q: "A URL é gerada no servidor?", a: "Não. Tudo é montado no seu navegador, sem envio de dados." },
];

export default function Page() {
  return (
    <ToolPage
      slug="gerador-utm"
      emoji="🔖"
      title="Gerador de UTM"
      heroDescription={
        <>
          Crie <strong style={{ color: "var(--text)" }}>URLs com parâmetros UTM</strong> para rastrear suas campanhas
          no Google Analytics. Preencha os campos e copie o link pronto para anúncios, e-mail e redes sociais.
        </>
      }
      schemaName="Gerador de UTM"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como usar os parâmetros UTM",
        body: (
          <p>
            Informe a URL de destino e os parâmetros da campanha. <strong>utm_source</strong> é a origem (ex.: google,
            instagram), <strong>utm_medium</strong> é o tipo de mídia (ex.: cpc, email, social) e{" "}
            <strong>utm_campaign</strong> é o nome da campanha. Mantenha um padrão de nomes consistente para que os
            relatórios fiquem organizados. Copie a URL final e use nos seus links de divulgação.
          </p>
        ),
      }}
      faq={FAQ}
      related={["open-graph-preview", "serp-preview", "robots-generator"]}
      ctaText="Precisa de mais ferramentas de SEO?"
    >
      <UtmBuilder />
    </ToolPage>
  );
}
