import ToolPage from "../../components/ToolPage";
import { toolMetadata } from "../../lib/seo";
import PasswordGenerator from "./PasswordGenerator";

const DESCRIPTION =
  "Gere senhas fortes e aleatórias com tamanho e tipos de caracteres personalizados, usando o gerador criptográfico do navegador. Grátis e sem upload.";

export const metadata = toolMetadata({
  slug: "gerador-senha",
  title: "Gerador de Senhas Online — Criar Senhas Fortes Grátis",
  description: DESCRIPTION,
});

const FAQ = [
  { q: "As senhas são realmente aleatórias?", a: "Sim. Usamos crypto.getRandomValues, o gerador de números aleatórios criptográfico do navegador, com seleção sem viés de módulo." },
  { q: "Qual o tamanho ideal de senha?", a: "Pelo menos 12 a 16 caracteres com letras, números e símbolos. Quanto maior e mais variada, maior a entropia e a resistência a ataques." },
  { q: "O que é entropia em bits?", a: "É uma medida de imprevisibilidade. Acima de 80 bits a senha é considerada muito forte para os padrões atuais. O medidor mostra essa estimativa." },
  { q: "Por que evitar caracteres ambíguos?", a: "Caracteres como O/0 e l/I/1 podem ser confundidos ao digitar manualmente. A opção os remove, útil para senhas que serão lidas em voz alta ou copiadas à mão." },
  { q: "A senha é enviada para servidores?", a: "Não. A geração acontece inteiramente no seu navegador, sem registro ou envio." },
];

export default function Page() {
  return (
    <ToolPage
      slug="gerador-senha"
      emoji="🔑"
      title="Gerador de Senhas"
      heroDescription={
        <>
          Crie <strong style={{ color: "var(--text)" }}>senhas fortes e aleatórias</strong> com tamanho e tipos de
          caracteres personalizados, usando o gerador criptográfico do navegador.
        </>
      }
      schemaName="Gerador de Senhas"
      schemaDescription={DESCRIPTION}
      content={{
        heading: "Como criar uma senha segura",
        body: <p>Ajuste o comprimento e escolha quais conjuntos de caracteres incluir. O medidor de força mostra a entropia estimada em tempo real. Clique em ↻ para gerar outra e em Copiar para usar. Nada é enviado para servidores.</p>,
      }}
      faq={FAQ}
      related={["gerador-qr", "hash-generator", "uuid-massa"]}
      ctaText="Precisa de mais utilidades?"
    >
      <PasswordGenerator />
    </ToolPage>
  );
}
