"use client";

import SubTabs from "./SubTabs";
import JsonFormatter from "./JsonFormatter";
import JsonValidator from "./JsonValidator";
import JsonDiff from "./JsonDiff";

export default function JsonTools() {
  return (
    <SubTabs
      label="Ação com JSON"
      tabs={[
        { id: "formatter", label: "Formatar", content: <JsonFormatter /> },
        { id: "validator", label: "Validar", content: <JsonValidator /> },
        { id: "diff", label: "Comparar", content: <JsonDiff /> },
      ]}
    />
  );
}
