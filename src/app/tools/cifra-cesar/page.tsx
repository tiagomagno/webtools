import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import CaesarCipher from "./CaesarCipher";

const DESCRIPTION = "Codifique e decodifique textos com a Cifra de César (ROT-N). Suporta qualquer deslocamento de 1 a 25, incluindo ROT13. Grátis e sem cadastro.";

export const metadata = toolMetadata({
  slug: "cifra-cesar",
  title: "Cifra de César Online — ROT13 e ROT-N com Qualquer Deslocamento",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "O que é a Cifra de César?", a: "É uma das cifras de substituição mais antigas, criada por Júlio César. Cada letra é substituída por outra que está N posições à frente no alfabeto." },
  { q: "O que é ROT13?", a: "ROT13 é a Cifra de César com deslocamento 13 — a metade de 26 letras. Isso faz com que codificar e decodificar sejam a mesma operação." },
  { q: "Espaços e números são afetados?", a: "Não. Apenas letras de A a Z são deslocadas. Espaços, números e símbolos permanecem inalterados." },
  { q: "A cifra é segura?", a: "Não. A Cifra de César é trivialmente quebrável por força bruta (apenas 25 tentativas). Use-a apenas para fins educacionais ou lúdicos." },
];

export default function Page() {
  return (
    <ToolPage
      slug="cifra-cesar"
      emoji="🔐"
      title="Cifra de César"
      heroDescription={<>Codifique e decodifique textos com a clássica <strong style={{ color: "var(--text)" }}>Cifra de César</strong>, incluindo ROT13.</>}
      schemaName="Cifra de César"
      schemaDescription={DESCRIPTION}
      content={{ heading: "Como a Cifra de César funciona", body: <p>Cada letra do texto é deslocada N posições no alfabeto. Com shift 3, 'A' vira 'D', 'B' vira 'E', e assim por diante. Para decodificar, basta usar o deslocamento inverso (-N).</p> }}
      faq={FAQ}
      related={["hash-generator", "base64-encode", "jwt-decoder"]}
      ctaText="Precisa de mais ferramentas de Dev?"
    >
      <CaesarCipher />
    </ToolPage>
  );
}
