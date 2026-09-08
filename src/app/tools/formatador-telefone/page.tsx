import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import PhoneFormatter from "./PhoneFormatter";

const DESCRIPTION = "Formate números de telefone brasileiro no padrão (XX) XXXXX-XXXX e gere o link direto do WhatsApp (wa.me), com mensagem pré-definida opcional. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "formatador-telefone",
  title: "Formatador de Telefone e Link do WhatsApp Online",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "Qual a diferença entre fixo e celular?", a: "Telefones fixos brasileiros têm 8 dígitos após o DDD (ex: (11) 3333-4444). Celulares têm 9 dígitos, sempre começando com 9 (ex: (11) 99999-8888)." },
  { q: "Funciona com números sem DDD?", a: "Sim, mas o formatador assume que os dois primeiros dígitos são o DDD. Insira sempre o DDD para resultado correto." },
  { q: "E números 0800?", a: "Sim. Números 0800 são detectados automaticamente e formatados como 0800 XXX XXXX — mas não geram link de WhatsApp, já que não são números de celular." },
  { q: "Como funciona o link do WhatsApp?", a: "A ferramenta monta um link no padrão wa.me com o DDI do Brasil (55) + DDD + número. Ao abrir o link, o WhatsApp já inicia a conversa com esse contato, com a mensagem digitada (se houver) preenchida automaticamente." },
  { q: "Preciso ter o número salvo nos contatos?", a: "Não. O link do WhatsApp (wa.me) abre a conversa diretamente pelo número, sem precisar salvá-lo antes." },
];

export default function Page() {
  return (
    <ToolPage
      slug="formatador-telefone"
      emoji="📱"
      title="Formatador de Telefone"
      heroDescription={<>Formate telefones brasileiros no padrão <strong style={{ color: "var(--text)" }}>(XX) XXXXX-XXXX</strong> e gere o <strong style={{ color: "var(--text)" }}>link direto do WhatsApp</strong> — detecta celular, fixo e 0800 automaticamente.</>}
      schemaName="Formatador de Telefone e Link do WhatsApp"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Padrões de telefone no Brasil",
        body: (
          <p>
            No Brasil, os celulares têm 9 dígitos (iniciando com 9) e os fixos têm 8 dígitos. Todos os formatos incluem o DDD de
            dois dígitos entre parênteses. Para números de celular ou fixo com DDD completo, a ferramenta também monta o link
            de contato direto do WhatsApp (wa.me), pronto para colar em um site, bio de rede social ou assinatura de e-mail.
          </p>
        ),
      }}
      faq={FAQ}
      related={["cpf-cnpj", "gerador-qr"]}
      ctaText="Precisa de mais ferramentas?"
    >
      <PhoneFormatter />
    </ToolPage>
  );
}
