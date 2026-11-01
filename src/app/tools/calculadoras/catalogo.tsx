"use client";

import type { ComponentType } from "react";
import {
  BowlFood, CalendarBlank, Cake, ChartLineUp, Clock, Divide, Fire, ForkKnife, GasPump, Hourglass, Lightning,
  Monitor, PaintRoller, Percent, Ruler, Scales, Square, Tag, Thermometer, TrendUp, type Icon,
} from "@phosphor-icons/react";

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
import AreaTinta from "./AreaTinta";
import JurosSimples from "./JurosSimples";
import EnergiaCalc from "./EnergiaCalc";
import MetroQuadrado from "./MetroQuadrado";
import GasolinaVsAlcool from "./GasolinaVsAlcool";
import TelaTool from "./TelaTool";
import ConversorTempo from "./ConversorTempo";

export interface CalcDef {
  /** Preserva o slug antigo de cada calculadora: é o `?tipo=` para onde as URLs antigas redirecionam (ver next.config.ts). */
  key: string;
  label: string;
  icon: Icon;
  Component: ComponentType;
}

export const GROUPS: { title: string; items: CalcDef[] }[] = [
  { title: "Tempo e datas", items: [
    { key: "calculadora-idade", label: "Idade", icon: Cake, Component: AgeCalculator },
    { key: "calculadora-datas", label: "Datas", icon: CalendarBlank, Component: DateCalculator },
    { key: "calculadora-horas", label: "Horas", icon: Clock, Component: HoursCalculator },
    { key: "conversor-tempo", label: "Conversor de tempo", icon: Hourglass, Component: ConversorTempo },
  ] },
  { title: "Dinheiro", items: [
    { key: "juros-compostos", label: "Juros compostos", icon: TrendUp, Component: CompoundCalculator },
    { key: "juros-simples", label: "Juros simples", icon: ChartLineUp, Component: JurosSimples },
    { key: "calculadora-desconto", label: "Desconto", icon: Tag, Component: DiscountCalculator },
    { key: "calculadora-gorjeta", label: "Gorjeta", icon: ForkKnife, Component: TipCalculator },
  ] },
  { title: "Números", items: [
    { key: "calculadora-porcentagem", label: "Porcentagem", icon: Percent, Component: PercentCalculator },
    { key: "regra-de-tres", label: "Regra de três", icon: Divide, Component: RuleOfThree },
  ] },
  { title: "Conversores", items: [
    { key: "conversor-unidades", label: "Unidades", icon: Ruler, Component: UnitConverter },
    { key: "conversor-temperatura", label: "Temperatura", icon: Thermometer, Component: TempConverter },
    { key: "calculadora-tela", label: "Tela (polegadas e proporção)", icon: Monitor, Component: TelaTool },
  ] },
  { title: "Saúde", items: [
    { key: "calculadora-imc", label: "IMC", icon: Scales, Component: BmiCalculator },
    { key: "calculadora-calorias", label: "Calorias", icon: Fire, Component: CalorieCalculator },
    { key: "calculadora-macros", label: "Macros", icon: BowlFood, Component: MacroCalculator },
  ] },
  { title: "Casa", items: [
    { key: "area-tinta", label: "Área e tinta", icon: PaintRoller, Component: AreaTinta },
    { key: "calculadora-metro-quadrado", label: "Custo por m²", icon: Square, Component: MetroQuadrado },
    { key: "calculadora-energia", label: "Energia", icon: Lightning, Component: EnergiaCalc },
  ] },
  { title: "Carro", items: [
    { key: "calculadora-combustivel", label: "Combustível", icon: GasPump, Component: FuelCalculator },
    { key: "gasolina-vs-alcool", label: "Gasolina vs álcool", icon: GasPump, Component: GasolinaVsAlcool },
  ] },
];

export const ALL = GROUPS.flatMap((g) => g.items);

