import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import CardGenerator from './CardGenerator';

const DESC = 'Gere números de cartão de crédito válidos pelo algoritmo Luhn para testes. Visa, Mastercard, Amex e Elo. Não são cartões reais.';

export const metadata = toolMetadata({
  slug: 'gerador-cartao',
  title: 'Gerador de Número de Cartão de Crédito para Testes',
  description: DESC,
  keywords: ['gerador cartão crédito', 'número cartão teste', 'luhn generator', 'visa teste', 'mastercard fake', 'cartão crédito válido teste'],
});

export default function Page() {
  return (
    <ToolPage
      slug="gerador-cartao"
      title="Gerador de Cartão para Testes"
      emoji="💳"
      heroDescription={<>Gere <strong style={{ color: 'var(--text)' }}>números de cartão Luhn-válidos</strong> para Visa, Mastercard, Amex e Elo — apenas para testes.</>}
      schemaName="Gerador de Número de Cartão de Crédito para Testes"
      schemaDescription={DESC}
      faq={[
        { q: 'Estes cartões são reais?', a: 'Não. São números válidos matematicamente pelo algoritmo Luhn, mas não estão associados a nenhuma conta bancária real.' },
        { q: 'Para que serve?', a: 'Para testar formulários de pagamento em ambientes de desenvolvimento e sandbox, sem usar dados reais.' },
        { q: 'O que é o algoritmo Luhn?', a: 'É um algoritmo de verificação de dígitos usado para validar números de cartão de crédito. Todo número de cartão válido passa nesta verificação.' },
      ]}
      related={['validador-luhn', 'gerador-cpf', 'gerador-cnpj']}
    >
      <CardGenerator />
    </ToolPage>
  );
}
