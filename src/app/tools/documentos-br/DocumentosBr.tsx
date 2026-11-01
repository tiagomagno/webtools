"use client";

import { CreditCard, IdentificationCard, Phone } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import CpfCnpjTool from "./CpfCnpjTool";
import CardGenerator from "./CardGenerator";
import LuhnValidator from "./LuhnValidator";
import PhoneFormatter from "./PhoneFormatter";

export default function DocumentosBr() {
  return (
    <ToolTabs
      label="Documentos BR"
      tabs={[
        { id: "cpf-cnpj", label: "CPF e CNPJ", icon: IdentificationCard, content: <CpfCnpjTool /> },
        { id: "cartao", label: "Gerar cartão", icon: CreditCard, content: <CardGenerator /> },
        { id: "luhn", label: "Validar cartão", icon: CreditCard, content: <LuhnValidator /> },
        { id: "telefone", label: "Telefone", icon: Phone, content: <PhoneFormatter /> },
      ]}
    />
  );
}
