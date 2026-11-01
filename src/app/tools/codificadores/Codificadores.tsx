"use client";

import { Binary, Key, LinkSimple } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import Base64Tool from "../../components/Base64Tool";
import UrlTools from "./UrlTools";
import JwtDecoder from "./JwtDecoder";

export default function Codificadores() {
  return (
    <ToolTabs
      label="Tipo de codificação"
      tabs={[
        { id: "base64", label: "Base64", icon: Binary, content: <Base64Tool /> },
        { id: "url", label: "URL", icon: LinkSimple, content: <UrlTools /> },
        { id: "jwt", label: "JWT", icon: Key, content: <JwtDecoder /> },
      ]}
    />
  );
}
