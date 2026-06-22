import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import InssAutonomo from './InssAutonomo';

const DESC = 'Calcule a contribuição do INSS para autônomos e contribuintes individuais em 2026. Plano simplificado (11%) e completo (20%). Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'calculadora-inss-autonomo',
  title: 'Calculadora de INSS para Autônomo 2026',
  description: DESC,
  keywords: ['inss autonomo', 'contribuição individual inss', 'calculo inss autonomo', 'previdencia autonomo', 'inss 2026', 'contribuinte individual'],
});

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-inss-autonomo"
      title="INSS Autônomo 2026"
      emoji="🧾"
      heroDescription={<>Calcule a <strong style={{ color: 'var(--text)' }}>contribuição previdenciária</strong> para autônomos e contribuintes individuais com as alíquotas 2026.</>}
      schemaName="Calculadora de INSS para Autônomo 2026"
      schemaDescription={DESC}
      faq={[
        { q: 'Qual a alíquota do INSS para autônomo?', a: 'O contribuinte individual (autônomo) paga 20% sobre a remuneração, limitada ao teto de R$8.157,41 (2026). Há o plano simplificado de 11% sobre o salário mínimo.' },
        { q: 'O que é o plano simplificado (11%)?', a: 'Permite contribuir com 11% sobre o salário mínimo, mas não dá direito a aposentadoria por tempo de contribuição.' },
        { q: 'Qual a diferença para o MEI?', a: 'O MEI tem um valor fixo mensal (DAS MEI), bem menor. Mas tem limite de faturamento anual (R$169.200 em 2026).' },
      ]}
      related={['calculadora-salario', 'calculadora-mei', 'simulador-aposentadoria']}
    >
      <InssAutonomo />
    </ToolPage>
  );
}
