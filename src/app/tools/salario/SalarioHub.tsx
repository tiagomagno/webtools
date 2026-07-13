"use client";

import { useState } from "react";
import SalaryCalculator from "../calculadora-salario/SalaryCalculator";
import RescisaoCalculator from "../calculadora-rescisao/RescisaoCalculator";

const TABS = [
  { id: "salario", label: "Calcular Salário", emoji: "💳" },
  { id: "rescisao", label: "Calcular Rescisão", emoji: "📋" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SalarioHub() {
  const [tab, setTab] = useState<TabId>("salario");

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 16px",
                border: "none",
                borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
                background: "transparent",
                color: active ? "var(--text)" : "var(--text-muted)",
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "salario" ? <SalaryCalculator /> : <RescisaoCalculator />}
    </div>
  );
}
