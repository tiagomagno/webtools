# WEBTOOLS — Roadmap (100 ferramentas)

> Fonte de verdade do roadmap. Status detalhado em [implementation-status.md](./implementation-status.md).
> Última atualização: 2026-06-22

## Legenda
- **Prioridade:** P1 (essencial) → P3 (nice-to-have)
- **Dificuldade:** Baixa / Média / Alta
- **Status:** PENDENTE · EM_ANALISE · EM_DESENVOLVIMENTO · EM_TESTE · CONCLUIDO · BLOQUEADO

---

## Ferramentas pré-existentes (fora da numeração do roadmap)
Já no projeto antes do início deste orquestrador — mantidas e reaproveitadas:

| Slug | Nome | Categoria |
|------|------|-----------|
| color-palette | Paleta de Cores | Design |
| gradients | Gradientes | Design |
| css-units | Conversor CSS | CSS |
| text-cleaner | Limpeza de Texto | Texto |
| pdf-extractor | Extrator de Docs | Texto |
| pdf-compressor | Compressão de PDF | Texto |
| image-converter | Conversor de Imagens | Imagens |
| image-upscaler | Aumentar Resolução | Imagens |
| area-tinta | Área e Tinta | Construção |

---

## FASE P1 (45 ferramentas)

| # | Nome | Slug | Categoria | Dif. | Monetização | Dependências | Status |
|---|------|------|-----------|------|-------------|--------------|--------|
| 1 | Contador de Palavras | contador-palavras | Texto | Baixa | AdSense | — | CONCLUIDO |
| 2 | Contador de Caracteres | contador-caracteres | Texto | Baixa | AdSense | text-stats util | CONCLUIDO |
| 3 | Tempo de Leitura | tempo-leitura | Texto | Baixa | AdSense | text-stats util | CONCLUIDO |
| 4 | Comparador de Textos | comparador-textos | Texto | Média | AdSense | line-diff util | CONCLUIDO |
| 5 | Removedor de Linhas | removedor-linhas | Texto | Baixa | AdSense | — | CONCLUIDO |
| 6 | JSON Formatter | json-formatter | Dev | Baixa | AdSense | json-tools util | CONCLUIDO |
| 7 | JSON Validator | json-validator | Dev | Baixa | AdSense | json-tools util | CONCLUIDO |
| 8 | JSON Diff | json-diff | Dev | Média | AdSense | json-tools util | CONCLUIDO |
| 9 | SQL Formatter | sql-formatter | Dev | Média | AdSense | sql-format util | CONCLUIDO |
| 10 | Base64 Encode | base64-encode | Dev | Baixa | AdSense | base64 util | CONCLUIDO |
| 11 | Base64 Decode | base64-decode | Dev | Baixa | AdSense | base64 util | CONCLUIDO |
| 12 | JWT Decoder | jwt-decoder | Dev | Baixa | AdSense | base64 util | CONCLUIDO |
| 13 | UUID Generator | uuid-generator | Dev | Baixa | AdSense | — | CONCLUIDO |
| 14 | Hash Generator | hash-generator | Dev | Baixa | AdSense | hash util | CONCLUIDO |
| 15 | Open Graph Preview | open-graph-preview | SEO | Média | AdSense | seo-tools util | CONCLUIDO |
| 16 | Robots Generator | robots-generator | SEO | Baixa | AdSense | seo-tools util | CONCLUIDO |
| 17 | Gerador UTM | gerador-utm | SEO | Baixa | AdSense | seo-tools util | CONCLUIDO |
| 18 | SERP Preview | serp-preview | SEO | Baixa | AdSense | seo-tools util | CONCLUIDO |
| 19 | Compressor Imagem | compressor-imagem | Imagens | Média | AdSense | image-tools util | CONCLUIDO |
| 20 | JPG→PNG | jpg-para-png | Imagens | Baixa | AdSense | FormatConverter | CONCLUIDO |
| 21 | PNG→JPG | png-para-jpg | Imagens | Baixa | AdSense | FormatConverter | CONCLUIDO |
| 22 | WebP Converter | webp-converter | Imagens | Baixa | AdSense | FormatConverter | CONCLUIDO |
| 23 | Redimensionador | redimensionador-imagem | Imagens | Média | AdSense | image-tools util | CONCLUIDO |
| 24 | Cortador Imagem | cortador-imagem | Imagens | Média | AdSense | image-tools (crop) | CONCLUIDO |
| 25 | Gerador Favicon | gerador-favicon | Imagens | Média | AdSense | image-tools (crop) | CONCLUIDO |
| 26 | JPG→PDF | jpg-para-pdf | PDF | Média | AdSense | pdf-tools util | CONCLUIDO |
| 27 | PDF→JPG | pdf-para-jpg | PDF | Média | AdSense | pdf-tools util | CONCLUIDO |
| 28 | Unir PDF | unir-pdf | PDF | Média | AdSense | pdf-tools util | CONCLUIDO |
| 29 | Dividir PDF | dividir-pdf | PDF | Média | AdSense | pdf-tools util | CONCLUIDO |
| 30 | Compactar PDF | compactar-pdf | PDF | Média | AdSense | pdf-compressor | CONCLUIDO (consolidado no `pdf-compressor` existente — ver decisions.md) |
| 31 | CSV→JSON | csv-para-json | Dados | Média | AdSense | csv-json util | CONCLUIDO |
| 32 | JSON→CSV | json-para-csv | Dados | Média | AdSense | csv-json util | CONCLUIDO |
| 33 | Markdown→HTML | markdown-para-html | Dev | Média | AdSense | markdown util | CONCLUIDO |
| 34 | Texto→Slug | texto-para-slug | Texto | Baixa | AdSense | slugify util | CONCLUIDO |
| 35 | Unix Timestamp | unix-timestamp | Dev | Baixa | AdSense | — | CONCLUIDO |
| 36 | Gerador QR | gerador-qr | Utilidades | Média | AdSense | qrcode (lib) | CONCLUIDO |
| 37 | Leitor QR | leitor-qr | Utilidades | Média | AdSense | jsqr (lib) | CONCLUIDO |
| 38 | Gerador Senha | gerador-senha | Utilidades | Baixa | AdSense | password util | CONCLUIDO |
| 39 | UUID Massa | uuid-massa | Dev | Baixa | AdSense | uuid util | CONCLUIDO |
| 40 | Sorteador | sorteador | Utilidades | Baixa | AdSense | — | CONCLUIDO |
| 41 | Calculadora Idade | calculadora-idade | Calculadoras | Baixa | AdSense | format util | CONCLUIDO |
| 42 | IMC | calculadora-imc | Calculadoras | Baixa | AdSense | format util | CONCLUIDO |
| 43 | Porcentagem | calculadora-porcentagem | Calculadoras | Baixa | AdSense | format util | CONCLUIDO |
| 44 | Desconto | calculadora-desconto | Calculadoras | Baixa | AdSense | format util | CONCLUIDO |
| 45 | Juros Compostos | juros-compostos | Calculadoras | Média | AdSense | format util | CONCLUIDO |
| E1 | Calculadora de Datas | calculadora-datas | Calculadoras | Baixa | AdSense | — | CONCLUIDO (extra fora da numeração original) |
| E2 | Conversor de Temperatura | conversor-temperatura | Calculadoras | Baixa | AdSense | — | CONCLUIDO (extra fora da numeração original) |

