"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

export function LocaleDocument({ lang }: { lang: Locale }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.locale = lang;
  }, [lang]);

  return null;
}
