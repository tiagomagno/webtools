"use client";

import { useState } from "react";
import SqlFormatter from "./SqlFormatter";
import HtmlFormatter from "./HtmlFormatter";
import CssMinifier from "./CssMinifier";
import XmlFormatter from "./XmlFormatter";

export default function CodeFormatterTools() {
  const [activeTab, setActiveTab] = useState<"sql" | "html" | "css" | "xml">("sql");

  const btnStyle = (tab: string) => ({
    padding: "8px 16px",
    background: activeTab === tab ? "var(--accent)" : "transparent",
    color: activeTab === tab ? "#fff" : "var(--text-muted)",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 10, flexWrap: "wrap" }}>
        <button onClick={() => setActiveTab("sql")} style={btnStyle("sql")}>SQL</button>
        <button onClick={() => setActiveTab("html")} style={btnStyle("html")}>HTML</button>
        <button onClick={() => setActiveTab("css")} style={btnStyle("css")}>CSS (Minify)</button>
        <button onClick={() => setActiveTab("xml")} style={btnStyle("xml")}>XML</button>
      </div>

      {activeTab === "sql" && <SqlFormatter />}
      {activeTab === "html" && <HtmlFormatter />}
      {activeTab === "css" && <CssMinifier />}
      {activeTab === "xml" && <XmlFormatter />}
    </div>
  );
}
