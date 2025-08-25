"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useLocale() {
  const { i18n, t } = useTranslation();

  const changeLanguage = useCallback(
    async (lng: string) => {
      if (i18n.language !== lng) {
        await i18n.changeLanguage(lng);
      }
    },
    [i18n]
  );

  return { t, i18n, changeLanguage, currentLanguage: i18n.language };
}


