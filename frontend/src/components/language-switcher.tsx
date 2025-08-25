"use client";

import { useMemo } from "react";
import { useLocale } from "@/hooks/useLocale";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { currentLanguage, changeLanguage } = useLocale();

  const next = useMemo(() => (currentLanguage?.startsWith("vi") ? "en" : "vi"), [currentLanguage]);

  return (
    <Button
      variant="ghost"
      size={compact ? "sm" : "default"}
      className="text-[#0033FF] hover:text-[#0600AF] hover:bg-[#FFCCF2]/10"
      onClick={() => changeLanguage(next)}
      aria-label="Switch language"
      title={next === "vi" ? "Chuyển sang Tiếng Việt" : "Switch to English"}
    >
      {next === "vi" ? "VI" : "EN"}
    </Button>
  );
}


