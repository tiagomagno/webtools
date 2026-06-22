import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import MeiTool from './MeiTool';

const DESC = 'Calcule o valor do DAS MEI (Documento de Arrecadação do Simples Nacional) para Microempreendedor Individual em 2026. Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'calculadora-mei',
  title: 'Calculadora do MEI — DAS 2026',
  description: DESC,
  keywords: ['calculadora mei', 'das mei', 'imposto mei', 'microempreendedor individual', 'mei 2026', 'guia mei'],
});

export default function Page() {
  return (
    <ToolPage
      slug="calculadora-mei"
      title="Calculadora do MEI (DAS)"
      emoji="🏪"
      heroDescription={<>Calcule o valor mensal do <strong style={{ color: 'var(--text)' }}>DAS MEI</strong> para comércio, serviços ou ambos em 2026.</>}
      schemaName="Calculadora DAS MEI 2026"
      schemaDescription={DESC}
      faq={[
        { q: 'O que é o DAS MEI?', a: 'DAS é o Documento de Arrecadação do Simples Nacional. O MEI paga um valor fixo mensal que inclui INSS, ICMS e/ou ISS.' },
        { q: 'Qual o faturamento máximo do MEI?', a: 'Em 2026, o MEI pode faturar até R$169.200 por ano (R$14.100/mês em média).' },
        { q: 'O que acontece se faturar acima do limite?', a: 'O empreendedor é desenquadrado do MEI e passa a ser ME (Microempresa), com tributação mais elevada pelo Simples Nacional.' },
      ]}
      related={['calculadora-inss-autonomo', 'calculadora-salario', 'simulador-aposentadoria']}
    >
      <MeiTool />
    </ToolPage>
  );
}
