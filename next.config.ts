import type { NextConfig } from "next";

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

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return CALCULATOR_SLUGS.map((slug) => ({
      source: `/tools/${slug}`,
      destination: `/tools/calculadoras?tipo=${slug}`,
      permanent: true,
    }));
  },
  // @huggingface/transformers só é usado no navegador (Web Worker) nesta
  // app; evita que o Turbopack resolva os backends Node-only da lib.
  turbopack: {
    resolveAlias: {
      sharp: "./src/app/lib/empty-module.js",
      "onnxruntime-node": "./src/app/lib/empty-module.js",
    },
  },
};

export default nextConfig;
