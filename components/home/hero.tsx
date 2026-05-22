"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function Hero() {
  const { t } = useLanguage();
  const waHref = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/628123456789";

  return (
    <section className="relative overflow-hidden bg-primary">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.12 72) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <div className="max-w-2xl">
          <p
            className="mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.12 72)" }}
          >
            {t("hero.overline")}
          </p>

          <h1 className="font-heading text-5xl leading-[1.1] text-primary-foreground sm:text-6xl lg:text-7xl">
            {t("hero.headline")}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            {t("hero.subheadline")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className={cn(buttonVariants({ size: "lg" }), "bg-secondary text-secondary-foreground hover:opacity-90")}
            >
              {t("hero.cta_menu")}
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "border-0 text-white hover:opacity-90")}
              style={{ backgroundColor: "#25D366" }}
            >
              {t("hero.cta_wa")}
            </a>
          </div>
        </div>

        <div aria-hidden className="absolute bottom-0 right-8 top-0 hidden w-80 items-center lg:flex">
          <div className="grid grid-cols-2 gap-3">
            {[{ h: "h-48", mt: "" }, { h: "h-36", mt: "mt-12" }, { h: "h-36", mt: "-mt-6" }, { h: "h-48", mt: "" }]
              .map((item, i) => (
                <div key={i} className={cn("rounded-xl bg-primary-foreground/10", item.h, item.mt)} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
