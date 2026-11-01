"use client";

import { Briefcase, Hourglass, Money, Receipt } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import SalaryCalculator from "./SalaryCalculator";
import RescisaoCalculator from "./RescisaoCalculator";
import InssAutonomo from "./InssAutonomo";
import MeiTool from "./MeiTool";
import AposentadoriaTool from "./AposentadoriaTool";

export default function TrabalhoImpostos() {
  return (
    <ToolTabs
      label="Trabalho e Impostos"
      tabs={[
        { id: "salario", label: "Salário líquido", icon: Money, content: <SalaryCalculator /> },
        { id: "rescisao", label: "Rescisão", icon: Receipt, content: <RescisaoCalculator /> },
        { id: "inss", label: "INSS autônomo", icon: Briefcase, content: <InssAutonomo /> },
        { id: "mei", label: "MEI (DAS)", icon: Receipt, content: <MeiTool /> },
        { id: "aposentadoria", label: "Aposentadoria", icon: Hourglass, content: <AposentadoriaTool /> },
      ]}
    />
  );
}
