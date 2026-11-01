import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import AnalisadorTexto from "./AnalisadorTexto";

const DESCRIPTION = "Conte palavras, caracteres, frases, linhas e analise a frequência de letras, vogais e consoantes. Limites de redes sociais e tempo de leitura, tudo no navegador.";

export const metadata = toolMetadata({
  slug: "analisador-texto",
  title: "Analisador de Texto Online — Contador de Palavras, Linhas e Letras",
  description: DESCRIPTION,
});

export default function Page() {
  return (
    <ToolPage
      slug="analisador-texto"
      title="Analisador de Texto"
      heroDescription={<>Conte <strong style={{ color: "var(--text)" }}>palavras, caracteres e linhas</strong> e veja a frequência das letras, com limites de redes sociais e tempo de leitura.</>}
      schemaName="Analisador de Texto"
      schemaDescription={DESCRIPTION}
      faq={[]}
      related={["editor-texto", "comparador-textos"]}
    >
      <AnalisadorTexto />
    </ToolPage>
  );
}