---

## FASE P2 (30 ferramentas — #46–#75)

> P1 concluída em 2026-06-22. P2 iniciada em 2026-06-22.

### Texto (#46–#52)

| # | Nome | Slug | Categoria | Dif. | Dependências | Status |
|---|------|------|-----------|------|--------------|--------|
| 46 | Formatador de Texto | formatador-texto | Texto | Baixa | text-transform util | PENDENTE |
| 47 | Inversor de Texto | inversor-texto | Texto | Baixa | text-transform util | PENDENTE |
| 48 | Contador de Linhas | contador-linhas | Texto | Baixa | text-transform util | PENDENTE |
| 49 | Removedor de Acentos | removedor-acentos | Texto | Baixa | text-transform util | PENDENTE |
| 50 | Ordenador de Linhas | ordenador-linhas | Texto | Baixa | text-transform util | PENDENTE |
| 51 | Cifra de César | cifra-cesar | Texto | Baixa | text-transform util | PENDENTE |
| 52 | Número por Extenso | numero-por-extenso | Texto | Média | text-transform util | PENDENTE |

### Dev (#53–#57)

| # | Nome | Slug | Categoria | Dif. | Dependências | Status |
|---|------|------|-----------|------|--------------|--------|
| 53 | Testador de Regex | regex-tester | Dev | Média | — (RegExp nativo) | PENDENTE |
| 54 | HTML Formatter | html-formatter | Dev | Média | dev-tools util | PENDENTE |
| 55 | Minificador CSS | css-minifier | Dev | Baixa | dev-tools util | PENDENTE |
| 56 | Conversor de Bases | conversor-bases | Dev | Baixa | dev-tools util | PENDENTE |
| 57 | Tabela ASCII | tabela-ascii | Dev | Baixa | — | PENDENTE |

### Utilidades BR (#58–#63)

| # | Nome | Slug | Categoria | Dif. | Dependências | Status |
|---|------|------|-----------|------|--------------|--------|
| 58 | Gerador de CPF | gerador-cpf | Utilidades BR | Baixa | cpf-cnpj util | PENDENTE |
| 59 | Validador de CPF | validador-cpf | Utilidades BR | Baixa | cpf-cnpj util | PENDENTE |
| 60 | Gerador de CNPJ | gerador-cnpj | Utilidades BR | Baixa | cpf-cnpj util | PENDENTE |
| 61 | Validador de CNPJ | validador-cnpj | Utilidades BR | Baixa | cpf-cnpj util | PENDENTE |
| 62 | Validador de E-mail | validador-email | Utilidades BR | Baixa | — | PENDENTE |
| 63 | Formatador de Telefone | formatador-telefone | Utilidades BR | Baixa | — | PENDENTE |

