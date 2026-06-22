import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import IrAcoes from './IrAcoes';

const DESC = 'Calcule o Imposto de Renda sobre ganho de capital em ações. Alíquota 15% (swing trade) ou 20% (day trade). Isenção até R$20.000.';

export const metadata = toolMetadata({
  slug: 'calculadora-ir-acoes',
  title: 'Calculadora de IR sobre Ações — Ganho de Capital',
  description: DESC,
  keywords: ['ir acoes', 'imposto de renda acoes', 'ganho de capital', 'day trade ir', 'swing trade ir', 'isenção 20000 acoes'],
});

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-ir-acoes"
      title="IR sobre Ações"
      emoji="📊"
      heroDescription={<>Calcule o <strong style={{ color: 'var(--text)' }}>IR sobre ganho de capital em ações</strong> com alíquota 15% (swing) ou 20% (day trade).</>}
      schemaName="Calculadora de IR sobre Ganho de Capital em Ações"
      schemaDescription={DESC}
      faq={[
        { q: 'Qual a alíquota do IR sobre ações?', a: 'Mercado à vista (swing trade): 15%. Day trade: 20% sobre o lucro líquido.' },
        { q: 'Existe isenção para ações?', a: 'Sim. No mercado à vista, vendas totais até R$20.000 no mês são isentas de IR para pessoa física.' },
        { q: 'O prejuízo pode ser compensado?', a: 'Sim. Prejuízos em ações podem ser compensados com lucros futuros na mesma categoria (day trade com day trade, swing com swing).' },
      ]}
      related={['calculadora-investimento', 'calculadora-salario', 'calculadora-porcentagem']}
    >
      <IrAcoes />
    </ToolPage>
  );
}
