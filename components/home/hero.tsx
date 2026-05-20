import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Gold radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.12 72) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <div className="max-w-2xl">
          {/* Overline */}
          <p
            className="mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.12 72)" }}
          >
            Horas! — Catering Batak Otentik
          </p>

          {/* Headline */}
          <h1 className="font-heading text-5xl leading-[1.1] text-primary-foreground sm:text-6xl lg:text-7xl">
            Cita Rasa Batak, Buat Setiap Momen Jadi Pesta.
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
            Catering Batak otentik untuk acara adat, wedding, arisan marga,
            birthday, sampai hangout tim kantor. Tepat waktu, porsi pas, rasa
            autentik.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-secondary text-secondary-foreground hover:opacity-90"
              )}
            >
              Lihat Menu
            </Link>
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/60"
              )}
            >
              Chat di WhatsApp
            </a>
          </div>
        </div>

        {/* Decorative grid placeholder — diganti foto asli nanti */}
        <div
          aria-hidden
          className="absolute bottom-0 right-8 top-0 hidden w-80 items-center lg:flex"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { h: "h-48", mt: "" },
              { h: "h-36", mt: "mt-12" },
              { h: "h-36", mt: "-mt-6" },
              { h: "h-48", mt: "" },
            ].map((item, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl bg-primary-foreground/10",
                  item.h,
                  item.mt
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
