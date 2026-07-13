"use client";

import { useState } from "react";
import JsonFormatter from "./JsonFormatter";
import JsonValidator from "./JsonValidator";
import JsonDiff from "./JsonDiff";

export default function JsonTools() {
  const [activeTab, setActiveTab] = useState<"formatter" | "validator" | "diff">("formatter");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab("formatter")}
          style={{
            padding: "8px 16px",
            background: activeTab === "formatter" ? "var(--accent)" : "transparent",
            color: activeTab === "formatter" ? "#fff" : "var(--text-muted)",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Formatter
        </button>
        <button
          onClick={() => setActiveTab("validator")}
          style={{
            padding: "8px 16px",
            background: activeTab === "validator" ? "var(--accent)" : "transparent",
            color: activeTab === "validator" ? "#fff" : "var(--text-muted)",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Validator
        </button>
        <button
          onClick={() => setActiveTab("diff")}
          style={{
            padding: "8px 16px",
            background: activeTab === "diff" ? "var(--accent)" : "transparent",
            color: activeTab === "diff" ? "#fff" : "var(--text-muted)",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Diff
        </button>
      </div>

      {activeTab === "formatter" && <JsonFormatter />}
      {activeTab === "validator" && <JsonValidator />}
      {activeTab === "diff" && <JsonDiff />}
    </div>
  );
}
