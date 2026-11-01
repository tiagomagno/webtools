import { Plus_Jakarta_Sans, Kode_Mono } from "next/font/google";

// Fontes do layout novo (Figma): texto em Plus Jakarta Sans, títulos e números em Kode Mono.
// Cada uma expõe uma variável CSS (`--font-jakarta`, `--font-kode`) para usar via `className={x.variable}`.
export const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-jakarta", display: "swap" });
export const kodeMono = Kode_Mono({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-kode", display: "swap" });
