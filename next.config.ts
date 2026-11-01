import type { NextConfig } from "next";

// Build usado só para empacotar o app Electron: gera export estático (sem
// servidor Next por trás) porque o app desktop só abre o HTML/JS local e
// fala com a API (webtools/server) diretamente. O site público continua
// como servidor Next normal (output "standalone"), sem mudar nada aqui.
const isElectronBuild = process.env.BUILD_TARGET === "electron";

// As 20 calculadoras foram unificadas em /tools/calculadoras (com abas).
// Mantém as URLs antigas funcionando via redirect permanente para a aba certa.
const CALCULATOR_SLUGS = [
  "calculadora-idade",
  "calculadora-imc",
  "calculadora-porcentagem",
  "calculadora-desconto",
  "juros-compostos",
  "juros-simples",
  "calculadora-datas",
  "calculadora-horas",
  "conversor-tempo",
  "conversor-temperatura",
  "conversor-unidades",
  "calculadora-metro-quadrado",
  "calculadora-tela",
  "calculadora-combustivel",
  "gasolina-vs-alcool",
  "calculadora-energia",
  "calculadora-gorjeta",
  "regra-de-tres",
  "calculadora-calorias",
  "calculadora-macros",
];

// Ferramentas de imagem e cor unificadas (Conversor de Imagens, Editor de Imagem e Paleta de Cores).
// Cada página antiga redireciona para a ferramenta nova já com a opção certa selecionada.
const MERGED_TOOLS: { from: string; to: string }[] = [
  { from: "jpg-para-png", to: "/tools/editor-imagem?acao=exportar&formato=png" },
  { from: "png-para-jpg", to: "/tools/editor-imagem?acao=exportar&formato=jpg" },
  { from: "heic-para-jpg", to: "/tools/editor-imagem?acao=exportar&formato=jpg" },
  { from: "webp-converter", to: "/tools/editor-imagem?acao=exportar&formato=webp" },
  { from: "image-to-base64", to: "/tools/editor-imagem?acao=exportar&formato=base64" },
  { from: "image-converter", to: "/tools/editor-imagem?acao=exportar" },
  { from: "redimensionador-imagem", to: "/tools/editor-imagem" },
  { from: "cortador-imagem", to: "/tools/editor-imagem" },
  { from: "image-upscaler", to: "/tools/editor-imagem" },
  { from: "compressor-imagem", to: "/tools/editor-imagem?acao=exportar&formato=jpg" },
  { from: "extrator-cores", to: "/tools/color-palette?modo=imagem" },
  { from: "conversor-cores", to: "/tools/color-palette?modo=base" },
  { from: "json-formatter", to: "/tools/formatador-dados?tipo=json" },
  { from: "formatador-codigo", to: "/tools/formatador-dados?tipo=codigo" },
  { from: "csv-para-json", to: "/tools/formatador-dados?tipo=csv" },
  { from: "json-para-csv", to: "/tools/formatador-dados?tipo=csv" },
  { from: "markdown-para-html", to: "/tools/formatador-dados?tipo=markdown" },
  { from: "base64-encode", to: "/tools/codificadores?tipo=base64" },
  { from: "codificador-url", to: "/tools/codificadores?tipo=url" },
  { from: "jwt-decoder", to: "/tools/codificadores?tipo=jwt" },
  { from: "hash-generator", to: "/tools/hash-uuid?tipo=hash" },
  { from: "uuid-generator", to: "/tools/hash-uuid?tipo=uuid" },
  { from: "uuid-massa", to: "/tools/hash-uuid?tipo=massa" },
  { from: "conversor-bases", to: "/tools/conversores-tecnicos?tipo=bases" },
  { from: "unix-timestamp", to: "/tools/conversores-tecnicos?tipo=timestamp" },
  { from: "tabela-ascii", to: "/tools/conversores-tecnicos?tipo=ascii" },
  { from: "css-units", to: "/tools/conversores-tecnicos?tipo=css" },
  { from: "regex-tester", to: "/tools/regex-cron?tipo=regex" },
  { from: "cron-helper", to: "/tools/regex-cron?tipo=cron" },
  { from: "contador-palavras", to: "/tools/analisador-texto?tipo=palavras" },
  { from: "contador-linhas", to: "/tools/analisador-texto?tipo=linhas" },
  { from: "contador-vogais", to: "/tools/analisador-texto?tipo=frequencia" },
  { from: "formatador-texto", to: "/tools/editor-texto?tipo=caixa" },
  { from: "inversor-texto", to: "/tools/editor-texto?tipo=inverter" },
  { from: "removedor-acentos", to: "/tools/editor-texto?tipo=acentos" },
  { from: "ordenador-linhas", to: "/tools/editor-texto?tipo=ordenar" },
  { from: "text-cleaner", to: "/tools/editor-texto?tipo=limpeza" },
  { from: "texto-para-slug", to: "/tools/editor-texto?tipo=slug" },
  { from: "numero-por-extenso", to: "/tools/codificacoes-texto?tipo=extenso" },
  { from: "texto-para-morse", to: "/tools/codificacoes-texto?tipo=morse" },
  { from: "cifra-cesar", to: "/tools/codificacoes-texto?tipo=cesar" },
  { from: "pdf-extractor", to: "/tools/extrator-documentos?tipo=texto" },
  { from: "documento-para-markdown", to: "/tools/extrator-documentos?tipo=markdown" },
  { from: "unir-pdf", to: "/tools/ferramentas-pdf?tipo=unir" },
  { from: "dividir-pdf", to: "/tools/ferramentas-pdf?tipo=dividir" },
  { from: "pdf-compressor", to: "/tools/ferramentas-pdf?tipo=comprimir" },
  { from: "jpg-para-pdf", to: "/tools/ferramentas-pdf?tipo=jpg-para-pdf" },
  { from: "pdf-para-jpg", to: "/tools/ferramentas-pdf?tipo=pdf-para-jpg" },
  { from: "gerador-qr", to: "/tools/qr-code?tipo=gerar" },
  { from: "leitor-qr", to: "/tools/qr-code?tipo=ler" },
  { from: "gerador-senha", to: "/tools/geradores?tipo=senha" },
  { from: "lorem-ipsum", to: "/tools/geradores?tipo=lorem" },
  { from: "gerador-anagrama", to: "/tools/geradores?tipo=anagrama" },
  { from: "sorteador", to: "/tools/geradores?tipo=sorteio" },
  { from: "cpf-cnpj", to: "/tools/documentos-br?tipo=cpf-cnpj" },
  { from: "gerador-cartao", to: "/tools/documentos-br?tipo=cartao" },
  { from: "validador-luhn", to: "/tools/documentos-br?tipo=luhn" },
  { from: "formatador-telefone", to: "/tools/documentos-br?tipo=telefone" },
  { from: "calculadora-salario", to: "/tools/trabalho-impostos?tipo=salario" },
  { from: "calculadora-rescisao", to: "/tools/trabalho-impostos?tipo=rescisao" },
  { from: "calculadora-inss-autonomo", to: "/tools/trabalho-impostos?tipo=inss" },
  { from: "calculadora-mei", to: "/tools/trabalho-impostos?tipo=mei" },
  { from: "simulador-aposentadoria", to: "/tools/trabalho-impostos?tipo=aposentadoria" },
  { from: "simulador-financiamento", to: "/tools/imoveis?tipo=financiamento" },
  { from: "reajuste-aluguel", to: "/tools/imoveis?tipo=aluguel" },
  { from: "calculadora-investimento", to: "/tools/investimentos?tipo=comparador" },
  { from: "calculadora-ir-acoes", to: "/tools/investimentos?tipo=ir-acoes" },
  { from: "area-tinta", to: "/tools/calculadoras?tipo=area-tinta" },
  { from: "salario", to: "/tools/trabalho-impostos?tipo=salario" },
  { from: "ferramentas-texto", to: "/tools/analisador-texto?tipo=palavras" },
];

const nextConfig: NextConfig = {
  output: isElectronBuild ? "export" : "standalone",
  // Export estático não aceita redirects() (nem função vazia) — o app
  // desktop não tem as URLs antigas das calculadoras pra redirecionar mesmo.
  ...(!isElectronBuild && {
    async redirects() {
      return [
        ...CALCULATOR_SLUGS.map((slug) => ({
          source: `/tools/${slug}`,
          destination: `/tools/calculadoras?tipo=${slug}`,
          permanent: true,
        })),
        ...MERGED_TOOLS.map(({ from, to }) => ({ source: `/tools/${from}`, destination: to, permanent: true })),
      ];
    },
  }),
  // @huggingface/transformers só é usado no navegador (Web Worker) nesta
  // app; evita que o Turbopack resolva os backends Node-only da lib.
  turbopack: {
    root: __dirname,
    resolveAlias: {
      sharp: "./src/app/lib/empty-module.js",
      "onnxruntime-node": "./src/app/lib/empty-module.js",
    },
  },
};

export default nextConfig;
