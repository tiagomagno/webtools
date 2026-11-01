"use client";

import { Fingerprint, Hash, ListNumbers } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import HashGenerator from "./HashGenerator";
import UuidGenerator from "./UuidGenerator";
import UuidBulk from "./UuidBulk";

export default function HashUuid() {
  return (
    <ToolTabs
      label="Hash ou UUID"
      tabs={[
        { id: "hash", label: "Hash", icon: Hash, content: <HashGenerator /> },
        { id: "uuid", label: "UUID v4", icon: Fingerprint, content: <UuidGenerator /> },
        { id: "massa", label: "UUID em massa", icon: ListNumbers, content: <UuidBulk /> },
      ]}
    />
  );
}
