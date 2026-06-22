import { toolMetadata } from '@/app/lib/seo';
import ToolPage from '@/app/components/ToolPage';
import AposentadoriaTool from './AposentadoriaTool';

const DESC = 'Simule quando você pode se aposentar pelo INSS e qual o valor estimado do benefício. Regras 2026 (Reforma da Previdência). Online e gratuito.';

export const metadata = toolMetadata({
  slug: 'simulador-aposentadoria',
  title: 'Simulador de Aposentadoria INSS 2026',
  description: DESC,
  keywords: ['simulador aposentadoria', 'quando posso me aposentar', 'calcular aposentadoria inss', 'reforma previdencia', 'aposentadoria 2026', 'tempo de contribuição'],
});

export default function Page() {
  return (
    <ToolPage
      slug="simulador-aposentadoria"
      title="Simulador de Aposentadoria INSS"
      emoji="👴"
      heroDescription={<>Simule sua <strong style={{ color: 'var(--text)' }}>aposentadoria pelo INSS</strong> com base nas regras da Reforma da Previdência de 2026.</>}
      schemaName="Simulador de Aposentadoria INSS 2026"
      schemaDescription={DESC}
      faq={[
        { q: 'Qual a idade mínima para aposentadoria em 2026?', a: '65 anos para homens (20 anos de contribuição) e 62 anos para mulheres (15 anos de contribuição), conforme a Reforma da Previdência.' },
        { q: 'Como é calculado o valor do benefício?', a: 'O benefício começa em 60% da média salarial + 2% por ano de contribuição acima do mínimo, limitado ao teto do INSS.' },
        { q: 'Esta simulação é oficial?', a: 'Não. É uma estimativa simplificada. Para uma simulação oficial, use o portal Meu INSS (meu.inss.gov.br).' },
      ]}
      related={['calculadora-inss-autonomo', 'calculadora-salario', 'calculadora-mei']}
    >
      <AposentadoriaTool />
    </ToolPage>
  );
}
