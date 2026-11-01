"use client";

import SubTabs from "./SubTabs";
import SqlFormatter from "./SqlFormatter";
import HtmlFormatter from "./HtmlFormatter";
import CssMinifier from "./CssMinifier";
import XmlFormatter from "./XmlFormatter";

export default function CodeFormatterTools() {
  return (
    <SubTabs
      label="Linguagem"
      tabs={[
        { id: "sql", label: "SQL", content: <SqlFormatter /> },
        { id: "html", label: "HTML", content: <HtmlFormatter /> },
        { id: "css", label: "CSS (minificar)", content: <CssMinifier /> },
        { id: "xml", label: "XML", content: <XmlFormatter /> },
      ]}
    />
  );
}
