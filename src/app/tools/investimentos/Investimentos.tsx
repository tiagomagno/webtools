"use client";

import { ChartLineUp, TrendUp } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import InvestmentCalculator from "./InvestmentCalculator";
import IrAcoes from "./IrAcoes";

export default function Investimentos() {
  return (
    <ToolTabs
      label="Investimentos"
      tabs={[
        { id: "comparador", label: "Comparador", icon: ChartLineUp, content: <InvestmentCalculator /> },
        { id: "ir-acoes", label: "IR sobre ações", icon: TrendUp, content: <IrAcoes /> },
      ]}
    />
  );
}
