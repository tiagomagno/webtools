"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { TOOLS } from "../lib/tools";
import { useRecentTools } from "../hooks/useRecentTools";

export default function RecentTracker() {
  const pathname = usePathname();
  const { track } = useRecentTools();

  useEffect(() => {
    const tool = TOOLS.find((t) => t.href === pathname);
    if (tool) track(tool.slug);
  }, [pathname, track]);

  return null;
}
