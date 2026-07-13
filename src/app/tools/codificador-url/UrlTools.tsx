"use client";

import { useState } from "react";
import UrlEncoder from "./UrlEncoder";
import UrlParser from "./UrlParser";

export default function UrlTools() {
  const [activeTab, setActiveTab] = useState<"encode" | "parser">("encode");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab("encode")}
          style={{
            padding: "8px 16px",
            background: activeTab === "encode" ? "var(--accent)" : "transparent",
            color: activeTab === "encode" ? "#fff" : "var(--text-muted)",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Encode / Decode
        </button>
        <button
          onClick={() => setActiveTab("parser")}
          style={{
            padding: "8px 16px",
            background: activeTab === "parser" ? "var(--accent)" : "transparent",
            color: activeTab === "parser" ? "#fff" : "var(--text-muted)",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Parser
        </button>
      </div>

      {activeTab === "encode" && <UrlEncoder />}
      {activeTab === "parser" && <UrlParser />}
    </div>
  );
}
