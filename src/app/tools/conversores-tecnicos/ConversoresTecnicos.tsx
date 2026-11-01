"use client";

import { Calculator, ClockClockwise, Ruler, Table } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import BaseConverter from "./BaseConverter";
import TimestampTool from "./TimestampTool";
import AsciiTable from "./AsciiTable";
import CssUnits from "./CssUnits";

export default function ConversoresTecnicos() {
  return (
    <ToolTabs
      label="Tipo de conversão"
      tabs={[
        { id: "bases", label: "Bases numéricas", icon: Calculator, content: <BaseConverter /> },
        { id: "timestamp", label: "Timestamp Unix", icon: ClockClockwise, content: <TimestampTool /> },
        { id: "ascii", label: "Tabela ASCII", icon: Table, content: <AsciiTable /> },
        { id: "css", label: "Unidades CSS", icon: Ruler, content: <CssUnits /> },
      ]}
    />
  );
}
