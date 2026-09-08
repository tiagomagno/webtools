"use client";

import { Suspense, useState, type ComponentType } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AgeCalculator from "./AgeCalculator";
import BmiCalculator from "./BmiCalculator";
import PercentCalculator from "./PercentCalculator";
import DiscountCalculator from "./DiscountCalculator";
import CompoundCalculator from "./CompoundCalculator";
import DateCalculator from "./DateCalculator";
import TempConverter from "./TempConverter";
import HoursCalculator from "./HoursCalculator";
import UnitConverter from "./UnitConverter";
import FuelCalculator from "./FuelCalculator";
import TipCalculator from "./TipCalculator";
import RuleOfThree from "./RuleOfThree";
import CalorieCalculator from "./CalorieCalculator";
import MacroCalculator from "./MacroCalculator";
import JurosSimples from "./JurosSimples";
import EnergiaCalc from "./EnergiaCalc";
import MetroQuadrado from "./MetroQuadrado";
import GasolinaVsAlcool from "./GasolinaVsAlcool";
import TelaTool from "./TelaTool";
import ConversorTempo from "./ConversorTempo";

interface CalcDef {
  key: string;
  label: string;
  emoji: string;
  Component: ComponentType;
}

// `key` preserva o slug antigo de cada calculadora — usado no parâmetro
// `?tipo=` para onde as URLs antigas (/tools/calculadora-idade, etc.)
// redirecionam (ver next.config.ts).
const CALCULATORS: CalcDef[] = [
  { key: "calculadora-idade", label: "Idade", emoji: "🎂", Component: AgeCalculator },
  { key: "calculadora-imc", label: "IMC", emoji: "⚖️", Component: BmiCalculator },
  { key: "calculadora-porcentagem", label: "Porcentagem", emoji: "％", Component: PercentCalculator },
  { key: "calculadora-desconto", label: "Desconto", emoji: "🏷️", Component: DiscountCalculator },
  { key: "juros-compostos", label: "Juros Compostos", emoji: "📈", Component: CompoundCalculator },
  { key: "juros-simples", label: "Juros Simples", emoji: "📈", Component: JurosSimples },
  { key: "calculadora-datas", label: "Datas", emoji: "📅", Component: DateCalculator },
  { key: "calculadora-horas", label: "Horas", emoji: "⏱️", Component: HoursCalculator },
  { key: "conversor-tempo", label: "Tempo", emoji: "🕐", Component: ConversorTempo },
  { key: "conversor-temperatura", label: "Temperatura", emoji: "🌡️", Component: TempConverter },
  { key: "conversor-unidades", label: "Unidades", emoji: "📏", Component: UnitConverter },
  { key: "calculadora-metro-quadrado", label: "Custo por m²", emoji: "📐", Component: MetroQuadrado },
  { key: "calculadora-tela", label: "Tela", emoji: "🖥️", Component: TelaTool },
  { key: "calculadora-combustivel", label: "Combustível", emoji: "⛽", Component: FuelCalculator },
  { key: "gasolina-vs-alcool", label: "Gasolina vs Álcool", emoji: "⛽", Component: GasolinaVsAlcool },
  { key: "calculadora-energia", label: "Energia", emoji: "⚡", Component: EnergiaCalc },
  { key: "calculadora-gorjeta", label: "Gorjeta", emoji: "🍽️", Component: TipCalculator },
  { key: "regra-de-tres", label: "Regra de Três", emoji: "🔢", Component: RuleOfThree },
  { key: "calculadora-calorias", label: "Calorias", emoji: "🔥", Component: CalorieCalculator },
  { key: "calculadora-macros", label: "Macros", emoji: "🥗", Component: MacroCalculator },
];

function HubInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("tipo");
  const initialKey = CALCULATORS.find((c) => c.key === fromQuery)?.key ?? CALCULATORS[0].key;
  const [active, setActive] = useState(initialKey);

  function select(key: string) {
    setActive(key);
    router.replace(`/tools/calculadoras?tipo=${key}`, { scroll: false });
  }

  const current = CALCULATORS.find((c) => c.key === active) ?? CALCULATORS[0];
  const Comp = current.Component;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
        {CALCULATORS.map((c) => {
          const isActive = c.key === active;
          return (
            <button
              key={c.key}
              onClick={() => select(c.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                background: isActive ? "var(--accent)" : "var(--surface)",
                color: isActive ? "#fff" : "var(--text)",
                fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
              }}
            >
              <span>{c.emoji}</span> {c.label}
            </button>
          );
        })}
      </div>
      <Comp />
    </div>
  );
}

export default function CalculadorasHub() {
  return (
    <Suspense fallback={null}>
      <HubInner />
    </Suspense>
  );
}
