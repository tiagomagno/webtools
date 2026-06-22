import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import JurosSimples from './JurosSimples';

const DESC = 'Calcule juros simples: montante, valor dos juros e total a pagar. Escolha taxa mensal ou anual e número de períodos. Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'juros-simples',
  title: 'Calculadora de Juros Simples',
  description: DESC,
  keywords: ['calculadora juros simples', 'calcular juros simples', 'juros simples online', 'montante juros simples', 'taxa de juros'],
});

export default function Page() {
  return (
    <ToolPage
      slug="juros-simples"
      title="Calculadora de Juros Simples"
      emoji="📈"
      heroDescription={<>Calcule o <strong style={{ color: 'var(--text)' }}>montante, juros e total a pagar</strong> com a fórmula M = P(1 + i·n).</>}
      schemaName="Calculadora de Juros Simples Online"
      schemaDescription={DESC}
      faq={[
        { q: 'Qual a diferença entre juros simples e compostos?', a: 'Nos juros simples, os juros incidem apenas sobre o capital inicial. Nos compostos, incidem sobre o saldo acumulado (juros sobre juros).' },
        { q: 'Qual a fórmula dos juros simples?', a: 'M = P × (1 + i × n), onde P é o capital, i é a taxa e n é o número de períodos.' },
        { q: 'Quando os juros simples são usados?', a: 'Em operações de curto prazo, cheque especial, alguns empréstimos pessoais e desconto de duplicatas.' },
      ]}
      related={['juros-compostos', 'simulador-financiamento', 'calculadora-investimento']}
    >
      <JurosSimples />
    </ToolPage>
  );
}
