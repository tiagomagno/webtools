import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import EnergiaCalc from './EnergiaCalc';

const DESC = 'Calcule o consumo de eletrodomésticos em kWh e o custo na conta de luz. Adicione múltiplos aparelhos e veja o gasto mensal e anual.';

export const metadata = toolMetadata({
  slug: 'calculadora-energia',
  title: 'Calculadora de Consumo de Energia Elétrica',
  description: DESC,
  keywords: ['calculadora energia elétrica', 'consumo kwh', 'conta de luz', 'calcular eletricidade', 'custo eletrodoméstico', 'kwh calculadora'],
});

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-energia"
      title="Calculadora de Energia Elétrica"
      emoji="⚡"
      heroDescription={<>Calcule o <strong style={{ color: 'var(--text)' }}>consumo em kWh e o custo na conta de luz</strong> de qualquer aparelho elétrico.</>}
      schemaName="Calculadora de Consumo de Energia Elétrica"
      schemaDescription={DESC}
      faq={[
        { q: 'Como calcular o consumo de um aparelho?', a: 'Multiplique a potência (W) pelas horas de uso por dia. Divida por 1000 para obter kWh. Multiplique pelo valor do kWh da sua distribuidora.' },
        { q: 'Qual o valor médio do kWh no Brasil?', a: 'Em 2026, o valor médio está em torno de R$0,80 a R$1,00 por kWh, mas varia muito por distribuidora e bandeira tarifária.' },
        { q: 'Como saber a potência do meu aparelho?', a: 'A potência em watts (W) normalmente está indicada na etiqueta do aparelho ou no manual do fabricante.' },
      ]}
      related={['calculadora-metro-quadrado', 'calculadora-porcentagem', 'gasolina-vs-alcool']}
    >
      <EnergiaCalc />
    </ToolPage>
  );
}
