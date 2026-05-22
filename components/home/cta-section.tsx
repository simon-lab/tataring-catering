"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function CtaSection() {
  const { t } = useLanguage();
  const waHref = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/628123456789";

  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "oklch(0.72 0.12 72)" }}
        >
          {t("cta_section.overline")}
        </p>
        <h2 className="mt-3 font-heading text-4xl text-primary-foreground sm:text-5xl">
          {t("cta_section.headline")}
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/75">
          {t("cta_section.subtext")}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/order"
            className={cn(buttonVariants({ size: "lg" }), "bg-secondary text-secondary-foreground hover:opacity-90")}
          >
            {t("cta.book")}
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "border-0 text-white hover:opacity-90")}
            style={{ backgroundColor: "#25D366" }}
          >
            {t("cta.consult")}
          </a>
        </div>
      </div>
    </section>
  );
}
