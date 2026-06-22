import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import PhoneFormatter from "./PhoneFormatter";

const DESCRIPTION = "Formate números de telefone brasileiro no padrão (XX) XXXXX-XXXX. Detecta celular, fixo e 0800 automaticamente. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "formatador-telefone",
  title: "Formatador de Telefone Brasileiro — (XX) XXXXX-XXXX Online",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Qual a diferença entre fixo e celular?", a: "Telefones fixos brasileiros têm 8 dígitos após o DDD (ex: (11) 3333-4444). Celulares têm 9 dígitos, sempre começando com 9 (ex: (11) 99999-8888)." },
  { q: "Funciona com números sem DDD?", a: "Sim, mas o formatador assume que os dois primeiros dígitos são o DDD. Insira sempre o DDD para resultado correto." },
  { q: "E números 0800?", a: "Sim. Números 0800 são detectados automaticamente e formatados como 0800 XXX XXXX." },
];

export default function Page() {
  return (
    <ToolPage
      slug="formatador-telefone"
      emoji="📱"
      title="Formatador de Telefone"
      heroDescription={<>Formate telefones brasileiros no padrão <strong style={{ color: "var(--text)" }}>(XX) XXXXX-XXXX</strong> — detecta celular, fixo e 0800 automaticamente.</>}
      schemaName="Formatador de Telefone Brasileiro"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Padrões de telefone no Brasil", body: <p>No Brasil, os celulares têm 9 dígitos (iniciando com 9) e os fixos têm 8 dígitos. Todos os formatos incluem o DDD de dois dígitos entre parênteses. Essa padronização facilita a leitura e evita confusões em cadastros.</p> }}
      faq={FAQ}
      related={["validador-cpf", "validador-email", "validador-cnpj"]}
      ctaText="Precisa de mais ferramentas?"
    >
      <PhoneFormatter />
    </ToolPage>
  );
}
