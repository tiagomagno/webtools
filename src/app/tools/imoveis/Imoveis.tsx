"use client";

import { Bank, Buildings } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import LoanSimulator from "./LoanSimulator";
import RentAdjustment from "./RentAdjustment";

export default function Imoveis() {
  return (
    <ToolTabs
      label="Imóveis"
      tabs={[
        { id: "financiamento", label: "Financiamento", icon: Bank, content: <LoanSimulator /> },
        { id: "aluguel", label: "Reajuste de aluguel", icon: Buildings, content: <RentAdjustment /> },
      ]}
    />
  );
}
