"use client";

import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { locale, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      title={locale === "id" ? "Aktifkan Mode Batak" : "Kembali ke Bahasa Indonesia"}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-semibold tracking-wide transition-colors",
        "hover:bg-muted"
      )}
    >
      <span className={locale === "id" ? "text-primary" : "text-muted-foreground"}>
        ID
      </span>
      <span className="text-muted-foreground mx-0.5">/</span>
      <span
        className={cn(
          "transition-colors",
          locale === "btk" ? "text-secondary-foreground font-bold" : "text-muted-foreground"
        )}
        style={locale === "btk" ? { color: "oklch(0.72 0.12 72)" } : undefined}
      >
        BTK
      </span>
    </button>
  );
}
