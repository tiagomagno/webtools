"use client";

import { Asterisk, CalendarCheck } from "@phosphor-icons/react";
import ToolTabs from "../../components/ToolTabs";
import RegexTester from "./RegexTester";
import CronHelper from "./CronHelper";

export default function RegexCron() {
  return (
    <ToolTabs
      label="Regex ou Cron"
      tabs={[
        { id: "regex", label: "Testador de Regex", icon: Asterisk, content: <RegexTester /> },
        { id: "cron", label: "Leitor de Cron", icon: CalendarCheck, content: <CronHelper /> },
      ]}
    />
  );
}
