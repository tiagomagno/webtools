"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ALL } from "./catalogo";

function HubInner() {
  const tipo = useSearchParams().get("tipo");
  const current = ALL.find((c) => c.key === tipo);

  if (!current) {
    return (
      <p className="cut-box" style={{ margin: 0, padding: 32, textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
        Selecione o tipo de calculadora no menu acima, ao lado do título.
      </p>
    );
  }

  const Comp = current.Component;
  return <Comp />;
}

export default function CalculadorasHub() {
  return (
    <Suspense fallback={null}>
      <HubInner />
    </Suspense>
  );
}
