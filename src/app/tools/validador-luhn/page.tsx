import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import LuhnValidator from './LuhnValidator';

const DESC = 'Valide se um número de cartão de crédito passa na verificação do algoritmo de Luhn. Detecta a bandeira automaticamente. Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'validador-luhn',
  title: 'Validador Luhn — Verificar Número de Cartão de Crédito',
  description: DESC,
  keywords: ['validador luhn', 'validar cartão crédito', 'luhn algorithm', 'verificar cartão', 'número cartão válido'],
});

export default function Page() {
  return (
    <ToolPage
      slug="validador-luhn"
      title="Validador Luhn"
      emoji="🔍"
      heroDescription={<>Valide números de cartão pelo <strong style={{ color: 'var(--text)' }}>algoritmo de Luhn</strong> e identifique a bandeira automaticamente.</>}
      schemaName="Validador Luhn de Cartão de Crédito"
      schemaDescription={DESC}
      faq={[
        { q: 'O que é o algoritmo de Luhn?', a: 'É um algoritmo de soma de verificação desenvolvido por Hans Peter Luhn em 1954. Todo número de cartão de crédito válido passa nesta verificação.' },
        { q: 'Luhn válido significa cartão ativo?', a: 'Não. A verificação Luhn apenas confirma que o número não tem erro de digitação. Não conecta com nenhum banco ou sistema de pagamento.' },
        { q: 'Como funciona o algoritmo?', a: 'O algoritmo dobra dígitos alternados da direita para a esquerda. Se a soma total for divisível por 10, o número é válido.' },
      ]}
      related={['gerador-cartao', 'validador-cpf', 'validador-cnpj']}
    >
      <LuhnValidator />
    </ToolPage>
  );
}