### Calculadoras (#64–#70)

| # | Nome | Slug | Categoria | Dif. | Dependências | Status |
|---|------|------|-----------|------|--------------|--------|
| 64 | Calculadora de Horas | calculadora-horas | Calculadoras | Baixa | — | PENDENTE |
| 65 | Conversor de Unidades | conversor-unidades | Calculadoras | Baixa | units util | PENDENTE |
| 66 | Calculadora de Combustível | calculadora-combustivel | Calculadoras | Baixa | — | PENDENTE |
| 67 | Calculadora de Gorjeta | calculadora-gorjeta | Calculadoras | Baixa | — | PENDENTE |
| 68 | Regra de Três | regra-de-tres | Calculadoras | Baixa | — | PENDENTE |
| 69 | Calculadora de Calorias | calculadora-calorias | Calculadoras | Baixa | — | PENDENTE |
| 70 | Calculadora de Macros | calculadora-macros | Calculadoras | Baixa | — | PENDENTE |

### Finanças (#71–#75)

| # | Nome | Slug | Categoria | Dif. | Dependências | Status |
|---|------|------|-----------|------|--------------|--------|
| 71 | Simulador de Financiamento | simulador-financiamento | Finanças | Média | finance util | PENDENTE |
| 72 | Calculadora de Salário Líquido | calculadora-salario | Finanças | Média | finance util | PENDENTE |
| 73 | Calculadora de Rescisão | calculadora-rescisao | Finanças | Média | finance util | PENDENTE |
| 74 | Simulador de Reajuste de Aluguel | reajuste-aluguel | Finanças | Baixa | finance util | PENDENTE |
| 75 | Comparador de Investimentos | calculadora-investimento | Finanças | Média | finance util | PENDENTE |

## FASE P3 (23 ferramentas — #76–#98)

> P2 concluída em 2026-06-22. P3 iniciada em 2026-06-22.

### Texto (#76–#78)
| # | Nome | Slug | Dif. | Status |
|---|------|------|------|--------|
| 76 | Texto para Morse | texto-para-morse | Baixa | PENDENTE |
| 77 | Frequência de Letras | contador-vogais | Baixa | PENDENTE |
| 78 | Gerador de Anagramas | gerador-anagrama | Baixa | PENDENTE |

### Dev (#79–#83)
| # | Nome | Slug | Dif. | Status |
|---|------|------|------|--------|
| 79 | Minificador JSON | json-minifier | Baixa | PENDENTE |
| 80 | Parser de URL | url-parser | Baixa | PENDENTE |
| 81 | XML Formatter | xml-formatter | Média | PENDENTE |
| 82 | Leitor de Cron | cron-helper | Média | PENDENTE |
| 83 | Gerador de Paleta | color-generator | Baixa | PENDENTE |

### Imagens (#84–#85)
| # | Nome | Slug | Dif. | Status |
|---|------|------|------|--------|
| 84 | Imagem para Base64 | image-to-base64 | Baixa | PENDENTE |
| 85 | Extrator de Cores | extrator-cores | Média | PENDENTE |

### Utilidades (#86–#88)
| # | Nome | Slug | Dif. | Status |
|---|------|------|------|--------|
| 86 | Gerador de Cartão | gerador-cartao | Baixa | PENDENTE |
| 87 | Validador Luhn | validador-luhn | Baixa | PENDENTE |
| 88 | Cronômetro Online | cronometro | Baixa | PENDENTE |

### Calculadoras (#89–#94)
| # | Nome | Slug | Dif. | Status |
|---|------|------|------|--------|
| 89 | Juros Simples | juros-simples | Baixa | PENDENTE |
| 90 | Energia Elétrica | calculadora-energia | Baixa | PENDENTE |
| 91 | Custo por m² | calculadora-metro-quadrado | Baixa | PENDENTE |
| 92 | Gasolina vs Álcool | gasolina-vs-alcool | Baixa | PENDENTE |
| 93 | Tela (PPI/Diagonal) | calculadora-tela | Baixa | PENDENTE |
| 94 | Conversor de Tempo | conversor-tempo | Baixa | PENDENTE |

### Finanças (#95–#98)
| # | Nome | Slug | Dif. | Status |
|---|------|------|------|--------|
| 95 | INSS Autônomo | calculadora-inss-autonomo | Baixa | PENDENTE |
| 96 | Impostos MEI | calculadora-mei | Baixa | PENDENTE |
| 97 | Simulador Aposentadoria | simulador-aposentadoria | Média | PENDENTE |
| 98 | IR sobre Ações | calculadora-ir-acoes | Baixa | PENDENTE |

---

## Algoritmo de escolha da próxima ferramenta
1. Menor prioridade numérica (P1 antes de P2/P3)
2. Menor dificuldade
3. Maior reaproveitamento de código existente
4. Maior potencial de SEO
5. Menor risco
6. Dependências resolvidas primeiro
